import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SECTION_COLORS } from "@/components/glossary/colors";
import { getGlossary } from "./glossary";
import { GLOSSARIES } from "./glossaries";

describe.each(GLOSSARIES)("$slug", ({ slug }) => {
  const data = getGlossary(slug);

  it("has a color for every section", () => {
    expect(data.sections.length).toBeGreaterThan(0);
    expect(data.sections.length).toBeLessThanOrEqual(SECTION_COLORS.length);
  });

  it("lists every term file in the curriculum exactly once", () => {
    const files = readdirSync(join(process.cwd(), "src/content", slug))
      .filter((f) => f.endsWith(".md") && f !== "_curriculum.md")
      .map((f) => f.slice(0, -3))
      .sort();
    const listed = data.sections.flatMap((s) => s.terms);
    expect(new Set(listed).size).toBe(listed.length);
    expect([...listed].sort()).toEqual(files);
  });

  it("links every term to at least one other", () => {
    const unlinked = data.terms.filter((t) => t.links.length === 0).map((t) => t.title);
    expect(unlinked).toEqual([]);
  });
});

// The AI glossary is adapted from aihero.dev as-is; ours are written to size.
const WRITTEN_HERE = GLOSSARIES.map((g) => g.slug).filter((slug) => slug !== "ai-glossary");

describe.each(WRITTEN_HERE)("%s", (slug) => {
  it("has 50 to 60 terms in 7 sections", () => {
    const data = getGlossary(slug);
    expect(data.sections).toHaveLength(7);
    expect(data.terms.length).toBeGreaterThanOrEqual(50);
    expect(data.terms.length).toBeLessThanOrEqual(60);
  });
});

describe("gym and nutrition glossaries", () => {
  const titles = (slug: string) => getGlossary(slug).terms.map((t) => t.title);

  it("share exactly the agreed words", () => {
    const nutrition = new Set(titles("nutrition-glossary"));
    const both = titles("gym-glossary").filter((t) => nutrition.has(t));
    expect(both.sort()).toEqual(["Body recomposition", "Bulking", "Creatine", "Cutting", "Protein"]);
  });

  it("carry the medical note, and only they do", () => {
    const noted = GLOSSARIES.filter((g) => g.note).map((g) => g.slug);
    expect(noted).toEqual(["gym-glossary", "nutrition-glossary"]);
  });
});
