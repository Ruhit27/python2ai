import type { CourseModule } from "@/data/courses";
import SampleRun from "@/components/SampleRun";

export const habitTrackerModule: CourseModule = {
  title: "Capstone: Habit Tracker",
  lessons: [
    {
      id: "habits-the-brief",
      title: "The brief",
      content: `By the end of this lesson you'll know exactly what you're building for your capstone, and what finished looks like.

## What you'll build

A habit tracker for your terminal. You add habits, check them off each day, and the program remembers between runs. When you check something off, it shows you a motivational quote from the internet.

This one combines every earlier project: menus and dictionaries from the To-Do List, files and errors from the Word Counter, and an API call from Weather Now.

## The requirements

- \`add\` starts tracking a new habit
- \`done\` records that you did a habit today
- \`list\` shows each habit, whether you've done it today, and how many days in total
- \`quit\` exits
- Habits and check-ins are saved in \`habits.json\`, so they're still there next time
- Checking off a habit prints a quote from an API, and a fallback if the API is unreachable
- Nothing you type can crash it

## How this differs from the projects

You get a plan and three checkpoints, but no rough version. You write the code. The earlier lessons hold everything you need, so go back to them whenever you're stuck. That's what programmers do.

## Time

About three hours. Take a break after each checkpoint.`,
      extra: (
        <SampleRun
          steps={[
            ["cmd", "uv run habits.py"],
            ["out", "add / done / list / quit: add"],
            ["out", "Habit: Read"],
            ["out", "Now tracking Read."],
            ["out", "add / done / list / quit: done"],
            ["out", "Habit: Read"],
            ["ok", "Done: Read. Total check-ins: 1."],
            ["ok", '"We must embrace pain and burn it as fuel for our journey." - Kenji Miyazawa'],
            ["out", "add / done / list / quit: list"],
            ["ok", "[x] Read (total: 1)"],
          ]}
        />
      ),
    },
    {
      id: "habits-plan-and-structure",
      title: "Plan before you type",
      content: `By the end of this lesson you'll have a plan for the program, and a project folder ready to go.

## Decide the data first

Everything else follows from how you store a habit. Here is a simple shape: a dictionary where each key is a habit name, and each value is a list of the dates you did it.

\`\`\`python
{
    "Read": ["2026-09-24", "2026-09-25"],  # two check-ins so far
    "Run": [],                              # tracked, but never actually run
}
\`\`\`

Dates are stored as text in the form \`YYYY-MM-DD\`. That form sorts correctly and saves straight to a file with no conversion.

## Decide the functions

One job each, as in the To-Do List:

- \`load()\` reads \`habits.json\`, or returns an empty dictionary if it doesn't exist yet
- \`save(habits)\` writes it back
- \`add_habit(habits, name)\`
- \`check_in(habits, name)\`
- \`show(habits)\`
- \`get_quote()\` fetches a quote
- \`main()\` runs the menu loop

## Set up the folder

\`\`\`bash
uv init habit-tracker
cd habit-tracker
uv add requests
\`\`\`

Create \`habits.py\` next to \`main.py\` and build there. Run it with \`uv run habits.py\`.

## Try it

Write the function names above as empty functions, each with just \`pass\` in the body. \`pass\` is Python for "nothing yet". It gives you an outline to fill in.`,
    },
    {
      id: "habits-checkpoint-add-and-list",
      title: "Checkpoint 1: add and list",
      content: `By the end of this checkpoint you'll have a working menu that tracks habits in memory.

## Your task

Build \`add_habit\`, \`show\`, and the \`main\` loop. Habits live in a dictionary that starts empty each run. There's no saving yet.

Get today's date as text with:

\`\`\`python
from datetime import date

today = date.today().isoformat()   # "2026-09-24": a string, ready to store and compare
\`\`\`

## Done when

- \`add\` with a new name prints "Now tracking ..."
- \`add\` with a name you already track prints "You already track ..." and changes nothing
- \`list\` with no habits prints "No habits yet."
- \`list\` shows a line per habit, like \`[ ] Read (total: 0)\`
- An unknown command prints "Unknown command." and carries on

## Hints

- Review "Dictionaries" in Project 2 for checking whether a key exists with \`in\`
- The habit's total is the length of its list of dates
- Get \`add\` and \`list\` working before you write anything else`,
    },
    {
      id: "habits-checkpoint-save-and-load",
      title: "Checkpoint 2: save and load",
      content: `By the end of this checkpoint your habits survive closing the program.

## Your task

Add \`check_in\`, then \`load\` and \`save\`.

Python's \`json\` module converts dictionaries and lists to and from files. It's the same format you read from the weather API.

\`\`\`python
import json

with open("habits.json", "w", encoding="utf-8") as file:
    json.dump(habits, file, indent=2)   # your dictionary, turned into text on disk

with open("habits.json", encoding="utf-8") as file:
    habits = json.load(file)            # and back into a real dictionary again
\`\`\`

\`indent=2\` makes the saved file readable when you open it.

## Done when

- \`done\` with a habit you track records today's date and prints the new total
- \`done\` a second time on the same day prints "Already done today" and doesn't add a duplicate
- \`done\` with an unknown habit prints "No habit called ..." and doesn't crash
- Quit, run again, and \`list\` shows the same habits and totals
- The first ever run, with no \`habits.json\`, works without an error
- Open \`habits.json\` in your editor and it looks like the data shape from the plan

## Hints

- \`load()\` needs a \`try\` and \`except FileNotFoundError\`. See "Handling errors" in Project 3
- Call \`save\` after every command so a crash can't lose data`,
    },
    {
      id: "habits-checkpoint-quote-reward",
      title: "Checkpoint 3: the quote reward",
      content: `By the end of this checkpoint each check-in gives you a quote, and nothing breaks when the network does.

## Your task

Write \`get_quote()\` and call it from \`check_in\` after a successful check-in.

The quote service is ZenQuotes. It needs no account. Send a \`GET\` request to:

\`\`\`text
https://zenquotes.io/api/random
\`\`\`

It replies with a list holding one dictionary. The quote text is under the key \`"q"\`, and the author is under \`"a"\`. Print the response and confirm before you write code that depends on it.

## Done when

- A check-in prints the quote and its author
- With Wi-Fi off, a check-in still works, and prints a fallback line you wrote
- A request has a \`timeout\`
- \`get_quote()\` returns a string and doesn't print. \`check_in\` does the printing

## Hints

- Review "Handling failures, and finishing the project" in Project 4. One \`except requests.RequestException\` covers the network
- The reply could also come back empty or in an unexpected shape. Catching \`KeyError\`, \`IndexError\`, and \`ValueError\` as well makes it sturdy
- Keep the \`try\` around the request only`,
    },
    {
      id: "habits-ship-it",
      title: "Ship it",
      content: `By the end of this lesson your habit tracker will be something another person can run without your help.

## What shipping means

A program is shipped when someone else can get it running from a fresh folder by following instructions. That's the test.

## Tidy up

- Delete debug prints, and any code you commented out and no longer need
- Give each function a one-line \`#\` comment saying what it does
- Rename anything that confuses you today, so it won't confuse you in a month

## Write a README

Create \`README.md\` in the project folder, with:

- What the program does, in one sentence
- How to install: \`uv sync\`
- How to run it: \`uv run habits.py\`
- The four commands and what each does

## The fresh-folder test

Copy the project folder to somewhere new, without \`.venv\` and \`habits.json\`. In that copy, run \`uv sync\`, then \`uv run habits.py\`. If it starts, the setup is complete.

## Done when

- The fresh-folder test passes
- The README's steps work as written
- If you use git, \`habits.json\` is listed in a file called \`.gitignore\`, so your personal data isn't shared
- You can explain every function in the file

## Where next

You can now read, write, and ship small Python programs. The FastAPI course turns programs like this into web services, and the AI Agents course uses the same skills to build software that reasons and acts.`,
    },
  ],
};
