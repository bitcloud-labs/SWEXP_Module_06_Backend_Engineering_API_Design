# Lab 07 — Move Work Off the Request

**Ticket:** JOBS-7001 · **Goal:** a job queue with bounded retries + exponential backoff, idempotent jobs, and a dead-letter queue.

## What you do
In [`src/jobs.ts`](src/jobs.ts):

- **`nextDelayMs` / `shouldRetry`** — exponential backoff (`base * 2^attempt`, capped) and a bounded
  retry decision.
- **`JobQueue.processOne(handler)`** — run a job; on a transient throw, re-enqueue with `attempts+1`
  while attempts remain (`retried`), otherwise move it to `deadLetter` (`dead-lettered`). An empty queue →
  `empty`. **No infinite loops.**
- **`sendOrderEmail(orderId, sent)`** — an idempotent job: at-least-once delivery means a re-run must be a
  no-op. Send once, record it, no-op thereafter.

Run:
```bash
npx vitest run labs/lab-07-jobs
```

## Definition of done
- All tests pass; `npm run check` clean.
- In your notebook, note what you moved off the request path and why.

## Submit
Edit `src/`, run the tests, commit and push.
