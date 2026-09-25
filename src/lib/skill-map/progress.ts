/**
 * What the Learner has marked as learned, the Branch they chose to go deep in,
 * the Current Skill they picked, and whether they've been through the first visit.
 */
export type Progress = { learned: Set<string>; branch: string | null; current: string | null; onboarded: boolean };

/** The part of `localStorage` progress needs, so tests can pass a fake. */
export type ProgressStorage = Pick<Storage, "getItem" | "setItem">;

const KEY = "betshaped:progress";

const fresh = (): Progress => ({ learned: new Set(), branch: null, current: null, onboarded: false });

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

  const { learned, branch, current, onboarded } = saved as Record<string, unknown>;
  if (!Array.isArray(learned)) return fresh();
  const kept = new Set(learned.filter((id): id is string => typeof id === "string" && map.skills.has(id)));
  return {
    learned: kept,
    branch: typeof branch === "string" && map.branches.has(branch) ? branch : null,
    current: typeof current === "string" && map.skills.has(current) && !kept.has(current) ? current : null,
    onboarded: onboarded === true,
  };
}

/** Saves progress; does nothing when the browser blocks storage. */
export function saveProgress(storage: ProgressStorage, progress: Progress) {
  try {
    storage.setItem(KEY, JSON.stringify({ ...progress, learned: [...progress.learned] }));
  } catch {
    // Private mode or blocked site data: progress lasts only for this visit.
  }
}
