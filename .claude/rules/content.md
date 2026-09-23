# Content rules

Rules for adding or editing courses, lessons, quizzes, and cheatsheets. All content is TypeScript data in `src/data/`, not a CMS.

## Adding a course

Add an object to `COURSES` in `src/data/courses.tsx`. Every field is required:

| Field | Rule |
|---|---|
| `slug` | lowercase-hyphenated, unique. It becomes the URL `/courses/<slug>`. |
| `title` | Short display name. |
| `description` | One sentence, shown on the course card. |
| `bg` | Tailwind hex class, e.g. `bg-[#60A5FA]`. Must not match another course. |
| `icon` | A brand icon from `src/components/icons/BrandIcons.tsx` or a lucide icon (any component that accepts SVG props). |
| `iconColor` | Tailwind text color for the icon, e.g. `text-[#60A5FA]`. |
| `accent` | Hex string used to theme lesson pages. Usually the same hue as `bg`. |
| `modules` | Array of `{ title, lessons: [{ title }] }`. |

Example (the existing `coding-with-ai` entry):

```tsx
{
  slug: "coding-with-ai",
  title: "Coding with AI",
  description: "Use AI assistants to plan, write, review, and ship code faster without giving up quality.",
  bg: "bg-[#60A5FA]",
  icon: CodeXml,
  iconColor: "text-[#60A5FA]",
  accent: "#60A5FA",
  modules: [{ title: "Getting Started", lessons: [{ id: "ai-assisted-workflow", title: "The AI-assisted workflow" }] }],
}
```

Adding an entry is enough: the `/courses` grid and `/courses/[slug]` pages read from `COURSES`, so do not create route files per course.

## Writing lessons

- Every lesson needs an `id`: a lowercase-hyphenated slug, unique within its course (for example `overview-of-python`). Users' saved progress is keyed by it, so never change an `id` after the lesson is published, even if the title changes. Duplicates log an error in dev.
- A lesson with only an `id` and `title` shows the "coming soon" placeholder. That is fine for unfinished lessons; do not invent filler content.
- `content` is a template string in the lightweight markdown rendered by `src/lib/lesson-content.tsx`:
  - Blank-line-separated paragraphs. The first paragraph renders larger as the hook line, so make it a strong one-sentence opener.
  - `- ` lines make a bullet list.
  - `> ` lines make a pull-quote.
  - Triple-backtick fences with a language make a terminal-style code block.
  - A fence tagged `note` makes a highlighted callout.
  - Inline `code` works anywhere.
- Inside the template string, escape every backtick as `\``. Unescaped backticks end the string and break the build.
- Use `extra` for something interactive that follows the text: a live `<Terminal>` demo or a `<Quiz>`. Do not put prose in `extra`.

Example:

```tsx
{
  id: "overview-of-python",
  title: "Overview of Python",
  content: `Programming is the practice of writing precise, step-by-step instructions.

> Python reads close to plain English.

- Readable syntax
- No compilation step

\`\`\`note
By the end of this module you will understand the concepts underneath the syntax.
\`\`\``,
}
```

## Quizzes

- Put questions in `src/data/<topic>-quiz.ts` and export a `QuizQuestion[]` (type from `src/components/Quiz.tsx`).
- Each question has `question`, `options` (string array), `correctIndex`, and an `explanation`.
- `correctIndex` is zero-based. Vary which position is correct across questions.
- Always write an `explanation`; it is shown after the answer and is where the teaching happens.
- Attach the quiz to a lesson with `extra`:

```tsx
{
  id: "python-basics-quiz",
  title: "Python Basics Quiz",
  extra: <Quiz questions={pythonIntroQuiz} accent="#5B9BD5" title="Python Basics Quiz" />,
}
```

- Pass the same `accent` as the course so the quiz matches the page.

## Cheatsheets

Add an object to `CHEATSHEETS` in `src/data/cheatsheets.tsx` with `slug`, `title`, `subtitle`, `description`, `bg`, `icon`, `iconColor`, and `items`. Each item has:

- `n`: sequential from 1, no gaps.
- `name`: the thing being referenced, e.g. `len()`.
- `purpose`: one sentence, ends with a period.
- `example`: one line of code, with the result in a trailing `# comment`.

```tsx
{ n: 3, name: "len()", purpose: "Return the number of items/characters.", example: 'len("Python") # 6' }
```

## Naming and tone

- Titles (course, module, lesson) are short and sentence case.
- Slugs are lowercase with hyphens, no spaces or underscores.
- Copy is practical and project-driven. No filler, no hype.
