# Operational Readiness Checklist

## Liveness vs readiness
- **Liveness** (`/healthz`) — *is the process alive?* Keep it **trivial** — no dependency checks (or a DB blip causes restart loops). Failing → restart me.
- **Readiness** (`/readyz`) — *can I serve now?* Checks dependencies (DB reachable, migrations done). Failing → stop traffic, don't restart.
```ts
aggregateReadiness(checks) = { ready: Object.values(checks).every(Boolean), checks };
```

## Structured, correlated logs
Log JSON; stamp every line in a request with a `requestId` (from `X-Request-Id` or generated) so you can trace one request across lines/services.
```ts
log.info({ requestId, route: 'POST /orders', userId, durationMs, status: 201 });
```
**Never log secrets/tokens/passwords/PII** — redact them.

## Config & secrets from the environment
Read config from env vars, validated at boot (fail fast on missing). Secrets come from the environment/secret manager — never committed.

## Graceful shutdown
On `SIGTERM`: stop accepting connections → drain in-flight requests/workers → close resources → exit, within a deadline. Without it, every deploy drops live requests.

## Observability
Emit the RED signals — **R**ate, **E**rrors, **D**uration (latency) — so you can see health and alert. You can't operate what you can't measure.

## Gotchas
- Dependency checks in liveness (restart loops).
- Unstructured/uncorrelated logs; logged secrets.
- Secrets in source; config errors found at runtime, not boot.
- No graceful shutdown; no metrics (flying blind).
