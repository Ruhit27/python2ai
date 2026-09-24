import { learnThis } from "@/lib/agentic-os/learn-this";
import { spendRun } from "@/lib/agentic-os/request";

const MAX_TOPIC = 200;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
  if (!topic) return Response.json({ error: "Type a topic to learn." }, { status: 400 });
  if (topic.length > MAX_TOPIC) {
    return Response.json({ error: `Keep the topic under ${MAX_TOPIC} characters.` }, { status: 400 });
  }

  const run = spendRun(request);
  if (run instanceof Response) return run;

  try {
    return Response.json({ result: await learnThis(topic), remaining: run.remaining });
  } catch (error) {
    console.error("Learn this failed", error);
    return Response.json({ error: "The Agent couldn't answer. Try again in a moment." }, { status: 502 });
  }
}
