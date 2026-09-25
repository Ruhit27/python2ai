import type { SkillMap } from "./types";

/** The Core is near-white; each Branch brings its own color. */
export const CORE_COLOR = "#e8e9ec";

/** The color a Skill is drawn in, from the area it belongs to. */
export function areaColor(map: SkillMap, area: string): string {
  return map.branches.find((b) => b.id === area)?.color ?? CORE_COLOR;
}
