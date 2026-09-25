import { describe, expect, it } from "vitest";
import type { Skill, SkillMap } from "./types";
import { nextRankNeeds, rankOf } from "./rank";

function skill(id: string, area: string): Skill {
  return { id, title: id, summary: "", why: "", area, prerequisites: [], resources: [], glossary: [] };
}

// A Core of 6 and two Branches: "ai" with 4 Skills, "web" with 2.
const MAP: SkillMap = {
  branches: [
    { id: "ai", title: "AI", summary: "", color: "#fff" },
    { id: "web", title: "Web", summary: "", color: "#fff" },
  ],
  skills: [
    ...["c1", "c2", "c3", "c4", "c5", "c6"].map((id) => skill(id, "core")),
    ...["a1", "a2", "a3", "a4"].map((id) => skill(id, "ai")),
    ...["w1", "w2"].map((id) => skill(id, "web")),
  ],
};

const CORE = ["c1", "c2", "c3", "c4", "c5", "c6"];
const rank = (learned: string[], branch: string | null) => rankOf(MAP, new Set(learned), branch);

describe("rankOf", () => {
  it("starts every Learner at E", () => {
    expect(rank([], null)).toBe("E");
    expect(rank(["c1", "c2", "c3"], null)).toBe("E");
  });

  it("reaches D at four Core Skills and C with the whole Core", () => {
    expect(rank(["c1", "c2", "c3", "c4"], null)).toBe("D");
    expect(rank(CORE, null)).toBe("C");
  });

  it("caps at C until the Learner chooses a Branch", () => {
    expect(rank([...CORE, "a1", "a2", "a3", "a4"], null)).toBe("C");
  });

  it("climbs B, A, S through the chosen Branch once the Core is done", () => {
    expect(rank([...CORE, "a1"], "ai")).toBe("C");
    expect(rank([...CORE, "a1", "a2"], "ai")).toBe("B");
    expect(rank([...CORE, "a1", "a2", "a3"], "ai")).toBe("A");
    expect(rank([...CORE, "a1", "a2", "a3", "a4"], "ai")).toBe("S");
  });

  it("counts Branch Skills only once the Core is done", () => {
    expect(rank(["c1", "a1", "a2", "a3", "a4"], "ai")).toBe("E");
  });

  it("measures only the chosen Branch, so switching Branch can drop the Rank", () => {
    const learned = [...CORE, "a1", "a2", "a3", "a4"];
    expect(rank(learned, "ai")).toBe("S");
    expect(rank(learned, "web")).toBe("C");
  });

  it("rounds half a Branch up, and gives a two-Skill Branch A after its first Skill", () => {
    expect(rank([...CORE, "w1"], "web")).toBe("A");
    expect(rank([...CORE, "w1", "w2"], "web")).toBe("S");
  });
});

describe("nextRankNeeds", () => {
  const needs = (learned: string[], branch: string | null) => nextRankNeeds(MAP, new Set(learned), branch);

  it("counts the Core Skills left for D, then for C", () => {
    expect(needs(["c1"], null)).toEqual({ rank: "D", area: "core", skills: 3 });
    expect(needs(["c1", "c2", "c3", "c4"], null)).toEqual({ rank: "C", area: "core", skills: 2 });
  });

  it("asks for a Branch once the Core is done and none is chosen", () => {
    expect(needs(CORE, null)).toEqual({ rank: "B", area: null, skills: 0 });
  });

  it("counts the chosen Branch's Skills left for B, A and S, and nothing past S", () => {
    expect(needs(CORE, "ai")).toEqual({ rank: "B", area: "ai", skills: 2 });
    expect(needs([...CORE, "a1", "a2"], "ai")).toEqual({ rank: "A", area: "ai", skills: 1 });
    expect(needs([...CORE, "a1", "a2", "a3"], "ai")).toEqual({ rank: "S", area: "ai", skills: 1 });
    expect(needs([...CORE, "a1", "a2", "a3", "a4"], "ai")).toBeNull();
  });
});
