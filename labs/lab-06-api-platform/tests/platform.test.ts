import { describe, it, expect } from 'vitest';
import { errorEnvelope, clampLimit, IdempotencyStore, allow, type Bucket } from '../src/platform';

describe('lab 06 — error envelope', () => {
  it('produces the one true shape', () => {
    expect(errorEnvelope('not_found', 'order missing')).toEqual({
      error: { code: 'not_found', message: 'order missing' },
    });
  });
  it('omits details when undefined, includes them when present', () => {
    expect('details' in errorEnvelope('x', 'y').error).toBe(false);
    expect(errorEnvelope('bad', 'nope', { field: 'total' }).error.details).toEqual({ field: 'total' });
  });
});

describe('lab 06 — pagination clamp', () => {
  it('defaults non-finite input', () => {
    expect(clampLimit(undefined)).toBe(20);
    expect(clampLimit('abc')).toBe(20);
  });
  it('clamps to 1..100 and truncates', () => {
    expect(clampLimit(99999)).toBe(100);
    expect(clampLimit(0)).toBe(1);
    expect(clampLimit(-5)).toBe(1);
    expect(clampLimit(50)).toBe(50);
    expect(clampLimit('30')).toBe(30);
    expect(clampLimit(10.9)).toBe(10);
  });
  it('respects custom default and max', () => {
    expect(clampLimit(undefined, 5, 50)).toBe(5);
    expect(clampLimit(9999, 5, 50)).toBe(50);
  });
});

describe('lab 06 — idempotent replay', () => {
  it('runs work once and replays thereafter', () => {
    const store = new IdempotencyStore<number>();
    let calls = 0;
    const work = () => {
      calls += 1;
      return 42;
    };
    const first = store.run('k1', work);
    const second = store.run('k1', work);
    expect(first).toEqual({ result: 42, replayed: false });
    expect(second).toEqual({ result: 42, replayed: true });
    expect(calls).toBe(1); // side effect happened exactly once
  });
  it('distinct keys run independently', () => {
    const store = new IdempotencyStore<string>();
    expect(store.run('a', () => 'A').replayed).toBe(false);
    expect(store.run('b', () => 'B').replayed).toBe(false);
    expect(store.run('a', () => 'A').replayed).toBe(true);
  });
});

describe('lab 06 — token bucket', () => {
  it('allows up to capacity then denies', () => {
    const bucket: Bucket = { tokens: 2, last: 1000 };
    expect(allow(bucket, 1000, 1, 2)).toBe(true); // 2 -> 1
    expect(allow(bucket, 1000, 1, 2)).toBe(true); // 1 -> 0
    expect(allow(bucket, 1000, 1, 2)).toBe(false); // empty
  });
  it('refills over time, capped at capacity', () => {
    const bucket: Bucket = { tokens: 0, last: 1000 };
    // 2 seconds later at 1 token/sec → +2 tokens
    expect(allow(bucket, 3000, 1, 5)).toBe(true);
    // never exceeds capacity
    const full: Bucket = { tokens: 0, last: 0 };
    allow(full, 1_000_000, 1, 3); // huge gap
    expect(full.tokens).toBeLessThanOrEqual(3);
  });
});
