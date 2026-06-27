# Lab 05 — Stop Unauthorized Access

**Ticket:** AUTHZ-5001 · **Goal:** a centralized authorization policy (role + ownership, least privilege) and a 401-vs-403 decision.

## What you do
In [`src/authz.ts`](src/authz.ts):

- **`policy`** — pure functions, **default-deny**, least privilege:
  - `canViewOrder` — admin/support, or the owner.
  - `canModifyOrder` — admin, or the owner.
  - `canRefundOrder` — admin only.
  - An unknown/extra role must be denied by default.
- **`authorize(user, permitted)`** — keeps the two failures distinct: `null` user → `401`; authenticated
  but denied → `403`; permitted → `200`. Never return `403` to an unauthenticated caller, nor `401` to a
  forbidden one.

Run:
```bash
npx vitest run labs/lab-05-authz
```

## Definition of done
- All tests pass; `npm run check` clean.
- In your notebook, note one case where returning `404` (hide existence) beats `403`.

## Submit
Edit `src/`, run the tests, commit and push.
