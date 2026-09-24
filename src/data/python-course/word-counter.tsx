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

You give it a filename. It counts the words, finds the five most common, prints a summary, and saves that summary to \`report.txt\`. If the file doesn't exist, it says so instead of crashing. The sample run shows the finished tool.

## Set up a test file

Create \`sample.txt\` next to your program. To get the exact numbers in the sample run, use this line: \`Hello, world! Hello again. The world is big, the world is round.\` Any other text works too, with different counts.

## The rough version

\`\`\`python
filename = input("File to analyze: ")
text = open(filename).read()   # never closed, and crashes if the file is missing
words = text.split()
print(len(words), "words")
\`\`\`

## What's wrong with it

- "Hello," and "hello" count as different words
- It only reports a total, not which words are common
- It never saves anything
- A mistyped filename crashes it with a raw traceback, and the file is never explicitly closed

This module covers strings, files, and error handling: the three things almost every real program does with data that comes from outside itself.`,
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
      id: "words-strings",
      title: "Working with strings",
      content: `By the end of this lesson you'll be able to clean up messy text so "Hello," and "hello" count as the same word, and count how often each one shows up.

## Strings have methods too

Like lists, strings come with built-in methods, called with a dot. Unlike list methods such as \`.append()\`, string methods never change the original string: they hand back a new one, so you have to keep the result.

\`\`\`python
text = "Hello, world! Hello again."   # the start of sample.txt
clean = text.strip().lower()   # each method runs on the result of the one before it
print(text)    # unchanged: "Hello, world! Hello again."
print(clean)   # "hello, world! hello again."
\`\`\`

Chaining \`.strip().lower()\` like that reads right to left in effect but left to right on the page: strip the whitespace first, then lowercase what's left. This is the start of the fix for "'Hello,' and 'hello' count as different words" in \`words.py\`: lowercase both, and they match.

## Methods you'll use here

\`\`\`python
text = "  Hello, world!  "

print(text.lower())               # "  hello, world!  "
print(text.strip())               # "Hello, world!": outer whitespace only
print(text.strip().split())       # ['Hello,', 'world!']: cuts on whitespace, this is where "words" comes from
print("-".join(["a", "b", "c"]))  # "a-b-c": the reverse of split
print(text.replace("l", "L"))     # "  HeLLo, worLd!  "
\`\`\`

## Stripping punctuation specifically

\`.strip()\` with no arguments removes whitespace. Give it characters instead, and it strips those from both ends:

\`\`\`python
import string

print(string.punctuation)              # !"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~
word = "Hello,".lower().strip(string.punctuation)
print(word)   # "hello": comma's gone, "hello" itself is untouched
\`\`\`

\`string.punctuation\` is just a string someone already typed out for you, sitting inside the \`string\` module, so you don't have to. This \`.strip(string.punctuation)\` call is the rest of the fix for "'Hello,' and 'hello' count as different words" in \`words.py\`: the comma comes off too, not just the case.

## Counting with a dictionary

Project 2 used a dictionary to hold facts about one task. Here, the keys are words and the values are counts, which is one of the most common dictionary shapes you'll write.

\`\`\`python
words = ["hello", "world", "hello", "again"]   # already lowercased and split
counts = {}

for word in words:
    # .get(word, 0) returns the count so far, or 0 the first time we see it:
    # without this, brand new words would crash with KeyError
    counts[word] = counts.get(word, 0) + 1

print(counts)   # {'hello': 2, 'world': 1, 'again': 1}
\`\`\`

This loop, on \`words\` and \`counts\`, is the fix for "it only reports a total, not which words are common" in \`words.py\`.

## Try it

- Run \`"the cat and the hat".split()\` and predict the list before you check
- Clean \`"WOW!!"\` down to \`"wow"\` using \`.lower()\` and \`.strip(string.punctuation)\`
- Count the words in \`["a", "b", "a", "a", "c"]\` by hand, then confirm with the loop above`,
    },
    {
      id: "words-files",
      title: "Reading and writing files",
      content: `By the end of this lesson you'll be able to load a file's contents in, and save your program's results back out.

## Opening a file safely

Open a file inside a \`with\` block. It closes the file for you automatically when the block ends, even if an error happens partway through, which is easy to forget if you open it by hand.

\`\`\`python
with open("sample.txt", encoding="utf-8") as file:
    text = file.read()
# the file is already closed here, even though the code never said so
\`\`\`

\`encoding="utf-8"\` tells Python how to turn the file's raw bytes into characters. Leave it out and text with accents or emoji can come out garbled on some systems. Just always include it. This \`with\` block is the fix for "the file is never explicitly closed" in \`words.py\`.

## A plain filename is relative to where you ran the command

\`open("sample.txt")\` looks in the folder you launched \`python3\` from, not the folder the \`.py\` file lives in. That's why we open the terminal inside the project folder before running anything.

## Three ways to read

\`\`\`python
with open("sample.txt", encoding="utf-8") as file:
    text = file.read()          # everything, as one string

with open("sample.txt", encoding="utf-8") as file:
    lines = file.readlines()    # a list, one string per line, newlines kept

with open("sample.txt", encoding="utf-8") as file:
    for line in file:           # walks the file one line at a time
        print(line.strip())     # strip() here just drops the trailing newline
\`\`\`

\`for line in file\` is the one to reach for on a huge file, since it never loads the whole thing into memory at once. For this project's files, \`.read()\` is simplest and fine.

## Writing a file

Pass \`"w"\` as a second argument to write instead of read. Python creates the file if it's missing, and empties it first if it already exists, every single time you open it in \`"w"\` mode.

\`\`\`python
with open("report.txt", "w", encoding="utf-8") as file:
    file.write("12 words\\n")     # write() adds no newline of its own: \\n is you asking for one
    file.write("7 different\\n")
\`\`\`

This is the start of the fix for "it never saves anything" in \`words.py\`: writing to \`report.txt\`, not just printing to the screen. \`"a"\` (append) is the other common mode: it adds to the end and keeps what was already there, instead of erasing it.

## Building a report in one write

Collect the lines you want in a list, glue them together with \`"\\n".join(...)\`, and write once. It's easier to get right than juggling several \`.write()\` calls:

\`\`\`python
lines = ["12 words, 7 different.", "world: 3", "hello: 2"]
report = "\\n".join(lines)

print(report)
with open("report.txt", "w", encoding="utf-8") as file:
    file.write(report + "\\n")   # +1 for the final newline join() doesn't add
\`\`\`

## Try it

- Write three lines to \`notes.txt\` using \`"w"\` mode, run the file twice, and confirm it still has three lines, not six
- Switch to \`"a"\` mode and run it twice: now confirm it does grow`,
    },
    {
      id: "words-errors",
      title: "Handling errors",
      content: `By the end of this lesson you'll be able to make your program respond to a problem instead of crashing with a wall of red text.

## Errors are normal, not a sign you did something wrong

Files go missing. Players type nonsense. Python signals a problem by raising an exception, and if nothing catches it, the program stops and prints a traceback. Read a traceback from the bottom up: the last line names the error, the lines above trace where it happened.

## try / except

Put the risky line inside \`try\`. If it raises the exact error named after \`except\`, Python jumps there instead of crashing the program.

\`\`\`python
filename = input("File to analyze: ")

try:
    with open(filename, encoding="utf-8") as file:
        text = file.read()
except FileNotFoundError:
    print(f"Can't find {filename}.")   # this runs; the program keeps going
\`\`\`

This is the fix for "a mistyped filename crashes it with a raw traceback" in \`words.py\`.

## Name the error you expect

A bare \`except:\` with nothing after it catches everything, including bugs in your own code and typos in variable names, and hides them the same way it hides a missing file. Name the specific error so real bugs still surface as crashes you can actually see and fix.

## else: the part that only runs if nothing went wrong

\`\`\`python
try:
    number = int(input("Number: "))
except ValueError:
    print("That's not a number.")
else:
    # only reached if the try block didn't raise: number is guaranteed to exist here
    print(number * 2)
\`\`\`

Putting the success path in \`else\` rather than after the \`try\` block keeps it separate from the risky part, so you don't accidentally catch an error the success code itself raises.

## Errors you've already caused, on purpose, while testing

\`\`\`python
# int("abc")            -> ValueError
# [1, 2][5]              -> IndexError
# {"a": 1}["b"]           -> KeyError
# open("nope.txt")        -> FileNotFoundError
\`\`\`

Recognizing the name of an error is most of the work of fixing it; Python is telling you exactly what went wrong, in the last line of the traceback.

## Try it

- Go back to Guess the Number and wrap \`int(input(...))\` in \`try\`/\`except ValueError\` so typing letters prints a message and asks again instead of crashing
- Trigger a \`KeyError\` on purpose with a dictionary you make up, and read the traceback it produces before catching it`,
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
        if word:   # skip anything that was pure punctuation, like a lone "-"
            counts[word] = counts.get(word, 0) + 1

    # sort words by their count, highest first, and keep only the top 5
    top = sorted(counts, key=counts.get, reverse=True)[:5]

    lines = [f"{len(words)} words, {len(counts)} different."]
    for word in top:
        lines.append(f"{word}: {counts[word]}")
    report = "\\n".join(lines)

    print(report)
    with open("report.txt", "w", encoding="utf-8") as out:
        out.write(report + "\\n")
\`\`\`

Two pieces are new here. \`sorted(counts, key=counts.get, reverse=True)\` sorts the dictionary's keys by looking up each one's count; \`[:5]\` then keeps only the first five of that sorted list.

## Done when

- Running it on \`sample.txt\` prints the total, the number of different words, and the five most common
- "Hello," and "hello" count as the same word
- A mistyped filename prints "Can't find ..." with no traceback
- \`report.txt\` appears with the same text you saw printed
- Running it twice leaves one copy of the report, not two, because \`"w"\` mode overwrites
- You can explain why the loop skips a word when \`word\` is empty after stripping punctuation

## Stretch goals

- Ignore very common words like "the" and "is" by skipping them in the loop
- Ask how many top words to show instead of hardcoding 5
- Handle a completely empty file (0 words) without dividing by zero anywhere you add later`,
    },
  ],
};
