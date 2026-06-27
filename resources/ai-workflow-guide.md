# AI Workflow Guide — Draft → Verify → Log

Backend work gives you three mechanical verifiers: the **type-checker** (contracts), **tests** (logic + auth via real `node:crypto`), and **real requests** (endpoint behavior via an in-process server + `fetch`). Use them — don't take the AI's word, especially on security.

## The loop
1. **Draft.** Ask the AI for a controller, service, validator, auth helper, policy, or job.
2. **Verify.**
   - **Type-check** (`tsc --noEmit`) — broken contracts, untyped boundaries are caught.
   - **Test** the pure logic in Node (service rules, validators, policy, backoff, ops). Auth uses **real crypto**.
   - **Exercise** the endpoint with real requests (status codes, idempotency, 401/403, 429, readiness).
3. **Log.** Record what you asked, what each verifier said, where the AI was right, where it was overruled.

## Where AI most often goes wrong here (and it's dangerous)
- Trusts `req.body` instead of validating at the boundary.
- Plaintext or fast/unsalted password hashes; `===` secret comparison.
- Trusts a token payload **before** verifying the signature; no expiry.
- Allow-by-default authorization; role checked but not ownership.
- Non-idempotent retries / unbounded job retries / no dead-letter.
- Dependency checks in liveness; secrets in logs; no graceful shutdown.

## The golden rule
A contract that doesn't type-check isn't done; a security claim without a test isn't proven; an endpoint behavior without a real request isn't verified. The compiler, the tests, and the requests are the arbiters — not confidence. Security code especially: **fail safe, not open**, and prove it.
