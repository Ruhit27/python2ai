export type LimitResult = {
  allowed: boolean;
  remaining: number;
  /** When this visitor's allowance refills: the next UTC midnight. */
  resetsAt: Date;
};

function nextUtcMidnight(now: Date) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
}

/**
 * Counts requests per IP per UTC day, in memory. Serverless hosts run several
 * short-lived instances, so this is a soft limit: each instance keeps its own
 * counts. Good enough while Groq is cheap; move it to a shared store if abused.
 */
export function createDailyLimiter(limit: number) {
  const counts = new Map<string, { used: number; resetsAt: Date }>();

  return {
    take(ip: string, now: Date): LimitResult {
      let entry = counts.get(ip);
      if (counts.size > 50_000) {
        for (const [key, value] of counts) if (now >= value.resetsAt) counts.delete(key);
      }
      if (!entry || now >= entry.resetsAt) {
        entry = { used: 0, resetsAt: nextUtcMidnight(now) };
        counts.set(ip, entry);
      }
      if (entry.used >= limit) return { allowed: false, remaining: 0, resetsAt: entry.resetsAt };
      entry.used += 1;
      return { allowed: true, remaining: limit - entry.used, resetsAt: entry.resetsAt };
    },
  };
}
