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
import { pythonIntroQuiz } from "@/data/python-quiz";

export type Lesson = {
  /** Stable slug, unique within its course. Progress is saved against it, so never change it once published. */
  id: string;
  title: string;
  /**
   * Lightweight markdown, rendered by `renderLessonContent`:
   * - blank-line-separated paragraphs (the first one renders as a larger hook line)
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
            content: `Programming is the practice of writing precise, step-by-step instructions that a computer can execute. Every app, script, and AI system you'll build in this course comes down to the same idea: take data in, transform it, produce an output.

> Python reads close to plain English — you spend your energy solving the problem, not fighting the syntax.

It doesn't force you to manage low-level details like memory, and it has a massive ecosystem of libraries — which is why it became the default language for data science, automation, and AI.

- Readable syntax that stays close to how you'd describe the logic out loud
- No compilation step — you run code and see results immediately

\`\`\`note
By the end of this module, you won't just know Python syntax — you'll understand the programming concepts underneath it (variables, control flow, functions, data structures) that transfer to every other language you pick up afterward.
\`\`\``,
          },
          {
            id: "installing-python-and-an-ide",
            title: "Installing Python and an IDE",
            content: `Before writing any code, you need two things installed: Python itself, and an editor to write it in.

Install Python. On macOS and Linux, a Python 3 binary is often preinstalled, but it's better to manage your own version with a tool like \`uv\` or \`pyenv\` rather than relying on the system install. On Windows, download the installer from python.org and check "Add Python to PATH" during setup.

\`\`\`bash
python3 --version
\`\`\`

If that prints a version number of 3.10 or higher, you're set.

Pick an editor. Visual Studio Code (free) is the most common choice — install the official Python extension for autocomplete, linting, and a built-in terminal. Any editor works, but VS Code is what the rest of this course assumes.

Once Python and your editor are installed, open a terminal inside your project folder — that's where you'll run every script in this course.`,
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
            content: `Every Python project you build will eventually need third-party packages — and different projects often need different, conflicting versions of the same package. A virtual environment gives each project its own isolated set of installed packages, so they never collide.

Python ships with a built-in tool for this: the \`venv\` module. No extra install required.

\`\`\`bash
python3 -m venv .venv
source .venv/bin/activate
\`\`\`

On Windows, activate with \`.venv\\Scripts\\activate\` instead. Once active, your terminal prompt shows the environment name, and anything you \`pip install\` from here only affects this project.

- One virtual environment per project — never share one across projects
- Add \`.venv/\` to your \`.gitignore\`; it should never be committed
- Run \`deactivate\` to leave the environment when you're done

\`\`\`note
If you ever see "module not found" errors that seem impossible, check whether you actually activated the right virtual environment first — it's the most common gotcha.
\`\`\``,
            extra: (
              <Terminal className="max-w-full">
                <TypingAnimation>&gt; python3 -m venv .venv</TypingAnimation>
                <TypingAnimation>&gt; source .venv/bin/activate</TypingAnimation>
                <AnimatedSpan className="text-green-500">✔ (.venv) environment active</AnimatedSpan>
                <TypingAnimation>&gt; pip install requests</TypingAnimation>
                <AnimatedSpan className="text-muted-foreground">
                  Installed requests-2.32.3 into .venv
                </AnimatedSpan>
              </Terminal>
            ),
          },
          {
            id: "managing-projects-with-uv",
            title: "Managing Projects with uv",
            content: `\`uv\` is a modern, extremely fast replacement for \`pip\`, \`venv\`, and \`pyenv\` — built in Rust by the team behind Ruff. It handles installing Python itself, creating virtual environments, and managing dependencies, all through one tool.

> uv does in milliseconds what pip and venv together take seconds to do — and it manages your Python version too.

\`\`\`bash
uv init my-project
cd my-project
uv add requests
uv run main.py
\`\`\`

\`uv add\` installs a package and writes it to a \`pyproject.toml\` lockfile automatically — no separate \`requirements.txt\` to keep in sync by hand. \`uv run\` executes your script inside the project's virtual environment without you ever having to activate it manually.

- \`uv python install 3.12\` — installs a specific Python version for you
- \`uv add <package>\` — adds and locks a dependency
- \`uv run <script>\` — runs a script inside the project's environment automatically

\`\`\`note
You don't have to choose between venv and uv forever — venv is worth understanding because it's what uv (and most tooling) uses under the hood. Once you're comfortable with both, uv is the faster day-to-day choice for new projects.
\`\`\``,
            extra: (
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
            ),
          },
          {
            id: "basic-syntax-and-data-types",
            title: "Basic syntax and data types",
            content: `Python uses indentation, not curly braces, to define blocks of code. This isn't just a style choice — inconsistent indentation is a syntax error in Python, so get comfortable with it early.

\`\`\`python
name = "Ada"
age = 28

if age >= 18:
    print(f"{name} is an adult")
else:
    print(f"{name} is a minor")
\`\`\`

A variable in Python doesn't need a declared type — it just points to a value, and the type is inferred from whatever you assign to it:

- \`int\` and \`float\` — whole and decimal numbers (\`age = 28\`, \`price = 9.99\`)
- \`str\` — text, wrapped in quotes (\`name = "Ada"\`)
- \`bool\` — \`True\` or \`False\`
- \`list\` — an ordered, changeable collection (\`scores = [90, 85, 77]\`)
- \`dict\` — key-value pairs (\`user = {"name": "Ada", "age": 28}\`)

You can check any value's type with the built-in \`type()\` function — \`type(age)\` returns \`<class 'int'>\`. Python is dynamically typed, meaning a variable can be reassigned to a different type later, which is convenient but means you're responsible for keeping track of what a variable holds.`,
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
            content: `Let's see what stuck. 10 questions covering everything from this module — Python's philosophy, installing your toolchain, virtual environments, uv, and basic syntax.`,
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
