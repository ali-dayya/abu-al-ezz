import { describe, it, expect } from "vitest";
import { checkRateLimit, getClientIp } from "./rateLimit";

describe("checkRateLimit", () => {
  it("allows first request through", () => {
    expect(checkRateLimit("rl-test-first", { limit: 3, windowMs: 60_000 })).toBe(true);
  });

  it("allows requests up to the limit", () => {
    const key = "rl-test-upto";
    expect(checkRateLimit(key, { limit: 3, windowMs: 60_000 })).toBe(true);
    expect(checkRateLimit(key, { limit: 3, windowMs: 60_000 })).toBe(true);
    expect(checkRateLimit(key, { limit: 3, windowMs: 60_000 })).toBe(true);
  });

  it("blocks once the limit is exceeded", () => {
    const key = "rl-test-block";
    checkRateLimit(key, { limit: 2, windowMs: 60_000 });
    checkRateLimit(key, { limit: 2, windowMs: 60_000 });
    expect(checkRateLimit(key, { limit: 2, windowMs: 60_000 })).toBe(false);
    expect(checkRateLimit(key, { limit: 2, windowMs: 60_000 })).toBe(false);
  });

  it("resets after the window expires", async () => {
    const key = "rl-test-reset";
    checkRateLimit(key, { limit: 1, windowMs: 10 });
    expect(checkRateLimit(key, { limit: 1, windowMs: 10 })).toBe(false);
    await new Promise((r) => setTimeout(r, 20));
    expect(checkRateLimit(key, { limit: 1, windowMs: 10 })).toBe(true);
  });

  it("tracks different keys independently", () => {
    const key1 = "rl-test-key1";
    const key2 = "rl-test-key2";
    checkRateLimit(key1, { limit: 1, windowMs: 60_000 });
    // key1 exhausted, key2 should still be fine
    expect(checkRateLimit(key1, { limit: 1, windowMs: 60_000 })).toBe(false);
    expect(checkRateLimit(key2, { limit: 1, windowMs: 60_000 })).toBe(true);
  });
});

describe("getClientIp", () => {
  const makeReq = (headers) => ({
    headers: { get: (h) => headers[h] ?? null },
  });

  it("returns the first IP from x-forwarded-for", () => {
    const req = makeReq({ "x-forwarded-for": "1.2.3.4, 5.6.7.8, 9.0.1.2" });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("trims whitespace from the forwarded IP", () => {
    const req = makeReq({ "x-forwarded-for": "  10.0.0.1  , 10.0.0.2" });
    expect(getClientIp(req)).toBe("10.0.0.1");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const req = makeReq({ "x-real-ip": "203.0.113.5" });
    expect(getClientIp(req)).toBe("203.0.113.5");
  });

  it('returns "unknown" when no IP headers are present', () => {
    const req = makeReq({});
    expect(getClientIp(req)).toBe("unknown");
  });

  it("prefers x-forwarded-for over x-real-ip", () => {
    const req = makeReq({ "x-forwarded-for": "1.1.1.1", "x-real-ip": "2.2.2.2" });
    expect(getClientIp(req)).toBe("1.1.1.1");
  });
});
