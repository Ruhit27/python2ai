import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { termSlug } from "@/lib/term-slug";

export type GlossaryTerm = {
  slug: string;
  title: string;
  description: string;
  body: string;
  section: number;
  links: string[];
  position: [number, number, number];
};

export type GlossarySection = {
  title: string;
  terms: string[];
};

export type GlossaryData = {
  sections: GlossarySection[];
  terms: GlossaryTerm[];
};

const CONTENT = join(process.cwd(), "src/content");
const SECTION_RE = /^## Section \d+ — (.+)$/;
const LINK_RE = /\[[^\]]+\]\(\.\/([^)]+)\.md\)/g;


function parseCurriculum(dir: string): GlossarySection[] {
  const sections: GlossarySection[] = [];
  for (const raw of readFileSync(join(dir, "_curriculum.md"), "utf8").split("\n")) {
    const line = raw.trimEnd();
    const heading = line.match(SECTION_RE);
    if (heading) sections.push({ title: heading[1], terms: [] });
    else if (line.startsWith("- ")) {
      if (!sections.length) throw new Error(`Curriculum: bullet before section: ${line}`);
      sections[sections.length - 1].terms.push(line.slice(2));
    }
  }
  return sections;
}

function parseTerm(dir: string, title: string) {
  const text = readFileSync(join(dir, `${title}.md`), "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${title}.md: missing frontmatter`);
  const description = match[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  if (!description) throw new Error(`${title}.md: missing description`);
  return { description, body: match[2].trim() };
}

// Small seeded PRNG so the layout is identical on every build.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Force layout: terms repel, linked terms attract, each section is pulled
// toward its own anchor on a sphere so sections read as clusters.
function layout(
  sectionCount: number,
  nodes: { section: number; links: number[] }[],
): [number, number, number][] {
  const rand = mulberry32(7);
  const anchors = Array.from({ length: sectionCount }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / sectionCount;
    const r = Math.sqrt(1 - y * y);
    const a = Math.PI * (3 - Math.sqrt(5)) * i;
    return [Math.cos(a) * r * 5.2, y * 5.2, Math.sin(a) * r * 5.2];
  });
  const pos = nodes.map((n) =>
    anchors[n.section].map((c) => c + (rand() - 0.5) * 4),
  );
  for (let step = 0; step < 400; step++) {
    const cool = 1 - step / 400;
    const force = pos.map(() => [0, 0, 0]);
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const d = pos[i].map((v, k) => v - pos[j][k]);
        const dist2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2 + 0.01;
        const push = 4 / dist2;
        for (let k = 0; k < 3; k++) {
          force[i][k] += d[k] * push;
          force[j][k] -= d[k] * push;
        }
      }
      for (let k = 0; k < 3; k++)
        force[i][k] += (anchors[nodes[i].section][k] - pos[i][k]) * 0.04;
      for (const j of nodes[i].links) {
        const d = pos[j].map((v, k) => v - pos[i][k]);
        const dist = Math.hypot(d[0], d[1], d[2]) + 0.01;
        const pull = (dist - 2.2) * 0.02;
        for (let k = 0; k < 3; k++) force[i][k] += (d[k] / dist) * pull;
      }
    }
    for (let i = 0; i < pos.length; i++)
      for (let k = 0; k < 3; k++) pos[i][k] += force[i][k] * cool;
  }
  return pos.map((p) => [p[0], p[1], p[2]] as [number, number, number]);
}

/** Loads the glossary stored in src/content/<slug>. */
export function getGlossary(slug: string): GlossaryData {
  const dir = join(CONTENT, slug);
  const sections = parseCurriculum(dir);
  const entries = sections.flatMap((s, section) =>
    s.terms.map((title) => ({ title, section, ...parseTerm(dir, title) })),
  );
  const slugs = new Map(entries.map((e, i) => [e.title, i]));
  const links = entries.map((e) => {
    const out = new Set<number>();
    for (const m of e.body.matchAll(LINK_RE)) {
      const target = slugs.get(decodeURIComponent(m[1]));
      if (target === undefined)
        throw new Error(`${e.title}.md links to unknown term "${m[1]}"`);
      out.add(target);
    }
    return [...out];
  });
  const positions = layout(
    sections.length,
    entries.map((e, i) => ({ section: e.section, links: links[i] })),
  );
  return {
    sections,
    terms: entries.map((e, i) => ({
      slug: termSlug(e.title),
      title: e.title,
      description: e.description,
      body: e.body,
      section: e.section,
      links: links[i].map((j) => termSlug(entries[j].title)),
      position: positions[i].map((v) => Math.round(v * 100) / 100) as [
        number,
        number,
        number,
      ],
    })),
  };
}
