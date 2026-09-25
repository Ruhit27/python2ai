// Shapes the Agents send to the page. Shared by the API routes and the client.

/** Runs each visitor gets per UTC day across Learn this and Dependency check. */
export const DAILY_LIMIT = 10;

export type AgentId = "daily-digest" | "learn-this" | "dependency-check";

export type DigestItem = { title: string; summary: string; url: string; source: string };
export type DigestTheme = { title: string; items: DigestItem[] };
export type Digest = { generatedAt: string; themes: DigestTheme[] };

export type LearnLink = { kind: "glossary"; title: string; href: string };
export type LearnResult = {
  topic: string;
  explanation: string;
  plan: { step: string; detail: string }[];
  links: LearnLink[];
};

export type DependencyReport = {
  name: string;
  current: string;
  latest: string | null;
  /** "no-notes" means we found no release notes, so we don't say what changed. */
  status: "up-to-date" | "outdated" | "no-notes" | "unknown";
  summary: string;
  breaking: boolean;
  releasesUrl: string | null;
};
export type DependencyResult = { ecosystem: "npm" | "pypi"; reports: DependencyReport[] };

/** Every Agent route returns this on success; `remaining` is the visitor's runs left today. */
export type AgentResponse<T> = { result: T; remaining?: number };
