import { describe, expect, it } from "vitest";
import { readyNext } from "./ready-next";

const SKILLS = [
  { id: "terminal", prerequisites: [] },
  { id: "git", prerequisites: ["terminal"] },
  { id: "python", prerequisites: ["terminal"] },
  { id: "apis", prerequisites: ["git", "python"] },
];

describe("readyNext", () => {
  it("starts a new Learner on the Skills that need nothing first", () => {
    expect(readyNext(SKILLS, new Set())).toEqual(new Set(["terminal"]));
  });

  it("offers a Skill once every one of its Prerequisites is learned", () => {
    expect(readyNext(SKILLS, new Set(["terminal", "git"]))).toEqual(new Set(["python"]));
    expect(readyNext(SKILLS, new Set(["terminal", "git", "python"]))).toEqual(new Set(["apis"]));
  });

  it("never offers a Skill the Learner has already learned, even out of order", () => {
    expect(readyNext(SKILLS, new Set(["apis"]))).toEqual(new Set(["terminal"]));
  });
});
