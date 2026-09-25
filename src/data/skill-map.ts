import type { Resource, ResourceKind, SkillMap } from "@/lib/skill-map/types";

const CHECKED = "2026-09-25";

const docs = (title: string, url: string): Resource => res("docs", title, url);
const course = (title: string, url: string): Resource => res("course", title, url);
const video = (title: string, url: string): Resource => res("video", title, url);

function res(kind: ResourceKind, title: string, url: string): Resource {
  return { kind, title, url, checked: CHECKED };
}

/**
 * The Core every developer needs, and the Branches a Learner can choose to go deep in.
 * Every resource is free forever (a free sign-up is fine, a free trial is not).
 * Prerequisites are advice, never locks.
 */
export const SKILL_MAP: SkillMap = {
  branches: [
    {
      id: "ai",
      title: "AI engineering",
      summary:
        "Build software on top of language models: calling them, prompting them, grounding them in your data, and letting them use tools.",
      color: "#a855f7",
    },
    {
      id: "frontend",
      title: "Frontend",
      summary:
        "Build the part of an app people see and touch in the browser, and make it fast and usable for everyone.",
      color: "#38bdf8",
    },
    {
      id: "backend",
      title: "Backend",
      summary: "Build the servers, APIs and databases behind an app, and keep them correct and secure.",
      color: "#f97316",
    },
    {
      id: "devops",
      title: "DevOps & Cloud",
      summary: "Get code from a laptop to servers reliably, then keep it running.",
      color: "#22c55e",
    },
    {
      id: "data",
      title: "Data",
      summary: "Clean, explore and explain data, then teach machines to find patterns in it.",
      color: "#eab308",
    },
  ],

  skills: [
    // ── Core ──────────────────────────────────────────────────────────────
    {
      id: "how-computers-work",
      title: "How computers & the internet work",
      summary:
        "What a program actually is, how a computer runs it, and how computers talk to each other over the internet.",
      why: "Every later Skill builds on this picture. Without it, errors and jargon feel like magic instead of cause and effect.",
      area: "core",
      prerequisites: [],
      resources: [
        course("CS50x: Harvard's Introduction to Computer Science", "https://cs50.harvard.edu/x/"),
        video(
          "Crash Course Computer Science",
          "https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo",
        ),
        docs(
          "MDN: How does the internet work?",
          "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work",
        ),
      ],
      glossary: [],
    },
    {
      id: "terminal",
      title: "The terminal",
      summary: "Typing commands to move around files, run programs and install tools, instead of clicking.",
      why: "Nearly every developer tool is run from the terminal: Git, Python, package managers, servers and AI coding agents.",
      area: "core",
      prerequisites: ["how-computers-work"],
      resources: [
        course("The Missing Semester: The Shell", "https://missing.csail.mit.edu/2020/course-shell/"),
        course(
          "The Odin Project: Command Line Basics",
          "https://www.theodinproject.com/lessons/foundations-command-line-basics",
        ),
      ],
      glossary: [],
    },
    {
      id: "git",
      title: "Git & GitHub",
      summary:
        "Saving snapshots of your code, going back when something breaks, and sharing work with others on GitHub.",
      why: "Every team uses version control, and a GitHub profile is how people see what you've built.",
      area: "core",
      prerequisites: ["terminal"],
      resources: [
        docs("Pro Git (free book)", "https://git-scm.com/book/en/v2"),
        course("GitHub Skills", "https://skills.github.com/"),
        video("Git and GitHub for Beginners (freeCodeCamp)", "https://www.youtube.com/watch?v=RGOj5yH7evk"),
      ],
      glossary: [],
    },
    {
      id: "python",
      title: "A first language: Python",
      summary:
        "Variables, conditions, loops, functions and files: the building blocks of every program, learned in the most readable language.",
      why: "You need one language you can think in. Python reads almost like English and leads straight into AI and data work.",
      area: "core",
      prerequisites: ["terminal"],
      resources: [
        course("CS50's Introduction to Programming with Python", "https://cs50.harvard.edu/python/"),
        docs("The official Python tutorial", "https://docs.python.org/3/tutorial/"),
        video("Learn Python: Full Course for Beginners (freeCodeCamp)", "https://www.youtube.com/watch?v=rfscVS0vtbw"),
      ],
      glossary: [],
    },
    {
      id: "problem-solving",
      title: "Problem solving & data structures",
      summary:
        "Breaking a problem into steps, and choosing the right way to store data: lists, dictionaries, sets, stacks, queues and trees.",
      why: "Knowing syntax isn't the same as knowing what to write. This is what lets you solve problems nobody has shown you before.",
      area: "core",
      prerequisites: ["python"],
      resources: [
        docs("Think Python (free book)", "https://allendowney.github.io/ThinkPython/"),
        video("Data Structures Easy to Advanced (freeCodeCamp)", "https://www.youtube.com/watch?v=RBSGKlAvoiM"),
      ],
      glossary: [],
    },
    {
      id: "html-css",
      title: "HTML & CSS",
      summary: "HTML describes what's on a web page; CSS decides how it looks and lays out on any screen size.",
      why: "The browser is the world's most common app platform. Even backend and AI developers end up building a page to show their work.",
      area: "core",
      prerequisites: ["how-computers-work"],
      resources: [
        course("MDN: Learn web development", "https://developer.mozilla.org/en-US/docs/Learn_web_development"),
        course("freeCodeCamp: Responsive Web Design", "https://www.freecodecamp.org/learn/2022/responsive-web-design"),
        docs("web.dev: Learn CSS", "https://web.dev/learn/css"),
      ],
      glossary: [],
    },
    {
      id: "web-apis",
      title: "How the web works: HTTP & APIs",
      summary:
        "What happens between typing a URL and seeing a page, and how programs ask other programs for data through APIs.",
      why: "Almost everything you build will call an API or be one, including every AI model you'll use.",
      area: "core",
      prerequisites: ["html-css", "python"],
      resources: [
        docs("MDN: An overview of HTTP", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
        video("APIs for Beginners (freeCodeCamp)", "https://www.youtube.com/watch?v=GZvSYJDk-us"),
      ],
      glossary: [],
    },
    {
      id: "sql",
      title: "SQL & databases",
      summary: "Storing data in tables and asking questions of it with SQL, the language nearly every database speaks.",
      why: "Every real app keeps data somewhere, and SQL has outlived every trend for fifty years.",
      area: "core",
      prerequisites: ["python"],
      resources: [
        course("SQLBolt: interactive SQL lessons", "https://sqlbolt.com/"),
        course("CS50's Introduction to Databases with SQL", "https://cs50.harvard.edu/sql/"),
        video(
          "SQL Tutorial: Full Database Course for Beginners (freeCodeCamp)",
          "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        ),
      ],
      glossary: [],
    },
    {
      id: "testing-debugging",
      title: "Testing & debugging",
      summary:
        "Writing small programs that check your program, and tracking down why something breaks instead of guessing.",
      why: "You'll spend more time fixing code than writing it. Tests let you change code without fear, including code an AI wrote.",
      area: "core",
      prerequisites: ["python"],
      resources: [
        docs("pytest: Get started", "https://docs.pytest.org/en/stable/getting-started.html"),
        course(
          "The Missing Semester: Debugging and Profiling",
          "https://missing.csail.mit.edu/2020/debugging-profiling/",
        ),
      ],
      glossary: ["Automated check"],
    },
    {
      id: "deploying",
      title: "Deploying something",
      summary: "Putting a project on the internet so anyone can use it with a link, not just you on your laptop.",
      why: "Shipped beats perfect. A live link is worth more to an employer, or a friend, than any number of unfinished folders.",
      area: "core",
      prerequisites: ["git", "html-css"],
      resources: [
        docs("GitHub Pages quickstart", "https://docs.github.com/en/pages/quickstart"),
        docs(
          "MDN: Publishing your website",
          "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Publishing_your_website",
        ),
      ],
      glossary: [],
    },
    {
      id: "ai-tools",
      title: "Using AI tools as a developer",
      summary:
        "Working with AI coding assistants and agents: giving them good context, checking their work and knowing when not to trust them.",
      why: "AI now writes a lot of code. Developers who can direct it and review it well get far more done than those who can't.",
      area: "core",
      prerequisites: ["git", "python"],
      resources: [
        docs("Claude Code overview", "https://code.claude.com/docs/en/overview"),
        docs(
          "Prompt engineering overview (Anthropic)",
          "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
        ),
      ],
      glossary: ["Vibe coding", "Context window", "Hallucination", "Human review"],
    },

    // ── AI engineering ────────────────────────────────────────────────────
    {
      id: "how-llms-work",
      title: "How language models work",
      summary:
        "What a large language model is: a program trained to predict the next token, and why that makes it both useful and unreliable.",
      why: "Knowing what's under the hood tells you what to expect from a model, and why it sometimes confidently gets things wrong.",
      area: "ai",
      prerequisites: ["ai-tools"],
      resources: [
        video("Intro to Large Language Models (Andrej Karpathy)", "https://www.youtube.com/watch?v=zjkBMFhNj_g"),
        video("Transformers, the tech behind LLMs (3Blue1Brown)", "https://www.youtube.com/watch?v=wjZofJX0v4M"),
      ],
      glossary: ["Token", "Next-token prediction", "Training", "Knowledge cutoff", "Non-determinism"],
    },
    {
      id: "model-apis",
      title: "Calling model APIs",
      summary:
        "Sending messages to a model from your own code and getting replies back, with the settings that shape the answer.",
      why: "This is the step from using AI to building with it. Every AI feature starts with an API call.",
      area: "ai",
      prerequisites: ["how-llms-work", "web-apis"],
      resources: [
        docs("Claude API: Get started", "https://platform.claude.com/docs/en/get-started"),
        course("Anthropic courses: API fundamentals", "https://github.com/anthropics/courses"),
      ],
      glossary: ["Model provider", "Input tokens", "Output tokens", "Parameters"],
    },
    {
      id: "prompting",
      title: "Prompt engineering",
      summary: "Writing instructions, examples and context so a model does what you meant, reliably, not just once.",
      why: "The same model gives poor or excellent results depending on how it's asked. This is the cheapest way to improve an AI feature.",
      area: "ai",
      prerequisites: ["model-apis"],
      resources: [
        course(
          "Anthropic's interactive prompt engineering tutorial",
          "https://github.com/anthropics/prompt-eng-interactive-tutorial",
        ),
        docs(
          "Prompt engineering overview (Anthropic)",
          "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
        ),
      ],
      glossary: ["System prompt", "Context"],
    },
    {
      id: "retrieval",
      title: "Retrieval & embeddings (RAG)",
      summary:
        "Finding the right pieces of your own documents and handing them to the model, so it answers from facts rather than memory.",
      why: "Models don't know your company's data or anything after their cutoff. Retrieval is how most real AI products fix that.",
      area: "ai",
      prerequisites: ["prompting", "sql"],
      resources: [
        docs(
          "What is retrieval-augmented generation? (Pinecone)",
          "https://www.pinecone.io/learn/retrieval-augmented-generation/",
        ),
        course("Hugging Face LLM Course", "https://huggingface.co/learn/llm-course/chapter1/1"),
      ],
      glossary: ["Parametric knowledge", "Contextual knowledge"],
    },
    {
      id: "agents",
      title: "Agents & tool use",
      summary:
        "Letting a model call functions you define, such as search or running code, in a loop until a task is done.",
      why: "Agents turn a model from something that talks into something that acts. It's where AI engineering is heading fastest.",
      area: "ai",
      prerequisites: ["prompting"],
      resources: [
        docs(
          "Building effective agents (Anthropic)",
          "https://www.anthropic.com/engineering/building-effective-agents",
        ),
        docs("Tool use with Claude", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"),
        docs("Model Context Protocol", "https://modelcontextprotocol.io/"),
      ],
      glossary: ["Agent", "Tool call", "Tool result", "MCP", "Subagent", "Harness"],
    },
    {
      id: "evals",
      title: "Evaluating AI output",
      summary:
        "Measuring whether an AI feature is actually good, with test sets and automatic checks instead of a quick look.",
      why: "Models are non-deterministic, so a demo that worked once proves little. Evals are testing for AI.",
      area: "ai",
      prerequisites: ["agents", "testing-debugging"],
      resources: [
        docs("Your AI product needs evals (Hamel Husain)", "https://hamel.dev/blog/posts/evals/"),
        docs(
          "Create strong empirical evaluations (Anthropic)",
          "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests",
        ),
      ],
      glossary: ["Hallucination", "Non-determinism", "Automated review"],
    },
    {
      id: "neural-networks",
      title: "Neural networks from scratch",
      summary:
        "Building a small neural network and a tiny GPT yourself, to see exactly how training and prediction work.",
      why: "Optional depth for the curious. Not needed to ship AI features, but it makes every other AI Skill click.",
      area: "ai",
      prerequisites: ["how-llms-work", "problem-solving"],
      resources: [
        course("Neural Networks: Zero to Hero (Andrej Karpathy)", "https://karpathy.ai/zero-to-hero.html"),
        video("Let's build GPT from scratch (Andrej Karpathy)", "https://www.youtube.com/watch?v=kCc8FmEb1nY"),
      ],
      glossary: ["Training", "Inference"],
    },

    // ── Frontend ──────────────────────────────────────────────────────────
    {
      id: "javascript",
      title: "JavaScript",
      summary: "The language every browser runs, which makes pages respond to clicks, typing and data.",
      why: "HTML and CSS make a page; JavaScript makes it an app. There's no frontend without it.",
      area: "frontend",
      prerequisites: ["html-css", "problem-solving"],
      resources: [
        docs("The Modern JavaScript Tutorial", "https://javascript.info/"),
        docs("MDN: JavaScript Guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"),
        video(
          "Learn JavaScript: Full Course for Beginners (freeCodeCamp)",
          "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        ),
      ],
      glossary: [],
    },
    {
      id: "typescript",
      title: "TypeScript",
      summary: "JavaScript with types, so your editor catches mistakes before your users do.",
      why: "Most professional frontend code is TypeScript now, and it makes large codebases far easier to change.",
      area: "frontend",
      prerequisites: ["javascript"],
      resources: [docs("The TypeScript Handbook", "https://www.typescriptlang.org/docs/handbook/intro.html")],
      glossary: [],
    },
    {
      id: "react",
      title: "React",
      summary: "Building interfaces out of small, reusable components that update themselves when data changes.",
      why: "React is the most widely used way to build web interfaces, and most frontend jobs expect it.",
      area: "frontend",
      prerequisites: ["javascript"],
      resources: [
        docs("React: Learn", "https://react.dev/learn"),
        video("React Course for Beginners (freeCodeCamp)", "https://www.youtube.com/watch?v=bMknfKXIFA8"),
      ],
      glossary: [],
    },
    {
      id: "accessibility",
      title: "Accessibility",
      summary: "Making interfaces that work for everyone, including people using screen readers, keyboards or zoom.",
      why: "About one in six people has a disability. Accessible sites are better for everyone, and often a legal requirement.",
      area: "frontend",
      prerequisites: ["html-css"],
      resources: [
        course("web.dev: Learn Accessibility", "https://web.dev/learn/accessibility"),
        docs("MDN: Accessibility", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility"),
      ],
      glossary: [],
    },

    // ── Backend ───────────────────────────────────────────────────────────
    {
      id: "web-framework",
      title: "Building APIs with FastAPI",
      summary: "Writing your own web server in Python that answers requests, checks input and returns data.",
      why: "This is the moment you stop only calling APIs and start building them for others to call.",
      area: "backend",
      prerequisites: ["web-apis", "testing-debugging"],
      resources: [docs("FastAPI tutorial", "https://fastapi.tiangolo.com/tutorial/")],
      glossary: [],
    },
    {
      id: "database-design",
      title: "Database design & ORMs",
      summary:
        "Shaping tables and relationships that stay fast and correct as data grows, and working with them from Python.",
      why: "A bad schema is the hardest mistake to undo in a backend. Getting it right early saves months later.",
      area: "backend",
      prerequisites: ["sql", "web-framework"],
      resources: [
        docs("PostgreSQL tutorial", "https://www.postgresql.org/docs/current/tutorial.html"),
        docs("SQLAlchemy Unified Tutorial", "https://docs.sqlalchemy.org/en/20/tutorial/"),
      ],
      glossary: [],
    },
    {
      id: "auth-security",
      title: "Authentication & security",
      summary:
        "Logging people in safely, keeping passwords and secrets out of reach, and defending against the most common attacks.",
      why: "One security mistake can leak every user's data. Backend developers are the last line of defense.",
      area: "backend",
      prerequisites: ["web-framework"],
      resources: [
        docs("OWASP Top 10", "https://owasp.org/projects/top-ten"),
        docs("FastAPI: Security", "https://fastapi.tiangolo.com/tutorial/security/"),
      ],
      glossary: [],
    },
    {
      id: "system-design",
      title: "System design",
      summary:
        "Planning how the parts of a large system fit together: caches, queues, load balancers and how they fail.",
      why: "It's how you build things that survive real traffic, and it's asked in almost every mid-level interview.",
      area: "backend",
      prerequisites: ["database-design", "auth-security"],
      resources: [docs("The System Design Primer", "https://github.com/donnemartin/system-design-primer")],
      glossary: [],
    },

    // ── DevOps & Cloud ────────────────────────────────────────────────────
    {
      id: "linux",
      title: "Linux & servers",
      summary:
        "How the operating system behind almost every server works: users, permissions, processes and networking.",
      why: "Your code will run on a Linux machine you can only reach through a terminal. You need to be at home there.",
      area: "devops",
      prerequisites: ["terminal"],
      resources: [
        video(
          "Linux Operating System: Crash Course for Beginners (freeCodeCamp)",
          "https://www.youtube.com/watch?v=ROjZy1WbCIA",
        ),
        course("The Missing Semester: Command-line Environment", "https://missing.csail.mit.edu/2020/command-line/"),
      ],
      glossary: [],
    },
    {
      id: "docker",
      title: "Containers with Docker",
      summary:
        "Packaging an app with everything it needs, so it runs the same on your laptop, a teammate's and a server.",
      why: '"It works on my machine" stops being a problem. Containers are how most software is shipped today.',
      area: "devops",
      prerequisites: ["linux", "deploying"],
      resources: [
        docs("Docker: Get started", "https://docs.docker.com/get-started/"),
        video("Docker Tutorial for Beginners (freeCodeCamp)", "https://www.youtube.com/watch?v=fqMOX6JJhGo"),
      ],
      glossary: [],
    },
    {
      id: "ci-cd",
      title: "CI/CD with GitHub Actions",
      summary: "Having every push run your tests automatically, and shipping to production when they pass.",
      why: "Automation catches mistakes humans miss, and lets a team ship many times a day without fear.",
      area: "devops",
      prerequisites: ["git", "testing-debugging"],
      resources: [docs("GitHub Actions quickstart", "https://docs.github.com/en/actions/get-started/quickstart")],
      glossary: ["Automated check"],
    },
    {
      id: "cloud",
      title: "Cloud basics",
      summary:
        "Renting computers, storage and databases from a cloud provider, and knowing which service to use for what.",
      why: "Most companies run on AWS, Google Cloud or Azure. Knowing the basics makes you useful on any team.",
      area: "devops",
      prerequisites: ["docker"],
      resources: [
        course(
          "AWS Cloud Practitioner learning (free with sign-up)",
          "https://aws.amazon.com/training/learn-about/cloud-practitioner/",
        ),
        video("AWS Certified Cloud Practitioner course (freeCodeCamp)", "https://www.youtube.com/watch?v=NhDYbskXRgc"),
      ],
      glossary: [],
    },

    // ── Data ──────────────────────────────────────────────────────────────
    {
      id: "pandas",
      title: "Data wrangling with pandas",
      summary: "Loading, cleaning, filtering and reshaping tables of data in Python.",
      why: "Real data is messy. Most of data work is getting it into shape, and pandas is the standard tool for that.",
      area: "data",
      prerequisites: ["python"],
      resources: [
        course("Kaggle Learn: Pandas", "https://www.kaggle.com/learn/pandas"),
        docs("pandas: Getting started", "https://pandas.pydata.org/docs/getting_started/index.html"),
      ],
      glossary: [],
    },
    {
      id: "statistics",
      title: "Statistics",
      summary: "Averages, spread, probability and how to tell a real pattern from luck.",
      why: "Without statistics, charts and models can confidently tell you things that aren't true.",
      area: "data",
      prerequisites: ["python"],
      resources: [
        course("Khan Academy: Statistics and probability", "https://www.khanacademy.org/math/statistics-probability"),
        video("StatQuest with Josh Starmer", "https://www.youtube.com/@statquest"),
      ],
      glossary: [],
    },
    {
      id: "visualization",
      title: "Data visualization",
      summary: "Turning numbers into charts that make a point clearly and honestly.",
      why: "An insight nobody understands changes nothing. A good chart is how data persuades people.",
      area: "data",
      prerequisites: ["pandas"],
      resources: [
        course("Kaggle Learn: Data Visualization", "https://www.kaggle.com/learn/data-visualization"),
        docs("Matplotlib tutorials", "https://matplotlib.org/stable/tutorials/index.html"),
      ],
      glossary: [],
    },
    {
      id: "machine-learning",
      title: "Machine learning",
      summary: "Training models that learn patterns from examples to make predictions on new data.",
      why: "It's the step from describing what happened to predicting what will, and it's the foundation under modern AI.",
      area: "data",
      prerequisites: ["pandas", "statistics"],
      resources: [
        course("Kaggle Learn: Intro to Machine Learning", "https://www.kaggle.com/learn/intro-to-machine-learning"),
        course("Practical Deep Learning for Coders (fast.ai)", "https://course.fast.ai/"),
        docs("scikit-learn: Getting started", "https://scikit-learn.org/stable/getting_started.html"),
      ],
      glossary: ["Training", "Model"],
    },
  ],
};
