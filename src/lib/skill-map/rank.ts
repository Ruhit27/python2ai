import type { SkillMap } from "./types";

export const RANKS = ["E", "D", "C", "B", "A", "S"] as const;
export type Rank = (typeof RANKS)[number];

/** Core Skills needed to leave E. */
const CORE_FOR_D = 4;

/** How many of an area's Skills the Learner has learned. */
export function learnedIn(map: SkillMap, learned: ReadonlySet<string>, area: string) {
  const skills = map.skills.filter((s) => s.area === area);
  return { learned: skills.filter((s) => learned.has(s.id)).length, total: skills.length };
}

/** Branch Skills each Rank past C asks for, in a Branch of `total` Skills. */
function branchSteps(total: number): [Rank, number][] {
  return [
    ["B", Math.ceil(total / 2)],
    ["A", total - 1],
    ["S", total],
  ];
}

/**
 * How far a Learner has got through the Core and their chosen Branch.
 * The Core leads to C; only the chosen Branch counts after that, so without
 * one the Learner stays at C, and switching Branch can lower the Rank.
 */
export function rankOf(map: SkillMap, learned: ReadonlySet<string>, branch: string | null): Rank {
  const core = learnedIn(map, learned, "core");
  if (core.learned < core.total) return core.learned >= CORE_FOR_D ? "D" : "E";
  if (!branch) return "C";

  const own = learnedIn(map, learned, branch);
  const reached = branchSteps(own.total).filter(([, need]) => own.learned >= need);
  return reached.length ? reached[reached.length - 1][0] : "C";
}

/**
 * The next Rank and how many more Skills it takes, and where: the Core, the
 * chosen Branch, or (area null) choosing a Branch first. Null at S.
 */
export function nextRankNeeds(
  map: SkillMap,
  learned: ReadonlySet<string>,
  branch: string | null,
): { rank: Rank; area: string | null; skills: number } | null {
  const core = learnedIn(map, learned, "core");
  if (core.learned < CORE_FOR_D) return { rank: "D", area: "core", skills: CORE_FOR_D - core.learned };
  if (core.learned < core.total) return { rank: "C", area: "core", skills: core.total - core.learned };
  if (!branch) return { rank: "B", area: null, skills: 0 };

  const own = learnedIn(map, learned, branch);
  // The fewest Skills that raise the Rank; if two Ranks need the same, the higher one is what's reached.
  const ahead = branchSteps(own.total).filter(([, need]) => need > own.learned);
  if (!ahead.length) return null;
  const fewest = Math.min(...ahead.map(([, need]) => need));
  const [rank] = ahead.filter(([, need]) => need === fewest).pop()!;
  return { rank, area: branch, skills: fewest - own.learned };
}
