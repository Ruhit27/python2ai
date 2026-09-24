import { getDailyDigest } from "@/lib/agentic-os/daily-digest";

// The digest is cached for a day and shared, so reading it doesn't spend a visitor's runs.
export async function GET() {
  try {
    return Response.json({ result: await getDailyDigest() });
  } catch (error) {
    console.error("Daily digest failed", error);
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}
