# Lesson 08 — Pass the Production Readiness Review

> **Role:** Backend Software Engineer · **Competency:** Operational Readiness · **Track:** OPS · **Est. time:** 4 hours

---

## 🎫 Engineering Ticket

```
TICKET:      OPS-5001
TITLE:       The service works on a laptop; make it operable in production
PRIORITY:    P1
TYPE:        Quality / Operations
DESCRIPTION: Before Forge's backend can ship, it must pass a production readiness
             review: health and readiness checks for orchestration, structured
             logging with request correlation, sane configuration and secrets
             handling, graceful shutdown, and basic metrics. Make the service
             observable and operable, not just functional.

ACCEPTANCE CRITERIA:
  - Liveness and readiness endpoints reflect real health
  - Logs are structured (JSON) and correlate by request id
  - Configuration/secrets come from the environment, not code
  - The service shuts down gracefully (drains in-flight work)
  - Key signals (errors, latency) are observable
```

## 🏢 Business Context

"It runs on my machine" is not production. A production service has to be *operable*: an orchestrator needs to know if it's alive and ready, on-call engineers need logs they can search and correlate, secrets can't live in source, deploys and restarts can't drop in-flight requests, and someone needs to see error rates and latency. Operational readiness is what separates a service that survives a 3am incident from one that causes it. This is *design for failure* and *measure first* (Module 03) applied to running systems.

## 🎯 Learning Objectives

- Implement liveness and readiness checks that reflect real state
- Emit structured, correlated logs
- Load configuration and secrets from the environment
- Shut down gracefully, draining in-flight work
- Expose key operational signals (errors, latency)

## 📚 Technical Deep Dive

**Liveness vs readiness.** They answer different questions an orchestrator asks:
- **Liveness** (`/healthz`) — *is the process alive?* If it fails, restart me. Keep it trivial (don't check dependencies, or a slow DB will cause restart loops).
- **Readiness** (`/readyz`) — *can I serve traffic right now?* Checks dependencies (DB reachable, migrations done). If it fails, stop sending me requests but don't restart me.

```ts
async function readiness(): Promise<{ ready: boolean; checks: Record<string, boolean> }> {
  const db = await pingDb().then(() => true).catch(() => false);
  return { ready: db, checks: { db } };
}
```

**Structured, correlated logs.** Log JSON (machine-parsable), and stamp every log line in a request with a **request id** (generated or from `X-Request-Id`) so you can trace one request across all its log lines and services:

```ts
log.info({ requestId, route: 'POST /orders', userId, durationMs, status: 201 });
```
Never log secrets, tokens, passwords, or full PII.

**Configuration & secrets from the environment.** Read config from environment variables (validated at startup), not hardcoded. Secrets (DB URL, signing key) come from the environment/secret manager — never committed. Fail fast at boot if a required config is missing.

**Graceful shutdown.** On `SIGTERM` (a deploy/scale-down), stop accepting new connections, finish in-flight requests, drain workers, close the DB, then exit — within a deadline:

```ts
process.on('SIGTERM', async () => {
  server.close();                 // stop accepting new connections
  await drainInFlight(deadlineMs);
  await db.close();
  process.exit(0);
});
```
Without this, a deploy drops live requests and corrupts in-flight work.

**Observability.** Emit metrics for the signals that matter — request rate, error rate, latency (the "RED" metrics) — so you can see health and set alerts. You can't operate what you can't measure.

### Common gotchas
- Liveness that checks dependencies → restart loops when a dependency blips.
- Unstructured logs with no request id (untraceable incidents).
- Secrets in source/config files; missing config discovered at runtime, not boot.
- No graceful shutdown → dropped requests on every deploy.
- No metrics → flying blind.

## 🧪 Hands-on Labs

Work through **`labs/lab-08-ops.md`**. You'll add liveness/readiness endpoints, a structured logger that correlates by request id, environment-based config validated at startup, and graceful-shutdown draining. The pure logic (readiness aggregation, config validation, log redaction, shutdown drain decision) is unit-tested in Node, and the health endpoints are exercised end-to-end (ready when deps are up, not-ready when a dep is down).

## 🔍 Engineering Investigation

Make a dependency "down" and confirm readiness flips to not-ready while liveness stays alive. Issue a request and confirm every log line shares its request id. Remove a required env var and confirm the service fails fast at boot. Trigger shutdown with an in-flight request and confirm it drains before exit. Record each.

## 🤖 AI Engineering Exercise

Ask an AI to "make this service production-ready." **Verify** liveness stays trivial (no dependency checks), logs are structured + correlated and redact secrets, config/secrets come from the environment, and shutdown drains in-flight work. **Log** where the AI checked deps in liveness, logged a secret, or skipped graceful shutdown and your fix.

## 📝 Assignment

Submit: liveness/readiness endpoints, the structured correlated logger (with redaction), env-based validated config, and graceful shutdown — with passing Node tests of the pure logic and end-to-end evidence (readiness reflects a downed dependency; logs share a request id; missing config fails fast).

## 🚀 Stretch Goal

Add a metrics endpoint (request count / error rate / latency histogram) or distributed-tracing context propagation, and explain which signal you'd alert on first and why.

## ✅ Definition of Done

- [ ] Liveness (trivial) and readiness (dependency-aware) endpoints
- [ ] Structured, request-correlated logs that redact secrets
- [ ] Config/secrets from the environment, validated at boot
- [ ] Graceful shutdown drains in-flight work
- [ ] Key signals observable; pure logic unit-tested

## 🪞 Reflection

Which readiness check would have caught a real outage early? Why must liveness stay dumb while readiness gets smart, and what breaks if you mix them up?
