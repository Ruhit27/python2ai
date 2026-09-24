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

You type a city name. The program looks up where it is, asks a weather service for the current conditions there, and prints the temperature and wind. If the city doesn't exist, or your connection is down, it says so instead of crashing. The sample run shows the finished program.

## The rough version

Here's as far as you can get with only what you know so far:

\`\`\`python
city = input("City: ")
print(f"The weather in {city} is... unknown.")   # no way to find out yet
\`\`\`

To do better, your program has to talk to another computer over the internet, and that needs code that doesn't come built into Python.

## What's new in this module

- Installing a package: code someone else wrote, that your project depends on
- Keeping each project's packages separate, with \`uv\`
- Calling an API and reading the JSON data it sends back
- Coping with a request that fails for reasons entirely outside your code

\`\`\`note
The weather comes from Open-Meteo, which is free and needs no account or key. That's why this project, not a paid API, is the one you're building.
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
      id: "weather-importing-and-environments",
      title: "Importing code, and why environments exist",
      content: `By the end of this lesson you'll be able to pull in code from the standard library and your own files, and know why installed packages live in a project-specific place.

## The standard library

Python ships with modules for dozens of jobs: \`random\` for chance, \`string\` for text helpers, \`json\` for data, \`datetime\` for dates. You've already imported three of these.

## Three ways to import

\`\`\`python
import random                    # random.randint(...): full name every time
from datetime import date        # date.today(): pulled one name out directly
import json as js                # js.dumps(...): given a shorter local name
\`\`\`

## Your own files are modules too

A file \`helpers.py\` sitting next to your script, containing \`def shout(text): return text.upper()\`, can be pulled in with \`from helpers import shout\`. Splitting a program across files this way, instead of one growing script, is how real projects stay navigable once they get past a couple hundred lines.

## Packages need installing before you can import them

A package is a bundle of modules someone else wrote and published for others to reuse. The standard library is always there; a package like \`requests\` is not, until you install it.

\`\`\`python
import requests
# ModuleNotFoundError: No module named 'requests'
# on a machine where it was never installed
\`\`\`

## Why isolate each project's packages

Different projects want different packages, and sometimes different versions of the same one. If everything installed into one shared, computer-wide place, upgrading a package for one project could quietly break another one you haven't touched in months. A virtual environment is a private folder of installed packages, scoped to one project, so that can't happen.

Python's built-in way to make one is the \`venv\` module:

\`\`\`bash
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\\Scripts\\activate
\`\`\`

Your prompt now shows \`(.venv)\`, and anything you \`pip install\` from here stays inside this project. \`deactivate\` leaves it. You're about to meet a tool that does this step for you automatically, so this is the last time in the course you'll type \`venv\` by hand, but it's worth knowing what's happening underneath.

## Try it

- Import \`date\` from \`datetime\` and print \`date.today()\`
- Make a \`.venv\` in a scratch folder, activate it, and run \`pip list\`. It's nearly empty, which is the whole point`,
      extra: <VenvDiagram accent="#5B9BD5" />,
    },
    {
      id: "weather-uv",
      title: "Managing packages with uv",
      content: `By the end of this lesson you'll be able to start a project, install a package, and run your code with a single tool.

## What uv is

\`uv\` handles Python versions, virtual environments, and packages together, and does it fast. Install it from the instructions at docs.astral.sh/uv, then confirm with:

\`\`\`bash
uv --version
\`\`\`

## Start the weather project

\`\`\`bash
uv init weather-now    # creates the folder, with a starter main.py inside
cd weather-now
uv add requests        # installs requests, into this project only
\`\`\`

\`uv add\` does two things at once: it installs the package into the project's own environment, and it records the exact version in \`pyproject.toml\`, so anyone who clones the project can rebuild the identical setup with one command.

## Running your code

\`\`\`bash
uv run main.py
\`\`\`

\`uv run\` uses the project's environment automatically. There's no \`source .venv/bin/activate\` to remember or forget. Use \`uv run\` for the rest of this course, including the capstone.

## Try it

Replace \`main.py\`'s contents with:

\`\`\`python
import requests

print(requests.__version__)   # confirms the package actually installed
\`\`\`

Run it with \`uv run main.py\`. A version number means it worked.`,
      extra: <UvDiagram accent="#5B9BD5" />,
    },
    {
      id: "weather-api-and-json",
      title: "Calling an API and reading JSON",
      content: `By the end of this lesson you'll be able to ask a web service for data, and pull the values you want out of what it sends back.

## What an API is

An API is a way for programs to talk to each other. You send a request to a web address; the service sends back data shaped for programs, not for a browser to render as a page.

## Your first request

\`\`\`python
import requests

response = requests.get(
    "https://geocoding-api.open-meteo.com/v1/search",
    params={"name": "Berlin", "count": 1},   # added onto the address for you
    timeout=10,                               # give up after 10s instead of hanging forever
)
print(response.status_code)   # 200 means it worked
\`\`\`

\`200\` means success. \`404\` means not found. Anything in the 400s or 500s means something went wrong. \`response.raise_for_status()\` turns a bad status into an exception automatically, so you don't have to remember to check the number by hand every time.

## JSON looks like dictionaries and lists, because it becomes them

Most APIs reply in JSON, a text format that maps directly onto Python dictionaries and lists. \`response.json()\` does that conversion for you.

\`\`\`python
data = response.json()
place = data["results"][0]   # "results" is a list; [0] takes its first item
print(place["name"], place["latitude"], place["longitude"])
\`\`\`

Read a chain like \`data["results"][0]["name"]\` as a path: go into \`"results"\`, take the first item, then read its \`"name"\`.

## Explore before you extract

Print the whole response and read it before you write code that reaches into it. Guessing at a key that isn't there is where nearly every API bug starts.

## A missing key isn't the same as an empty list

If a city doesn't exist, \`"results"\` might be missing from the reply entirely, and \`data["results"]\` raises \`KeyError\`. \`.get\` returns \`None\` instead of crashing, so you can check first:

\`\`\`python
results = response.json().get("results")
if not results:            # catches both "key missing" and "empty list"
    print("No such city.")
\`\`\`

## The weather request itself

The weather service wants a latitude and longitude, plus a list of which values you want back:

\`\`\`python
weather = requests.get(
    "https://api.open-meteo.com/v1/forecast",
    params={
        "latitude": place["latitude"],       # from the geocoding request above
        "longitude": place["longitude"],
        "current": "temperature_2m,wind_speed_10m",   # comma-separated, no spaces
    },
    timeout=10,
).json()["current"]   # chained straight through: response -> json -> "current"

print(weather["temperature_2m"], weather["wind_speed_10m"])
\`\`\`

## Saving your own data as JSON

The \`json\` module does the same conversion for data you make yourself, not just API replies. \`json.dump\` writes a dictionary or list to a file; \`json.load\` reads it back into real Python data.

\`\`\`python
import json

data = {"visits": 3, "favorite_city": "Berlin"}

with open("data.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=2)   # indent=2 just makes the file readable

with open("data.json", encoding="utf-8") as file:
    reloaded = json.load(file)

print(reloaded)   # {'visits': 3, 'favorite_city': 'Berlin'}
\`\`\`

You'll use exactly this pair in the capstone, to save a learner's habits between runs.

## Try it

- Print the full response from the geocoding request for your own city and find the keys you'll need
- Save a small dictionary of your own to \`data.json\`, then load it back and print it`,
    },
    {
      id: "weather-failures-and-finish",
      title: "Handling failures, and finishing the project",
      content: `By the end of this lesson you'll have a finished Weather Now that survives a dead connection, and a checklist to prove it.

## The network isn't yours to control

Code that talks to the internet fails in ways your own code never does: no connection, a slow server, a service that's down entirely. You can't prevent any of that, so you handle it instead.

## One exception covers the whole family

Every failure \`requests\` can produce, including a timeout and a bad status from \`raise_for_status()\`, is a subclass of \`requests.RequestException\`. Catching that one exception catches all of them:

\`\`\`python
try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
except requests.RequestException:
    print("Couldn't reach the service.")   # covers timeouts, DNS failures, 500s, all of it
\`\`\`

Test this by turning off your Wi-Fi and running the program. A clean message instead of a traceback means it works.

## Keep the try block small

Wrap only the lines that can actually fail over the network. If the \`try\` block also holds your own logic, a real bug in that logic gets silently relabeled as a "connection problem," and you'll spend an hour debugging the wrong thing.

## The finished program

\`\`\`python
import requests


def find_city(name):
    # geocoding: turns a city name into coordinates the forecast API understands
    response = requests.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        params={"name": name, "count": 1},
        timeout=10,
    )
    response.raise_for_status()          # turns a bad status into an exception
    results = response.json().get("results")
    return results[0] if results else None   # None when nothing matched


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
    # covers both requests failing outright (offline) and raise_for_status()
    # above turning a bad reply into this same exception
    print("Couldn't reach the weather service. Check your connection.")
\`\`\`

Each function does one job and returns data; the code at the bottom decides what to show with it, the same split you used for \`add\`/\`show\`/\`complete\` in Project 2. Your own numbers will differ from the sample run, since it's live weather.

## Done when

- A real city prints its name, country, temperature, and wind speed
- A made-up city prints "No city called ..." with no traceback
- With Wi-Fi off, it prints the connection message, not a traceback
- \`uv run main.py\` works from a fresh terminal, with nothing manually activated
- \`pyproject.toml\` lists \`requests\` as a dependency
- You can explain why the \`try\` block wraps only the two \`requests.get\` calls, not the whole program

## Stretch goals

- Show the temperature in Fahrenheit too, converted from the Celsius you already have
- Loop, so you can check several cities in one run without restarting
- Add \`"precipitation"\` to the values you request from the forecast API`,
    },
  ],
};
