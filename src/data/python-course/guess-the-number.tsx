import type { CourseModule } from "@/data/courses";
import SampleRun from "@/components/SampleRun";

export const guessTheNumberModule: CourseModule = {
  title: "Project 1: Guess the Number",
  lessons: [
    {
      id: "guess-meet-the-project",
      title: "Meet the project",
      content: `By the end of this module you'll have built a game where the computer picks a secret number and you hunt it down.

## What you'll build

The computer picks a number from 1 to 100. You guess, and it tells you "Too low" or "Too high" until you get it. Then it tells you how many tries it took. The sample run below shows the finished game.

## The rough version

Here is a first attempt. It runs, but it's missing almost everything.

\`\`\`python
secret = 42
guess = int(input("Your guess: "))
if guess == secret:
    print("Got it!")
else:
    print("Nope.")
\`\`\`

Save it as \`guess.py\` and run it. Try a few guesses.

## What's wrong with it

- The secret is always 42, so the game is the same every time
- You get exactly one guess
- "Nope" doesn't tell you which direction to go
- It doesn't count your tries

Each lesson in this module fixes one of these. You'll also learn the ideas behind each fix: variables, input, decisions, and loops.`,
      extra: (
        <SampleRun
          steps={[
            ["cmd", "python3 guess.py"],
            ["out", "I'm thinking of a number between 1 and 100."],
            ["out", "Your guess: 50"],
            ["out", "Too high."],
            ["out", "Your guess: 25"],
            ["out", "Too low."],
            ["out", "Your guess: 37"],
            ["ok", "Got it in 3 attempts!"],
          ]}
        />
      ),
    },
    {
      id: "guess-variables-and-types",
      title: "Variables and types",
      content: `By the end of this lesson you'll be able to store a value under a name and know what kind of value it is.

## Variables

A variable is a name that points to a value. You create one with \`=\`, which means "store this", not "is equal to".

\`\`\`python
secret = 42
attempts = 0
name = "Ada"
\`\`\`

You can change what a name points to at any time, and you can use the name anywhere you'd use the value.

## Comments

A line starting with \`#\` is a comment. Python ignores it, so use it to leave notes for yourself: \`# how many guesses so far\`.

## Types

Every value has a type, which decides what you can do with it. The three you need now:

- \`int\`: whole numbers, like \`42\`
- \`str\`: text in quotes, like \`"Ada"\`
- \`bool\`: \`True\` or \`False\`

Numbers with decimals are \`float\`, like \`9.99\`. Ask Python for a value's type with \`type(secret)\`.

## Types don't mix freely

\`"5" + 5\` is an error, because Python won't guess whether you meant text or a number. Convert first: \`int("5") + 5\` gives \`10\`, and \`str(5)\` gives \`"5"\`. This matters in the next lesson.

## Try it

- Make a variable \`attempts\` set to 0, then set it to \`attempts + 1\` and print it
- Print \`type("42")\` and \`type(42)\` and compare`,
    },
    {
      id: "guess-input-and-output",
      title: "Input and output",
      content: `By the end of this lesson you'll be able to ask the player a question and show a message that includes their answer.

## Showing text

\`print()\` writes a line to the terminal. You've used it already. Put a variable in the parentheses to show its value.

## Asking a question

\`input()\` shows a prompt, waits for the player to type and press Enter, then hands back what they typed.

\`\`\`python
name = input("What's your name? ")
print("Hello,", name)
\`\`\`

## The catch: input is always text

Whatever the player types comes back as a \`str\`, even digits. If you want to compare a guess to a number, convert it with \`int()\`:

\`\`\`python
guess = int(input("Your guess: "))
\`\`\`

Without the \`int()\`, \`"50" == 50\` is \`False\`, and your game could never be won.

## Building messages

An f-string puts values inside text. Start the string with \`f\` and wrap a variable in braces:

\`\`\`python
attempts = 3
print(f"Got it in {attempts} attempts!")
\`\`\`

\`\`\`note
If you type letters where a number is expected, \`int()\` crashes the program. That's fine for now. You'll handle it properly in Project 3.
\`\`\``,
    },
    {
      id: "guess-making-decisions",
      title: "Making decisions",
      content: `By the end of this lesson you'll be able to make your program respond differently depending on the player's guess.

## if, elif, else

An \`if\` runs its block only when a condition is true. \`elif\` ("else if") checks another condition, and \`else\` catches everything that's left.

\`\`\`python
if guess < secret:
    print("Too low.")
elif guess > secret:
    print("Too high.")
else:
    print("Got it!")
\`\`\`

Python checks the conditions from the top and runs the first one that's true, then skips the rest.

## Indentation matters

The lines under each \`if\` are indented by four spaces. That indentation is how Python knows which lines belong to which block. Mixing indentation levels is a syntax error, so let your editor's Tab key do the work.

## Comparing values

- \`==\` equal (two equals signs, because one is for storing)
- \`!=\` not equal
- \`<\`, \`>\`, \`<=\`, \`>=\` less, greater, and the "or equal" versions

## Try it

Replace the "Nope." branch in your rough version with the three-way check above. Run it three times: guess too low, too high, and right.`,
    },
    {
      id: "guess-repeating-with-while",
      title: "Repeating with while",
      content: `By the end of this lesson you'll be able to give the player as many guesses as they need, and count them.

## The while loop

A \`while\` loop repeats its block for as long as its condition is true.

\`\`\`python
count = 0
while count < 3:
    print(count)
    count = count + 1
\`\`\`

This prints 0, 1, 2 and stops. If the condition never becomes false, the loop runs forever. Press Ctrl+C in the terminal to stop it.

## Loop until something happens

For a game, you don't know how many rounds it'll take. Use \`while True\` to loop indefinitely, and \`break\` to leave the loop when the player wins:

\`\`\`python
while True:
    guess = int(input("Your guess: "))
    if guess == secret:
        print("Got it!")
        break
\`\`\`

## Counting

Add to a counter each time round the loop. \`attempts += 1\` is a shorter way to write \`attempts = attempts + 1\`. Set \`attempts = 0\` before the loop starts, so it isn't reset every time round.

## Try it

Wrap your guess-and-check code in a \`while True\` loop, add \`break\` to the winning branch, and print the attempts at the end.`,
    },
    {
      id: "guess-using-random",
      title: "Using random",
      content: `By the end of this lesson you'll be able to make your game pick a different secret number every time.

## Using code that's already written

Python comes with a library of ready-made tools, grouped into modules. To use one, \`import\` it at the top of your file. The \`random\` module is for anything unpredictable.

\`\`\`python
import random

secret = random.randint(1, 100)
\`\`\`

\`random.randint(1, 100)\` picks a whole number between 1 and 100, and both ends are included. The dot means "the \`randint\` tool inside \`random\`".

## Checking it works

Print the secret while you're testing, so you can confirm your hints are right:

\`\`\`python
print(secret)
\`\`\`

Delete that line when you're done, or you've spoiled your own game.

## Try it

- Run \`random.randint(1, 6)\` in a loop and print 5 results, like rolling a die
- Change your game's range to 1 to 10 and see how much easier it gets

Module 4 covers importing in more depth, including tools that don't come with Python.`,
    },
    {
      id: "guess-finish-the-project",
      title: "Finish the project",
      content: `By the end of this lesson you'll have a complete Guess the Number game and know it works.

## The finished program

Put everything together. Read it top to bottom and check that you understand each line:

\`\`\`python
import random

secret = random.randint(1, 100)
attempts = 0

print("I'm thinking of a number between 1 and 100.")

while True:
    guess = int(input("Your guess: "))
    attempts += 1

    if guess < secret:
        print("Too low.")
    elif guess > secret:
        print("Too high.")
    else:
        print(f"Got it in {attempts} attempts!")
        break
\`\`\`

Yours doesn't have to match exactly. It has to do the same things.

## Done when

- The game prints a welcome message, then asks for a guess
- A guess below the secret prints "Too low.", and one above prints "Too high."
- Guessing correctly ends the game and prints the number of attempts
- Running it twice uses a different secret each time
- You can explain what \`input()\`, \`if\`, \`while\`, and \`import\` each do

## Stretch goals

- Tell the player when they've guessed the same number twice
- Add a limit of 7 guesses and reveal the secret if they run out
- Ask "Play again?" when a game ends`,
    },
  ],
};
