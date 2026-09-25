import { describe, expect, it } from "vitest";
import { loadProgress, saveProgress, type ProgressStorage } from "./progress";

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
    expect(loadProgress(memoryStorage(), MAP)).toEqual({ learned: new Set(), branch: null });
  });

  it("brings back what the Learner saved", () => {
    const storage = memoryStorage();
    saveProgress(storage, { learned: new Set(["terminal", "git"]), branch: "ai" });
    expect(loadProgress(storage, MAP)).toEqual({ learned: new Set(["terminal", "git"]), branch: "ai" });
  });

  it("forgets Skills and Branches that are no longer on the map", () => {
    const storage = memoryStorage();
    saveProgress(storage, { learned: new Set(["terminal", "cobol"]), branch: "mobile" });
    expect(loadProgress(storage, MAP)).toEqual({ learned: new Set(["terminal"]), branch: null });
  });

  it("starts fresh when the saved data is corrupted", () => {
    for (const raw of ["not json", "null", "[1,2]", '{"learned":"git","branch":7}']) {
      const storage = memoryStorage({ "betshaped:progress": raw });
      expect(loadProgress(storage, MAP)).toEqual({ learned: new Set(), branch: null });
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
    expect(() => saveProgress(blocked, { learned: new Set(["git"]), branch: null })).not.toThrow();
    expect(loadProgress(blocked, MAP)).toEqual({ learned: new Set(), branch: null });
  });
});
