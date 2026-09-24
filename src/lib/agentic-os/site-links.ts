export type SiteLink = {
  kind: "lesson" | "glossary";
  title: string;
  href: string;
  /** Extra words to match against, weighted below the title. */
  text: string;
};

const STOPWORDS = new Set(
  "a an and are as at be but by can do does for from how i in into is it me my of on or should the to use using vs what when where which why with work works you your".split(" "),
);

/** Lowercased words with a trailing plural "s" dropped, so "windows" meets "window". */
function words(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map((w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w));
}

const TITLE_WEIGHT = 3;
const MIN_SCORE = 2;

/** The site's lessons and glossary entries that best cover a topic, best first. */
export function matchSiteLinks(topic: string, catalog: SiteLink[], max = 4): SiteLink[] {
  const wanted = new Set(words(topic));
  if (wanted.size === 0) return [];

  return catalog
    .map((link) => {
      const title = new Set(words(link.title));
      const text = new Set(words(link.text));
      let score = 0;
      for (const w of wanted) {
        if (title.has(w)) score += TITLE_WEIGHT;
        else if (text.has(w)) score += 1;
      }
      return { link, score };
    })
    .filter((m) => m.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((m) => m.link);
}
