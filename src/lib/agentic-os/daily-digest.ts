import "server-only";
import { unstable_cache } from "next/cache";
import { askJson } from "./groq";
import { fetchOrNull, githubHeaders } from "./request";
import type { Digest, DigestTheme } from "./types";

type SourceItem = { source: string; title: string; url: string; note?: string };

const RELEASE_REPOS = [
  "anthropics/claude-code",
  "vercel/next.js",
  "facebook/react",
  "langchain-ai/langchain",
  "openai/openai-python",
  "anthropics/anthropic-sdk-python",
  "fastapi/fastapi",
  "ollama/ollama",
];
const SUBREDDITS = ["LocalLLaMA", "ClaudeAI", "MachineLearning"];
const BLUESKY_ACCOUNTS = [
  "simonwillison.net",
  "swyx.io",
  "karpathy.bsky.social",
  "jeremyphoward.bsky.social",
  "natolambert.bsky.social",
  "hamel.bsky.social",
];

const DAY_MS = 24 * 60 * 60 * 1000;

async function githubReleases(since: number): Promise<SourceItem[]> {
  const perRepo = await Promise.all(
    RELEASE_REPOS.map(async (repo) => {
      const res = await fetchOrNull(`https://api.github.com/repos/${repo}/releases?per_page=10`, {
        headers: githubHeaders(),
      });
      if (!res) return [];
      const releases: {
        name: string;
        tag_name: string;
        html_url: string;
        published_at: string;
        prerelease: boolean;
        body: string | null;
      }[] = await res.json();
      return releases
        .filter((r) => !r.prerelease && Date.parse(r.published_at) >= since)
        .map((r) => ({
          source: `GitHub · ${repo}`,
          title: `${repo} ${r.name || r.tag_name}`,
          url: r.html_url,
          note: (r.body ?? "").slice(0, 200),
        }));
    }),
  );
  return perRepo.flat();
}

async function hackerNews(): Promise<SourceItem[]> {
  const res = await fetchOrNull("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=20");
  if (!res) return [];
  const data: { hits: { title: string; url: string | null; objectID: string; points: number }[] } = await res.json();
  return data.hits.map((h) => ({
    source: "Hacker News",
    title: h.title,
    url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
    note: `${h.points} points`,
  }));
}

async function reddit(): Promise<SourceItem[]> {
  const perSub = await Promise.all(
    SUBREDDITS.map(async (sub) => {
      const res = await fetchOrNull(`https://www.reddit.com/r/${sub}/top/.rss?t=day&limit=6`);
      if (!res) return [];
      const xml = await res.text();
      return [...xml.matchAll(/<entry>[\s\S]*?<link href="([^"]+)"[\s\S]*?<title>([^<]+)<\/title>/g)].map(
        (m) => ({ source: `r/${sub}`, title: decodeEntities(m[2]), url: m[1] }),
      );
    }),
  );
  return perSub.flat();
}

async function bluesky(since: number): Promise<SourceItem[]> {
  const perAccount = await Promise.all(
    BLUESKY_ACCOUNTS.map(async (actor) => {
      const res = await fetchOrNull(
        `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${actor}&limit=5&filter=posts_no_replies`,
      );
      if (!res) return [];
      const data: { feed: { post: { uri: string; record: { text: string; createdAt: string } } }[] } = await res.json();
      return data.feed
        .filter((f) => Date.parse(f.post.record.createdAt) >= since)
        .map((f) => ({
          source: `Bluesky · @${actor}`,
          title: f.post.record.text.slice(0, 160),
          url: `https://bsky.app/profile/${actor}/post/${f.post.uri.split("/").pop()}`,
        }));
    }),
  );
  return perAccount.flat();
}

async function huggingFacePapers(): Promise<SourceItem[]> {
  const res = await fetchOrNull("https://huggingface.co/api/daily_papers?limit=10");
  if (!res) return [];
  const papers: { paper: { id: string; title: string; upvotes?: number } }[] = await res.json();
  return papers.map((p) => ({
    source: "Hugging Face papers",
    title: p.paper.title,
    url: `https://huggingface.co/papers/${p.paper.id}`,
    note: `${p.paper.upvotes ?? 0} upvotes`,
  }));
}

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const SYSTEM = `You write the Daily digest for developers who build with AI.
You receive numbered items gathered today from GitHub releases, Hacker News, Reddit, Bluesky and Hugging Face papers.
Pick the 9 to 15 items that matter most to a developer working with AI and developer tooling. Skip items unrelated to software or AI.
Group them under 3 or 4 themes, choosing from: "Model releases", "Tooling updates", "Research", "Worth reading". 3 to 5 items per theme.
For each item write a one-sentence plain-English summary of why it matters, based only on the item's title and note. Never invent details.
Reply as JSON: {"themes":[{"title":string,"items":[{"id":number,"summary":string}]}]}. Use each id at most once.`;

async function buildDigest(): Promise<Digest> {
  const since = Date.now() - 2 * DAY_MS;
  const batches = await Promise.all([githubReleases(since), hackerNews(), reddit(), bluesky(since), huggingFacePapers()]);
  const items = batches.flat();
  if (items.length === 0) throw new Error("Every digest source failed");

  const listing = items
    .map((it, i) => `[${i}] (${it.source}) ${it.title}${it.note ? ` — ${it.note.replace(/\s+/g, " ")}` : ""}`)
    .join("\n");
  const reply = await askJson<{ themes: { title: string; items: { id: number; summary: string }[] }[] }>(SYSTEM, listing);

  // The model only picks ids, so every link in the digest is a real source URL.
  const used = new Set<number>();
  const themes: DigestTheme[] = reply.themes
    .map((theme) => ({
      title: theme.title,
      items: theme.items.flatMap(({ id, summary }) => {
        const item = items[id];
        if (!item || used.has(id)) return [];
        used.add(id);
        return [{ title: item.title, summary, url: item.url, source: item.source }];
      }),
    }))
    .filter((theme) => theme.items.length > 0);

  if (themes.length === 0) throw new Error("Digest came back empty");
  return { generatedAt: new Date().toISOString(), themes };
}

// `use cache` replaces unstable_cache in Next 16, but only with the cacheComponents
// flag, which this app doesn't enable. Switch when the rest of the site opts in.
const cachedDigest = unstable_cache(buildDigest, ["agentic-os-daily-digest"], {
  revalidate: 86400,
});

// A failed build isn't cached, so without this every visit would retry all sources.
const RETRY_AFTER_FAILURE_MS = 10 * 60 * 1000;
let lastFailureAt = 0;

/** The shared digest, rebuilt at most once a day (and at most every 10 minutes after a failure). */
export async function getDailyDigest(): Promise<Digest> {
  if (Date.now() - lastFailureAt < RETRY_AFTER_FAILURE_MS) throw new Error("Digest failed recently");
  try {
    return await cachedDigest();
  } catch (error) {
    lastFailureAt = Date.now();
    throw error;
  }
}
