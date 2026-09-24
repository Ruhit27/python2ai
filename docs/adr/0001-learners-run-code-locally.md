# Learners run code locally, with no in-browser Python runner

The site's `<Terminal>` component only replays scripted output; it cannot execute code. The Python course's projects need `input()`, files, and real network calls, which an in-browser runner such as Pyodide handles poorly. We chose to have learners install Python and an editor and run everything on their own machine, and to teach that setup in a short first module.

## Considered Options

- **Pyodide in-browser runner**: no install, but weak on files, input, and network. Rejected because the module projects depend on them.
- **Hosted runner (Replit, Colab)**: rejected to avoid depending on a third party for every lesson.

## Consequences

Some learners will drop out at setup. The "Get set up" module is kept short and skippable to limit that.
