# Lab 02 — Organize the Service Layer

**Ticket:** ARCH-2001 · **Goal:** controller → service → repository; business rules testable without HTTP or a DB.

## What you do
In [`src/orders-service.ts`](src/orders-service.ts):

- **`InMemoryOrderRepository`** implements the `OrderRepository` interface over a `Map`.
- **`OrderService`** holds the business rules — `get` (throws `NotFoundError` when absent) and `markPaid`
  (throws `ConflictError` for a cancelled order; otherwise an **immutable** update to `paid`). It imports
  no HTTP and no DB driver.
- **`toResponse`** is the thin controller seam: success → `200`, `NotFoundError` → `404`,
  `ConflictError` → `409`.

The tests unit-test the service with a fake repo, then **swap** in a second fake to prove the seam.

Run:
```bash
npx vitest run labs/lab-02-service-layer
```

## Definition of done
- All tests pass; `npm run check` clean.
- Note that the service has **zero** HTTP/DB imports.

## Submit
Edit `src/`, run the tests, commit and push.
