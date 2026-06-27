/**
 * Lab 04 — Authenticate Every Request. See README.md.
 *
 * Real cryptographic primitives — no home-grown crypto, no plaintext passwords.
 *  - Passwords: per-password salt + scrypt (slow) + constant-time compare.
 *  - Tokens:    HMAC-SHA256 over `header.payload`; VERIFY before trusting; check `exp`.
 *
 * The design must FAIL SAFE: a wrong password or a bad token yields NO identity.
 * No `any`.
 */
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'node:crypto';

// --- passwords ---------------------------------------------------------------

/** Hash a password as `saltHex:hashHex`. A fresh random salt every call. */
export function hashPassword(pw: string): string {
  // TODO: 16-byte random salt; scryptSync(pw, salt, 32); return `${saltHex}:${hashHex}`.
  return '';
}

/** Verify a password against a stored `saltHex:hashHex`, in constant time. */
export function verifyPassword(pw: string, stored: string): boolean {
  // TODO: split stored into salt + hash; re-derive with scryptSync; compare with
  //       timingSafeEqual (guard against length mismatch first). Return false on any malformed input.
  return false;
}

// --- signed tokens -----------------------------------------------------------

export interface TokenPayload {
  sub: string;
  role: string;
  exp: number; // unix seconds
}

function b64url(o: object): string {
  return Buffer.from(JSON.stringify(o)).toString('base64url');
}

/** Sign `{ sub, role }` into `header.payload.signature`, expiring in `ttlSec` seconds. */
export function signToken(payload: Omit<TokenPayload, 'exp'>, secret: string, ttlSec = 3600): string {
  // TODO: header = { alg:'HS256', typ:'JWT' }; payload gets exp = now + ttlSec;
  //       sig = HMAC-SHA256(secret) over `${h}.${p}` as base64url; return `${h}.${p}.${sig}`.
  return '';
}

/**
 * Verify a token and return its payload, or `null` on ANY failure
 * (malformed, tampered signature, wrong secret, expired).
 * Recompute and compare the HMAC in constant time BEFORE parsing the payload as an identity.
 */
export function verifyToken(token: string, secret: string): TokenPayload | null {
  // TODO: split into 3 parts; recompute expected sig; timingSafeEqual (length-guard);
  //       only then JSON.parse the payload; reject if exp < now. Return null on any failure.
  return null;
}

// --- middleware --------------------------------------------------------------

export interface AuthResult {
  status: number;
  user: TokenPayload | null;
}

/**
 * Authenticate from an `Authorization: Bearer <token>` header value (may be undefined).
 * - valid token → { status: 200, user }
 * - missing / malformed / tampered / expired → { status: 401, user: null }
 * Never assume a user. Fail safe.
 */
export function authenticate(authorizationHeader: string | undefined, secret: string): AuthResult {
  // TODO: require a "Bearer <token>" header; verifyToken it; 200 + user, else 401 + null.
  return { status: 401, user: null };
}
