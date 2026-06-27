import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  authenticate,
} from '../src/auth';

const SECRET = 'unit-test-secret-value';

describe('lab 04 — passwords (real scrypt + salt)', () => {
  it('verifies the correct password', () => {
    const stored = hashPassword('hunter2');
    expect(verifyPassword('hunter2', stored)).toBe(true);
  });

  it('rejects the wrong password', () => {
    const stored = hashPassword('hunter2');
    expect(verifyPassword('Hunter2', stored)).toBe(false);
    expect(verifyPassword('', stored)).toBe(false);
  });

  it('salts: the same password hashes to two different stored values', () => {
    expect(hashPassword('same')).not.toBe(hashPassword('same'));
  });

  it('stored format is saltHex:hashHex (no plaintext)', () => {
    const stored = hashPassword('hunter2');
    expect(stored).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
    expect(stored).not.toContain('hunter2');
  });
});

describe('lab 04 — signed tokens (HMAC, verify before trust)', () => {
  it('a valid token round-trips to its payload', () => {
    const token = signToken({ sub: 'u-1', role: 'admin' }, SECRET);
    const payload = verifyToken(token, SECRET);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('u-1');
    expect(payload?.role).toBe('admin');
    expect(typeof payload?.exp).toBe('number');
  });

  it('a tampered signature yields no identity', () => {
    const token = signToken({ sub: 'u-1', role: 'admin' }, SECRET);
    const tampered = token.slice(0, -2) + (token.endsWith('aa') ? 'bb' : 'aa');
    expect(verifyToken(tampered, SECRET)).toBeNull();
  });

  it('a wrong secret yields no identity', () => {
    const token = signToken({ sub: 'u-1', role: 'admin' }, SECRET);
    expect(verifyToken(token, 'other-secret')).toBeNull();
  });

  it('an expired token yields no identity', () => {
    const expired = signToken({ sub: 'u-1', role: 'admin' }, SECRET, -10);
    expect(verifyToken(expired, SECRET)).toBeNull();
  });

  it('a malformed token yields no identity', () => {
    expect(verifyToken('not.a.token.at.all', SECRET)).toBeNull();
    expect(verifyToken('nonsense', SECRET)).toBeNull();
  });
});

describe('lab 04 — auth middleware fails safe', () => {
  it('200 + user for a valid Bearer token', () => {
    const token = signToken({ sub: 'u-1', role: 'customer' }, SECRET);
    const res = authenticate(`Bearer ${token}`, SECRET);
    expect(res.status).toBe(200);
    expect(res.user?.sub).toBe('u-1');
  });

  it('401 + null for missing, malformed, or tampered tokens', () => {
    expect(authenticate(undefined, SECRET)).toEqual({ status: 401, user: null });
    expect(authenticate('Token abc', SECRET)).toEqual({ status: 401, user: null });
    expect(authenticate('Bearer not-a-token', SECRET)).toEqual({ status: 401, user: null });
  });
});
