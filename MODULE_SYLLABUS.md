# Module Syllabus — Backend Engineering & API Design

## Description
A ticket-driven module that builds the **production backend** for *Project Forge* on Node and TypeScript. Across 10 lessons and a capstone, you operate as a Backend Software Engineer closing tickets that move from replacing a mock with a real REST API, through layered architecture and boundary validation, authentication and authorization, API platform standards, background processing, and operational readiness — culminating in shipping the platform. The emphasis is on **architecture, security, reliability, and judgment**: the boundary is untrusted, layers have clear contracts, illegal states are unrepresentable, security fails safe, and you design for failure.

## Prerequisites
- Solid TypeScript (SWEXP Module 04) — the backend is fully typed.
- Familiarity with the Module 05 frontend's data needs (it consumes this API).
- Comfort at a command line and basic Git (Modules 01–02).
- **Node.js** (18+ for global `fetch`; `node:crypto` is built in) and **npm**.
- A TypeScript-aware editor.

## Pacing Options

| Track | Cadence | Duration |
|-------|---------|----------|
| Intensive (bootcamp) | ~1 lesson/day; capstone over the last 4–5 days | ~2–3 weeks |
| Part-time (cohort) | 2 lessons/week | ~6 weeks |
| Self-paced | 1 lesson per sitting; capstone when ready | flexible |

Most lessons are 3–4 hours including the lab; the capstone is 16–20 hours.

## Module Arc

| Phase | Lessons | Focus |
|-------|---------|-------|
| Foundations | 0 | toolchain; request/response lifecycle; backend vs frontend |
| API Foundations | 1–3 | REST + controllers; layered architecture; boundary validation |
| Security | 4–5 | authentication; authorization |
| Platform | 6–7 | API platform standards; background processing |
| Quality & Production | 8 | operational readiness |
| Capstone | 9 | ship the full Forge backend platform with evidence |

## Lesson Structure
Every lesson follows the same shape: **Engineering Ticket → Business Context → Learning Objectives → Technical Deep Dive → Hands-on Labs → Engineering Investigation → AI Engineering Exercise → Assignment → Stretch Goal → Definition of Done → Reflection.**

## Labs
Every lab carries a running Forge backend forward and is **verified three ways**: contracts are TypeScript type-checked with `tsc` (+`@types/node`); pure logic and auth are unit-tested with `node` (real `node:crypto` — scrypt + HMAC); and endpoints are exercised end-to-end by a real in-process HTTP server (Node's built-in `http`) hit with global `fetch` — no external services. Note `tsc file.ts` ignores `tsconfig.json` — use `tsc --noEmit` or `-p`.

## Deliverables
- **Per lesson:** a completed lab, an assignment via `assignments/submission-template.md`, and an engineering-notebook entry (what you built → evidence → fixes → AI log).
- **Capstone:** the working strict-typed Forge backend, a release report proving each quality bar with evidence (layered architecture with service tests sans HTTP, the REST contract, boundary validation, auth failing safe, authz 403-vs-401, idempotency/429, jobs recover/DLQ, readiness reflecting a downed dependency), and the notebook — per `assignments/capstone-brief.md`.

## Final Assessment
Graded against `ASSESSMENT_RUBRIC.md`: Architecture (15%), Security (15%), API Platform (15%), Data Platform (10%), Background Processing (10%), Operations (10%), Documentation (10%), Engineering Judgment (10%), AI Workflow (5%).

## Support Materials
- `resources/` — setup; REST reference; layered architecture; validation; authentication; authorization; API platform standards; background processing; operational readiness; HTTP status codes; error handling; AI-workflow; notebook template.
- `dashboard.html` — an interactive progress tracker.
- `solutions/` — worked solutions (type-check / Node-test / request reproducible) to check against.
- `instructor-notes/` — per-lesson facilitation guidance.

## Academic & Professional Integrity
AI assistance is **encouraged**, used as a professional would: every use follows **draft → verify (type-check + test/run + measure) → log.** The recurring failures to catch — trusting `req.body`, plaintext/fast-hashed passwords, `===` secret comparison, trust-before-verify tokens, allow-by-default authorization, non-idempotent retries, unbounded job retries, dependency checks in liveness, secrets in logs — are exactly what the verifiers exist to surface. Unverified AI output in deliverables counts against you, and security shortcuts especially.
