import type { AgentId } from "@/lib/agentic-os/types";

export type AgentInfo = {
  id: AgentId;
  name: string;
  tagline: string;
  /** Hex color of the Agent's node and HUD accents. */
  color: string;
  trigger: string;
};

export const AGENTS: AgentInfo[] = [
  {
    id: "daily-digest",
    name: "Daily digest",
    tagline: "What changed in AI and dev tooling today, grouped by theme, every item linked to its source.",
    color: "#22d3ee",
    trigger: "Runs once a day",
  },
  {
    id: "learn-this",
    name: "Learn this",
    tagline: "Name any topic. Get a short explanation, a study plan, and the lessons on this site that cover it.",
    color: "#a78bfa",
    trigger: "Runs when asked",
  },
  {
    id: "dependency-check",
    name: "Dependency check",
    tagline: "Paste a package.json or requirements.txt. See what changed in newer versions, from the real release notes.",
    color: "#f97316",
    trigger: "Runs when asked",
  },
];

export function agentInfo(id: AgentId) {
  return AGENTS.find((a) => a.id === id)!;
}

export type FileNode = { name: string; children?: FileNode[]; content?: string };

/**
 * An illustrative layout of how an Agentic OS could be organised on disk.
 * It explains the idea; it is not the code this demo runs on.
 */
export const FILE_TREE: FileNode[] = [
  {
    name: "agentic-os",
    children: [
      {
        name: "os.config.yaml",
        content: `name: agentic-os
model: openai/gpt-oss-120b
agents:
  - daily-digest
  - learn-this
  - dependency-check
limits:
  runs_per_visitor_per_day: 10`,
      },
      {
        name: "agents",
        children: [
          {
            name: "daily-digest",
            children: [
              {
                name: "agent.md",
                content: `# Daily digest

Gather what changed today in AI and developer tooling.
Pick the 9–15 items that matter to a developer.
Group them under 3–4 themes.
Summarise each in one sentence, using only the source.
Every item links to where it came from.`,
              },
              {
                name: "sources.yaml",
                content: `changelogs:
  - github: anthropics/claude-code
  - github: vercel/next.js
  - github: facebook/react
  - github: langchain-ai/langchain
  - github: ollama/ollama
communities:
  - hacker-news: front_page
  - reddit: [LocalLLaMA, ClaudeAI, MachineLearning]
  - bluesky: [simonwillison.net, karpathy.bsky.social]
research:
  - huggingface: daily_papers`,
              },
              { name: "schedule.cron", content: `# every day at 06:00 UTC\n0 6 * * *` },
            ],
          },
          {
            name: "learn-this",
            children: [
              {
                name: "agent.md",
                content: `# Learn this

Input: any topic a developer names.

1. Explain it in two short paragraphs.
2. Write a 3–5 step study plan.
3. Link the lessons and glossary entries
   on python2ai that cover it.`,
              },
            ],
          },
          {
            name: "dependency-check",
            children: [
              {
                name: "agent.md",
                content: `# Dependency check

Input: package.json or requirements.txt.

For each dependency:
  - look up the latest version (npm / PyPI)
  - fetch GitHub release notes in between
  - summarise ONLY what the notes say
No notes found? Say so. Never guess.`,
              },
              {
                name: "registries.yaml",
                content: `npm: https://registry.npmjs.org
pypi: https://pypi.org/pypi
releases: https://api.github.com/repos/{repo}/releases`,
              },
            ],
          },
        ],
      },
      {
        name: "tools",
        children: [
          { name: "fetch_source.ts", content: `// Fetch one source, time out after 10s,\n// return null instead of failing the run.` },
          { name: "ask_model.ts", content: `// Send a prompt, get JSON back.\n// Retry once if the provider says "wait".` },
        ],
      },
    ],
  },
];
