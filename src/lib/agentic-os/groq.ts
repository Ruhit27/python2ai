import "server-only";

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";
// Groq's free tier caps tokens per minute; wait out a short 429 once, never longer.
const MAX_RETRY_WAIT_SECONDS = 10;

async function request(system: string, user: string, key: string) {
  return fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  });
}

/** Asks the model for a JSON object and returns it parsed. Throws on any failure. */
export async function askJson<T>(system: string, user: string): Promise<T> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set");

  let res = await request(system, user, key);
  const wait = Number(res.headers.get("retry-after"));
  if (res.status === 429 && wait > 0 && wait <= MAX_RETRY_WAIT_SECONDS) {
    await new Promise((resolve) => setTimeout(resolve, wait * 1000));
    res = await request(system, user, key);
  }
  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`);

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Groq returned no content");
  return JSON.parse(content) as T;
}
