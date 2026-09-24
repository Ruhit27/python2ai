import type { CourseModule } from "@/data/courses";
import SampleRun from "@/components/SampleRun";
import { UvDiagram, VenvDiagram } from "@/components/LessonDiagrams";

export const weatherNowModule: CourseModule = {
  title: "Project 4: Weather Now",
  lessons: [
    {
      id: "weather-meet-the-project",
      title: "Meet the project",
      content: `By the end of this module you'll have built a program that asks for a city and prints its live weather, fetched from the internet.

## What you'll build

You type a city name. The program looks up where it is, asks a weather service for the current conditions there, and prints the temperature and wind. If the city doesn't exist, or your connection is down, it says so. The sample run shows the finished program.

## The rough version

Here is what you can do with only what you know so far:

\`\`\`python
city = input("City: ")
print(f"The weather in {city} is... unknown.")
\`\`\`

To do better, your program has to talk to another computer. That needs code that doesn't come with Python.

## What's new in this module

- Installing a package: code written by other people
- Keeping each project's packages separate with \`uv\`
- Calling an API and reading the JSON it sends back
- Coping with things that fail because they're out of your control

\`\`\`note
The weather comes from Open-Meteo, which is free and needs no account or key.
\`\`\``,
      extra: (
        <SampleRun
          steps={[
            ["cmd", "uv run main.py"],
            ["out", "City: Berlin"],
            ["ok", "Berlin, Germany"],
            ["ok", "15.0°C, wind 17.9 km/h"],
          ]}
        />
      ),
    },
    {
      id: "weather-importing-code",
      title: "Importing code",
      content: `By the end of this lesson you'll be able to pull in code from Python's standard library and from your own files.

## The standard library

Python ships with modules for many jobs: \`random\` for chance, \`string\` for text helpers, \`json\` for data, \`datetime\` for dates. You've imported two already.

## Three ways to import

\`\`\`python
import random
from datetime import date
import json as js
\`\`\`

- \`import random\` gives you the module, and you write \`random.randint(...)\`
- \`from datetime import date\` pulls one name out, and you write just \`date.today()\`
- \`import x as y\` gives it a shorter name

## Your own files are modules too

If you have a file \`helpers.py\` next to your script that defines \`def shout(text): ...\`, then \`from helpers import shout\` works. Splitting a large program across files this way is how real projects stay readable.

## Packages

A package is a bundle of modules that someone else published. Python's standard library is always there, but packages must be installed before you can import them. Try \`import requests\` on a fresh machine and you'll get a \`ModuleNotFoundError\`. The next two lessons fix that.

## Try it

Import \`date\` from \`datetime\`, and print \`date.today()\`.`,
    },
    {
      id: "weather-virtual-environments",
      title: "Virtual environments",
      content: `By the end of this lesson you'll understand why each project gets its own set of packages.

## The problem

Different projects need different packages, and sometimes different versions of the same one. If everything installs into one shared place, a change for one project can silently break another.

A virtual environment is a private folder of packages for one project. Python has a built-in tool for it, called \`venv\`.

## Create and activate one

\`\`\`bash
python3 -m venv .venv
source .venv/bin/activate
\`\`\`

On Windows, activate with \`.venv\\Scripts\\activate\` instead. Your prompt now shows \`(.venv)\`, and anything you \`pip install\` stays in this project.

## Rules of thumb

- One virtual environment per project
- Never commit \`.venv/\` to git, the tool that tracks changes to code. If you don't use git yet, ignore this
- Run \`deactivate\` to leave it

You won't do this by hand much. The next lesson introduces a tool that creates and uses the environment for you. It's still worth knowing what it's doing underneath.

## Try it

Make a \`.venv\` in a scratch folder, activate it, and run \`pip list\`. It's nearly empty, which is the point.`,
      extra: <VenvDiagram accent="#5B9BD5" />,
    },
    {
      id: "weather-managing-packages-with-uv",
      title: "Managing packages with uv",
      content: `By the end of this lesson you'll be able to start a project, install a package, and run your code with one tool.

## What uv is

\`uv\` is a fast tool that handles Python versions, virtual environments, and packages together. Install it from the instructions at docs.astral.sh/uv, then check it with \`uv --version\`.

## Start the weather project

\`\`\`bash
uv init weather-now
cd weather-now
uv add requests
\`\`\`

\`uv init\` makes the folder, with a \`main.py\` in it. \`uv add requests\` installs the \`requests\` package into the project's own environment and records it in \`pyproject.toml\`, so anyone else can rebuild the same setup.

## Run your code

\`\`\`bash
uv run main.py
\`\`\`

\`uv run\` uses the project's environment for you, so there's nothing to activate. Use it for the rest of this course.

## Try it

Replace the contents of \`main.py\` with \`import requests\` followed by \`print(requests.__version__)\`, and run it. If it prints a version number, the package is installed.`,
      extra: <UvDiagram accent="#5B9BD5" />,
    },
    {
      id: "weather-calling-an-api",
      title: "Calling an API",
      content: `By the end of this lesson you'll be able to ask a web service for data from your own code.

## What an API is

An API is a way for programs to talk to each other. You send a request to a web address, and the service sends back data. Your browser does the same thing when it loads a page, except an API returns data made for programs, not for eyes.

## Your first request

\`\`\`python
import requests

response = requests.get(
    "https://geocoding-api.open-meteo.com/v1/search",
    params={"name": "Berlin", "count": 1},
    timeout=10,
)
print(response.status_code)
\`\`\`

- The first argument is the address
- \`params\` are extra details added to the address for you
- \`timeout=10\` gives up after ten seconds instead of waiting forever. Always set one

## Status codes

The number in \`response.status_code\` says how it went. \`200\` means success. \`404\` means not found. Anything in the 400s or 500s is a failure. \`response.raise_for_status()\` turns those failures into an exception, so you don't have to remember to check.

## Try it

Run the request above and print the status code. Then change \`"Berlin"\` to your own city.`,
    },
    {
      id: "weather-reading-json",
      title: "Reading JSON",
      content: `By the end of this lesson you'll be able to pull the values you want out of an API's response.

## JSON is dictionaries and lists

Most APIs reply in JSON, a text format that looks like Python dictionaries and lists. \`response.json()\` turns it into real ones you can use.

\`\`\`python
data = response.json()
place = data["results"][0]
print(place["name"], place["latitude"], place["longitude"])
\`\`\`

Read it as a path: the key \`"results"\` holds a list, \`[0]\` takes its first item, and that item is a dictionary.

## Explore before you extract

Print the whole response first and read it. Look for the keys you need. Nearly every mistake with APIs comes from guessing at the structure.

## When a key might be missing

If a city doesn't exist, \`"results"\` isn't in the reply at all, and \`data["results"]\` raises a \`KeyError\`. Use \`.get\` and check:

\`\`\`python
results = response.json().get("results")
if not results:
    print("No such city.")
\`\`\`

## Saving and loading JSON yourself

The \`json\` module does the same conversion for your own data and files. \`json.dump(data, file)\` writes a dictionary or list to a file, and \`json.load(file)\` reads it back:

\`\`\`python
import json

with open("data.json", "w", encoding="utf-8") as file:
    json.dump({"visits": 3}, file)

with open("data.json", encoding="utf-8") as file:
    data = json.load(file)
\`\`\`

You'll use this in the capstone.

## The weather request

The weather service takes a latitude and a longitude, and a list of the values you want:

\`\`\`python
weather = requests.get(
    "https://api.open-meteo.com/v1/forecast",
    params={
        "latitude": place["latitude"],
        "longitude": place["longitude"],
        "current": "temperature_2m,wind_speed_10m",
    },
    timeout=10,
).json()["current"]
\`\`\`

## Try it

Print the weather dictionary and find the two values you'll show.`,
    },
    {
      id: "weather-handling-failures",
      title: "When things fail",
      content: `By the end of this lesson you'll be able to make a program that survives a dead connection.

## The network isn't yours

Code that talks to the internet fails in ways your own code never does: no connection, a slow server, a service that's down. You can't prevent these, so you handle them.

## One exception to catch

Every problem \`requests\` can have, including timeouts and failed status checks, is a subclass of \`requests.RequestException\`. Catch that one, and you cover all of them:

\`\`\`python
try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
except requests.RequestException:
    print("Couldn't reach the service.")
\`\`\`

## Testing it

Turn off your Wi-Fi and run the program. If it prints your message instead of a traceback, it works.

## Keep the try small

Wrap only the code that can fail with the network. If your \`try\` block holds everything, real bugs in your own logic get swallowed by the same message.

## Try it

Run your request with the internet off, first without the \`try\`, to see the traceback, then with it.`,
    },
    {
      id: "weather-finish-the-project",
      title: "Finish the project",
      content: `By the end of this lesson you'll have a finished Weather Now program and a checklist to prove it works.

## The finished program

Put this in \`main.py\` inside your \`weather-now\` folder:

\`\`\`python
import requests


def find_city(name):
    response = requests.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        params={"name": name, "count": 1},
        timeout=10,
    )
    response.raise_for_status()
    results = response.json().get("results")
    return results[0] if results else None


def get_weather(latitude, longitude):
    response = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,wind_speed_10m",
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()["current"]


city = input("City: ")

try:
    place = find_city(city)
    if place is None:
        print(f"No city called {city}.")
    else:
        now = get_weather(place["latitude"], place["longitude"])
        print(f"{place['name']}, {place['country']}")
        print(f"{now['temperature_2m']}°C, wind {now['wind_speed_10m']} km/h")
except requests.RequestException:
    print("Couldn't reach the weather service. Check your connection.")
\`\`\`

Each function does one job and returns data. The code at the bottom decides what to show. Your numbers will differ from the sample run, because it's live weather.

## Done when

- A real city prints its name, country, temperature, and wind speed
- A made-up city prints "No city called ..." and no traceback
- With Wi-Fi off, it prints the connection message and no traceback
- \`uv run main.py\` works from a fresh terminal without activating anything
- \`pyproject.toml\` lists \`requests\` as a dependency

## Stretch goals

- Show the temperature in Fahrenheit too
- Loop, so you can check several cities without restarting
- Add \`"precipitation"\` to the values you request`,
    },
  ],
};
