# Lab 06 — Build a Reliable API Platform

**Lesson:** 06 · **Goal:** a consistent error envelope, clamped pagination, idempotency for unsafe retries, and a token-bucket rate limiter — verified.

## Goal
Turn the endpoints into a platform with uniform cross-cutting behavior, proven with unit tests and end-to-end checks (retry acts once; over-limit → 429).

## Setup
```bash
cd /tmp/swexp-be
cat > platform.ts <<'TS'
// --- consistent error envelope ---
export interface ApiError { error: { code: string; message: string; details?: unknown }; }
export function errorEnvelope(code: string, message: string, details?: unknown): ApiError {
  return { error: { code, message, ...(details !== undefined ? { details } : {}) } };
}

// --- pagination: clamp the limit so a client can't request everything ---
export function clampLimit(raw: unknown, def = 20, max = 100): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return def;
  return Math.min(Math.max(Math.trunc(n), 1), max);
}

// --- idempotency: replay the stored result for a repeated key ---
export class IdempotencyStore<T> {
  private seen = new Map<string, T>();
  run(key: string, work: () => T): { result: T; replayed: boolean } {
    if (this.seen.has(key)) return { result: this.seen.get(key)!, replayed: true };
    const result = work();
    this.seen.set(key, result);
    return { result, replayed: false };
  }
}

// --- rate limiting: token bucket ---
export interface Bucket { tokens: number; last: number; }
export function allow(bucket: Bucket, now: number, ratePerSec: number, capacity: number): boolean {
  bucket.tokens = Math.min(capacity, bucket.tokens + ((now - bucket.last) / 1000) * ratePerSec);
  bucket.last = now;
  if (bucket.tokens < 1) return false;
  bucket.tokens -= 1;
  return true;
}
TS
echo "Wire these into the API; unit-test each; verify idempotency + 429 end-to-end."
```

## Tasks
1. **Consistent error envelope.** Map every error (validation/auth/not-found/server) through `errorEnvelope` so all errors share one shape.
2. **Pagination.** Clamp `limit` to `1..100` (default 20); return the page plus metadata. A client requesting `limit=99999` gets 100, not everything.
3. **Idempotency.** For an unsafe operation (e.g. create/payment), use an `Idempotency-Key` header + `IdempotencyStore` so a retried request replays the original result and the side effect happens **once**.
4. **Rate limiting.** Use the token-bucket `allow` per client; on exhaustion return **429** with a `Retry-After` header.
5. **Unit-test** each pure piece (envelope shape, limit clamp at boundaries, idempotent replay, bucket refill/deny) and **verify end-to-end**: the same idempotent request twice → one side effect; exceeding the limit → 429.

## Deliverable
The envelope/pagination/idempotency/rate-limit code; passing Node unit tests of each; and end-to-end evidence (retry replays with one side effect; over-limit → 429 + `Retry-After`).

## Cleanup
```bash
rm -f /tmp/swexp-be/platform.ts
```

## Check
`../solutions/lab-06-solution.md`.
