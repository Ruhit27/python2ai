/** What the Learner has marked as learned, and the Branch they chose to go deep in. */
export type Progress = { learned: Set<string>; branch: string | null };

/** The part of `localStorage` progress needs, so tests can pass a fake. */
export type ProgressStorage = Pick<Storage, "getItem" | "setItem">;

const KEY = "betshaped:progress";

const fresh = (): Progress => ({ learned: new Set(), branch: null });

/**
 * The Learner's saved progress, keeping only Skills and Branches still on the map.
 * Missing, corrupted or blocked storage all mean starting fresh.
 */
export function loadProgress(
  storage: ProgressStorage,
  map: { skills: ReadonlySet<string>; branches: ReadonlySet<string> },
): Progress {
  let saved: unknown;
  try {
    saved = JSON.parse(storage.getItem(KEY) ?? "null");
  } catch {
    return fresh();
  }
  if (typeof saved !== "object" || saved === null || Array.isArray(saved)) return fresh();

  const { learned, branch } = saved as Record<string, unknown>;
  if (!Array.isArray(learned)) return fresh();
  return {
    learned: new Set(learned.filter((id): id is string => typeof id === "string" && map.skills.has(id))),
    branch: typeof branch === "string" && map.branches.has(branch) ? branch : null,
  };
}

/** Saves progress; does nothing when the browser blocks storage. */
export function saveProgress(storage: ProgressStorage, progress: Progress) {
  try {
    storage.setItem(KEY, JSON.stringify({ learned: [...progress.learned], branch: progress.branch }));
  } catch {
    // Private mode or blocked site data: progress lasts only for this visit.
  }
}
