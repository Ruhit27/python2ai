import type { CourseModule } from "@/data/courses";
import SampleRun from "@/components/SampleRun";

export const wordCounterModule: CourseModule = {
  title: "Project 3: Word Counter",
  lessons: [
    {
      id: "words-meet-the-project",
      title: "Meet the project",
      content: `By the end of this module you'll have built a tool that reads any text file and reports which words it uses most.

## What you'll build

You give it a filename. It counts the words, finds the five most common, prints a summary, and saves that summary to a file called \`report.txt\`. If the file doesn't exist, it says so instead of crashing. The sample run shows the finished tool.

## Set up a test file

Create a file called \`sample.txt\` next to your program with a few sentences in it. To get the same numbers as the sample run, use exactly this line: \`Hello, world! Hello again. The world is big, the world is round.\` Any other text works too, with different counts.

## The rough version

\`\`\`python
filename = input("File to analyze: ")
text = open(filename).read()
words = text.split()
print(len(words), "words")
\`\`\`

## What's wrong with it

- "Hello," and "hello" count as different words
- It only reports a total, not which words are common
- It never saves anything
- A mistyped filename crashes it, and it never closes the file

This module covers strings, reading and writing files, and error handling.`,
      extra: (
        <SampleRun
          steps={[
            ["cmd", "python3 words.py"],
            ["out", "File to analyze: sample.txt"],
            ["ok", "12 words, 7 different."],
            ["ok", "world: 3"],
            ["ok", "hello: 2"],
            ["ok", "the: 2"],
            ["ok", "is: 2"],
            ["ok", "again: 1"],
          ]}
        />
      ),
    },
    {
      id: "words-string-methods",
      title: "Working with strings",
      content: `By the end of this lesson you'll be able to clean up text so that "Hello," and "hello" become the same word.

## Strings have methods

A method is a function attached to a value, called with a dot. Strings come with dozens. None of them change the original string. They return a new one, so you need to keep the result.

\`\`\`python
text = "  Hello, World!  "
clean = text.strip().lower()
print(clean)
\`\`\`

## Methods you'll use

- \`.lower()\` and \`.upper()\` change the case
- \`.strip()\` removes whitespace from both ends. Given characters, like \`.strip(".,")\`, it removes those instead
- \`.split()\` cuts a string into a list of words on whitespace
- \`.replace("a", "b")\` swaps text
- \`"-".join(["a", "b"])\` glues a list into one string

## Removing punctuation

The \`string\` module has a ready-made list of punctuation characters:

\`\`\`python
import string

word = "Hello,".lower().strip(string.punctuation)
print(word)
\`\`\`

## Counting with a dictionary

To count how often each word appears, use a dictionary from word to count. \`counts.get(word, 0)\` returns the current count, or 0 for a new word:

\`\`\`python
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
\`\`\`

## Try it

Split "the cat and the hat" into words and count them. \`"the"\` should come out as 2.`,
    },
    {
      id: "words-reading-files",
      title: "Reading files",
      content: `By the end of this lesson you'll be able to load the contents of a text file into your program.

## Opening a file

Use \`open\` inside a \`with\` block. The block closes the file for you when it ends, even if something goes wrong halfway through.

\`\`\`python
with open("sample.txt", encoding="utf-8") as file:
    text = file.read()
\`\`\`

\`encoding="utf-8"\` tells Python how to turn the file's bytes into characters. Include it, or non-English text can come out garbled on some systems.

## Where does the file live?

A plain filename like \`sample.txt\` is looked up in the folder you ran the command from, not the folder your script sits in. That's why we open the terminal in the project folder.

## Other ways to read

- \`file.read()\` gives the whole file as one string
- \`file.readlines()\` gives a list with one string per line
- \`for line in file:\` walks through the lines one at a time, which suits large files

## Try it

Read \`sample.txt\`, then print how many characters, words, and lines it has. Lines are \`text.splitlines()\`.`,
    },
    {
      id: "words-writing-files",
      title: "Writing files",
      content: `By the end of this lesson you'll be able to save your program's results to a file.

## Write mode

Pass \`"w"\` as the second argument to \`open\` to write. If the file doesn't exist, Python creates it. If it does exist, Python empties it first.

\`\`\`python
with open("report.txt", "w", encoding="utf-8") as file:
    file.write("12 words\\n")
    file.write("7 different\\n")
\`\`\`

\`write\` doesn't add a line break for you. \`\\n\` is the character for one, so include it where you want a new line.

## Other modes

- \`"r"\` reads. It's the default, and it fails if the file is missing
- \`"w"\` writes, erasing what was there
- \`"a"\` appends to the end and keeps what was there

## Building a report

Collect the report lines in a list, join them with a line break, and write once:

\`\`\`python
lines = [f"{len(words)} words", f"{len(counts)} different"]
report = "\\n".join(lines)
with open("report.txt", "w", encoding="utf-8") as file:
    file.write(report + "\\n")
\`\`\`

## Try it

Write three lines of your choice to \`notes.txt\`, run the program twice, and confirm the file has three lines, not six. Then switch to \`"a"\` and run it twice again.`,
    },
    {
      id: "words-handling-errors",
      title: "Handling errors",
      content: `By the end of this lesson you'll be able to make your program respond politely to problems instead of crashing.

## Errors are normal

Files go missing, and players type nonsense. Python signals the problem by raising an exception, and if nothing handles it, the program stops with a traceback. Read a traceback from the bottom: the last line names the error, and the lines above show where.

## try and except

Put the risky code in \`try\`. If it raises the error you named, Python jumps to \`except\` instead of crashing.

\`\`\`python
try:
    with open(filename, encoding="utf-8") as file:
        text = file.read()
except FileNotFoundError:
    print(f"Can't find {filename}.")
\`\`\`

## Be specific

Name the error you expect. A bare \`except:\` catches everything, including your own typos, and hides bugs you'd want to see.

## else

An \`else\` block after \`except\` runs only when nothing went wrong. It's the right place for the code that depends on the risky part having worked:

\`\`\`python
try:
    number = int(input("Number: "))
except ValueError:
    print("That's not a number.")
else:
    print(number * 2)
\`\`\`

## Errors you've already met

- \`ValueError\`: \`int("abc")\`
- \`IndexError\`: an index that's past the end of a list
- \`KeyError\`: a dictionary key that isn't there
- \`FileNotFoundError\`: a file that isn't there

## Try it

Go back to your Guess the Number game and wrap the \`int(input(...))\` in a \`try\` so that typing "abc" prints a message and asks again.`,
    },
    {
      id: "words-finish-the-project",
      title: "Finish the project",
      content: `By the end of this lesson you'll have a working word counter and a checklist to prove it.

## The finished program

\`\`\`python
import string

filename = input("File to analyze: ")

try:
    with open(filename, encoding="utf-8") as file:
        text = file.read()
except FileNotFoundError:
    print(f"Can't find {filename}.")
else:
    words = text.lower().split()
    counts = {}
    for word in words:
        word = word.strip(string.punctuation)
        if word:
            counts[word] = counts.get(word, 0) + 1

    top = sorted(counts, key=counts.get, reverse=True)[:5]

    lines = [f"{len(words)} words, {len(counts)} different."]
    for word in top:
        lines.append(f"{word}: {counts[word]}")
    report = "\\n".join(lines)

    print(report)
    with open("report.txt", "w", encoding="utf-8") as out:
        out.write(report + "\\n")
\`\`\`

Two lines are new. \`sorted(counts, key=counts.get, reverse=True)\` orders the words by their counts, highest first. \`[:5]\` keeps only the first five.

## Done when

- Running it on \`sample.txt\` prints the total, the number of different words, and the five most common
- "Hello," and "hello" count as the same word
- A mistyped filename prints "Can't find ..." and exits without a traceback
- \`report.txt\` appears with the same text you saw on screen
- Running it twice leaves one copy of the report, not two

## Stretch goals

- Ignore very common words like "the" and "is"
- Ask how many top words to show
- Handle an empty file`,
    },
  ],
};
