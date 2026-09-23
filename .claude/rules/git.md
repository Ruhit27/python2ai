# Git rules

## Branch names

Format: `ruhit/<topic>`

- `<topic>` is lowercase, hyphen-separated, and short (about 2 to 5 words). It describes the change, not the file.
- No spaces, underscores, or capital letters.
- Avoid vague topics like `changes`, `update`, or `fix`.

| Good | Bad |
|---|---|
| `ruhit/coding-with-ai-course` | `ruhit/changes` |
| `ruhit/sidebar-toggle` | `ruhit/Sidebar_Toggle` |
| `ruhit/branch-naming-rule` | `sidebar-toggle` (missing prefix) |

## Never commit to main

- Before any commit, check the current branch. If it is `main`, create a new branch named per the rule above first, then commit there.
- Never push directly to `main`.
- Why: it keeps `main` in a working state and makes each change reviewable on its own.
