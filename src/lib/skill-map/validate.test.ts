import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SKILL_MAP } from "@/data/skill-map";
import type { Skill, SkillMap } from "./types";
import { validateSkillMap } from "./validate";

const GLOSSARY = readdirSync(join(process.cwd(), "src/content/dictionary"))
  .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  .map((f) => f.slice(0, -3));

const RESOURCE = { kind: "docs" as const, title: "Docs", url: "https://example.com/", checked: "2026-09-25" };

function skill(id: string, extra: Partial<Skill> = {}): Skill {
  return {
    id,
    title: id,
    summary: "s",
    why: "w",
    area: "core",
    prerequisites: [],
    resources: [RESOURCE],
    glossary: [],
    ...extra,
  };
}

function mapOf(...skills: Skill[]): SkillMap {
  return { branches: [{ id: "ai", title: "AI", summary: "s", color: "#fff" }], skills };
}

describe("validateSkillMap", () => {
  it("finds nothing wrong with the real Skill map", () => {
    expect(validateSkillMap(SKILL_MAP, GLOSSARY)).toEqual([]);
  });

  it("gives every Branch at least one Skill, and the Core at least one", () => {
    const branchesUsed = new Set(SKILL_MAP.skills.map((s) => s.area));
    expect(branchesUsed).toEqual(new Set(["core", ...SKILL_MAP.branches.map((b) => b.id)]));
  });

  it("catches a Prerequisite that isn't on the map", () => {
    expect(validateSkillMap(mapOf(skill("git", { prerequisites: ["terminal"] })), GLOSSARY)).toEqual([
      'git: Prerequisite "terminal" is not a Skill',
    ]);
  });

  it("catches Prerequisites that loop back on themselves", () => {
    const problems = validateSkillMap(
      mapOf(
        skill("a", { prerequisites: ["c"] }),
        skill("b", { prerequisites: ["a"] }),
        skill("c", { prerequisites: ["b"] }),
      ),
      GLOSSARY,
    );
    expect(problems).toEqual(["Prerequisites loop: a → c → b → a"]);
  });

  it("catches a Skill outside the Core and every Branch", () => {
    expect(validateSkillMap(mapOf(skill("swift", { area: "mobile" })), GLOSSARY)).toEqual([
      'swift: area "mobile" is neither the Core nor a Branch',
    ]);
  });

  it("wants one to three free resources per Skill, each with a real link and check date", () => {
    const problems = validateSkillMap(
      mapOf(
        skill("none", { resources: [] }),
        skill("many", { resources: [RESOURCE, RESOURCE, RESOURCE, RESOURCE] }),
        skill("bad", { resources: [{ ...RESOURCE, url: "example.com", checked: "last week" }] }),
      ),
      GLOSSARY,
    );
    expect(problems).toEqual([
      "none: needs 1–3 resources, has 0",
      "many: needs 1–3 resources, has 4",
      'bad: resource "Docs" url is not https',
      'bad: resource "Docs" checked date is not YYYY-MM-DD',
    ]);
  });

  it("catches duplicate Skill ids and glossary entries that don't exist", () => {
    const problems = validateSkillMap(
      mapOf(skill("git"), skill("git", { glossary: ["Token", "Blockchain"] })),
      GLOSSARY,
    );
    expect(problems).toEqual(["git: duplicate Skill id", 'git: glossary entry "Blockchain" does not exist']);
  });
});
