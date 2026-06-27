# REST API Reference

## Resources, not actions
Model nouns acted on by HTTP verbs. The verb is the method; the URL is the resource.
```
GET    /orders          list
GET    /orders/:id       fetch one
POST   /orders           create        → 201 + Location: /orders/:id
PATCH  /orders/:id       partial update
PUT    /orders/:id       replace
DELETE /orders/:id       delete         → 204
```
Avoid `GET /getOrders`, `POST /orders/delete`.

## Status codes are part of the contract
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created (set `Location`) |
| 204 | No Content (e.g. delete) |
| 400 | Bad request (validation) |
| 401 | Unauthenticated |
| 403 | Forbidden (authenticated, not permitted) |
| 404 | Not found |
| 405 | Method not allowed |
| 409 | Conflict (business rule) |
| 422 | Unprocessable |
| 429 | Too many requests |
| 500 | Server error |
Never return 200 with `{ error }` — it lies to clients, caches, and proxies.

## Controllers map request → response
```ts
async function getOrder(id: string): Promise<ApiResponse> {
  const order = await service.get(id);          // throws NotFoundError if absent
  return { status: 200, body: order };
}
```
Keep the router thin (match route → call controller). No business logic in the router.

## Typed contracts
Model request/response shapes in types so the compiler enforces the wire format the frontend consumes.

## Gotchas
- Verbs in URLs; lying status codes; business logic in the router; untyped bodies.
- Forgetting `Location` on create or `204` (no body) on delete.
