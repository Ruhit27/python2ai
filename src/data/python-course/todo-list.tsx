import type { CourseModule } from "@/data/courses";
import SampleRun from "@/components/SampleRun";

export const todoListModule: CourseModule = {
  title: "Project 2: To-Do List",
  lessons: [
    {
      id: "todo-meet-the-project",
      title: "Meet the project",
      content: `By the end of this module you'll have built a menu-driven to-do list that you control with typed commands.

## What you'll build

You type \`add\` to add a task, \`done\` to tick one off, \`list\` to see everything, and \`quit\` to exit. The sample run shows the finished program.

## The rough version

This version handles one task and forgets it as soon as you add another.

\`\`\`python
task = input("Task: ")
print("1. [ ]", task)
\`\`\`

## What's wrong with it

- It holds a single task, so you can't build a list
- There's no menu, so you can only do one thing per run
- You can't mark a task done
- The code is one lump, so adding features will make it messy

This module fixes those with lists, loops, dictionaries, and functions. It's the first time your program stores structured data, not just single values.

\`\`\`note
Your tasks disappear when the program exits. Saving them to a file comes in Project 3, and you'll use it again in the capstone.
\`\`\``,
      extra: (
        <SampleRun
          steps={[
            ["cmd", "python3 todo.py"],
            ["out", "add / done / list / quit: add"],
            ["out", "Task: Buy milk"],
            ["out", "add / done / list / quit: add"],
            ["out", "Task: Call Sam"],
            ["out", "add / done / list / quit: done"],
            ["out", "Number: 1"],
            ["out", "add / done / list / quit: list"],
            ["ok", "1. [x] Buy milk"],
            ["ok", "2. [ ] Call Sam"],
          ]}
        />
      ),
    },
    {
      id: "todo-lists",
      title: "Lists",
      content: `By the end of this lesson you'll be able to hold many values in one variable.

## Making a list

A list is an ordered collection in square brackets. It can hold any values, and it can change.

\`\`\`python
tasks = ["Buy milk", "Call Sam"]
tasks.append("Write code")
print(tasks)
\`\`\`

## Getting items out

Each item has a position, called an index, and counting starts at 0. \`tasks[0]\` is the first item and \`tasks[1]\` is the second. A negative index counts from the end, so \`tasks[-1]\` is the last one.

Asking for an index that doesn't exist, like \`tasks[10]\` in a three-item list, raises an \`IndexError\`.

## Useful list tools

A method is a function that belongs to a value, called with a dot, like \`tasks.append(x)\`.

- \`len(tasks)\` gives how many items there are
- \`tasks.append(x)\` adds to the end
- \`tasks.remove(x)\` removes the first item equal to \`x\`
- \`tasks[0] = "New"\` replaces an item
- \`"Buy milk" in tasks\` is \`True\` or \`False\`

Lists that never change are called tuples, written with parentheses, like \`(1, 2)\`. You won't need them for this project.

## Try it

Start with an empty list, \`tasks = []\`, append two tasks, print its length, then print the last one.`,
    },
    {
      id: "todo-loops-over-lists",
      title: "Looping over a list",
      content: `By the end of this lesson you'll be able to do something with every item in a list.

## The for loop

A \`for\` loop takes each item of a list in turn. Compare this with \`while\`, which repeats on a condition. Use \`for\` when you have a collection to walk through.

\`\`\`python
for task in tasks:
    print(task)
\`\`\`

The name after \`for\` is yours to choose. It holds the current item on each round.

## Numbering the items

To print "1. Buy milk", you need a number as well as the item. \`enumerate\` hands you both, and \`start=1\` makes it count from 1:

\`\`\`python
for number, task in enumerate(tasks, start=1):
    print(f"{number}. {task}")
\`\`\`

## Empty lists

A loop over an empty list simply does nothing. Because an empty list counts as false in a condition, you can check for it directly:

\`\`\`python
if not tasks:
    print("Nothing to do.")
\`\`\`

## Try it

Fill a list with three tasks and print them numbered. Then empty it (\`tasks = []\`) and confirm the message appears.`,
    },
    {
      id: "todo-dictionaries",
      title: "Dictionaries",
      content: `By the end of this lesson you'll be able to store related facts about one thing together.

## The problem

A task has two facts: its title and whether it's done. A list of strings can't hold both. A dictionary can.

## Key-value pairs

A dictionary maps keys to values, written in curly braces. You look a value up by its key, not by a position.

\`\`\`python
task = {"title": "Buy milk", "done": False}
print(task["title"])
task["done"] = True
\`\`\`

Assigning to a key that exists changes it. Assigning to one that doesn't creates it. Asking for a missing key with \`task["priority"]\` raises a \`KeyError\`.

## Lists of dictionaries

Put dictionaries in a list, and you have a table: each dictionary is a row.

\`\`\`python
tasks = [
    {"title": "Buy milk", "done": True},
    {"title": "Call Sam", "done": False},
]
\`\`\`

## Handy tools

- \`"priority" in task\` is \`True\` or \`False\`, and checks the keys
- \`task.get("priority", "none")\` returns a default instead of crashing when the key is missing
- \`task.keys()\` and \`task.values()\` list the parts
- \`for key, value in task.items()\` loops over both

## Try it

Build the list above, then loop over it and print each title with an "x" if it's done and a space if not.`,
    },
    {
      id: "todo-functions",
      title: "Functions",
      content: `By the end of this lesson you'll be able to give a chunk of code a name and reuse it.

## Why functions

Your program will list tasks in more than one place. Copying the same six lines around is a bug waiting to happen. A function packages code under a name, so you write it once and call it whenever you need it.

## Defining and calling

\`\`\`python
def add(tasks, title):
    tasks.append({"title": title, "done": False})

my_tasks = []
add(my_tasks, "Buy milk")
\`\`\`

\`def\` starts the definition. The names in parentheses are parameters, the inputs the function expects. The indented lines are its body, which only runs when you call it.

## Returning a value

A function can hand a result back with \`return\`:

\`\`\`python
def count_done(tasks):
    total = 0
    for task in tasks:
        if task["done"]:
            total += 1
    return total
\`\`\`

A function with no \`return\` gives back \`None\`, which just means "nothing".

## Try it

Write \`show(tasks)\` that prints the numbered list, including "[x]" or "[ ]" for each task. Call it after adding two tasks.`,
    },
    {
      id: "todo-organizing-the-code",
      title: "Organizing the code",
      content: `By the end of this lesson you'll be able to structure a program as small functions plus a main loop.

## One job per function

Each function should do one thing and be named for it. For this project, that gives \`show\`, \`add\`, and \`complete\`. When a bug appears, you know which function to look in.

## The main loop

Put the menu in a function called \`main\`. It reads a command, calls the right function, and repeats until the player quits.

\`\`\`python
def main():
    tasks = []
    while True:
        command = input("add / done / list / quit: ")
        if command == "add":
            add(tasks, input("Task: "))
        elif command == "list":
            show(tasks)
        elif command == "quit":
            break
        else:
            print("Unknown command.")

main()
\`\`\`

The call on the last line is what starts the program. The functions above it only define code, they don't run it.

## Order matters

Python must have seen a function's definition before you call it. Define your helpers first, and put \`main()\` at the bottom.

## Try it

Add a \`complete(tasks, number)\` function and a \`done\` command. Remember that the player sees numbers starting at 1, but the list starts at 0.`,
    },
    {
      id: "todo-finish-the-project",
      title: "Finish the project",
      content: `By the end of this lesson you'll have a complete to-do list and a checklist to prove it works.

## The finished program

\`\`\`python
def show(tasks):
    if not tasks:
        print("Nothing to do.")
    for number, task in enumerate(tasks, start=1):
        mark = "x" if task["done"] else " "
        print(f"{number}. [{mark}] {task['title']}")


def add(tasks, title):
    tasks.append({"title": title, "done": False})


def complete(tasks, number):
    tasks[number - 1]["done"] = True


def main():
    tasks = []
    while True:
        command = input("add / done / list / quit: ")
        if command == "add":
            add(tasks, input("Task: "))
        elif command == "done":
            complete(tasks, int(input("Number: ")))
        elif command == "list":
            show(tasks)
        elif command == "quit":
            break
        else:
            print("Unknown command.")


main()
\`\`\`

The line \`mark = "x" if task["done"] else " "\` is a one-line \`if\`: it picks "x" when the task is done and a space otherwise.

## Done when

- \`add\` asks for a task and stores it
- \`list\` shows tasks numbered from 1, with \`[x]\` for done and \`[ ]\` for not done
- \`done\` marks the task with that number as complete
- An empty list prints "Nothing to do."
- An unknown command prints "Unknown command." and keeps going
- \`quit\` ends the program

## Known problem

Ask for \`done\` with a number that doesn't exist, and the program crashes with an \`IndexError\`. Project 3 shows how to handle that kind of error.

## Stretch goals

- Add a \`delete\` command
- Show "2 of 5 done" after \`list\``,
    },
  ],
};
