# Lab 07 — Move Work Off the Request

**Lesson:** 07 · **Goal:** a job queue with bounded retries + exponential backoff, idempotent jobs, and a dead-letter queue — verified.

## Goal
Move slow work to a background queue that recovers from transient failures, never loops forever, and is safe to run more than once.

## Setup
```bash
cd /tmp/swexp-be
cat > jobs.ts <<'TS'
// --- retry/backoff policy (pure) ---
export function nextDelayMs(attempt: number, baseMs = 1000, capMs = 60000): number {
  return Math.min(capMs, baseMs * 2 ** attempt);   // 1s, 2s, 4s, … capped
}
export function shouldRetry(attempt: number, maxAttempts: number): boolean {
  return attempt < maxAttempts;
}

export interface Job { id: string; type: string; payload: unknown; attempts: number; }

// --- a minimal queue with retry + dead-letter ---
export class JobQueue {
  private queue: Job[] = [];
  readonly deadLetter: Job[] = [];
  constructor(private maxAttempts = 3) {}
  enqueue(job: Omit<Job, 'attempts'>): void { this.queue.push({ ...job, attempts: 0 }); }
  size(): number { return this.queue.length; }
  // process one job with a handler that may throw on transient failure
  async processOne(handler: (job: Job) => Promise<void>): Promise<'done' | 'retried' | 'dead-lettered' | 'empty'> {
    const job = this.queue.shift();
    if (!job) return 'empty';
    try { await handler(job); return 'done'; }
    catch {
      const attempts = job.attempts + 1;
      if (shouldRetry(attempts, this.maxAttempts)) { this.queue.push({ ...job, attempts }); return 'retried'; }
      this.deadLetter.push({ ...job, attempts }); return 'dead-lettered';
    }
  }
}
TS
echo "Make a job idempotent; unit-test recover/DLQ/duplicate; note what you moved off the request."
```

## Tasks
1. **Enqueue, return fast.** The create-order handler saves the order (critical), enqueues `sendOrderEmail` (deferred), and returns 201 — the email is not on the request path.
2. **Bounded retries + backoff.** Use `shouldRetry`/`nextDelayMs`. A transient failure retries (with increasing delay) up to `maxAttempts`.
3. **Idempotent jobs.** `sendOrderEmail` checks "already sent for this order?" before sending, so a re-run is a no-op (at-least-once delivery makes this mandatory).
4. **Dead-letter.** A job that fails every attempt lands in `deadLetter` after `maxAttempts` — no infinite loop.
5. **Unit-test in Node:** a job that fails twice then succeeds recovers; a job that always fails is dead-lettered after `maxAttempts`; a duplicate run is a no-op; the backoff delays are `1s,2s,4s…` capped.

## Deliverable
The queue + retry/backoff policy + idempotent job + DLQ; passing Node tests (transient recovers, permanent → DLQ after max attempts, duplicate run no-ops, correct backoff); and a note on what you moved off the request and why.

## Cleanup
```bash
rm -f /tmp/swexp-be/jobs.ts
```

## Check
`../solutions/lab-07-solution.md`.
