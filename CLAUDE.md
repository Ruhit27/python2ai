@AGENTS.md

# Project rules

Project rules live in `.claude/rules/`, one markdown file per topic. Claude Code loads every file in that folder automatically. When adding a new rule, put it in the matching file, or create a new topic file rather than growing this one.

Current rule files:
- `.claude/rules/git.md`: branch naming and commit safety

## Agent skills

### Issue tracker

Issues live as GitHub issues on `Ruhit27/python2ai`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
