import "server-only";
import { getDictionary } from "@/lib/dictionary";
import { askJson } from "./groq";
import { matchSiteLinks, type SiteLink } from "./site-links";
import type { LearnResult } from "./types";

let catalog: SiteLink[] | null = null;

/** Every glossary entry. */
function siteCatalog(): SiteLink[] {
  if (catalog) return catalog;
  const glossary: SiteLink[] = getDictionary().terms.map((term) => ({
    kind: "glossary",
    title: term.title,
    href: `/ai-glossary?term=${term.slug}`,
    text: term.description,
  }));
  catalog = glossary;
  return catalog;
}

const SYSTEM = `You are Learn this, an Agent that teaches developers a topic they name.
Write for someone who already codes. Be concrete and plain; no hype.
Reply as JSON: {"explanation":string,"plan":[{"step":string,"detail":string}]}.
"explanation": 2 short paragraphs (under 120 words total) on what it is and why it matters.
"plan": 3 to 5 steps in order. "step" is a short imperative title; "detail" is one or two sentences saying exactly what to do or build.
If the topic is not about software, AI or computing, set "explanation" to a one-line polite refusal and "plan" to [].`;

export async function learnThis(topic: string): Promise<LearnResult> {
  const reply = await askJson<{ explanation: string; plan: { step: string; detail: string }[] }>(SYSTEM, topic);
  const links = matchSiteLinks(topic, siteCatalog()).map(({ kind, title, href }) => ({ kind, title, href }));
  return {
    topic,
    explanation: String(reply.explanation ?? ""),
    plan: Array.isArray(reply.plan) ? reply.plan.slice(0, 5) : [],
    links,
  };
}
