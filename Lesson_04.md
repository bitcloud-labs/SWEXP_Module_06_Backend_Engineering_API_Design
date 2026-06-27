# Lesson 04 — Authenticate Every Request

> **Role:** Backend Software Engineer · **Competency:** Authentication · **Track:** AUTH · **Est. time:** 4 hours

---

## 🎫 Engineering Ticket

```
TICKET:      AUTH-3001
TITLE:       Anyone can call the API as anyone; add authentication
PRIORITY:    P0 — security
TYPE:        Feature
DESCRIPTION: The Orders API has no notion of who is calling. Add authentication:
             securely store passwords, issue a signed token on login, and verify
             that token on every protected request so the service knows the
             authenticated identity. Never store plaintext passwords or trust an
             unverified token.

ACCEPTANCE CRITERIA:
  - Passwords stored using a salted, slow hash (never plaintext/fast hash)
  - Login verifies credentials and issues a signed token
  - Protected endpoints verify the token and attach the identity to the request
  - Tampered, expired, or missing tokens are rejected with 401
```

## 🏢 Business Context

Authentication answers "who is making this request?" — the foundation everything else (authorization, auditing, rate limits per user) builds on. Get it wrong and the consequences are catastrophic and irreversible: leaked password databases, forged identities, account takeover. This is security-critical code where the rule is **fail safe, not open**: an unverified token is no identity, not a trusted one. You'll use real cryptographic primitives, because rolling your own is how breaches happen.

## 🎯 Learning Objectives

- Store passwords with a salted, slow hash and verify them in constant time
- Issue a signed token on successful login
- Verify the token on protected requests and attach the identity
- Reject tampered, expired, or missing tokens with 401

## 📚 Technical Deep Dive

**Never store plaintext.** Hash passwords with a *slow, salted* algorithm (scrypt, bcrypt, argon2). Slowness is the point — it makes brute-forcing a stolen database expensive. A unique random salt per password defeats rainbow tables.

```ts
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
function hashPassword(pw: string): string {
  const salt = randomBytes(16);
  const dk = scryptSync(pw, salt, 32);
  return `${salt.toString('hex')}:${dk.toString('hex')}`;
}
function verifyPassword(pw: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  const dk = scryptSync(pw, Buffer.from(saltHex, 'hex'), 32);
  return timingSafeEqual(dk, Buffer.from(hashHex, 'hex'));   // constant-time compare
}
```
Use `timingSafeEqual`, never `===`, to compare secrets — a normal compare leaks length/contents via timing.

**Signed tokens.** On login, issue a token whose integrity you can verify without a session store. A JWT is a base64url `header.payload.signature` where the signature is an HMAC over `header.payload` with a server secret:

```ts
import { createHmac } from 'node:crypto';
function sign(payload: object, secret: string): string {
  const h = b64url({ alg: 'HS256', typ: 'JWT' });
  const p = b64url({ ...payload, exp: Math.floor(Date.now()/1000) + 3600 });
  const sig = createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  return `${h}.${p}.${sig}`;
}
function verify(token: string, secret: string): Payload | null {
  const [h, p, sig] = token.split('.');
  const expected = createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  if (sig !== expected) return null;                    // tampered → no identity
  const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
  if (payload.exp < Math.floor(Date.now()/1000)) return null;   // expired
  return payload;
}
```

**Verify on every protected request.** An auth middleware reads `Authorization: Bearer <token>`, verifies it, and attaches the identity (`req.user`) — or returns 401. The payload is *not* trusted until the signature is verified; a token is only an identity *after* verification.

**Fail safe.** Missing, malformed, tampered, or expired token → 401, no identity, request stops. Never "assume a user" when verification fails. Don't put secrets in the token payload (it's readable); the signature guarantees integrity, not secrecy.

### Common gotchas
- Plaintext or fast-hashed (MD5/SHA-1, unsalted) passwords.
- Comparing secrets with `===` (timing leak) instead of `timingSafeEqual`.
- Trusting the token payload before verifying the signature.
- No expiry; secrets hardcoded in source; secrets in the token body.

## 🧪 Hands-on Labs

Work through **`labs/lab-04-auth.md`**. You'll implement password hashing/verification with `node:crypto` scrypt and a signed-token sign/verify with HMAC, then add an auth middleware. Everything is unit-tested in Node with **real crypto**: a correct password verifies and a wrong one is rejected; a valid token round-trips; and a tampered signature, wrong secret, or expired token all yield no identity (401).

## 🔍 Engineering Investigation

Hash the same password twice and confirm the stored values differ (salting). Tamper with one character of a token's payload and confirm verification fails. Let a token expire (short exp) and confirm rejection. Record each as evidence that the design fails safe.

## 🤖 AI Engineering Exercise

Ask an AI to "add login and JWT auth." **Verify** passwords are salted+slow-hashed, secrets compared in constant time, the token signature is verified *before* trusting the payload, and tokens expire. **Log** any plaintext/fast hash, `===` comparison, or trust-before-verify the AI produced and your fix.

## 📝 Assignment

Submit: password hashing/verification and token sign/verify (using real crypto), the auth middleware attaching identity, passing Node tests covering correct/wrong passwords and valid/tampered/expired/wrong-secret tokens, and a note on each way the design fails safe.

## 🚀 Stretch Goal

Add refresh tokens (short-lived access + longer-lived refresh) or token revocation, and explain the trade-off between stateless tokens and the ability to revoke.

## ✅ Definition of Done

- [ ] Passwords salted + slow-hashed; verified in constant time
- [ ] Login issues a signed, expiring token
- [ ] Protected endpoints verify the token and attach identity
- [ ] Tampered/expired/missing tokens rejected with 401 (fail safe)
- [ ] Auth logic unit-tested with real crypto

## 🪞 Reflection

Where was the temptation to take a shortcut that would "work" but be insecure (fast hash, `===`, trusting the payload)? Why is "fail safe, not open" the only acceptable default for auth?
