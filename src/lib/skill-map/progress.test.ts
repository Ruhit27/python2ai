import { describe, expect, it } from "vitest";
import { loadProgress, saveProgress, type ProgressStorage } from "./progress";

const FRESH = { learned: new Set(), branch: null, current: null, onboarded: false };
const MAP = { skills: new Set(["terminal", "git", "python"]), branches: new Set(["ai", "frontend"]) };

function memoryStorage(initial: Record<string, string> = {}): ProgressStorage {
  const data = { ...initial };
  return {
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

describe("progress", () => {
  it("gives a first-time Learner nothing learned and no chosen Branch", () => {
    expect(loadProgress(memoryStorage(), MAP)).toEqual(FRESH);
  });

  it("brings back what the Learner saved", () => {
    const storage = memoryStorage();
    saveProgress(storage, { learned: new Set(["terminal", "git"]), branch: "ai", current: "python", onboarded: true });
    expect(loadProgress(storage, MAP)).toEqual({
      learned: new Set(["terminal", "git"]),
      branch: "ai",
      current: "python",
      onboarded: true,
    });
  });

  it("forgets Skills and Branches that are no longer on the map", () => {
    const storage = memoryStorage();
    saveProgress(storage, {
      learned: new Set(["terminal", "cobol"]),
      branch: "mobile",
      current: "cobol",
      onboarded: true,
    });
    expect(loadProgress(storage, MAP)).toEqual({
      learned: new Set(["terminal"]),
      branch: null,
      current: null,
      onboarded: true,
    });
  });

  it("drops a Current Skill the Learner has already learned", () => {
    const storage = memoryStorage();
    saveProgress(storage, { learned: new Set(["git"]), branch: null, current: "git", onboarded: true });
    expect(loadProgress(storage, MAP).current).toBeNull();
  });

  it("starts fresh when the saved data is corrupted", () => {
    for (const raw of ["not json", "null", "[1,2]", '{"learned":"git","branch":7}']) {
      const storage = memoryStorage({ "betshaped:progress": raw });
      expect(loadProgress(storage, MAP)).toEqual(FRESH);
    }
  });

  it("starts fresh, and saving does nothing, when the browser blocks storage", () => {
    const blocked: ProgressStorage = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    };
    expect(() =>
      saveProgress(blocked, { learned: new Set(["git"]), branch: null, current: null, onboarded: true }),
    ).not.toThrow();
    expect(loadProgress(blocked, MAP)).toEqual(FRESH);
  });
});
