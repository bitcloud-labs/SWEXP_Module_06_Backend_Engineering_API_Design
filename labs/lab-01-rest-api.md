# Lab 01 — Replace the Mock API

**Lesson:** 01 · **Goal:** build the Orders REST API with typed controllers and a tiny router; verify routes, methods, and status codes end-to-end.

## Goal
Replace the mock with real resource-oriented endpoints and prove each behaves with real requests.

## Setup
```bash
cd /tmp/swexp-be
cat > orders-api.ts <<'TS'
import http from 'node:http';

export type OrderStatus = 'placed' | 'paid' | 'shipped' | 'cancelled';
export interface Order { id: string; customer: string; status: OrderStatus; total: number; }

// In-memory store for the lab (becomes a repository in Lesson 2).
const store = new Map<string, Order>([
  ['o-1001', { id: 'o-1001', customer: 'Ada', status: 'paid', total: 120 }],
]);

export interface ApiResponse { status: number; body: unknown; }

// Controllers: map request → response. No routing logic here.
export const controllers = {
  listOrders(): ApiResponse { return { status: 200, body: [...store.values()] }; },
  getOrder(id: string): ApiResponse {
    const o = store.get(id);
    return o ? { status: 200, body: o } : { status: 404, body: { error: 'not_found' } };
  },
  createOrder(body: unknown): ApiResponse {
    // (real validation arrives in Lesson 3 — here just a minimal shape check)
    if (typeof body !== 'object' || body === null) return { status: 400, body: { error: 'bad_request' } };
    const b = body as Partial<Order>;
    if (!b.customer || typeof b.total !== 'number') return { status: 400, body: { error: 'bad_request' } };
    const id = `o-${1002 + store.size}`;
    const order: Order = { id, customer: b.customer, status: 'placed', total: b.total };
    store.set(id, order);
    return { status: 201, body: order };
  },
};
TS
echo "Build the router + server around the controllers, then verify end-to-end."
```

## Tasks
1. **Resource-oriented routes:** `GET /orders`, `GET /orders/:id`, `POST /orders`. Methods on resources, not verbs in URLs.
2. **Typed controllers** map request → `ApiResponse`; keep the router thin (match route → call controller → write response).
3. **Honest status codes:** 200 list/fetch, 201 create (set a `Location: /orders/:id` header), 404 missing, 400 bad body, 405 for an unsupported method on a known path.
4. **JSON everywhere:** parse the request body as JSON; set `content-type: application/json` on responses.
5. **Verify end-to-end:** start the server on an ephemeral port and `fetch` each case — assert the status, body, and the `Location` header on create.

## Deliverable
The typed controllers + router; the endpoint→method→status mapping; and the passing end-to-end transcript (200 list, 201 create with Location, 404 missing, 400 bad body).

## Cleanup
```bash
rm -f /tmp/swexp-be/orders-api.ts
```

## Check
`../solutions/lab-01-solution.md`.
