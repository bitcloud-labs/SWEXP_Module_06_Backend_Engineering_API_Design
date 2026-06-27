# Lesson 09 — Project Forge Platform Release

> **Role:** Backend Software Engineer · **Competency:** Platform Release · **Track:** CAP · **Est. time:** 16–20 hours

---

## 🎫 Engineering Ticket

```
EPIC:        FORGE-9400
TITLE:       Ship the production Project Forge backend platform
PRIORITY:    P1 — module capstone
TYPE:        Epic (integrative)
DESCRIPTION: You own shipping the Forge backend that powers the Module 05
             frontend. Integrate everything: a layered REST API, boundary
             validation, authentication and authorization, platform standards
             (consistent errors, pagination, idempotency, rate limiting),
             background processing, and operational readiness — under strict
             TypeScript. Ship a coherent platform and a release report that proves
             each quality bar with evidence.

ACCEPTANCE CRITERIA: (full mapping in assignments/capstone-brief.md)
  - Layered architecture: controller → service → repository, business logic testable without HTTP
  - Resource-oriented REST with honest status codes and a consistent error envelope
  - Every request validated at the boundary; only typed data reaches services
  - Authentication (salted/slow-hashed passwords, signed expiring tokens) and authorization (role + ownership, least privilege)
  - Platform standards: pagination, idempotency for unsafe retries, rate limiting
  - Background processing with bounded retries, backoff, idempotency, dead-lettering
  - Operational readiness: liveness/readiness, structured correlated logs, env config, graceful shutdown
  - Strict TypeScript throughout; a release report proves each bar with evidence
```

## 🏢 Business Context

This is the job: take the API from "works on a laptop" to a platform that is correct, secure, reliable, and operable — one other teams (including the Module 05 frontend) can build on. Shipping a backend is an exercise in integration and judgment: the layers, the security model, the platform standards, and the operational concerns all interact, and the security and reliability bars can't be bolted on at the end. Any one pattern is straightforward; composing them into a release you'd put on call for is the skill.

## 🎯 Learning Objectives

Integrate every module competency into a shippable platform: a layered REST API; boundary validation; authentication and authorization; platform standards (errors, pagination, idempotency, rate limiting); background processing; and operational readiness — all under strict TypeScript and evidence-based documentation.

## 📚 Technical Deep Dive

No new concepts — the capstone tests **integration, architecture, security, and judgment.** The full specification, the platform scope, the recommended build order, and the acceptance-criteria → rubric mapping live in **`assignments/capstone-brief.md`**; read it first and trace each criterion to the evidence you'll produce.

A sound build order (detailed in the brief):

1. **REST + layers** — resource-oriented endpoints over controller → service → repository (Lessons 1, 2).
2. **Validation** — schema validation at the boundary; only typed data into services (Lesson 3).
3. **Security** — authentication then authorization (role + ownership, least privilege) (Lessons 4, 5).
4. **Platform standards** — consistent error envelope, pagination, idempotency, rate limiting (Lesson 6).
5. **Background processing** — move slow work to a queue with retries/backoff/idempotency/DLQ (Lesson 7).
6. **Operational readiness & release** — health/readiness, structured logs, env config, graceful shutdown; assemble the release report (Lesson 8).

Keep it type-checking and the service tests green throughout; commit in small, verified increments.

## 🧪 Hands-on Labs

The capstone *is* the lab. The endpoints, the Orders domain, the auth, and the jobs reuse the earlier lab generators, so you ship a real platform rather than a toy, and the evidence (service tests, end-to-end requests, security checks) is reproducible.

## 🔍 Engineering Investigation

Investigation is the deliverable. The release report must show, with evidence: the layered architecture (service tests run without HTTP); the REST contract and consistent error envelope; boundary validation rejecting bad input before the service; authentication failing safe (tampered/expired tokens → 401) and authorization enforcing role + ownership (403 vs 401); platform standards (a retried unsafe op acts once; over-limit → 429); background processing (transient recovers, permanent → DLQ); and operational readiness (readiness reflects a downed dependency, logs correlate, missing config fails fast, shutdown drains). End with a "production-readiness" summary: what each bar guarantees and how you verified it.

## 🤖 AI Engineering Exercise

Use AI throughout as a professional would — to draft a controller, a service, a validator, an auth helper, a job — **but every use follows draft → verify (type-check + test/run + measure) → log.** Maintain an AI-usage log. The recurring failures to catch: trusting `req.body`, plaintext/fast-hashed passwords, `===` secret comparison, trust-before-verify tokens, allow-by-default authorization, non-idempotent retries, unbounded job retries, dependency checks in liveness, and secrets in logs. The compiler, the tests, and the security checks are the arbiters.

## 📝 Assignment

Ship the Forge backend per `assignments/capstone-brief.md`, using `assignments/capstone-submission-template.md`. Your submission is the working, strict-typed platform plus a **release report** proving each quality bar with evidence, and the engineering notebook (including the AI-usage log).

## 🚀 Stretch Goal

Go beyond the brief in one production-grade way a real team would value — e.g. an OpenAPI spec generated from the types, contract tests against the Module 05 frontend's expectations, a real database behind the repository interface, audit logging, or a CI gate (type-check + tests + lint) — and justify it with evidence.

## ✅ Definition of Done

- [ ] Layered architecture; business logic testable without HTTP
- [ ] Resource-oriented REST; honest status codes; consistent error envelope
- [ ] Every request validated at the boundary; only typed data into services
- [ ] Authentication (salted/slow hash, signed expiring tokens) failing safe
- [ ] Authorization (role + ownership, least privilege); 403 vs 401 correct
- [ ] Platform standards: pagination, idempotency, rate limiting
- [ ] Background processing: bounded retries, backoff, idempotency, DLQ
- [ ] Operational readiness: liveness/readiness, structured logs, env config, graceful shutdown
- [ ] Strict TypeScript; release report + notebook + AI log complete and reproducible

## 🪞 Reflection

Which integration decision had the widest blast radius across the platform? Where did a security or reliability bar force a change you'd have skipped under time pressure — and why was building it in cheaper than bolting it on?
