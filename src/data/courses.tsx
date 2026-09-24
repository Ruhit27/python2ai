import type { ComponentType, ReactNode, SVGProps } from "react";
import { CodeXml } from "lucide-react";
import {
  ClaudeIcon,
  FastApiIcon,
  LangChainIcon,
  OllamaIcon,
  PromptIcon,
  PythonIcon,
} from "@/components/icons/BrandIcons";
import { pythonModules } from "@/data/python-course";

export type Lesson = {
  /** Stable slug, unique within its course. Progress is saved against it, so never change it once published. */
  id: string;
  title: string;
  /**
   * Lightweight markdown, rendered by `renderLessonContent`:
   * - blank-line-separated paragraphs (the first one renders as a larger hook line)
   * - a lone "## " line becomes a section heading (also feeds the "In this lesson" chips)
   * - "- " lines become a bullet list
   * - "> " lines become a pull-quote
   * - ```lang fences become a terminal-style code block
   * - ```note fences become a highlighted callout
   * - `inline code` works anywhere
   * Left undefined for lessons that don't have real content yet.
   */
  content?: string;
  /** Optional rich demo rendered after the markdown content (e.g. a live <Terminal>). */
  extra?: ReactNode;
};

export type CourseModule = {
  title: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: string;
  description: string;
  bg: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconColor: string;
  /** Hex accent used to theme that course's lesson pages (quotes, callouts, code chrome). */
  accent: string;
  modules: CourseModule[];
};

export const COURSES: Course[] = [
  {
    slug: "python",
    title: "Python",
    description: "Learn Python by building four small programs and a habit tracker you can actually use.",
    bg: "bg-[#FFD43B]",
    icon: PythonIcon,
    iconColor: "text-[#4B8BBE]",
    accent: "#5B9BD5",
    modules: pythonModules,
  },
  {
    slug: "fastapi",
    title: "FastAPI",
    description: "Ship production APIs for your models with the framework AI backends run on.",
    bg: "bg-[#3FD9C7]",
    icon: FastApiIcon,
    iconColor: "text-[#009688]",
    accent: "#3FD9C7",
    modules: [
      {
        title: "Getting Started",
        lessons: [{ id: "why-fastapi", title: "Why FastAPI" }, { id: "project-setup", title: "Project setup" }, { id: "your-first-endpoint", title: "Your first endpoint" }],
      },
      {
        title: "Core Concepts",
        lessons: [
          { id: "path-and-query-params", title: "Path & query params" },
          { id: "pydantic-models", title: "Pydantic models" },
          { id: "request-validation", title: "Request validation" },
          { id: "dependency-injection", title: "Dependency injection" },
        ],
      },
      {
        title: "Building Real APIs",
        lessons: [
          { id: "async-routes", title: "Async routes" },
          { id: "streaming-responses", title: "Streaming responses" },
          { id: "auth-and-middleware", title: "Auth & middleware" },
          { id: "background-tasks", title: "Background tasks" },
        ],
      },
      {
        title: "Shipping",
        lessons: [{ id: "testing-with-pytest", title: "Testing with pytest" }, { id: "deploying-to-production", title: "Deploying to production" }],
      },
    ],
  },
  {
    slug: "claude-code",
    title: "Claude Code",
    description: "Go from typing prompts to shipping real software with an agentic coding partner.",
    bg: "bg-[#FB923C]",
    icon: ClaudeIcon,
    iconColor: "text-[#D97757]",
    accent: "#D97757",
    modules: [
      {
        title: "Getting Started",
        lessons: [
          { id: "installing-claude-code", title: "Installing Claude Code" },
          { id: "your-first-session", title: "Your first session" },
          { id: "the-permission-model", title: "The permission model" },
        ],
      },
      {
        title: "Working with the Agent",
        lessons: [
          { id: "reading-and-editing-code", title: "Reading & editing code" },
          { id: "running-commands-safely", title: "Running commands safely" },
          { id: "subagents", title: "Subagents" },
          { id: "plan-mode", title: "Plan mode" },
        ],
      },
      {
        title: "Real Workflows",
        lessons: [
          { id: "debugging-with-claude-code", title: "Debugging with Claude Code" },
          { id: "refactoring-large-codebases", title: "Refactoring large codebases" },
          { id: "writing-tests", title: "Writing tests" },
        ],
      },
      {
        title: "Going Further",
        lessons: [{ id: "custom-skills", title: "Custom skills" }, { id: "ci-and-automation", title: "CI & automation" }],
      },
    ],
  },
  {
    slug: "ai-agents",
    title: "AI Agents",
    description: "Design multi-step, tool-using agents with LangChain that plan, act, and recover from failure.",
    bg: "bg-[#A78BFA]",
    icon: LangChainIcon,
    iconColor: "text-[#7FC8FF]",
    accent: "#7FC8FF",
    modules: [
      {
        title: "Getting Started",
        lessons: [{ id: "what-makes-an-agent", title: "What makes an agent" }, { id: "setting-up-langchain", title: "Setting up LangChain" }],
      },
      {
        title: "Core Concepts",
        lessons: [
          { id: "tool-calling", title: "Tool calling" },
          { id: "planning-and-reasoning-loops", title: "Planning & reasoning loops" },
          { id: "memory", title: "Memory" },
          { id: "state-machines", title: "State machines" },
        ],
      },
      {
        title: "Building Agents",
        lessons: [
          { id: "multi-step-agents", title: "Multi-step agents" },
          { id: "multi-agent-systems", title: "Multi-agent systems" },
          { id: "error-recovery", title: "Error recovery" },
        ],
      },
      {
        title: "Production",
        lessons: [{ id: "evaluation", title: "Evaluation" }, { id: "observability", title: "Observability" }],
      },
    ],
  },
  {
    slug: "local-models",
    title: "Local Models",
    description: "Run, quantize, and serve open-weight models on your own hardware with Ollama.",
    bg: "bg-[#34D399]",
    icon: OllamaIcon,
    iconColor: "text-white",
    accent: "#34D399",
    modules: [
      {
        title: "Getting Started",
        lessons: [{ id: "installing-ollama", title: "Installing Ollama" }, { id: "pulling-your-first-model", title: "Pulling your first model" }],
      },
      {
        title: "Core Concepts",
        lessons: [
          { id: "quantization-basics", title: "Quantization basics" },
          { id: "gguf-and-model-formats", title: "GGUF & model formats" },
          { id: "hardware-requirements", title: "Hardware requirements" },
        ],
      },
      {
        title: "Running Models",
        lessons: [
          { id: "serving-a-local-api", title: "Serving a local API" },
          { id: "fine-tuning-basics", title: "Fine-tuning basics" },
          { id: "benchmarking", title: "Benchmarking" },
        ],
      },
    ],
  },
  {
    slug: "prompt-engineering",
    title: "Prompt Engineering",
    description: "Write prompts that are reliable, testable, and easy to iterate on.",
    bg: "bg-[#F4A6C6]",
    icon: PromptIcon,
    iconColor: "text-[#F4A6C6]",
    accent: "#F4A6C6",
    modules: [
      {
        title: "Getting Started",
        lessons: [{ id: "how-llms-read-prompts", title: "How LLMs read prompts" }, { id: "zero-shot-vs-few-shot", title: "Zero-shot vs few-shot" }],
      },
      {
        title: "Core Techniques",
        lessons: [
          { id: "chain-of-thought", title: "Chain of thought" },
          { id: "system-prompts", title: "System prompts" },
          { id: "structured-output", title: "Structured output" },
        ],
      },
      {
        title: "Reliability",
        lessons: [{ id: "testing-prompts", title: "Testing prompts" }, { id: "evals", title: "Evals" }, { id: "versioning-prompts", title: "Versioning prompts" }],
      },
    ],
  },
  {
    slug: "coding-with-ai",
    title: "Coding with AI",
    description: "Use AI assistants to plan, write, review, and ship code faster without giving up quality.",
    bg: "bg-[#60A5FA]",
    icon: CodeXml,
    iconColor: "text-[#60A5FA]",
    accent: "#60A5FA",
    modules: [
      {
        title: "Getting Started",
        lessons: [
          { id: "the-ai-assisted-workflow", title: "The AI-assisted workflow" },
          { id: "choosing-your-tools", title: "Choosing your tools" },
          { id: "setting-up-your-editor", title: "Setting up your editor" },
        ],
      },
      {
        title: "Core Skills",
        lessons: [
          { id: "writing-effective-prompts-for-code", title: "Writing effective prompts for code" },
          { id: "giving-context", title: "Giving context (files, docs, errors)" },
          { id: "reviewing-ai-generated-code", title: "Reviewing AI-generated code" },
          { id: "iterating-with-feedback", title: "Iterating with feedback" },
        ],
      },
      {
        title: "Everyday Workflows",
        lessons: [
          { id: "generating-and-refactoring-code", title: "Generating and refactoring code" },
          { id: "debugging-with-ai", title: "Debugging with AI" },
          { id: "writing-tests-and-docs", title: "Writing tests and docs" },
          { id: "learning-unfamiliar-codebases", title: "Learning unfamiliar codebases" },
        ],
      },
      {
        title: "Working Responsibly",
        lessons: [
          { id: "security-and-secrets", title: "Security and secrets" },
          { id: "spotting-hallucinations", title: "Spotting hallucinations" },
          { id: "when-not-to-use-ai", title: "When not to use AI" },
        ],
      },
    ],
  },
];

if (process.env.NODE_ENV !== "production") {
  for (const course of COURSES) {
    const seen = new Set<string>();
    for (const lesson of course.modules.flatMap((m) => m.lessons)) {
      if (seen.has(lesson.id)) {
        console.error(`Duplicate lesson id "${lesson.id}" in course "${course.slug}"`);
      }
      seen.add(lesson.id);
    }
  }
}

export function getCourse(slug: string) {
  return COURSES.find((course) => course.slug === slug);
}
