# Assignments — Backend Engineering & API Design

Each lesson has an assignment described in its `Lesson_NN.md`. Submit every one using `submission-template.md`, and back every claim with evidence — `tsc --noEmit` for contracts, Node tests for logic/auth, real requests for endpoints.

| File | Purpose |
|------|---------|
| `submission-template.md` | per-lesson submission format |
| `capstone-brief.md` | the full FORGE-9400 platform-release specification |
| `capstone-submission-template.md` | the capstone release-report format |

## What every submission must include
- **What you built** and *why this shape* — which layer logic lives in, how the boundary is validated, how security fails safe, what's idempotent.
- **Evidence:** the type-check result and confirmed contract errors; Node test output (service rules / validators / policy / auth with real crypto / jobs / ops); endpoint request/response transcripts (status codes, idempotency, 401/403, 429, readiness).
- **The fix at the cause** — no `any`, no silenced errors, no trusting input.
- **AI-usage log:** draft → verify (type-check + test/run + measure) → log.
- **Clean commits** (your Module 02 Git skills apply).

## Grading
Against `../ASSESSMENT_RUBRIC.md`. The recurring standard: **the boundary is untrusted; layers with clear contracts; make illegal states unrepresentable; fail safe, not open; least privilege; measure first, design for failure.**
