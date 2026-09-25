import type { SkillMap } from "./types";

export type Vec3 = [number, number, number];

const CORE_Y = 4.5;
const CORE_WIDTH = 34;
const BRANCH_TOP = 0.3;
const BRANCH_STEP = 2.2;
const COLUMN_GAP = 7;

/**
 * Where each Skill sits, in the order the map lists them. The Core is a band across the top: the bar of the T.
 * Branches hang below it as columns. A chosen Branch swings to the middle and
 * forward, so the Core plus that Branch reads as the Learner's own T; the
 * others step back to the sides.
 */
export function layoutSkillMap(map: SkillMap, chosenBranch: string | null): Map<string, Vec3> {
  const positions = new Map<string, Vec3>();

  const core = map.skills.filter((s) => s.area === "core");
  core.forEach((skill, i) => {
    const t = core.length === 1 ? 0.5 : i / (core.length - 1);
    // Two staggered rows with a slight smile keep neighbouring labels apart.
    const x = (t - 0.5) * CORE_WIDTH;
    positions.set(skill.id, [x, CORE_Y + (x * x) / 260 + (i % 2 ? -1.1 : 1.1), 0]);
  });

  const columns = columnPlaces(
    map.branches.map((b) => b.id),
    chosenBranch,
  );
  for (const branch of map.branches) {
    const [cx, cz] = columns.get(branch.id)!;
    map.skills
      .filter((s) => s.area === branch.id)
      .forEach((skill, i) => {
        positions.set(skill.id, [cx + (i % 2 ? 0.9 : -0.9), BRANCH_TOP - i * BRANCH_STEP, cz]);
      });
  }
  return positions;
}

/** The x and z of each Branch column. */
function columnPlaces(ids: string[], chosen: string | null): Map<string, [number, number]> {
  const places = new Map<string, [number, number]>();
  if (!chosen || !ids.includes(chosen)) {
    ids.forEach((id, i) => places.set(id, [(i - (ids.length - 1) / 2) * COLUMN_GAP, 0]));
    return places;
  }
  places.set(chosen, [0, 2.5]);
  // The rest keep their order, split either side of the chosen one and pushed back.
  const rest = ids.filter((id) => id !== chosen);
  const left = rest.slice(0, Math.ceil(rest.length / 2));
  const right = rest.slice(left.length);
  left.reverse().forEach((id, i) => places.set(id, [-(i + 1.4) * COLUMN_GAP, -7]));
  right.forEach((id, i) => places.set(id, [(i + 1.4) * COLUMN_GAP, -7]));
  return places;
}
