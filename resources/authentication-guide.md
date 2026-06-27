# Authentication Guide

> Security-critical. Use real crypto primitives; never roll your own.

## Passwords: salted, slow hash; constant-time verify
```ts
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
const salt = randomBytes(16);
const dk = scryptSync(pw, salt, 32);            // store `${salt}:${dk}`
// verify:
timingSafeEqual(scryptSync(pw, salt, 32), stored);   // constant-time, NEVER ===
```
Slowness defeats brute force; a per-password salt defeats rainbow tables; `timingSafeEqual` defeats timing attacks.

## Signed tokens (JWT-style HMAC)
`header.payload.signature`, signature = HMAC-SHA256 over `header.payload` with a server secret.
```ts
const sig = createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
```
**Verify the signature (constant-time) BEFORE trusting the payload.** Check `exp`. The payload is readable — it's integrity-protected, not secret, so put no secrets in it.

## Verify on every protected request
Middleware reads `Authorization: Bearer <token>`, verifies, attaches `req.user` — or returns **401**.

## Fail safe, not open
Missing / malformed / tampered / expired → 401, no identity, stop. Never "assume a user" on failure. A token is an identity *only after* verification.

## Gotchas
- Plaintext or fast/unsalted hashes (MD5/SHA-1).
- `===` secret comparison (timing leak).
- Trusting the payload before verifying; no expiry; secrets in source or in the token body.
