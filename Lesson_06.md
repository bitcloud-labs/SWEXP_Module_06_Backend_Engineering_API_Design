# Lesson 06 — Build a Reliable API Platform

> **Role:** Backend Software Engineer · **Competency:** API Platform Standards · **Track:** API · **Est. time:** 4 hours

---

## 🎫 Engineering Ticket

```
TICKET:      API-4001
TITLE:       Each endpoint behaves differently; make the API a consistent platform
PRIORITY:    P1
TYPE:        Architecture / Platform
DESCRIPTION: Errors are shaped differently per endpoint, large lists return
             everything at once, retries can double-charge, and there's no
             protection from abusive traffic. Establish platform standards: a
             consistent error envelope, pagination, idempotency for unsafe
             retries, and rate limiting — applied uniformly across the API.

ACCEPTANCE CRITERIA:
  - One consistent error envelope across all endpoints
  - List endpoints paginated with a documented, stable scheme
  - Unsafe operations are idempotent under retry (idempotency keys)
  - Rate limiting protects the platform; clients get 429 with retry guidance
```

## 🏢 Business Context

The difference between "some endpoints" and "a platform" is consistency. When every endpoint reports errors the same way, paginates the same way, survives a retry the same way, and is protected from abuse, clients can build one integration that works everywhere — and the system stays up under real-world traffic (flaky networks, retries, bursts). These cross-cutting standards are what make an API dependable rather than a collection of one-offs.

## 🎯 Learning Objectives

- Define one consistent error envelope used everywhere
- Paginate list endpoints with a stable, documented scheme
- Make unsafe operations idempotent under retry
- Protect the platform with rate limiting (429 + retry guidance)

## 📚 Technical Deep Dive

**A consistent error envelope.** Every error — validation, auth, not-found, server — has the same shape, so clients parse one thing:

```ts
interface ApiError { error: { code: string; message: string; details?: unknown }; }
// 400 → { error: { code: 'validation_failed', message: '…', details: [...] } }
// 404 → { error: { code: 'not_found', message: 'order not found' } }
```
Map domain errors to `(status, code)` in one place.

**Pagination.** Don't return unbounded lists. Two common schemes:
- **Offset/limit** — `?limit=20&offset=40`. Simple; drifts if data changes between pages.
- **Cursor** — `?limit=20&cursor=<opaque>`. Stable under inserts/deletes; preferred for large/active datasets.

Return the page plus metadata (`nextCursor`/`total`), and cap `limit` so a client can't request a million rows:

```ts
const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);   // clamp 1..100
```

**Idempotency for unsafe retries.** Networks fail after the server acted, so clients retry — and a naive `POST /payments` double-charges. An **idempotency key** (client-supplied, e.g. `Idempotency-Key` header) lets the server recognize a retry and return the original result instead of acting twice:

```ts
if (seen.has(key)) return seen.get(key)!;        // replay the stored response
const result = await doWork();
seen.set(key, result);
return result;
```
Safe methods (GET, PUT, DELETE) are idempotent by definition; the work is making *POST*-style operations safe to retry.

**Rate limiting.** Protect the platform from bursts/abuse. A token-bucket or fixed-window limiter per client returns `429 Too Many Requests` with a `Retry-After` header when exceeded:

```ts
function allow(bucket: Bucket, now: number, ratePerSec: number, capacity: number): boolean {
  bucket.tokens = Math.min(capacity, bucket.tokens + (now - bucket.last) / 1000 * ratePerSec);
  bucket.last = now;
  if (bucket.tokens < 1) return false;
  bucket.tokens -= 1; return true;
}
```

### Common gotchas
- Different error shapes per endpoint (clients can't handle them uniformly).
- Unbounded list responses; no max on `limit`.
- Non-idempotent POSTs that double-charge/double-create on retry.
- No rate limiting (one client can take down the platform); 429 without `Retry-After`.

## 🧪 Hands-on Labs

Work through **`labs/lab-06-api-platform.md`**. You'll add a consistent error envelope, paginate the orders list with a clamped limit, make a create/payment operation idempotent via a key, and implement a token-bucket rate limiter. The pure logic (envelope mapping, limit clamp, idempotency replay, token bucket) is unit-tested in Node, and the endpoints are exercised end-to-end (a retried request returns the same result; an over-limit client gets 429).

## 🔍 Engineering Investigation

Trigger each error type and confirm they share the envelope. Page through a list and confirm the limit is clamped and metadata is correct. Send the same idempotent request twice and confirm the side effect happens once. Exceed the rate limit and confirm 429 + `Retry-After`. Record each.

## 🤖 AI Engineering Exercise

Ask an AI to "add pagination and rate limiting." **Verify** the error shape is consistent, `limit` is clamped, idempotent operations replay rather than re-execute, and 429 carries retry guidance. **Log** where the AI returned unbounded lists or non-idempotent retries and your fix.

## 📝 Assignment

Submit: the consistent error envelope, paginated list with clamped limit, idempotent unsafe operation, and rate limiter — with passing Node tests of each pure piece and end-to-end evidence (same-result retry; 429 on over-limit).

## 🚀 Stretch Goal

Add API versioning (`/v1`) or a deprecation policy, or `ETag`-based conditional requests, and explain how it lets the platform evolve without breaking clients.

## ✅ Definition of Done

- [ ] One consistent error envelope across endpoints
- [ ] List endpoints paginated with a clamped, documented scheme
- [ ] Unsafe operations idempotent under retry
- [ ] Rate limiting with 429 + `Retry-After`
- [ ] Pure logic unit-tested; endpoints verified end-to-end

## 🪞 Reflection

Which standard would clients miss most if it were inconsistent? Why is idempotency a *correctness* concern and not just a nicety?
