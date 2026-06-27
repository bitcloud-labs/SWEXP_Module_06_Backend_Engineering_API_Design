# Lab 08 — Pass the Production Readiness Review

**Ticket:** OPS-8001 · **Goal:** readiness aggregation, env config validated at boot, log redaction, graceful-shutdown drain.

## What you do
In [`src/ops.ts`](src/ops.ts), implement the operable logic as pure functions:

- **`aggregateReadiness(checks)`** — ready only if **every** dependency check passes.
- **`loadConfig(env)`** — require `PORT`, `DATABASE_URL`, `JWT_SECRET`; fail fast listing the missing vars
  (discovered at boot, not at 3am); otherwise return a typed `Config`.
- **`redact(entry)`** — return a copy with secret-ish keys (`password`, `token`, `secret`,
  `authorization`, case-insensitive) replaced by `[REDACTED]`. Don't mutate the input.
- **`shouldKeepDraining(inFlight, elapsedMs, deadlineMs)`** — keep draining while there is in-flight work
  **and** we are under the deadline.

Run:
```bash
npx vitest run labs/lab-08-ops
```

## Definition of done
- All tests pass; `npm run check` clean.
- In your notebook, note how `/healthz` (liveness) differs from `/readyz` (readiness).

## Submit
Edit `src/`, run the tests, commit and push.
