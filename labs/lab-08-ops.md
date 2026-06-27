# Lab 08 — Pass the Production Readiness Review

**Lesson:** 08 · **Goal:** liveness/readiness, structured correlated logs with redaction, env config validated at boot, and graceful-shutdown draining — verified.

## Goal
Make the service operable: an orchestrator can tell if it's alive vs ready, incidents are traceable, secrets stay out of logs and source, and deploys don't drop in-flight work.

## Setup
```bash
cd /tmp/swexp-be
cat > ops.ts <<'TS'
// --- readiness aggregation (pure): ready only if every dependency check passes ---
export function aggregateReadiness(checks: Record<string, boolean>): { ready: boolean; checks: Record<string, boolean> } {
  return { ready: Object.values(checks).every(Boolean), checks };
}

// --- config validation at boot (fail fast on missing required vars) ---
export interface Config { port: number; dbUrl: string; jwtSecret: string; }
export function loadConfig(env: Record<string, string | undefined>): { ok: true; config: Config } | { ok: false; missing: string[] } {
  const missing: string[] = [];
  for (const key of ['PORT', 'DATABASE_URL', 'JWT_SECRET']) if (!env[key]) missing.push(key);
  if (missing.length) return { ok: false, missing };
  return { ok: true, config: { port: Number(env.PORT), dbUrl: env.DATABASE_URL!, jwtSecret: env.JWT_SECRET! } };
}

// --- log redaction: never log secrets/tokens/passwords ---
const SECRET_KEYS = ['password', 'token', 'secret', 'authorization'];
export function redact(entry: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(entry)) out[k] = SECRET_KEYS.includes(k.toLowerCase()) ? '[REDACTED]' : v;
  return out;
}

// --- graceful shutdown decision: keep draining until idle or deadline ---
export function shouldKeepDraining(inFlight: number, elapsedMs: number, deadlineMs: number): boolean {
  return inFlight > 0 && elapsedMs < deadlineMs;
}
TS
echo "Wire health endpoints + structured logger + config + shutdown; unit-test; verify readiness end-to-end."
```

## Tasks
1. **Liveness vs readiness.** `/healthz` (liveness) stays trivial — process alive, no dependency checks. `/readyz` (readiness) aggregates dependency checks (DB reachable, etc.) and flips to not-ready when one is down.
2. **Structured, correlated logs.** Log JSON; stamp every line in a request with a `requestId` (from `X-Request-Id` or generated). Run untrusted fields through `redact` so secrets/tokens never land in logs.
3. **Config from the environment, validated at boot.** `loadConfig(process.env)` fails fast (lists missing vars) if a required var is absent — discovered at startup, not at 3am.
4. **Graceful shutdown.** On `SIGTERM`: stop accepting connections, drain in-flight work using `shouldKeepDraining` until idle or deadline, close resources, exit.
5. **Unit-test** the pure logic (readiness aggregation, config validation, redaction, drain decision) and **verify readiness end-to-end** (ready when deps up; not-ready when a dep is down).

## Deliverable
The health endpoints, structured+redacting logger, validated config, and graceful-shutdown drain; passing Node tests of the pure logic; and end-to-end evidence (readiness reflects a downed dependency; missing config fails fast; logs share a requestId and redact secrets).

## Cleanup
```bash
rm -f /tmp/swexp-be/ops.ts
```

## Check
`../solutions/lab-08-solution.md`.
