import { checkDependencies } from "@/lib/agentic-os/dependency-check";
import { parseDependencies } from "@/lib/agentic-os/dependencies";
import { spendRun } from "@/lib/agentic-os/request";

const MAX_TEXT = 20_000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text : "";
  if (text.length > MAX_TEXT) return Response.json({ error: "That file is too long to check." }, { status: 400 });

  const parsed = parseDependencies(text);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const run = spendRun(request);
  if (run instanceof Response) return run;

  try {
    const result = await checkDependencies(parsed.ecosystem, parsed.dependencies);
    return Response.json({ result, remaining: run.remaining });
  } catch (error) {
    console.error("Dependency check failed", error);
    return Response.json({ error: "The Agent couldn't finish. Try again in a moment." }, { status: 502 });
  }
}
