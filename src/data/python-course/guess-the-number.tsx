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
secret = 42  # not random yet, always the same number
guess = int(input("Your guess: "))  # turn what was typed into a whole number

if guess == secret:
    print("Got it!")
else:
    print("Nope.")  # doesn't say which direction to go
\`\`\`

Save it as \`guess.py\` and run it. Try a few guesses.

## What's wrong with it

- The secret is always 42, so the game is the same every time
- You get exactly one guess
- "Nope" doesn't tell you which direction to go
- It doesn't count your tries

Each lesson in this module fixes one of these, and goes a bit further than the fix itself: not just how, but why Python behaves this way.`,
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
      id: "guess-variables-types-and-io",
      title: "Variables, types, and talking to the player",
      content: `By the end of this lesson you'll be able to store values, know what kind of value each one is, and get input from the player.

## Variables

A variable is a name that points to a value. \`=\` means "store this", not "is equal to": that trips up almost everyone once.

\`\`\`python
secret = 42       # int: a whole number
attempts = 0      # int: starts at zero, we'll count up
name = "Ada"      # str: text, in quotes
\`\`\`

You can point a name at a new value at any time. The old value isn't remembered anywhere; Python just forgets it existed.

\`\`\`python
score = 10
print(score)   # 10
score = 20     # not "score equals 20", but "point score at 20 instead"
print(score)   # 20
\`\`\`

## Types

Every value has a type, which decides what you can do with it.

- \`int\`: whole numbers, like \`42\`
- \`float\`: numbers with a decimal point, like \`9.99\`
- \`str\`: text, wrapped in quotes, like \`"Ada"\`
- \`bool\`: exactly \`True\` or \`False\`, capital letters and no quotes

\`\`\`python
# type() tells you what you're actually holding, which matters once
# variables start getting passed around and you lose track
oven_temp = 350
pizza_name = "Margherita"
is_ready = False

print(type(oven_temp))    # <class 'int'>
print(type(pizza_name))   # <class 'str'>
print(type(is_ready))     # <class 'bool'>
\`\`\`

Python is dynamically typed: nothing stops you from pointing \`oven_temp\` at \`"too hot"\` next. That's convenient, but it means you're the one keeping track of what a variable holds, not the language.

## Types don't mix on their own

\`\`\`python
age = "5" + 5
\`\`\`

This crashes with \`TypeError: can only concatenate str (not "int") to str\`. Python won't guess whether you meant to glue text together or add numbers, so it refuses both. Convert explicitly instead:

\`\`\`python
print(int("5") + 5)    # 10, both are numbers now
print("5" + str(5))    # "55", both are text now
\`\`\`

## Printing and asking questions

\`print()\` writes to the terminal. \`input()\` shows a prompt, waits for the player to type and hit Enter, and hands back whatever they typed.

\`\`\`python
name = input("What's your name? ")   # waits here until Enter is pressed
print("Hello,", name)                 # print takes several values, comma-separated
\`\`\`

## input() always gives you text

This is the one that catches people building their first guessing game: \`input()\` returns a \`str\`, always, even if the player typed only digits.

\`\`\`python
guess = input("Your guess: ")
print(guess == 50)       # False, even if you typed 50: "50" is not 50
print(int(guess) == 50)  # True, now they're both int
\`\`\`

Convert it the moment you read it, before you compare it to anything:

\`\`\`python
guess = int(input("Your guess: "))
\`\`\`

Type a letter instead of a number here and the program crashes. That's expected for now; you'll handle it properly with \`try\`/\`except\` in Project 3.

## Building messages with f-strings

Start a string with \`f\` and wrap a variable in braces to drop its value into the text:

\`\`\`python
attempts = 3
print(f"Got it in {attempts} attempts!")   # Got it in 3 attempts!
print(f"That's {attempts * 2} if you count the ones you take back")
\`\`\`

Anything inside the braces is a real expression, not just a variable name, so \`{attempts * 2}\` works exactly like it looks.

## Try it

- Make three variables of different types, print each one with \`type()\`
- Ask the player's name with \`input()\` and greet them with an f-string
- Predict what \`"3" * 3\` prints before you run it, then check`,
    },
    {
      id: "guess-decisions-and-loops",
      title: "Decisions and loops",
      content: `By the end of this lesson you'll be able to make your program branch on a guess and repeat until the player wins.

## if, elif, else

\`if\` runs its block only when a condition is true. \`elif\` ("else if") checks another condition if the first was false. \`else\` catches whatever's left. Python checks top to bottom and runs the first branch that matches, then skips the rest, even if a later condition would also be true.

\`\`\`python
guess = 60
secret = 42

if guess < secret:
    print("Too low.")
elif guess > secret:
    print("Too high.")
else:
    print("Got it!")
# prints "Too high.": elif and else never even get evaluated once a branch matches
\`\`\`

## Indentation is the block

The lines under \`if\` are indented four spaces. That indentation, not braces or a keyword, is how Python knows which lines belong to which branch. Mix tabs and spaces, or indent inconsistently, and you get a syntax error before the program even runs. Let your editor's Tab key do this for you.

## Comparisons and combining conditions

\`\`\`python
# ==  equal            !=  not equal
# <   less than        >   greater than
# <=  less or equal    >=  greater or equal

age = 20
has_ticket = True

# and: both sides must be true. or: at least one side. not: flips it.
if age >= 18 and has_ticket:
    print("Come on in.")
if age < 13 or not has_ticket:
    print("Not tonight.")
\`\`\`

## while: repeat on a condition

\`while\` keeps running its block as long as the condition is true, checked fresh each time round.

\`\`\`python
count = 0
while count < 3:      # checked before every round, including the first
    print(count)       # 0, 1, 2
    count = count + 1   # forget this line and the loop never ends
\`\`\`

If the condition never turns false, the loop runs until you kill it with Ctrl+C in the terminal. That's usually a bug, not a feature.

## while True, and breaking out

A guessing game doesn't know in advance how many rounds it'll take, so loop forever and \`break\` out the moment the player wins:

\`\`\`python
attempts = 0
while True:   # loop forever, or at least until break fires: like a gym membership nobody cancels
    guess = int(input("Your guess: "))
    attempts += 1   # shorthand for attempts = attempts + 1

    if guess == 42:
        print(f"Got it in {attempts} attempts!")
        break   # only line in this whole file that can end the loop
    print("Not quite.")
\`\`\`

\`break\` exits the loop immediately, skipping anything else in its body. Nothing after \`while True:\` runs again until it fires.

## Try it

- Write a loop that prints "still going" five times using \`while\`, then change it to run forever and add a \`break\` when a counter hits 5
- Combine \`if\`/\`elif\`/\`else\` with a loop: ask for a number 1 to 3 repeatedly, and \`break\` only when it's valid`,
    },
    {
      id: "guess-standard-library",
      title: "Using the standard library",
      content: `By the end of this lesson you'll be able to pull in ready-made tools instead of writing everything yourself, and use one to make your game unpredictable.

## import

Python ships with a library of modules: bundles of tools grouped by job. \`import\` at the top of a file makes one available. The dot after the module name means "the thing inside it called this."

\`\`\`python
import random

secret = random.randint(1, 100)   # random.randint: a tool that lives inside random
\`\`\`

## random: for anything unpredictable

\`\`\`python
import random

# randint(a, b) picks a whole number, both ends included
dice_roll = random.randint(1, 6)
print(dice_roll)   # anywhere from 1 to 6, different every run

# choice() picks one item out of a list: more on lists in Project 2
prize = random.choice(["socks", "a gift card", "nothing, sorry"])
print(prize)
\`\`\`

While you're building and testing, it helps to print the secret so you can check your own hints are right. Delete that line before you call the game finished, or you've spoiled it for yourself.

## A couple more modules worth knowing about

You won't need these for this project, but they're the kind of thing that saves you writing code by hand later.

\`\`\`python
import math

print(math.sqrt(16))     # 4.0: square root
print(math.pi)            # 3.141592653589793: a constant, not a function, no parentheses

import datetime

print(datetime.date.today())   # today's date, e.g. 2026-09-24
\`\`\`

\`math.pi\` has no parentheses because it's a value sitting inside the module, not a function you call. Mixing that up (\`math.pi()\`) is a common typo.

## Try it

- Simulate flipping a coin ten times with \`random.choice(["heads", "tails"])\` in a loop, and count how many were heads
- Print \`math.sqrt\` of a few numbers you can check by hand, like 9 and 25`,
    },
    {
      id: "guess-finish-the-project",
      title: "Finish the project",
      content: `By the end of this lesson you'll have a complete Guess the Number game and know it works.

## The finished program

\`\`\`python
import random

secret = random.randint(1, 100)   # a fresh number every run
attempts = 0

print("I'm thinking of a number between 1 and 100.")

while True:
    guess = int(input("Your guess: "))   # crashes on non-numbers: Project 3 fixes that
    attempts += 1

    if guess < secret:
        print("Too low.")
    elif guess > secret:
        print("Too high.")
    else:
        print(f"Got it in {attempts} attempts!")
        break   # the only way out of this loop
\`\`\`

Yours doesn't have to match this exactly. It has to do the same things, for the same reasons you now understand rather than by copying.

## Done when

- The game prints a welcome message, then asks for a guess
- A guess below the secret prints "Too low.", and one above prints "Too high."
- Guessing correctly ends the game and prints the number of attempts
- Running it twice uses a different secret each time
- You can explain, without looking it up, why \`input()\` needs \`int()\` around it

## Stretch goals

- Tell the player when they've guessed the same number twice (hint: you'll want a list, coming in Project 2)
- Add a limit of 7 guesses using a second loop condition, and reveal the secret if they run out
- Ask "Play again?" after a game ends, and loop the whole game if they say yes`,
    },
  ],
};
