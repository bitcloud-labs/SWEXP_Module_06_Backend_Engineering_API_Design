# Lab 04 — Authenticate Every Request

**Lesson:** 04 · **Goal:** real password hashing (scrypt) and signed-token sign/verify (HMAC); reject tampered/expired/wrong-secret tokens. Fail safe.

## Goal
Implement authentication with real cryptographic primitives and prove it fails safe: wrong passwords and bad tokens yield no identity.

## Setup
```bash
cd /tmp/swexp-be
cat > auth.ts <<'TS'
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'node:crypto';

// --- passwords: salted, slow hash; constant-time verify ---
export function hashPassword(pw: string): string {
  const salt = randomBytes(16);
  const dk = scryptSync(pw, salt, 32);
  return `${salt.toString('hex')}:${dk.toString('hex')}`;
}
export function verifyPassword(pw: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  const dk = scryptSync(pw, Buffer.from(saltHex, 'hex'), 32);
  const expected = Buffer.from(hashHex, 'hex');
  return dk.length === expected.length && timingSafeEqual(dk, expected);   // constant-time
}

// --- signed tokens: HMAC over header.payload; verify BEFORE trusting ---
export interface TokenPayload { sub: string; role: string; exp: number; }
function b64url(o: object): string { return Buffer.from(JSON.stringify(o)).toString('base64url'); }
export function signToken(payload: Omit<TokenPayload, 'exp'>, secret: string, ttlSec = 3600): string {
  const h = b64url({ alg: 'HS256', typ: 'JWT' });
  const p = b64url({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSec });
  const sig = createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  return `${h}.${p}.${sig}`;
}
export function verifyToken(token: string, secret: string): TokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, sig] = parts;
  const expected = createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(p, 'base64url').toString()) as TokenPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;   // expired
  return payload;                                                  // identity ONLY after verify
}
TS
echo "Add an auth middleware; unit-test everything with REAL crypto."
```

## Tasks
1. **Password storage.** Use `hashPassword`/`verifyPassword` (scrypt + per-password salt + `timingSafeEqual`). Confirm hashing the same password twice yields different stored values (salting).
2. **Login** verifies credentials and issues a signed, **expiring** token via `signToken`.
3. **Verify before trusting.** `verifyToken` recomputes the HMAC and compares in constant time *before* parsing the payload as an identity; checks `exp`.
4. **Auth middleware** reads `Authorization: Bearer <token>`, verifies it, attaches `req.user`, or returns **401** (missing/malformed/tampered/expired). Fail safe — never assume a user.
5. **Unit-test with real crypto:** correct vs wrong password; valid token round-trips; tampered signature, wrong secret, and expired token each → `null` (no identity).

## Deliverable
The password + token functions and the auth middleware; passing Node tests (correct/wrong password; valid/tampered/wrong-secret/expired token); evidence of salting (two different hashes for one password); and a note on each way the design fails safe.

## Cleanup
```bash
rm -f /tmp/swexp-be/auth.ts
```

## Check
`../solutions/lab-04-solution.md`.
