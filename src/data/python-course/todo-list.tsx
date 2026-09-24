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

This version handles one task and forgets it the moment you add another.

\`\`\`python
task = input("Task: ")   # only one task fits, ever
print("1. [ ]", task)
\`\`\`

## What's wrong with it

- It holds a single task, so you can't build a list
- There's no menu, so you can only do one thing per run
- You can't mark a task done
- The code is one lump, so adding features will make it messy fast

This module fixes those with lists, dictionaries, and functions: the three tools every non-trivial program is built from, in one shape or another.

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
      id: "todo-lists-and-looping",
      title: "Lists, and looping over them",
      content: `By the end of this lesson you'll be able to hold many values in one variable and do something with each of them.

## Making a list

A list is an ordered collection in square brackets. It can hold any values, and unlike a string, you can change it after you make it.

\`\`\`python
tasks = ["Buy milk", "Call Sam"]   # two strings, in order
print(tasks)
\`\`\`

## Getting items out by index

Each item has a position, called an index, counting from 0, not 1. That's the single most common off-by-one bug in beginner code, so slow down here.

\`\`\`python
tasks = ["Buy milk", "Call Sam", "Write code"]
print(tasks[0])    # Buy milk: first item, index 0
print(tasks[2])    # Write code: third item, index 2
print(tasks[-1])   # Write code: negative counts from the end
print(len(tasks))  # 3: how many items
\`\`\`

Ask for \`tasks[10]\` on a 3-item list and you get \`IndexError: list index out of range\`, not \`None\` or an empty string. Python refuses to guess.

## Methods: functions that belong to a value

A method is a function attached to a value, called with a dot, like \`tasks.append(...)\`. You've already used string methods without the name; \`.lower()\` in a future lesson works the same way. List methods change the list itself, rather than handing back a new one.

\`\`\`python
tasks = ["Buy milk"]

tasks.append("Call Sam")     # adds to the end
tasks.append("Write code")
print(tasks)                  # ['Buy milk', 'Call Sam', 'Write code']

tasks.remove("Call Sam")     # removes the first match, not by position
print(tasks)                  # ['Buy milk', 'Write code']

tasks[0] = "Buy oat milk"    # replace by index, no method needed
print(tasks)                  # ['Buy oat milk', 'Write code']

print("Write code" in tasks) # True: checks membership, doesn't search by index
\`\`\`

Lists that are never meant to change use parentheses instead of brackets and are called tuples, like \`(1, 2)\`. You won't need one for this project, but you'll see the word.

## for: loop over every item

\`for\` hands you each item of a collection in turn. Use it instead of \`while\` whenever you already have the collection and just want to walk through it.

\`\`\`python
tasks = ["Buy milk", "Call Sam", "Write code"]

for task in tasks:     # "task" is your choice of name, holds one item per round
    print(task)
\`\`\`

## Numbering as you go

To print "1. Buy milk" you need a position as well as the item. \`enumerate\` hands you both at once, and \`start=1\` makes the count begin at 1 instead of 0 without you doing the math:

\`\`\`python
tasks = ["Buy milk", "Call Sam"]

for number, task in enumerate(tasks, start=1):
    print(f"{number}. {task}")
# 1. Buy milk
# 2. Call Sam
\`\`\`

## Empty lists

A loop over an empty list runs zero times; it's not an error, it just does nothing. An empty list also counts as false in a condition, which gives you a clean check:

\`\`\`python
tasks = []
if not tasks:        # true when the list is empty
    print("Nothing to do.")
\`\`\`

## Try it

- Build a three-item list, print it numbered from 1 with \`enumerate\`, then \`.remove()\` the middle one and print it again
- Empty the list (\`tasks = []\`) and confirm your "Nothing to do." check fires`,
    },
    {
      id: "todo-dictionaries",
      title: "Dictionaries",
      content: `By the end of this lesson you'll be able to store several facts about one thing together, under a single item.

## The problem a list can't solve

A task has two facts: its title, and whether it's done. A list of strings has room for neither of those together. A dictionary maps a key to a value, so it can hold both under one item.

\`\`\`python
task = {"title": "Buy milk", "done": False}   # curly braces, key: value pairs
print(task["title"])   # Buy milk: look up by key, not position
task["done"] = True     # assigning to an existing key changes it
task["priority"] = "high"   # assigning to a new key creates it
print(task)
\`\`\`

Ask for a key that isn't there, \`task["notes"]\`, and you get \`KeyError\`, the dictionary equivalent of a list's \`IndexError\`. \`"priority" in task\` checks safely first, and \`task.get("notes", "none")\` returns a fallback instead of crashing.

## A list of dictionaries is a table

Put dictionaries inside a list, and each dictionary is a row with the same shape.

\`\`\`python
tasks = [
    {"title": "Buy milk", "done": True},
    {"title": "Call Sam", "done": False},
]

for task in tasks:
    mark = "x" if task["done"] else " "   # a one-line if: pick "x" or a space
    print(f"[{mark}] {task['title']}")
\`\`\`

That last line is worth pausing on: \`x if task["done"] else " "\` is a full \`if\`/\`else\` squeezed onto one line because it only needs to produce a value, not run a block.

## Try it

- Build a list of 3 dictionaries shaped like \`{"title": ..., "done": ...}\`, then print each one's title with its mark, using the loop above
- Change one task's \`"done"\` to \`True\` after the list exists, without retyping the whole dictionary`,
    },
    {
      id: "todo-functions",
      title: "Functions, and organizing the code",
      content: `By the end of this lesson you'll be able to package repeated code into named, reusable pieces, and structure a whole program out of them.

## Why functions

Your program will build this same numbered display more than once. Copying the same lines around means fixing the same bug in two places later, if you remember to. A function names a chunk of code so you write it once and call it by name.

\`\`\`python
def show(tasks):                 # def starts a definition; tasks is a parameter
    if not tasks:
        print("Nothing to do.")
    for number, task in enumerate(tasks, start=1):
        mark = "x" if task["done"] else " "
        print(f"{number}. [{mark}] {task['title']}")

my_tasks = [{"title": "Buy milk", "done": False}]
show(my_tasks)   # nothing runs inside show() until it's called, here
\`\`\`

The indented lines are the function's body. Nothing in them runs when Python reads the \`def\`; only a call like \`show(my_tasks)\` actually executes it, and it can be called as many times as you like.

## Returning a value

\`print\` isn't the only way for a function to communicate. \`return\` hands a value back to whatever called it, which is what lets you use a function's result in more code:

\`\`\`python
def count_done(tasks):
    total = 0
    for task in tasks:
        if task["done"]:
            total += 1
    return total   # hands the number back; doesn't print anything itself

my_tasks = [{"title": "Buy milk", "done": True}, {"title": "Call Sam", "done": False}]
print(f"{count_done(my_tasks)} of {len(my_tasks)} done")   # 1 of 2 done
\`\`\`

A function with no \`return\` hands back \`None\`, Python's way of saying "nothing here."

## One job per function, and a main loop to tie them together

Give each function one job, named for it: \`add\`, \`show\`, \`complete\`. When something breaks, the name tells you where to look. Put the menu itself in a function called \`main\`, which reads a command and calls the right helper:

\`\`\`python
def add(tasks, title):
    tasks.append({"title": title, "done": False})

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

main()   # this line is what actually starts the program
\`\`\`

Python must see a function's \`def\` before you call it, so define your helpers above \`main\`, and keep the \`main()\` call itself as the very last line of the file.

## Try it

- Add a \`complete(tasks, number)\` function that sets \`tasks[number - 1]["done"] = True\`. Remember the player counts from 1, the list counts from 0
- Wire a \`done\` command into the menu that calls it`,
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
    tasks[number - 1]["done"] = True   # player says 1, list index is 0


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
            print("Unknown command.")   # keeps the menu alive on a typo


main()
\`\`\`

## Done when

- \`add\` asks for a task and stores it
- \`list\` shows tasks numbered from 1, with \`[x]\` for done and \`[ ]\` for not done
- \`done\` marks the task with that number as complete
- An empty list prints "Nothing to do."
- An unknown command prints "Unknown command." and the menu keeps running
- \`quit\` ends the program
- You can say, without checking, why \`complete\` subtracts 1 from the number the player typed

## Known problem

Ask for \`done\` with a number that doesn't exist, and the program crashes with \`IndexError\`. Project 3 shows how to catch that instead of letting it kill the program.

## Stretch goals

- Add a \`delete\` command using \`tasks.pop(number - 1)\`
- Show "2 of 5 done" after \`list\`, using a function like \`count_done\` from this lesson
- Store a due date alongside each task's title and done flag`,
    },
  ],
};
