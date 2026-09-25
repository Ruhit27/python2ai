/** Skills not yet learned whose Prerequisites are all learned. */
export function readyNext(
  skills: { id: string; prerequisites: string[] }[],
  learned: ReadonlySet<string>,
): Set<string> {
  return new Set(
    skills.filter((s) => !learned.has(s.id) && s.prerequisites.every((p) => learned.has(p))).map((s) => s.id),
  );
}
