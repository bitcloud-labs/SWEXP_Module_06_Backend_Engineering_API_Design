# Lesson 01 — Replace the Mock API

> **Role:** Backend Software Engineer · **Competency:** REST APIs & Controllers · **Track:** API · **Est. time:** 3–4 hours

---

## 🎫 Engineering Ticket

```
TICKET:      API-1010
TITLE:       The frontend runs on a mock; build the real Orders REST API
PRIORITY:    P1
TYPE:        Feature
DESCRIPTION: Module 05's frontend reads orders from a mock at api.forge.dev.
             Build the real REST API: resource-oriented routes, correct HTTP
             methods and status codes, typed request/response shapes, and a
             controller layer that maps requests to responses. The endpoints must
             match what the frontend's typed data layer expects.

ACCEPTANCE CRITERIA:
  - Resource-oriented routes (/orders, /orders/:id) with correct HTTP methods
  - Correct status codes (200/201/204/400/404/…) for each outcome
  - Typed request and response bodies; JSON content types
  - A controller layer maps requests to responses (no logic sprawl in the router)
```

## 🏢 Business Context

REST is the contract between frontend and backend. When it's consistent — predictable URLs, the right verbs, honest status codes — the frontend team can build against it without surprises, and tools, caches, and proxies behave correctly. When it's ad-hoc, every integration is a negotiation. Replacing the mock with a real, well-shaped API is what turns Forge from a prototype into a system other teams can rely on.

## 🎯 Learning Objectives

- Design resource-oriented routes and choose correct HTTP methods
- Return honest status codes for each outcome
- Type request and response bodies; set JSON content types
- Separate routing from handling with a controller layer

## 📚 Technical Deep Dive

**Resources, not actions.** REST models *nouns* (resources) acted on by HTTP *verbs*:

| Method | Path | Meaning | Success |
|--------|------|---------|---------|
| GET | `/orders` | list orders | 200 |
| GET | `/orders/:id` | fetch one | 200 (404 if absent) |
| POST | `/orders` | create | 201 (+ `Location`) |
| PUT/PATCH | `/orders/:id` | replace/update | 200 |
| DELETE | `/orders/:id` | delete | 204 |

Avoid `GET /getOrders` or `POST /orders/delete` — the verb is the method, the URL is the resource.

**Status codes are part of the contract.** They tell the client what happened without parsing the body: `200` ok, `201` created, `204` no content, `400` bad request, `401` unauthenticated, `403` forbidden, `404` not found, `409` conflict, `422` unprocessable, `500` server error. Returning `200` with `{ error: ... }` lies to every client and cache.

**A controller maps request → response.** Keep the router thin (match route → call controller); the controller reads the request, calls into the (coming-in-Lesson-2) service layer, and shapes the response:

```ts
async function getOrder(req: ApiRequest, params: { id: string }): Promise<ApiResponse> {
  const order = await orders.find(params.id);     // service (Lesson 2)
  if (!order) return { status: 404, body: { error: 'order not found' } };
  return { status: 200, body: order };
}
```

**Typed request/response shapes.** Model the API contract in types so the compiler enforces it — the same domain modeling from Module 04, now describing the wire format the frontend consumes.

### Common gotchas
- Verbs in URLs (`/createOrder`) instead of methods on resources.
- Lying status codes (200 for errors; 200 for a created resource instead of 201).
- Business logic crammed into the router; no controller seam.
- Untyped bodies — the boundary is exactly where types matter most.

## 🧪 Hands-on Labs

Work through **`labs/lab-01-rest-api.md`**. You'll build the Orders REST API with typed controllers and a tiny router, then verify it end-to-end: a real in-process server is started and hit with `fetch`, asserting the routes, methods, and status codes (200 list, 201 create with `Location`, 404 missing, 400 bad body) behave correctly.

## 🔍 Engineering Investigation

List every endpoint the Module 05 frontend's data layer expects and map each to a method + path + status codes. After building, exercise each with real requests and record the status/body for the success and failure cases. Note any place you were tempted to use a verb in a URL and why the resource model is better.

## 🤖 AI Engineering Exercise

Ask an AI to "build CRUD endpoints for orders." **Verify** the routes are resource-oriented, status codes are honest (201 on create, 404 on missing), and bodies are typed. **Log** where it used a verb-in-URL or a lying status code and how you corrected it.

## 📝 Assignment

Submit the Orders REST API: typed controllers + router, the endpoint→method→status mapping, and the passing end-to-end request/response evidence for each success and failure case.

## 🚀 Stretch Goal

Add content negotiation or a `HEAD`/`OPTIONS` handler, or support conditional requests (`ETag`/`If-None-Match`) for `GET /orders/:id`, and explain what it buys clients and caches.

## ✅ Definition of Done

- [ ] Resource-oriented routes with correct methods
- [ ] Honest status codes for each outcome
- [ ] Typed request/response bodies; JSON content types
- [ ] Router thin; controllers map request → response
- [ ] End-to-end requests pass for success and failure cases

## 🪞 Reflection

Which status code were you most tempted to get lazy about, and what would a wrong one cost a client? How does the controller seam make the next lessons (services, validation, auth) easier to add?
