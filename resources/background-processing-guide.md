# Background Processing Guide

## Enqueue, return, process later
Do the critical work inline; defer the slow/flaky/non-critical work to a queue; return fast.
```ts
await orders.save(order);                                // critical
await queue.enqueue({ type: 'sendOrderEmail', orderId }); // deferred
return { status: 201, body: order };
```

## Retries with backoff (bounded)
Transient failures recover with increasing delay:
```ts
nextDelayMs(attempt, base=1000, cap=60000) = min(cap, base * 2 ** attempt);  // 1s,2s,4s… capped
shouldRetry(attempt, max) = attempt < max;
```
Add jitter in production to avoid thundering herds.

## Idempotent jobs (mandatory)
Queues deliver **at least once** — a job may run more than once. Make jobs safe to repeat:
```ts
if (alreadySent(orderId)) return;   // no-op on re-run
```
"Exactly once" is a myth at the system level; you get its effect via at-least-once delivery + idempotent jobs.

## Dead-letter queue
A job that fails every retry must not loop forever. After `maxAttempts`, move it to a DLQ for inspection/alerting — failures become visible and bounded.

## Gotchas
- Slow/flaky work inline (slow, fragile requests).
- Unbounded retries (poison loops forever); no backoff (retry storm).
- Non-idempotent jobs that double-send; no dead-letter path.
