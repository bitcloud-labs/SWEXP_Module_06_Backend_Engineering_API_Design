/**
 * Lab 06 — Build a Reliable API Platform. See README.md.
 *
 * Cross-cutting platform primitives: a consistent error envelope, clamped pagination,
 * idempotent replay for unsafe retries, and a token-bucket rate limiter.
 *
 * No `any`.
 */

// --- consistent error envelope ----------------------------------------------

export interface ApiError {
  error: { code: string; message: string; details?: unknown };
}

/** Wrap an error in the one true shape. Omit `details` entirely when undefined. */
export function errorEnvelope(code: string, message: string, details?: unknown): ApiError {
  // TODO: return { error: { code, message, ...(details !== undefined ? { details } : {}) } }.
  return { error: { code: '', message: '' } };
}

// --- pagination: clamp the limit so a client can't request everything --------

/**
 * Clamp a raw `limit` (unknown query value) into `1..max`, defaulting to `def`.
 * Non-finite input → `def`. Truncate fractions. e.g. clampLimit(99999) → 100.
 */
export function clampLimit(raw: unknown, def = 20, max = 100): number {
  // TODO: Number(raw); if !isFinite → def; else min(max, max(1, trunc(n))).
  return def;
}

// --- idempotency: replay the stored result for a repeated key -----------------

export class IdempotencyStore<T> {
  private seen = new Map<string, T>();
  /**
   * Run `work` once per `key`. A repeat returns the stored result with `replayed: true`
   * and does NOT call `work` again (the side effect happens once).
   */
  run(key: string, work: () => T): { result: T; replayed: boolean } {
    // TODO: if key already seen → replay; else run, store, return replayed:false.
    void work;
    return { result: undefined as unknown as T, replayed: false };
  }
}

// --- rate limiting: token bucket ---------------------------------------------

export interface Bucket {
  tokens: number;
  last: number; // ms timestamp of last refill
}

/**
 * Token-bucket decision (mutates the bucket): refill based on elapsed time, then try
 * to spend one token. Returns whether the request is allowed.
 * Refill: tokens = min(capacity, tokens + (now - last)/1000 * ratePerSec); last = now.
 * If tokens < 1 → deny (no spend). Else spend 1 and allow.
 */
export function allow(bucket: Bucket, now: number, ratePerSec: number, capacity: number): boolean {
  // TODO: implement the refill-then-spend logic above.
  return false;
}
