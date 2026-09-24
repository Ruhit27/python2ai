import type { CourseModule } from "@/data/courses";
import SampleRun from "@/components/SampleRun";

export const setupModule: CourseModule = {
  title: "Get set up",
  lessons: [
    {
      id: "how-this-course-works",
      title: "How this course works",
      content: `By the end of this lesson you'll know what you'll build, how each module is laid out, and how long it should take.

## You learn by building

You'll build four small programs and one larger one. Each project runs in your terminal (the text window where you type commands), and each one is something you could show a friend.

- **Guess the Number**: a game that hints higher or lower
- **To-Do List**: a menu-driven task manager
- **Word Counter**: a tool that analyzes any text file
- **Weather Now**: a program that fetches live weather from the internet
- **Habit Tracker**: the capstone, which saves your progress and cheers you on

## How a module works

Every module opens by showing you the finished program running, and a rough version that only half works. Then the lessons teach exactly the ideas you need to fix it, one at a time. At the end, a "Done when" checklist tells you whether your program is finished.

## What you'll need

About ten hours in total, spread over as many days as you like. You'll run every program on your own computer, so the next two lessons get Python installed. If Python is already set up, skip ahead to Module 1.

\`\`\`note
Type the code yourself instead of pasting it. It feels slower, but it's how the syntax settles into your hands.
\`\`\``,
    },
    {
      id: "install-python",
      title: "Install Python",
      content: `By the end of this lesson you'll have Python installed and confirmed working.

## Windows

Download the installer from python.org and run it. On the first screen, tick "Add python.exe to PATH" before you click Install. That box lets your terminal find Python.

## macOS and Linux

Your computer may already have Python 3. Check first, and only install if the version is missing or below 3.10. On macOS, the installer from python.org works. Linux users can install it with their package manager.

## Check it worked

Open a terminal and run this. On Windows, use \`python\` instead of \`python3\`.

\`\`\`bash
python3 --version
\`\`\`

If it prints a version like 3.12 or higher, you're set. If it says "command not found", close the terminal, open a new one, and try again.`,
      extra: (
        <SampleRun
          steps={[
            ["cmd", "python3 --version"],
            ["ok", "Python 3.12.3"],
          ]}
        />
      ),
    },
    {
      id: "editor-and-first-script",
      title: "An editor and your first script",
      content: `By the end of this lesson you'll have written and run a Python file.

## Pick an editor

Visual Studio Code is free and the most common choice. Install it, then add the official Python extension from the Extensions tab. It underlines likely mistakes as you type. Any editor works, but this course assumes VS Code.

## Make a project folder

Create a folder called \`python-projects\` somewhere you'll find it again. Open that folder in VS Code, then open its built-in terminal from the Terminal menu. Every command in this course runs from inside this folder.

## Write and run a script

Create a new file called \`hello.py\` and type this into it:

\`\`\`python
print("Hello, world!")
\`\`\`

Save it, then run it from the terminal. On Windows, type \`python\` wherever this course says \`python3\`:

\`\`\`bash
python3 hello.py
\`\`\`

Python reads the file from top to bottom and does what each line says. Here, it prints the text between the quotes.

## Try it

- Change the message and run the file again
- Add a second \`print\` line and see what order the output appears in`,
      extra: (
        <SampleRun
          steps={[
            ["cmd", "python3 hello.py"],
            ["ok", "Hello, world!"],
          ]}
        />
      ),
    },
  ],
};
