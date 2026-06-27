# Lab 06 — Build a Reliable API Platform

**Ticket:** PLAT-6001 · **Goal:** consistent error envelope, clamped pagination, idempotent retries, token-bucket rate limiting.

## What you do
In [`src/platform.ts`](src/platform.ts), implement four cross-cutting primitives:

- **`errorEnvelope(code, message, details?)`** — every error shares one shape; omit `details` when absent.
- **`clampLimit(raw, def, max)`** — non-finite → default; otherwise clamp into `1..max` and truncate
  (a client asking `limit=99999` gets `100`, not everything).
- **`IdempotencyStore.run(key, work)`** — run `work` once per key; a repeat replays the stored result and
  the side effect happens **once**.
- **`allow(bucket, now, ratePerSec, capacity)`** — token-bucket: refill by elapsed time (capped at
  capacity), then spend one token; deny when empty.

Run:
```bash
npx vitest run labs/lab-06-api-platform
```

## Definition of done
- All tests pass; `npm run check` clean.
- In your notebook, note how an idempotent retry maps to one side effect, and what an over-limit caller
  should receive (`429` + `Retry-After`).

## Submit
Edit `src/`, run the tests, commit and push.
