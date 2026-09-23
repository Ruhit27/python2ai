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
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";
import Quiz from "@/components/Quiz";
import { UvDiagram, VenvDiagram } from "@/components/LessonDiagrams";
import { pythonIntroQuiz } from "@/data/python-quiz";

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
    description: "The fundamentals every AI engineer needs, taught for people who build things.",
    bg: "bg-[#FFD43B]",
    icon: PythonIcon,
    iconColor: "text-[#4B8BBE]",
    accent: "#5B9BD5",
    modules: [
      {
        title: "Introduction to Python",
        lessons: [
          {
            id: "overview-of-python",
            title: "Overview of Python",
            content: `By the end of this lesson you'll know why Python became the default language for AI, and what this course will teach you to do with it.

## What programming is

Programming means writing precise, step-by-step instructions that a computer can follow. Every app, script, and AI system you'll build here comes down to the same loop: take data in, transform it, produce an output.

## Why Python

> Python reads close to plain English, so you spend your energy on the problem, not the syntax.

- Readable syntax that stays close to how you'd describe the logic out loud
- No compilation step: you run code and see results immediately
- No low-level details like memory to manage
- A massive library ecosystem, which is why it became the default for data science, automation, and AI

\`\`\`note
By the end of this module you'll know more than Python syntax. You'll understand the concepts underneath it (variables, control flow, functions, data structures), and those carry over to every other language you pick up.
\`\`\``,
          },
          {
            id: "installing-python-and-an-ide",
            title: "Installing Python and an IDE",
            content: `By the end of this lesson you'll have Python and an editor installed, ready to run your first script.

## Install Python

On macOS and Linux a Python 3 is often preinstalled, but it's better to manage your own version with a tool like \`uv\` or \`pyenv\` than to rely on the system one. On Windows, download the installer from python.org and tick "Add Python to PATH" during setup.

Check that it worked by running this in a terminal (the text window where you type commands):

\`\`\`bash
python3 --version
\`\`\`

If it prints 3.10 or higher, you're set.

## Pick an editor

Visual Studio Code is free and the most common choice. Install the official Python extension for autocomplete, linting (flagging likely mistakes as you type), and a built-in terminal. Any editor works, but the rest of this course assumes VS Code.

## Open your project folder

Once both are installed, open a terminal inside your project folder. That's where you'll run every script in this course.`,
            extra: (
              <Terminal className="max-w-full">
                <TypingAnimation>&gt; python3 --version</TypingAnimation>
                <AnimatedSpan className="text-green-500">✔ Python 3.12.3</AnimatedSpan>
                <TypingAnimation>&gt; code .</TypingAnimation>
                <AnimatedSpan className="text-muted-foreground">
                  Opening this folder in VS Code…
                </AnimatedSpan>
                <TypingAnimation className="text-muted-foreground">
                  You&apos;re ready to write your first script.
                </TypingAnimation>
              </Terminal>
            ),
          },
          {
            id: "virtual-environments",
            title: "Virtual Environments (venv)",
            content: `By the end of this lesson you'll be able to give each project its own set of packages, so they never collide.

## The problem

Sooner or later every project needs third-party packages: code other people wrote, installed with \`pip\`. Different projects often need conflicting versions of the same package.

A virtual environment gives each project its own isolated set of installed packages. Python ships with a built-in tool for this, the \`venv\` module, so there's nothing extra to install.

## Create and activate one

\`\`\`bash
python3 -m venv .venv
source .venv/bin/activate
\`\`\`

On Windows, activate with \`.venv\\Scripts\\activate\` instead. Once it's active, your terminal prompt shows the environment name, and anything you \`pip install\` only affects this project.

## Rules of thumb

- One virtual environment per project. Never share one across projects
- Add \`.venv/\` to your \`.gitignore\`; it should never be committed
- Run \`deactivate\` to leave the environment when you're done

\`\`\`note
If you hit a "module not found" error that seems impossible, check first that you activated the right virtual environment. It's the most common gotcha.
\`\`\``,
            extra: (
              <>
                <VenvDiagram accent="#5B9BD5" />
                <Terminal className="max-w-full">
                  <TypingAnimation>&gt; python3 -m venv .venv</TypingAnimation>
                  <TypingAnimation>&gt; source .venv/bin/activate</TypingAnimation>
                  <AnimatedSpan className="text-green-500">✔ (.venv) environment active</AnimatedSpan>
                  <TypingAnimation>&gt; pip install requests</TypingAnimation>
                  <AnimatedSpan className="text-muted-foreground">
                    Installed requests-2.32.3 into .venv
                  </AnimatedSpan>
                </Terminal>
              </>
            ),
          },
          {
            id: "managing-projects-with-uv",
            title: "Managing Projects with uv",
            content: `By the end of this lesson you'll be able to start a project, add packages, and run code with a single tool.

> uv does in milliseconds what pip and venv together take seconds to do, and it manages your Python version too.

## What uv is

\`uv\` is a modern, extremely fast replacement for \`pip\`, \`venv\`, and \`pyenv\`, built in Rust by the team behind Ruff. One tool installs Python itself, creates virtual environments, and manages dependencies.

## Your first uv project

\`\`\`bash
uv init my-project
cd my-project
uv add requests
uv run main.py
\`\`\`

\`uv add\` installs a package and records it in \`pyproject.toml\` (with the exact versions pinned in \`uv.lock\`), so there's no separate \`requirements.txt\` to keep in sync by hand. \`uv run\` executes your script inside the project's virtual environment, and you never have to activate it manually.

## Commands to remember

- \`uv python install 3.12\`: installs a specific Python version for you
- \`uv add <package>\`: adds and locks a dependency
- \`uv run <script>\`: runs a script inside the project's environment automatically

\`\`\`note
You don't have to pick between venv and uv forever. venv is worth understanding because uv and most other tooling use it under the hood. Once you're comfortable with both, uv is the faster day-to-day choice for new projects.
\`\`\``,
            extra: (
              <>
                <UvDiagram accent="#5B9BD5" />
                <Terminal className="max-w-full">
                  <TypingAnimation>&gt; uv init my-project</TypingAnimation>
                  <AnimatedSpan className="text-green-500">✔ Initialized project `my-project`</AnimatedSpan>
                  <TypingAnimation>&gt; uv add requests</TypingAnimation>
                  <AnimatedSpan className="text-green-500">✔ Added requests==2.32.3</AnimatedSpan>
                  <TypingAnimation>&gt; uv run main.py</TypingAnimation>
                  <AnimatedSpan className="text-muted-foreground">
                    Running in .venv — no activation needed
                  </AnimatedSpan>
                </Terminal>
              </>
            ),
          },
          {
            id: "basic-syntax-and-data-types",
            title: "Basic syntax and data types",
            content: `By the end of this lesson you'll be able to read basic Python: how blocks are marked, how variables work, and the core data types.

## Indentation

Python uses indentation, not curly braces, to define blocks of code. That's more than a style choice: inconsistent indentation is a syntax error, so get comfortable with it early.

\`\`\`python
name = "Ada"
age = 28

if age >= 18:
    print(f"{name} is an adult")
else:
    print(f"{name} is a minor")
\`\`\`

## Variables and types

A variable doesn't need a declared type. It just points to a value, and Python infers the type from whatever you assign. The ones you'll use most:

- \`int\` and \`float\`: whole and decimal numbers (\`age = 28\`, \`price = 9.99\`)
- \`str\`: text, wrapped in quotes (\`name = "Ada"\`)
- \`bool\`: \`True\` or \`False\`
- \`list\`: an ordered, changeable collection (\`scores = [90, 85, 77]\`)
- \`dict\`: key-value pairs (\`user = {"name": "Ada", "age": 28}\`)

## Checking a type

Check any value's type with the built-in \`type()\` function: \`type(age)\` returns \`<class 'int'>\`.

Python is dynamically typed, so a variable can be reassigned to a different type later. That's convenient, but it means you're responsible for keeping track of what a variable holds.`,
            extra: (
              <Terminal className="max-w-full">
                <TypingAnimation>&gt; python3 main.py</TypingAnimation>
                <AnimatedSpan className="text-green-500">Ada is an adult</AnimatedSpan>
                <TypingAnimation>&gt; python3 -c &quot;print(type(age))&quot;</TypingAnimation>
                <AnimatedSpan className="text-green-500">&lt;class &apos;int&apos;&gt;</AnimatedSpan>
                <TypingAnimation className="text-muted-foreground">
                  Same rules, every type — Python just infers them for you.
                </TypingAnimation>
              </Terminal>
            ),
          },
        ],
      },
      {
        title: "Checkpoint",
        lessons: [
          {
            id: "python-basics-quiz",
            title: "Python Basics Quiz",
            content: `Let's see what stuck. Ten questions cover this whole module: Python's philosophy, your toolchain, virtual environments, uv, and basic syntax.`,
            extra: <Quiz questions={pythonIntroQuiz} accent="#5B9BD5" title="Python Basics Quiz" />,
          },
        ],
      },
      {
        title: "Control Flow and Functions",
        lessons: [
          { id: "conditional-statements", title: "Conditional statements (if, else, elif)" },
          { id: "loops", title: "Loops (for, while)" },
          { id: "functions-and-modular-programming", title: "Functions and modular programming" },
        ],
      },
      {
        title: "Data Structures",
        lessons: [
          { id: "lists-tuples-and-dictionaries", title: "Lists, tuples, and dictionaries" },
          { id: "string-manipulation", title: "String manipulation" },
          { id: "basic-input-output", title: "Basic input/output" },
        ],
      },
      {
        title: "File Handling",
        lessons: [
          { id: "reading-and-writing-files", title: "Reading and writing files" },
          { id: "working-with-different-file-formats", title: "Working with different file formats (text, CSV)" },
        ],
      },
      {
        title: "Exception Handling",
        lessons: [
          { id: "handling-errors-and-exceptions", title: "Handling errors and exceptions" },
          { id: "using-try-except-blocks", title: "Using try-except blocks" },
        ],
      },
      {
        title: "Introduction to Libraries",
        lessons: [
          { id: "overview-of-standard-libraries", title: "Overview of standard libraries (e.g., math, random)" },
          { id: "introduction-to-external-libraries", title: "Introduction to external libraries (e.g., NumPy)" },
        ],
      },
    ],
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
