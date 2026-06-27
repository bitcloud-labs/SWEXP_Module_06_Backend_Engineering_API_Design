import { describe, it, expect } from 'vitest';
import { nextDelayMs, shouldRetry, JobQueue, sendOrderEmail, type Job } from '../src/jobs';

describe('lab 07 — backoff policy', () => {
  it('is exponential and capped', () => {
    expect(nextDelayMs(0)).toBe(1000);
    expect(nextDelayMs(1)).toBe(2000);
    expect(nextDelayMs(2)).toBe(4000);
    expect(nextDelayMs(10)).toBe(60000); // capped
  });
  it('shouldRetry respects maxAttempts', () => {
    expect(shouldRetry(1, 3)).toBe(true);
    expect(shouldRetry(3, 3)).toBe(false);
    expect(shouldRetry(4, 3)).toBe(false);
  });
});

describe('lab 07 — job queue retry + dead-letter', () => {
  it('a transient failure (fails twice, then succeeds) recovers', async () => {
    const q = new JobQueue(3);
    q.enqueue({ id: 'j1', type: 'email', payload: {} });
    let calls = 0;
    const handler = async (_job: Job) => {
      calls += 1;
      if (calls < 3) throw new Error('transient');
    };
    expect(await q.processOne(handler)).toBe('retried');
    expect(await q.processOne(handler)).toBe('retried');
    expect(await q.processOne(handler)).toBe('done');
    expect(q.deadLetter).toHaveLength(0);
    expect(q.size()).toBe(0);
  });

  it('a permanent failure dead-letters after maxAttempts (no infinite loop)', async () => {
    const q = new JobQueue(3);
    q.enqueue({ id: 'j2', type: 'email', payload: {} });
    const always = async () => {
      throw new Error('permanent');
    };
    expect(await q.processOne(always)).toBe('retried'); // attempts 1
    expect(await q.processOne(always)).toBe('retried'); // attempts 2
    expect(await q.processOne(always)).toBe('dead-lettered'); // attempts 3 → DLQ
    expect(q.deadLetter).toHaveLength(1);
    expect(q.deadLetter[0]?.attempts).toBe(3);
    expect(q.size()).toBe(0);
  });

  it('processing an empty queue returns "empty"', async () => {
    const q = new JobQueue();
    expect(await q.processOne(async () => {})).toBe('empty');
  });
});

describe('lab 07 — idempotent job', () => {
  it('sends once, then no-ops on a duplicate run', () => {
    const sent = new Set<string>();
    expect(sendOrderEmail('o-1', sent)).toBe(true);
    expect(sendOrderEmail('o-1', sent)).toBe(false);
    expect(sendOrderEmail('o-2', sent)).toBe(true);
  });
});
