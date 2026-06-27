# Learner Guide — Backend Engineering & API Design

## You are a backend engineer shipping a platform
Every lesson is an **engineering ticket** on *Project Forge*. Approach each as real work: understand what's being asked, build it in layers with clear contracts, validate the untrusted boundary, make security fail safe, type-check the contracts, test the logic, exercise the endpoints, and document your reasoning. The goal isn't memorizing a framework — it's the architecture, security, and judgment to ship a backend a team can put on call.

## The ideas that matter most
- **The boundary is untrusted.** Validate every request before any logic runs; never trust `req.body`.
- **Layers with clear contracts.** Controller (HTTP) / service (logic, no HTTP/DB) / repository (data behind an interface).
- **Make illegal states unrepresentable** (from Module 04): typed domain, literal unions, domain errors mapped to status codes in one place.
- **Fail safe, not open; least privilege.** Security defaults to deny; an unverified token is no identity.
- **Measure first, design for failure** (from Module 03): health/readiness, retries/backoff, dead-lettering, graceful shutdown.

## How each lesson works
1. **Read the ticket and the deep dive.**
2. **Do the lab.** Build it, **predict** the type-check/test/status-code result, then verify.
3. **Investigate** — push from "it returns 200" to "I can show the bad input rejected before the service, the token failing safe, the 403-vs-401, the idempotent retry acting once, the readiness flipping when a dependency dies."
4. **Run the AI exercise** — draft → verify → log, deliberately.
5. **Submit the assignment** and **update your notebook.**
6. **Check the solution** to validate your reasoning — after you've done the work.

Track progress in `dashboard.html`.

## What every assignment must include
- **What you built** and *why this shape* — which layer holds the logic, how the boundary is validated, how security fails safe, what's idempotent.
- **Evidence:** the type-check result and confirmed contract errors; Node test output (logic + auth via real crypto); endpoint request/response transcripts (status codes, idempotency, 401/403, 429, readiness).
- **The fix at the cause** — no `any`, no silenced errors, no trusting input.
- **AI-usage log:** draft → verify → log.
- **Clean commits** (Module 02 habits).

## Using AI responsibly
AI drafts fast and confidently, and is sometimes wrong in ways that are *dangerous* on a backend — trusting input, fast-hashing passwords, trusting a token before verifying, allow-by-default authorization. You have three mechanical checks: the type-checker, Node tests (auth with real crypto), and real requests. `resources/ai-workflow-guide.md` maps the failure modes.

## The standard
A contract that doesn't type-check isn't done; a security claim without a test isn't proven; an endpoint behavior without a real request isn't verified. The compiler, the tests, and the requests are the arbiters — not confidence. **Fail safe, not open**, and prove it.

## How you're graded
Against `ASSESSMENT_RUBRIC.md` — on architecture, security, API platform quality, data, background processing, and operations, with evidence. An endpoint that returns 200 but trusts its input, fast-hashes passwords, or authorizes by default scores poorly regardless of the happy path.
