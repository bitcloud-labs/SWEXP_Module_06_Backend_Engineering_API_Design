# Capstone Brief — FORGE-9400: Ship the Project Forge Backend Platform

> **Epic:** FORGE-9400 · **Role:** Backend Software Engineer (release owner) · **Est. time:** 16–20 hours (staged) · **Submission:** `capstone-submission-template.md`

## The situation
*Project Forge* has a frontend (Module 05) running against a mock at `api.forge.dev`. You own shipping the **real backend platform** that powers it: a layered REST API that is correct, secure, reliable, and operable — one the frontend team (and others) can build on. You integrate everything from this module into one coherent, strict-typed service, and you prove each quality bar with evidence.

The capstone introduces **no new concepts.** It tests **integration, architecture, security, and judgment**: the layers, the security model, the platform standards, and the operational concerns all interact, and the security and reliability bars can't be bolted on at the end.

## Platform scope
A working Forge backend with at least:
- **Orders REST API** — resource-oriented routes, honest status codes, a consistent error envelope (Lessons 1, 6).
- **Layered architecture** — controller → service → repository; business logic testable without HTTP (Lesson 2).
- **Boundary validation** — every request validated; only typed data reaches services (Lesson 3).
- **Authentication** — salted/slow-hashed passwords; signed, expiring tokens; verify-before-trust (Lesson 4).
- **Authorization** — role + ownership, least privilege; 403 vs 401 (Lesson 5).
- **Platform standards** — pagination, idempotency for unsafe retries, rate limiting (Lesson 6).
- **Background processing** — slow work on a queue with bounded retries, backoff, idempotency, dead-lettering (Lesson 7).
- **Operational readiness** — liveness/readiness, structured correlated logs, env config, graceful shutdown (Lesson 8).

## Build order (follow it)
1. **REST + layers** — endpoints over controller → service → repository. (Lessons 1, 2)
2. **Validation** — schema validation at the boundary; only typed data into services. (Lesson 3)
3. **Security** — authentication, then authorization (role + ownership, least privilege). (Lessons 4, 5)
4. **Platform standards** — consistent error envelope, pagination, idempotency, rate limiting. (Lesson 6)
5. **Background processing** — move slow work to a queue with retries/backoff/idempotency/DLQ. (Lesson 7)
6. **Operational readiness & release** — health/readiness, structured logs, env config, graceful shutdown; assemble the release report. (Lesson 8)

Keep it type-checking and the service tests green throughout; commit in small, verified increments.

## Phases (stage the work)
- **Phase A — REST + layers + validation.**
- **Phase B — Security (authn + authz).**
- **Phase C — Platform standards + background processing.**
- **Phase D — Operational readiness + release report.**

## Acceptance criteria → rubric mapping
| Acceptance criterion | Rubric category |
|----------------------|-----------------|
| Layered architecture; business logic testable without HTTP | Architecture (15%) |
| Authentication fails safe; authorization is role + ownership, least privilege | Security (15%) |
| Resource-oriented REST; consistent error envelope; pagination; idempotency; rate limiting | API Platform (15%) |
| Boundary validation; typed domain; repository interface (swappable data) | Data Platform (10%) |
| Background queue with bounded retries, backoff, idempotency, dead-lettering | Background Processing (10%) |
| Liveness/readiness, structured correlated logs, env config, graceful shutdown | Operations (10%) |
| Release report documents each bar with reproducible evidence | Documentation (10%) |
| Sound, justified architecture/security decisions; no over-engineering; no `any` | Engineering Judgment (10%) |
| AI used as draft → verify → log | AI Workflow (5%) |

## Deliverables
1. **The working platform** — strict TypeScript, `tsc --noEmit` clean; service tests and endpoint checks reproducible (the in-process server + `fetch` pattern). Reuse the lab generators for the Orders domain, auth, and jobs so the build is reproducible.
2. **A release report** proving each quality bar with evidence: the layered architecture (service tests without HTTP); the REST contract + error envelope; boundary validation rejecting bad input before the service; authentication failing safe (tampered/expired → 401); authorization (403 vs 401, role + ownership); platform standards (idempotent retry acts once; over-limit → 429); background processing (transient recovers, permanent → DLQ); operational readiness (readiness reflects a downed dependency, logs correlate, missing config fails fast, shutdown drains).
3. **The engineering notebook**, including the **AI-usage log**.
4. **A "production-readiness" summary** — what each quality bar guarantees and how you verified it.

## Definition of done
- [ ] Layered architecture; business logic testable without HTTP
- [ ] Resource-oriented REST; honest status codes; consistent error envelope
- [ ] Every request validated at the boundary; only typed data into services
- [ ] Authentication (salted/slow hash, signed expiring tokens) failing safe
- [ ] Authorization (role + ownership, least privilege); 403 vs 401 correct
- [ ] Platform standards: pagination, idempotency, rate limiting
- [ ] Background processing: bounded retries, backoff, idempotency, DLQ
- [ ] Operational readiness: liveness/readiness, structured logs, env config, graceful shutdown
- [ ] Strict TypeScript; release report + notebook + AI log complete and reproducible

## The standard
The boundary is untrusted; layers with clear contracts; illegal states unrepresentable; **fail safe, not open**; least privilege; measure first, design for failure. A green type-check, a passing security test, and a real request transcript are how "production-ready" becomes true rather than asserted.
