# Lesson 07 — Move Work Off the Request

> **Role:** Backend Software Engineer · **Competency:** Background Processing · **Track:** JOB · **Est. time:** 4 hours

---

## 🎫 Engineering Ticket

```
TICKET:      JOB-4010
TITLE:       Slow work blocks the request; move it to background jobs
PRIORITY:    P1
TYPE:        Architecture
DESCRIPTION: Sending the order-confirmation email and generating invoices happen
             inline, so the request hangs and a failure fails the whole call.
             Move slow, retryable, or non-critical work to a background queue:
             enqueue a job, return quickly, and process it with retries, backoff,
             and idempotency so transient failures recover and jobs don't double-run.

ACCEPTANCE CRITERIA:
  - Slow/non-critical work is enqueued, not run inline; the request returns fast
  - Workers process jobs with bounded retries and backoff
  - Jobs are idempotent (safe to run more than once)
  - Permanently failing jobs go to a dead-letter queue, not an infinite loop
```

## 🏢 Business Context

Not all work belongs in the request. Sending email, generating documents, calling slow third parties, processing uploads — doing these inline makes the API slow and fragile: the user waits, and a flaky email provider fails the whole order. Moving work to a background queue lets the request return immediately while the work happens reliably, with retries for transient failures. It's how a backend stays fast and resilient under real conditions, and it's a core pattern of every production platform.

## 🎯 Learning Objectives

- Decide what work to move off the request path
- Enqueue jobs and return quickly; process them in a worker
- Implement bounded retries with backoff
- Make jobs idempotent and dead-letter the permanently failed

## 📚 Technical Deep Dive

**Enqueue, return, process later.** The request handler does the critical work (create the order), enqueues the rest (send confirmation), and returns. A worker picks up jobs and runs them:

```ts
await orders.save(order);                 // critical, inline
await queue.enqueue({ type: 'sendOrderEmail', orderId: order.id });   // deferred
return { status: 201, body: order };      // fast response
```

**Retries with backoff.** Background work fails transiently (a provider blips). Retry a bounded number of times with increasing delay (exponential backoff) so you recover without hammering a struggling dependency:

```ts
function nextDelayMs(attempt: number, baseMs = 1000, capMs = 60000): number {
  return Math.min(capMs, baseMs * 2 ** attempt);   // 1s, 2s, 4s, 8s … capped
}
function shouldRetry(attempt: number, maxAttempts: number): boolean {
  return attempt < maxAttempts;
}
```
Add jitter in production to avoid thundering herds.

**Idempotency (again, and for the same reason).** A job may run more than once (a retry after the work partially succeeded, an at-least-once queue). Design jobs to be safe to repeat: check "already sent?" before sending, use the order id as a natural key. Same discipline as idempotent endpoints (Lesson 6), now for workers.

**Dead-letter queue.** A job that fails every retry must not loop forever. After `maxAttempts`, move it to a dead-letter queue for inspection/alerting — failures become visible and bounded, not silent or infinite.

**At-least-once vs at-most-once.** Most queues deliver *at least once* (a job can repeat) — which is why idempotency is mandatory. *Exactly once* is largely a myth at the system level; you achieve its effect with at-least-once delivery + idempotent jobs.

### Common gotchas
- Doing slow/flaky work inline (slow, fragile requests).
- Unbounded retries (a poisoned job loops forever, burning resources).
- Non-idempotent jobs that double-send/double-charge on retry.
- No dead-letter path, so permanent failures vanish silently.
- No backoff (retry storm hammers a failing dependency).

## 🧪 Hands-on Labs

Work through **`labs/lab-07-jobs.md`**. You'll build an in-memory job queue with enqueue/process, implement bounded retries with exponential backoff, make a `sendOrderEmail` job idempotent, and dead-letter permanent failures. The pure logic (backoff schedule, retry decision, idempotent-run guard, dead-letter after max attempts) is unit-tested in Node — a transient failure recovers on retry; a job that always fails lands in the DLQ after `maxAttempts`; a duplicate run is a no-op.

## 🔍 Engineering Investigation

Make a job fail twice then succeed; confirm it recovers and the request was fast. Make a job always fail; confirm it stops after `maxAttempts` and lands in the dead-letter queue (not an infinite loop). Run a job twice; confirm the side effect happens once. Record the backoff delays produced.

## 🤖 AI Engineering Exercise

Ask an AI to "send the email in the background." **Verify** the work is enqueued (not inline), retries are bounded with backoff, the job is idempotent, and permanent failures dead-letter. **Log** where the AI used unbounded retries, a non-idempotent job, or no DLQ and your fix.

## 📝 Assignment

Submit: the job queue + worker, bounded retry with backoff, an idempotent job, and a dead-letter path — with passing Node tests (transient recovers, permanent → DLQ after max attempts, duplicate run is a no-op) and a note on what you moved off the request and why.

## 🚀 Stretch Goal

Add a scheduled/delayed job (e.g. a reminder after 24h) or priority queues, and explain how delivery guarantees (at-least-once) shape the design.

## ✅ Definition of Done

- [ ] Slow/non-critical work enqueued; request returns fast
- [ ] Bounded retries with backoff
- [ ] Jobs idempotent (safe to repeat)
- [ ] Permanent failures dead-lettered (no infinite loop)
- [ ] Queue/worker logic unit-tested

## 🪞 Reflection

What did moving work off the request do for latency and resilience? Why does at-least-once delivery make idempotency non-optional rather than a nice-to-have?
