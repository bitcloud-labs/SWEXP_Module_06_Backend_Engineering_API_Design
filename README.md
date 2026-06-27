# SWEXP Module 06 — Backend Engineering & API Design

**Theme:** Powering Project Forge — build the production backend that supports the frontend created in Module 05.

You are a **Backend Software Engineer** on the Platform Team. The Forge frontend runs against a mock at `api.forge.dev`; now you build the real service it depends on. Across 10 ticket-driven lessons you replace the mock with a real REST API, organize it into layers, validate the untrusted boundary, authenticate and authorize every request, harden the API into a platform (consistent errors, pagination, idempotency, rate limiting), move slow work to background jobs, make it operationally ready (health, logging, graceful shutdown), and ship it.

The ethos, in every lesson: **the boundary is untrusted**; **layers with clear contracts**; **make illegal states unrepresentable**; **fail safe, not open**; **least privilege**; and **measure first, design for failure**. AI is used as **draft → verify (type-check + test/run + measure) → log**.

## How You Work Here

| Step | What it means |
|------|---------------|
| Pick up a ticket | Each lesson is an engineering ticket (`AUTH-3001`, `API-4001`, …) with acceptance criteria |
| Build in layers | Controller (HTTP) / service (logic) / repository (data), with clear contracts |
| Type-check | `tsc --noEmit` against `@types/node` — broken contracts are compile errors |
| Test the logic | Service rules, validators, policy, auth (real `node:crypto`), jobs, ops run in Node |
| Verify endpoints | A real in-process HTTP server hit with `fetch` — status codes, idempotency, 401/403, 429, readiness |
| Verify AI | Draft → verify (type-check + test/run + measure) → log |

## Learning Outcomes

By the end you will be able to:
- Design resource-oriented REST APIs with honest status codes and typed contracts.
- Structure a backend into controller / service / repository layers with logic testable without HTTP.
- Validate every request at the boundary and reject bad input with structured errors.
- Authenticate requests with salted/slow-hashed passwords and signed, expiring tokens, failing safe.
- Authorize with role- and ownership-based rules under least privilege (403 vs 401).
- Establish API platform standards: a consistent error envelope, pagination, idempotency, rate limiting.
- Move slow work to a background queue with bounded retries, backoff, idempotency, and dead-lettering.
- Make a service operationally ready: liveness/readiness, structured logs, env config, graceful shutdown.
- Ship a coherent, strict-typed backend platform with evidence for each quality bar.

## Lesson Index

| # | Lesson | Competency | Ticket |
|---|--------|-----------|--------|
| 0 | Welcome to the Backend Engineering Team | Backend Orientation | BE-1000 |
| 1 | Replace the Mock API | REST APIs & Controllers | API-1010 |
| 2 | Organize the Service Layer | Layered Architecture | ARCH-2001 |
| 3 | Stop Invalid Requests at the Door | Validation | VAL-2010 |
| 4 | Authenticate Every Request | Authentication | AUTH-3001 |
| 5 | Stop Unauthorized Access | Authorization | AUTHZ-3010 |
| 6 | Build a Reliable API Platform | API Platform Standards | API-4001 |
| 7 | Move Work Off the Request | Background Processing | JOB-4010 |
| 8 | Pass the Production Readiness Review | Operational Readiness | OPS-5001 |
| 9 | Project Forge Platform Release | Platform Release | FORGE-9400 |

Phases: **Foundations** (0) → **API Foundations** (1–3) → **Security** (4–5) → **Platform** (6–7) → **Quality & Production** (8) → **Capstone** (9).

## Repository Layout

```
.
├── README.md                      # this file
├── MODULE_SYLLABUS.md             # pacing, structure, deliverables
├── LEARNER_GUIDE.md               # how to operate as a backend engineer here
├── INSTRUCTOR_GUIDE.md            # facilitation and assessment
├── COMPETENCY_MATRIX.md           # lesson → competency → skills
├── ASSESSMENT_RUBRIC.md           # grading weights and performance levels
├── dashboard.html                 # interactive progress dashboard (open in a browser)
├── Lesson_00.md … Lesson_09.md    # the 10 lessons
├── labs/                          # hands-on labs (type-checked; logic + auth Node-tested; endpoints verified)
├── solutions/                     # worked solutions / answer keys
├── resources/                     # setup, REST, architecture, validation, auth, authz, platform, jobs, ops + more
├── assignments/                   # submission templates + capstone brief
└── instructor-notes/              # per-lesson facilitation notes
```

## Getting Started

1. Read `resources/backend-setup-guide.md`; set up the Node + TypeScript toolchain and the verify loop (Lesson 0 / `labs/lab-00-setup.md`).
2. Start your engineering notebook from `resources/engineering-notebook-template.md`.
3. Open `dashboard.html` in your browser to track progress through the lessons and phases.
4. Open `Lesson_00.md` and pick up your first ticket. Keep the relevant `resources/` references open as you build.

**Verification.** Type-check contracts with `tsc --noEmit` (+`@types/node`); run pure logic and auth with `node file.mjs` (real `node:crypto`); exercise endpoints with a real in-process HTTP server hit by `fetch` — no external services needed. Note `tsc file.ts` ignores `tsconfig.json` — use `--noEmit` or `-p`.
