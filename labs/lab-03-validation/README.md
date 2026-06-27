# Lab 03 — Stop Invalid Requests at the Door

**Ticket:** VAL-3001 · **Goal:** validate request bodies at the boundary — narrow `unknown` → typed value or structured issues.

## What you do
In [`src/validation.ts`](src/validation.ts), implement `validateCreateOrder(input)`:

- A non-object / null body → a single issue on field `_`.
- `customer` — required non-empty string (after trim).
- `total` — must be a number `> 0`.
- `status` — must be one of `placed | paid | shipped | cancelled`.
- Collect **all** applicable field issues (don't stop at the first), each with a useful message.
- On success, return `{ ok: true, value }` with a fully typed `CreateOrderInput`.

This is the **only** place that touches `unknown` — everything downstream is typed. A malformed body is a
`400` (validation); a business-rule violation like "can't pay a cancelled order" is a `409` (Lab 02) — keep
them separate.

Run:
```bash
npx vitest run labs/lab-03-validation
```

## Definition of done
- All tests pass; `npm run check` clean.
- In your notebook, distinguish one `400` (validation) from one `409` (business rule).

## Submit
Edit `src/`, run the tests, commit and push.
