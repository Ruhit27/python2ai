import "server-only";
import { createDailyLimiter } from "./rate-limit";
import { DAILY_LIMIT } from "./types";

// One limiter per server instance; see createDailyLimiter for why that's soft.
const limiter = createDailyLimiter(DAILY_LIMIT);

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * Spends one of the visitor's daily runs. Returns a 429 response when they
 * have none left, so the page can switch that Agent to its recorded replay.
 */
export function spendRun(request: Request): { remaining: number } | Response {
  const result = limiter.take(clientIp(request), new Date());
  if (!result.allowed) {
    return Response.json(
      { error: "limit", resetsAt: result.resetsAt.toISOString() },
      { status: 429 },
    );
  }
  return { remaining: result.remaining };
}

/** Fetch with a timeout that resolves to null instead of throwing, for optional sources. */
export async function fetchOrNull(url: string, init: RequestInit = {}) {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { "User-Agent": "betshaped-agentic-os/0.1", ...init.headers },
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

export function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
