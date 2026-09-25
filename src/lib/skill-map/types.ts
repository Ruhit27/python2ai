/** How a free resource teaches: reference docs, a structured course, or a video. */
export type ResourceKind = "docs" | "course" | "video";

/** A free place elsewhere on the web to learn a Skill. */
export type Resource = {
  kind: ResourceKind;
  title: string;
  url: string;
  /** The day the link was last confirmed to work and be free, as YYYY-MM-DD. */
  checked: string;
};

export type Branch = {
  id: string;
  title: string;
  /** One sentence on what going deep here means. */
  summary: string;
  color: string;
};

export type Skill = {
  id: string;
  title: string;
  /** What it is, in one or two sentences a beginner can follow. */
  summary: string;
  /** Why a developer needs it. */
  why: string;
  /** `core`, or the id of the Branch it belongs to. */
  area: string;
  prerequisites: string[];
  resources: Resource[];
  /** Titles of related AI glossary entries. */
  glossary: string[];
};

export type SkillMap = { branches: Branch[]; skills: Skill[] };
