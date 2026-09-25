import type { SkillMap } from "./types";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Everything wrong with a Skill map, as readable sentences. Empty means it's sound. */
export function validateSkillMap(map: SkillMap, glossaryTitles: string[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const areas = new Set(["core", ...map.branches.map((b) => b.id)]);
  const glossary = new Set(glossaryTitles);
  const allIds = new Set(map.skills.map((s) => s.id));

  for (const skill of map.skills) {
    if (ids.has(skill.id)) problems.push(`${skill.id}: duplicate Skill id`);
    ids.add(skill.id);

    if (!areas.has(skill.area)) problems.push(`${skill.id}: area "${skill.area}" is neither the Core nor a Branch`);

    for (const p of skill.prerequisites) {
      if (!allIds.has(p)) problems.push(`${skill.id}: Prerequisite "${p}" is not a Skill`);
    }

    const count = skill.resources.length;
    if (count < 1 || count > 3) problems.push(`${skill.id}: needs 1–3 resources, has ${count}`);
    for (const r of skill.resources) {
      if (!r.url.startsWith("https://")) problems.push(`${skill.id}: resource "${r.title}" url is not https`);
      if (!DATE.test(r.checked)) problems.push(`${skill.id}: resource "${r.title}" checked date is not YYYY-MM-DD`);
    }

    for (const term of skill.glossary) {
      if (!glossary.has(term)) problems.push(`${skill.id}: glossary entry "${term}" does not exist`);
    }
  }

  const loop = findLoop(map);
  if (loop) problems.push(`Prerequisites loop: ${loop.join(" → ")}`);
  return problems;
}

/** The first Prerequisite cycle found, starting and ending on the same Skill. */
function findLoop(map: SkillMap): string[] | null {
  const prereqs = new Map(map.skills.map((s) => [s.id, s.prerequisites]));
  const done = new Set<string>();
  const path: string[] = [];

  function visit(id: string): string[] | null {
    const start = path.indexOf(id);
    if (start !== -1) return [...path.slice(start), id];
    if (done.has(id) || !prereqs.has(id)) return null;
    path.push(id);
    for (const p of prereqs.get(id)!) {
      const loop = visit(p);
      if (loop) return loop;
    }
    path.pop();
    done.add(id);
    return null;
  }

  for (const skill of map.skills) {
    const loop = visit(skill.id);
    if (loop) return loop;
  }
  return null;
}
