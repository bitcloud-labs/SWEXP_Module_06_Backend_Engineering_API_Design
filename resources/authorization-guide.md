# Authorization Guide

## Authentication vs authorization
*Who are you* (authn, 401) vs *what may you do* (authz, 403). Different questions, different status codes.

## Authorization is a pure decision
Given `(user, resource/action)` → allow/deny. Keep it pure → trivially testable.
```ts
canViewOrder(user, order)  { if (user.role==='admin'||user.role==='support') return true; return order.customerId===user.id; }
canRefundOrder(user, _o)   { return user.role==='admin'; }   // least privilege
```

## Enforce server-side, every action
After authn, before the service acts. Authenticated-but-not-permitted → **403**; no/invalid token → **401**.
```ts
if (!order) return notFound();
if (!policy.canViewOrder(user, order)) return forbidden();   // 403
```
Sometimes return **404** instead of 403 to hide a resource's existence — decide per resource.

## Least privilege by default
Start from deny; grant explicitly. A new role/endpoint has *no* access until added — not full access until restricted.

## Centralize the policy
Pure functions in one module, not scattered `if (role === …)` checks, so rules are auditable and consistent.

## Gotchas
- Authorizing only in the frontend (bypassed).
- Checking role but not ownership; 401/403 swapped.
- Allow-by-default; scattered duplicated checks.
