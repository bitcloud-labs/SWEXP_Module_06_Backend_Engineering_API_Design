# Error Handling Guide

## Domain errors, mapped once
Throw typed domain errors from the service; map them to status + envelope in **one** place (an error handler or the controller seam) — not by returning status codes from deep in the logic.
```ts
class NotFoundError extends Error { constructor(public resource: string, public id: string) { super(`${resource} ${id} not found`); } }
class ConflictError extends Error {}
class ValidationError extends Error { constructor(public issues: FieldIssue[]) { super('validation_failed'); } }
```
```ts
function toResponse(err: unknown): ApiResponse {
  if (err instanceof ValidationError) return { status: 400, body: errorEnvelope('validation_failed', err.message, err.issues) };
  if (err instanceof NotFoundError)   return { status: 404, body: errorEnvelope('not_found', err.message) };
  if (err instanceof ConflictError)   return { status: 409, body: errorEnvelope('conflict', err.message) };
  return { status: 500, body: errorEnvelope('internal', 'unexpected error') };   // don't leak internals
}
```

## One consistent envelope
Every error — validation, auth, not-found, server — shares `{ error: { code, message, details? } }` so clients handle errors uniformly.

## Don't leak internals
A 500 returns a generic message and code to the client; the *details* (stack, query) go to the structured logs, not the response. Never return raw exceptions or stack traces to clients.

## Distinguish the categories
- **400** validation (malformed) · **409/422** business rule (disallowed) · **401** unauthenticated · **403** forbidden · **404** missing/hidden · **500** our fault · **503** not ready.

## Gotchas
- Returning status codes from inside services (couples logic to HTTP).
- Different error shapes per endpoint.
- Leaking stack traces / internal messages to clients.
- Catch-all `500` that swallows a 400/404 that should be specific.
