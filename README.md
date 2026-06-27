# SWEXP Module 06 — Backend Engineering & API Design · Starter Workspace

This repo is your **work-along workspace** for Module 06. The lessons live in the LMS; here you do the
labs and the capstone: open an exercise, read its `README.md`, implement the `// TODO`s in its `src/`,
run the tests, and submit.

> **The tests are the spec.** Each exercise's `tests/` describes exactly what your code must do — make
> them pass without weakening the types (no `any`, no `as` to lie about a shape, no `@ts-ignore`). No answer
> keys are shipped.

Every exercise is **pure handler/logic** — request validation, status-code decisions, auth/permission
checks, pagination, error envelopes, retry/queue logic. You never need to boot a real server or hit the
network; you test the decisions a server makes by calling functions directly.

## Quick start

```bash
npm install            # one time (already done in your LMS code-server workspace)
npm test               # run every exercise's behaviour tests
npm run test:types     # add the type-level checks (expectTypeOf)
npm run check          # strict type-check — "the compiler is your first reviewer"
npm run grade          # your score + per-exercise breakdown (what CI reports)
```

Run a single exercise while you work on it:

```bash
npx vitest run labs/lab-04-auth      # or any folder below
npx vitest watch labs/lab-04-auth    # re-run on save
```

## Exercises

| Exercise | Folder | You implement |
| --- | --- | --- |
| Lab 00 — Toolchain & minimal service | `labs/lab-00-setup` | `handleRequest` — `/health` 200, else 404 |
| Lab 01 — REST API | `labs/lab-01-rest-api` | typed controllers + a thin router (200/201/404/400/405) |
| Lab 02 — Service layer | `labs/lab-02-service-layer` | `OrderService` + repository; domain errors → status codes |
| Lab 03 — Boundary validation | `labs/lab-03-validation` | `validateCreateOrder` — narrow `unknown` → typed/issues |
| Lab 04 — Authentication | `labs/lab-04-auth` | scrypt passwords + HMAC tokens; fail safe |
| Lab 05 — Authorization | `labs/lab-05-authz` | role + ownership policy; 401 vs 403 |
| Lab 06 — API platform | `labs/lab-06-api-platform` | error envelope, pagination, idempotency, rate limit |
| Lab 07 — Background jobs | `labs/lab-07-jobs` | retry/backoff queue, DLQ, idempotent job |
| Lab 08 — Operational readiness | `labs/lab-08-ops` | readiness, config-at-boot, log redaction, drain |
| Capstone — Forge backend | `assignments/capstone` | integrate it all into one strict module |

Each folder is self-contained: a `README.md` (the brief), `src/` (starter code with `// TODO`s), and
`tests/` (the spec). Reference guides are in [`resources/`](resources/).

## How grading & submission work

- Every exercise contributes tests — behaviour (`*.test.ts`) and, for the capstone, type-level assertions
  (`*.test-d.ts`). `npm run grade` reports a per-exercise score plus a strict type-check gate.
- **Submit** by committing your changes and pushing (or opening a pull request). The **Autograde** GitHub
  Action runs the same grader, posts your score to the run summary, and comments it on any PR.
- You're done when the score is **100%** and the type-check is clean.

## The rules of this module

- The boundary is **untrusted** — parse, don't trust; only typed data reaches the service.
- Layers have clear contracts — business logic is testable without HTTP or a DB.
- **Fail safe, not open** — a wrong password or bad token yields no identity; deny by default.
- Least privilege; honest status codes; one consistent error envelope.
- The compiler is your first reviewer — a claim that doesn't type-check isn't true, and `any` is never the fix.
