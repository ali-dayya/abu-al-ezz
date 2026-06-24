const buckets = new Map();
const MAX_TRACKED_KEYS = 5000;

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

// Best-effort per-instance fixed-window limiter. Good enough to blunt
// accidental double-submits and basic spam on a low-traffic store;
// not a substitute for a shared store (e.g. Upstash) at higher scale.
export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.start > windowMs) {
    if (buckets.size > MAX_TRACKED_KEYS) buckets.clear();
    buckets.set(key, { start: now, count: 1 });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}
