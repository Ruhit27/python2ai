import { describe, expect, it } from "vitest";
import { createDailyLimiter } from "./rate-limit";

describe("daily limiter", () => {
  it("allows a visitor up to the limit, then refuses", () => {
    const limiter = createDailyLimiter(3);
    const now = new Date("2026-09-24T10:00:00Z");
    expect(limiter.take("1.1.1.1", now)).toMatchObject({ allowed: true, remaining: 2 });
    expect(limiter.take("1.1.1.1", now)).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.take("1.1.1.1", now)).toMatchObject({ allowed: true, remaining: 0 });
    expect(limiter.take("1.1.1.1", now)).toMatchObject({ allowed: false, remaining: 0 });
  });

  it("gives a refused visitor a fresh allowance after UTC midnight", () => {
    const limiter = createDailyLimiter(1);
    limiter.take("1.1.1.1", new Date("2026-09-24T23:59:00Z"));
    const refused = limiter.take("1.1.1.1", new Date("2026-09-24T23:59:30Z"));
    expect(refused).toMatchObject({ allowed: false });
    expect(refused.resetsAt).toEqual(new Date("2026-09-25T00:00:00Z"));
    expect(limiter.take("1.1.1.1", new Date("2026-09-25T00:00:01Z"))).toMatchObject({ allowed: true });
  });

  it("counts each visitor separately", () => {
    const limiter = createDailyLimiter(1);
    const now = new Date("2026-09-24T10:00:00Z");
    limiter.take("1.1.1.1", now);
    expect(limiter.take("2.2.2.2", now)).toMatchObject({ allowed: true });
  });
});
