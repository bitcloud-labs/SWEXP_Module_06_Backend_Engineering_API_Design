import { describe, it, expect } from 'vitest';
import { aggregateReadiness, loadConfig, redact, shouldKeepDraining } from '../src/ops';

describe('lab 08 — readiness aggregation', () => {
  it('ready only when every check passes', () => {
    expect(aggregateReadiness({ db: true, cache: true })).toEqual({
      ready: true,
      checks: { db: true, cache: true },
    });
    expect(aggregateReadiness({ db: true, cache: false }).ready).toBe(false);
  });
  it('an empty set of checks is vacuously ready', () => {
    expect(aggregateReadiness({}).ready).toBe(true);
  });
});

describe('lab 08 — config validation at boot', () => {
  it('fails fast listing missing vars', () => {
    const r = loadConfig({ PORT: '3000' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.missing).toEqual(['DATABASE_URL', 'JWT_SECRET']);
  });
  it('succeeds with all required vars and parses port to a number', () => {
    const r = loadConfig({ PORT: '8080', DATABASE_URL: 'postgres://x', JWT_SECRET: 's' });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.config).toEqual({ port: 8080, dbUrl: 'postgres://x', jwtSecret: 's' });
      expect(typeof r.config.port).toBe('number');
    }
  });
});

describe('lab 08 — log redaction', () => {
  it('redacts secret-ish keys, case-insensitively, keeps the rest', () => {
    const out = redact({
      requestId: 'r-1',
      Authorization: 'Bearer abc',
      password: 'p',
      TOKEN: 't',
      user: 'ada',
    });
    expect(out.requestId).toBe('r-1');
    expect(out.user).toBe('ada');
    expect(out.Authorization).toBe('[REDACTED]');
    expect(out.password).toBe('[REDACTED]');
    expect(out.TOKEN).toBe('[REDACTED]');
  });
  it('does not mutate the original entry', () => {
    const entry = { token: 'secret' };
    redact(entry);
    expect(entry.token).toBe('secret');
  });
});

describe('lab 08 — graceful shutdown drain', () => {
  it('drains while work remains and under the deadline', () => {
    expect(shouldKeepDraining(3, 500, 5000)).toBe(true);
  });
  it('stops when idle', () => {
    expect(shouldKeepDraining(0, 100, 5000)).toBe(false);
  });
  it('stops at the deadline even with work left', () => {
    expect(shouldKeepDraining(2, 5000, 5000)).toBe(false);
    expect(shouldKeepDraining(2, 6000, 5000)).toBe(false);
  });
});
