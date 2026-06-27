# Validation Guide

## Parse, don't trust
The request body is `unknown` until proven. One validator narrows it to a typed value or an error — the only place that touches `unknown`.
```ts
type ValidationResult<T> = { ok: true; value: T } | { ok: false; issues: FieldIssue[] };

const r = validateCreateOrder(req.body);
if (!r.ok) return { status: 400, body: { error: 'validation_failed', issues: r.issues } };
service.create(r.value);   // typed & trusted from here
```
A schema lib (Zod, etc.) gives the same shape: `safeParse` → `{ success, data | error }`, with the type **derived** from the schema (`z.infer`).

## Validate everything that crosses the boundary
Body, path params (`:id` format), query (pagination/filters), and depended-on headers. Reject **before** any service call.

## A useful 400
Tell the client what was wrong — which fields, which rules. A bare `400` forces guesswork:
```json
{ "error": "validation_failed", "issues": [{ "field": "total", "message": "must be a positive number" }] }
```

## Validation vs business rules
- **Validation** → "is this well-formed?" → **400** at the boundary.
- **Business rule** → "is this allowed now?" → **409/422** from the service.
Keep them separate; validate first.

## Gotchas
- Using `req.body` directly, or `as`-casting it (an unchecked claim).
- Vague 400s; business checks before validation.
- Scattered ad-hoc checks instead of one boundary validator.
