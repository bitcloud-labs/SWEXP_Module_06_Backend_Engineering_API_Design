/**
 * Lab 07 — Move Work Off the Request. See README.md.
 *
 * A job queue with bounded retries + exponential backoff and a dead-letter queue, plus
 * an idempotent job (at-least-once delivery makes a re-run a no-op).
 *
 * No `any`.
 */

// --- retry / backoff policy (pure) ------------------------------------------

/** Exponential backoff: baseMs * 2^attempt, capped at capMs. attempt 0 → baseMs. */
export function nextDelayMs(attempt: number, baseMs = 1000, capMs = 60000): number {
  // TODO: Math.min(capMs, baseMs * 2 ** attempt).
  return 0;
}

/** Retry while we have attempts left. */
export function shouldRetry(attempt: number, maxAttempts: number): boolean {
  // TODO: attempt < maxAttempts.
  return false;
}

export interface Job {
  id: string;
  type: string;
  payload: unknown;
  attempts: number;
}

export type ProcessOutcome = 'done' | 'retried' | 'dead-lettered' | 'empty';

/** A minimal queue with retry + dead-letter. */
export class JobQueue {
  private queue: Job[] = [];
  readonly deadLetter: Job[] = [];
  constructor(private maxAttempts = 3) {}

  /** Enqueue a new job (attempts start at 0). */
  enqueue(job: Omit<Job, 'attempts'>): void {
    // TODO: push { ...job, attempts: 0 }.
    void job;
  }

  size(): number {
    return this.queue.length;
  }

  /**
   * Process one job with a handler that may throw on transient failure.
   * - empty queue → 'empty'
   * - handler resolves → 'done'
   * - handler throws and attempts remain → re-enqueue with attempts+1, return 'retried'
   * - handler throws and no attempts remain → push to deadLetter (attempts+1), return 'dead-lettered'
   */
  async processOne(handler: (job: Job) => Promise<void>): Promise<ProcessOutcome> {
    // TODO: shift a job; try handler; on throw use shouldRetry(attempts, maxAttempts)
    //       to decide retry vs dead-letter.
    void handler;
    return 'empty';
  }
}

// --- an idempotent job -------------------------------------------------------

/**
 * Send an order email at-most-once per order. `sent` records orders already emailed.
 * Returns true if it actually sent (first time), false if it was a no-op (already sent).
 * Record the send in `sent` so a re-run is a no-op.
 */
export function sendOrderEmail(orderId: string, sent: Set<string>): boolean {
  // TODO: if already in `sent` → return false; else add and return true.
  void orderId;
  void sent;
  return false;
}
