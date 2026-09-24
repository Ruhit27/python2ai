export type Ecosystem = "npm" | "pypi";
export type Dependency = { name: string; version: string };
export type ParsedDependencies =
  | { ok: true; ecosystem: Ecosystem; dependencies: Dependency[] }
  | { ok: false; error: string };

/** Strips range operators so "^19.2.8" and "~5.4" read as the version they start from. */
function bareVersion(range: string) {
  return range.replace(/^[\^~>=<v\s]+/, "").split(/\s/)[0];
}

function fromPackageJson(json: Record<string, unknown>): ParsedDependencies {
  const dependencies: Dependency[] = [];
  for (const field of ["dependencies", "devDependencies"]) {
    const section = json[field];
    if (!section || typeof section !== "object") continue;
    for (const [name, range] of Object.entries(section)) {
      if (typeof range === "string") dependencies.push({ name, version: bareVersion(range) });
    }
  }
  return { ok: true, ecosystem: "npm", dependencies };
}

// "name[extras] <op> version", ignoring anything after ";" (markers) or "#".
const REQUIREMENT_RE = /^([A-Za-z0-9][A-Za-z0-9._-]*)(?:\[[^\]]*\])?\s*(?:(?:==|>=|~=|<=|!=|>|<)\s*([^\s,;]+))?/;

function fromRequirements(text: string): ParsedDependencies {
  const dependencies: Dependency[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.split("#")[0].split(";")[0].trim();
    if (!line || line.startsWith("-")) continue;
    const match = line.match(REQUIREMENT_RE);
    if (match) dependencies.push({ name: match[1], version: match[2] ?? "" });
  }
  return { ok: true, ecosystem: "pypi", dependencies };
}

const EMPTY = "Paste a package.json or requirements.txt with at least one dependency.";

export function parseDependencies(text: string): ParsedDependencies {
  const trimmed = text.trim();
  let result: ParsedDependencies;
  if (trimmed.startsWith("{")) {
    let json: unknown;
    try {
      json = JSON.parse(trimmed);
    } catch {
      return { ok: false, error: "That looks like a package.json, but it isn't valid JSON." };
    }
    result = fromPackageJson(json as Record<string, unknown>);
  } else {
    result = fromRequirements(trimmed);
  }
  if (result.ok && result.dependencies.length === 0) return { ok: false, error: EMPTY };
  return result;
}
