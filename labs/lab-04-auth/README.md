# Lab 04 — Authenticate Every Request

**Ticket:** AUTHN-4001 · **Goal:** real password hashing (scrypt) and signed-token sign/verify (HMAC) that fail safe.

## What you do
In [`src/auth.ts`](src/auth.ts), implement four primitives with **real** `node:crypto`:

- `hashPassword` / `verifyPassword` — per-password 16-byte salt + `scryptSync` (32-byte key), constant-time
  compare with `timingSafeEqual`. Stored format `saltHex:hashHex`.
- `signToken` — HMAC-SHA256 over `header.payload`, with an `exp` `ttlSec` seconds out.
- `verifyToken` — recompute the HMAC and compare in **constant time before** parsing the payload as an
  identity; reject expired tokens. Return `null` on any failure.
- `authenticate` — read `Authorization: Bearer <token>`; `200 + user` on success, `401 + null` for
  missing / malformed / tampered / expired. **Never assume a user.**

Run:
```bash
npx vitest run labs/lab-04-auth
```

## Definition of done
- All tests pass (correct/wrong password; valid/tampered/wrong-secret/expired token); `npm run check` clean.
- Evidence of salting: two different hashes for one password. Note each way the design fails safe.

## Submit
Edit `src/`, run the tests, commit and push.
