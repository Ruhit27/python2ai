import { describe, expect, it } from "vitest";
import { parseDependencies } from "./dependencies";

describe("parseDependencies", () => {
  it("reads runtime and dev dependencies from a package.json", () => {
    const text = JSON.stringify({
      name: "app",
      dependencies: { next: "16.3.6", react: "^19.2.8" },
      devDependencies: { typescript: "~5.4.0" },
    });
    expect(parseDependencies(text)).toEqual({
      ok: true,
      ecosystem: "npm",
      dependencies: [
        { name: "next", version: "16.3.6" },
        { name: "react", version: "19.2.8" },
        { name: "typescript", version: "5.4.0" },
      ],
    });
  });

  it("reads pinned and ranged packages from a requirements.txt", () => {
    const text = [
      "# web",
      "fastapi==0.115.0",
      "uvicorn[standard]>=0.30.1  # server",
      "pydantic~=2.8 ; python_version >= '3.9'",
      "requests",
      "-r dev.txt",
      "",
    ].join("\n");
    expect(parseDependencies(text)).toEqual({
      ok: true,
      ecosystem: "pypi",
      dependencies: [
        { name: "fastapi", version: "0.115.0" },
        { name: "uvicorn", version: "0.30.1" },
        { name: "pydantic", version: "2.8" },
        { name: "requests", version: "" },
      ],
    });
  });

  it("explains what went wrong instead of throwing on unreadable input", () => {
    expect(parseDependencies('{ "dependencies": ')).toEqual({
      ok: false,
      error: "That looks like a package.json, but it isn't valid JSON.",
    });
    expect(parseDependencies("   ")).toEqual({
      ok: false,
      error: "Paste a package.json or requirements.txt with at least one dependency.",
    });
    expect(parseDependencies(JSON.stringify({ name: "empty" }))).toEqual({
      ok: false,
      error: "Paste a package.json or requirements.txt with at least one dependency.",
    });
  });
});
