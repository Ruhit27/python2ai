import { describe, expect, it } from "vitest";
import { matchSiteLinks, siteCatalog, type SiteLink } from "./site-links";

const CATALOG: SiteLink[] = [
  { kind: "glossary", title: "Context window", href: "/ai-glossary?term=context-window", text: "The maximum number of tokens a model can see at once." },
  { kind: "glossary", title: "Token", href: "/ai-glossary?term=token", text: "A chunk of text the model reads and writes." },
  { kind: "glossary", title: "Subagent", href: "/ai-glossary?term=subagent", text: "An agent started by another agent to do one task." },
];

describe("matchSiteLinks", () => {
  it("ranks entries whose title matches the topic above ones that only mention it", () => {
    const links = matchSiteLinks("how do context windows and tokens work?", CATALOG);
    expect(links.map((l) => l.title)).toEqual(["Context window", "Token"]);
  });

  it("returns nothing when the site doesn't cover the topic", () => {
    expect(matchSiteLinks("kubernetes networking", CATALOG)).toEqual([]);
  });
});

describe("siteCatalog", () => {
  const skills = [
    { id: "docker", title: "Containers with Docker", summary: "Packaging an app so it runs the same everywhere." },
    { id: "sql", title: "SQL & databases", summary: "Storing data in tables." },
  ];
  const glossary = [{ slug: "token", title: "Token", description: "A chunk of text the model reads and writes." }];

  it("links a topic to the Skill that covers it, opened on the Skill map", () => {
    const links = matchSiteLinks("how do I learn docker containers?", siteCatalog(skills, glossary));
    expect(links).toEqual([
      { kind: "skill", title: "Containers with Docker", href: "/?skill=docker", text: "Packaging an app so it runs the same everywhere." },
    ]);
  });

  it("still links glossary entries alongside Skills", () => {
    const links = matchSiteLinks("tokens", siteCatalog(skills, glossary));
    expect(links.map((l) => l.href)).toEqual(["/ai-glossary?term=token"]);
  });
});
