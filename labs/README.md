# Labs — Backend Engineering & API Design

Hands-on labs for each lesson. The platform you build is the Forge backend, carried through from lesson to lesson. Three kinds of verification run through the labs:

- **Type-check the contracts.** Controllers, services, repositories, validators, and domain types are TypeScript checked with `tsc` (with `@types/node`) — illegal states and broken contracts are compile errors (your Module 04 standard).
- **Unit-test the logic in Node.** Service business rules, validators, auth (real `node:crypto`), authorization policy, pagination/idempotency/rate-limit math, job retry/backoff, and ops logic are pure and asserted with `node` — no server or database needed.
- **Verify endpoints end-to-end.** A real in-process HTTP server (Node's built-in `http`) is started and hit with `fetch`, asserting routes, methods, and status codes behave correctly. No external services.

## How to use a lab
1. Read the matching `Lesson_NN.md` first.
2. Run the **Setup** (a generator writes files under `/tmp/swexp-be` or your project).
3. Work the **Tasks**, type-checking with `tsc --noEmit` and running the Node/HTTP tests as you go.
4. Produce the **Deliverable** for your engineering notebook (include type-check output, test results, request/response evidence).
5. Check your reasoning against `solutions/lab-NN-solution.md`.

## Ground rules
- **TypeScript everywhere.** Typed controllers, services, repositories, and domain (Module 04 standard). No `any` escape hatches.
- **The boundary is untrusted.** Validate every request; never trust `req.body`.
- **Fail safe, not open.** Security defaults to deny; an unverified token is no identity.
- **Evidence, not assertion.** Paste real `tsc` output, Node test results, or request/response transcripts.
- **`tsc --noEmit`** type-checks; `node file.mjs` runs logic and in-process HTTP tests. `tsc file.ts` ignores `tsconfig.json` — use `-p` or no file argument.

## Prerequisites
- **Node.js** (`node --version`) and **npm**.
- **TypeScript** + **Node types** (lab-00: `npm i -D typescript @types/node`).
- Node 18+ for global `fetch` (used to exercise the in-process server). `node:crypto` is built in (used for auth).

## Lab index
| # | Lab | Focus |
|---|-----|-------|
| 0 | `lab-00-setup.md` | Node + TS toolchain; a minimal HTTP service |
| 1 | `lab-01-rest-api.md` | resource-oriented REST + typed controllers |
| 2 | `lab-02-service-layer.md` | controller → service → repository layers |
| 3 | `lab-03-validation.md` | boundary validation; structured 400s |
| 4 | `lab-04-auth.md` | password hashing + signed tokens (real crypto) |
| 5 | `lab-05-authz.md` | role + ownership authorization (403 vs 401) |
| 6 | `lab-06-api-platform.md` | error envelope, pagination, idempotency, rate limiting |
| 7 | `lab-07-jobs.md` | background queue: retries, backoff, idempotency, DLQ |
| 8 | `lab-08-ops.md` | liveness/readiness, structured logs, config, graceful shutdown |

The Lesson 09 capstone reuses these to ship the full Forge backend platform.
