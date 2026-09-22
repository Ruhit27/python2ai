import type { QuizQuestion } from "@/components/Quiz";

export const pythonIntroQuiz: QuizQuestion[] = [
  {
    question: "What makes Python especially beginner-friendly compared to many other languages?",
    options: [
      "It requires a compilation step before every run",
      "Its syntax reads close to plain English",
      "It has no ecosystem of libraries",
      "It forces you to manage memory manually",
    ],
    correctIndex: 1,
    explanation: "Python's readable syntax stays close to how you'd describe the logic out loud, which is a big part of why it's a popular first language.",
  },
  {
    question: "Which command checks the version of Python you have installed?",
    options: ["python3 --version", "python3 --check", "python3 version", "python3 -v install"],
    correctIndex: 0,
    explanation: "`python3 --version` prints the installed version — if it's 3.10 or higher, you're good to go.",
  },
  {
    question: "Why would you use a virtual environment for a Python project?",
    options: [
      "To make your code run faster",
      "To isolate a project's dependencies from other projects",
      "It's required to write any Python code at all",
      "To automatically format your code",
    ],
    correctIndex: 1,
    explanation: "A virtual environment gives each project its own isolated set of installed packages, so dependencies from different projects never collide.",
  },
  {
    question: "Which command creates a virtual environment with Python's built-in tool?",
    options: ["pip create venv", "python3 -m venv .venv", "python3 new-env", "venv install .venv"],
    correctIndex: 1,
    explanation: "`python3 -m venv .venv` uses Python's built-in `venv` module — no extra install required.",
  },
  {
    question: "What should you do before installing packages into a virtual environment?",
    options: [
      "Delete the .venv folder",
      "Activate the environment",
      "Restart your computer",
      "Nothing — packages install globally by default",
    ],
    correctIndex: 1,
    explanation: "Activating the environment (e.g. `source .venv/bin/activate`) makes sure `pip install` only affects that project, not your whole system.",
  },
  {
    question: "What is `uv` primarily used for?",
    options: [
      "Formatting Python code",
      "A fast, all-in-one replacement for pip, venv, and pyenv",
      "Writing unit tests",
      "Rendering documentation",
    ],
    correctIndex: 1,
    explanation: "uv handles installing Python itself, creating virtual environments, and managing dependencies — all through one fast tool.",
  },
  {
    question: "Which uv command adds a dependency and locks it automatically?",
    options: ["uv install <package>", "uv add <package>", "uv pip <package>", "uv new <package>"],
    correctIndex: 1,
    explanation: "`uv add <package>` installs the package and writes it to a pyproject.toml lockfile automatically.",
  },
  {
    question: "What does Python use to define blocks of code, instead of curly braces?",
    options: ["Semicolons", "Indentation", "Parentheses", "The `block` keyword"],
    correctIndex: 1,
    explanation: "Python uses indentation to define blocks — inconsistent indentation is actually a syntax error, not just a style issue.",
  },
  {
    question: "Which of these is NOT a real, distinct Python data type?",
    options: ["int", "bool", "char", "dict"],
    correctIndex: 2,
    explanation: "Python has no separate `char` type — a single character is just a `str` of length 1.",
  },
  {
    question: "What does `type(28)` return in Python?",
    options: ["'number'", "<class 'int'>", "int(28)", "TypeError"],
    correctIndex: 1,
    explanation: "The built-in `type()` function returns the value's class — for a whole number like 28, that's `<class 'int'>`.",
  },
];
