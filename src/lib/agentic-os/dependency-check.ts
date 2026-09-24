import "server-only";
import type { Dependency, Ecosystem } from "./dependencies";
import { askJson } from "./groq";
import { fetchOrNull, githubHeaders } from "./request";
import type { DependencyReport, DependencyResult } from "./types";

// Groq's free tier allows 8,000 tokens a minute, so one check stays around 3,000.
export const MAX_DEPENDENCIES = 8;
const NOTES_PER_RELEASE = 500;
const RELEASES_PER_PACKAGE = 3;

type Lookup = { latest: string; repo: string | null };
type Release = { tag: string; body: string };

const GITHUB_REPO_RE = /github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/#?]|$)/;

function githubRepo(url: unknown) {
  if (typeof url !== "string") return null;
  const match = url.match(GITHUB_REPO_RE);
  return match ? `${match[1]}/${match[2]}` : null;
}

async function lookup(ecosystem: Ecosystem, name: string): Promise<Lookup | null> {
  if (ecosystem === "npm") {
    const res = await fetchOrNull(`https://registry.npmjs.org/${name.replace("/", "%2F")}/latest`);
    if (!res) return null;
    const data = await res.json();
    const repository = typeof data.repository === "string" ? data.repository : data.repository?.url;
    return { latest: data.version, repo: githubRepo(repository) };
  }
  const res = await fetchOrNull(`https://pypi.org/pypi/${encodeURIComponent(name)}/json`);
  if (!res) return null;
  const { info } = await res.json();
  const urls: unknown[] = [...Object.values(info.project_urls ?? {}), info.home_page];
  return { latest: info.version, repo: urls.map(githubRepo).find(Boolean) ?? null };
}

/** [major, minor, patch] from "v1.2.3", "next@16.0.1" or "langchain-openai==1.6.5". */
function versionParts(version: string) {
  const match = version.match(/(\d+)\.(\d+)(?:\.(\d+))?/);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)] : null;
}

function compare(a: number[], b: number[]) {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}

/** "2.8" pinned against latest "2.8.0" is current, so compare numbers, not strings. */
function isUpToDate(current: string, latest: string) {
  const from = versionParts(current);
  const to = versionParts(latest);
  return from !== null && to !== null && compare(from, to) >= 0;
}

/** Monorepos tag each package ("pkg==1.2" or "pkg@1.2"); skip tags for other packages. */
function tagIsFor(tag: string, name: string) {
  const prefix = tag.match(/^(.+?)(?:==|@)v?\d/)?.[1];
  if (!prefix) return true;
  const norm = (s: string) => s.toLowerCase().replace(/[-_.]/g, "");
  return norm(prefix) === norm(name) || norm(prefix).endsWith(norm(name.split("/").pop() ?? name));
}

/** Release notes published after `current`, up to and including `latest`, newest first. */
async function releasesBetween(repo: string, name: string, current: string, latest: string): Promise<Release[]> {
  const res = await fetchOrNull(`https://api.github.com/repos/${repo}/releases?per_page=50`, { headers: githubHeaders() });
  if (!res) return [];
  const from = versionParts(current);
  const to = versionParts(latest);
  if (!to) return [];
  const releases: { tag_name: string; body: string | null; prerelease: boolean; draft: boolean }[] = await res.json();
  return releases
    .filter((r) => !r.prerelease && !r.draft && r.body && tagIsFor(r.tag_name, name))
    .filter((r) => {
      const v = versionParts(r.tag_name);
      return v && compare(v, to) <= 0 && (!from || compare(v, from) > 0);
    })
    .slice(0, RELEASES_PER_PACKAGE)
    .map((r) => ({ tag: r.tag_name, body: (r.body ?? "").slice(0, NOTES_PER_RELEASE) }));
}

const SYSTEM = `You are Dependency check, an Agent that tells developers what changed in newer versions of their dependencies.
For each package you get its current version, the latest version, and GitHub release notes for the versions in between.
Summarise ONLY what the release notes say. Never add changes from memory. If notes are thin, say so.
Only the most recent releases are included; when the jump spans more versions than the notes cover, start with "In the latest releases,".
Reply as JSON: {"reports":[{"name":string,"summary":string,"breaking":boolean}]}.
"summary": 1 to 3 plain sentences on what changed that a developer would care about when upgrading.
"breaking": true only if the notes mention a breaking change, removal or required migration.`;

export async function checkDependencies(ecosystem: Ecosystem, dependencies: Dependency[]): Promise<DependencyResult> {
  const found = await Promise.all(
    dependencies.slice(0, MAX_DEPENDENCIES).map(async (dep) => {
      const info = await lookup(ecosystem, dep.name);
      const releases =
        info?.repo && !isUpToDate(dep.version, info.latest)
          ? await releasesBetween(info.repo, dep.name, dep.version, info.latest)
          : [];
      return { dep, info, releases };
    }),
  );

  const reports: DependencyReport[] = found.map(({ dep, info, releases }) => {
    const base = {
      name: dep.name,
      current: dep.version || "unpinned",
      latest: info?.latest ?? null,
      breaking: false,
      releasesUrl: info?.repo ? `https://github.com/${info.repo}/releases` : null,
    };
    if (!info) return { ...base, status: "unknown", summary: `Couldn't find ${dep.name} on ${ecosystem === "npm" ? "npm" : "PyPI"}.` };
    if (isUpToDate(dep.version, info.latest)) return { ...base, status: "up-to-date", summary: "You're on the latest version." };
    if (releases.length === 0) {
      return { ...base, status: "no-notes", summary: "No release notes found on GitHub, so we won't guess. Check the changelog before upgrading." };
    }
    return { ...base, status: "outdated", summary: "" };
  });

  const withNotes = found.filter((_, i) => reports[i].status === "outdated");
  if (withNotes.length > 0) {
    const prompt = withNotes
      .map(({ dep, info, releases }) =>
        [`## ${dep.name}: ${dep.version || "unpinned"} → ${info!.latest}`, ...releases.map((r) => `### ${r.tag}\n${r.body}`)].join("\n"),
      )
      .join("\n\n");
    const reply = await askJson<{ reports: { name: string; summary: string; breaking: boolean }[] }>(SYSTEM, prompt);
    for (const summary of reply.reports ?? []) {
      const report = reports.find((r) => r.name === summary.name && r.status === "outdated");
      if (report) {
        report.summary = String(summary.summary ?? "");
        report.breaking = Boolean(summary.breaking);
      }
    }
    for (const report of reports) {
      if (report.status === "outdated" && !report.summary) report.summary = "Release notes found, but the summary failed. Open the releases page.";
    }
  }

  return { ecosystem, reports };
}
