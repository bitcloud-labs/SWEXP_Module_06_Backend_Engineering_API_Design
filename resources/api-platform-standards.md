# API Platform Standards

What turns "some endpoints" into a platform: consistency applied uniformly.

## Consistent error envelope
Every error shares one shape so clients parse one thing.
```ts
interface ApiError { error: { code: string; message: string; details?: unknown }; }
// 404 → { error: { code: 'not_found', message: 'order not found' } }
```
Map domain errors to `(status, code)` in one place.

## Pagination (bounded)
Never return unbounded lists. **Offset/limit** (simple, drifts) or **cursor** (stable under change, preferred for large/active data). Always clamp the limit:
```ts
const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);   // 1..100
```
Return the page + metadata (`nextCursor`/`total`).

## Idempotency for unsafe retries
Networks fail after the server acted → clients retry → a naive POST double-charges. A client-supplied `Idempotency-Key` lets the server replay the original result:
```ts
if (seen.has(key)) return seen.get(key)!;   // replay; side effect already happened
```
This is **correctness**, not a nicety. GET/PUT/DELETE are idempotent by definition; the work is making POST-style ops safe to retry.

## Rate limiting
Protect the platform from bursts/abuse. Token bucket per client; on exhaustion return **429** with `Retry-After`:
```ts
bucket.tokens = Math.min(cap, bucket.tokens + dt * ratePerSec);
if (bucket.tokens < 1) return false;  // 429
bucket.tokens -= 1;
```

## Gotchas
- Different error shapes per endpoint; unbounded lists.
- Non-idempotent POSTs that double-charge on retry.
- No rate limiting; 429 without `Retry-After`.
