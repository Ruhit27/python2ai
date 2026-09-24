# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues on `Ruhit27/python2ai`. Use the `gh` CLI for every operation.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments`, with `--label` and `--state` filters as needed.
- **Comment on an issue**: `gh issue comment <number> --body "..."`.
- **Apply or remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`. Label strings come from `triage-labels.md`.
- **Close an issue**: `gh issue close <number> --comment "..."`.

The repo is inferred from `git remote -v`, so `gh` works without `--repo` inside this clone.

## Specs and implementation issues

- A feature's spec is one issue, labelled `spec`.
- Implementation issues are one issue per ticket, never a single combined tickets issue. Each links back to its spec with `Part of #<spec-number>` in the body, and the spec lists its tickets as a task list (`- [ ] #<number>`).
- Triage state is recorded with a label (see `triage-labels.md`), not in the body.
- Conversation history lives in issue comments.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`. The user will normally pass the issue number or URL directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is one issue with one **child** issue per ticket.

- **Map**: an issue labelled `map` whose body holds the Notes / Decisions-so-far / Fog sections.
- **Child ticket**: an issue with the question in the body and `Part of #<map-number>`. A `type:<research|prototype|grilling|task>` label records the ticket type. The map's body lists its children as a task list.
- **Blocking**: a `Blocked by: #NN, #NN` line at the top of the body. A ticket is unblocked when every issue it lists is closed.
- **Frontier**: open, unblocked children of the map with no assignee; lowest issue number wins.
- **Claim**: `gh issue edit <number> --add-assignee @me` before any work.
- **Resolve**: post the answer as a comment starting with `## Answer`, close the issue, then append a context pointer (gist + link) to the map's Decisions-so-far with `gh issue edit <map-number> --body-file ...`.
