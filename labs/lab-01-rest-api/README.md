# Lab 01 — Replace the Mock API

**Ticket:** REST-1001 · **Goal:** build the Orders REST API with typed controllers and a thin router.

## What you do
In [`src/orders-api.ts`](src/orders-api.ts), implement the controllers and the `route()` dispatcher:

- **Resource-oriented routes:** `GET /orders`, `GET /orders/:id`, `POST /orders` — methods act on
  resources, no verbs in the URL.
- **Typed controllers** map a request → `ApiResponse`; the router just matches a route → calls a controller.
- **Honest status codes:** `200` list/fetch, `201` create (with a `Location: /orders/:id` header),
  `404` missing, `400` bad body, `405` for a wrong method on a known path.
- A minimal shape check on the create body only — **narrow** `unknown`, never `as` it into a lie. (Real
  validation arrives in Lab 03.)

Run:
```bash
npx vitest run labs/lab-01-rest-api
```

## Definition of done
- All tests pass; `npm run check` clean.
- In your notebook, write the endpoint → method → status mapping.

## Submit
Edit `src/`, run the tests, commit and push.
