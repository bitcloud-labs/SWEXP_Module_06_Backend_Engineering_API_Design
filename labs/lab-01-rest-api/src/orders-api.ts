/**
 * Lab 01 — Replace the Mock API. See README.md.
 *
 * Build resource-oriented Orders endpoints as pure controller + router logic.
 * Controllers map a request → an `ApiResponse`; the router matches a route → calls a
 * controller. No real server is needed to prove the contract.
 *
 * No `any`, no `as` on the typed paths.
 */

export type OrderStatus = 'placed' | 'paid' | 'shipped' | 'cancelled';
export interface Order {
  id: string;
  customer: string;
  status: OrderStatus;
  total: number;
}

export interface ApiResponse {
  status: number;
  body: unknown;
  /** Extra response headers, e.g. `{ Location: '/orders/o-1002' }` on create. */
  headers?: Record<string, string>;
}

/** A request the router dispatches. `body` is untrusted (`unknown`) until validated. */
export interface ApiRequest {
  method: string;
  /** Path only, e.g. `/orders` or `/orders/o-1001`. */
  path: string;
  body?: unknown;
}

/** In-memory store for the lab (becomes a repository in Lab 02). */
export class OrderStore {
  private seq = 1002;
  private orders = new Map<string, Order>();

  constructor(seed: Order[] = []) {
    for (const o of seed) this.orders.set(o.id, o);
  }

  list(): Order[] {
    return [...this.orders.values()];
  }
  find(id: string): Order | undefined {
    return this.orders.get(id);
  }
  /** Insert a new order with a generated id and `placed` status. */
  create(customer: string, total: number): Order {
    const id = `o-${this.seq++}`;
    const order: Order = { id, customer, status: 'placed', total };
    this.orders.set(id, order);
    return order;
  }
}

export function makeControllers(store: OrderStore) {
  return {
    /** GET /orders → 200 with the array of orders. */
    listOrders(): ApiResponse {
      // TODO: 200 with all orders from the store.
      return { status: 0, body: null };
    },

    /** GET /orders/:id → 200 with the order, or 404 not_found. */
    getOrder(id: string): ApiResponse {
      // TODO: look the order up; 200 if found, else 404 { error: 'not_found' }.
      return { status: 0, body: null };
    },

    /**
     * POST /orders → 201 with the created order and a `Location: /orders/:id` header.
     * A minimal shape check only (real validation arrives in Lab 03): the body must be a
     * non-null object with a non-empty `customer` string and a numeric `total`; otherwise
     * 400 { error: 'bad_request' }.
     */
    createOrder(body: unknown): ApiResponse {
      // TODO: minimal shape check on `body` (no `as` to lie about its shape — narrow it),
      //       then store.create(...) and return 201 with a Location header.
      return { status: 0, body: null };
    },
  };
}

/**
 * Thin router: match (method, path) → controller. Resource-oriented — methods act on
 * resources, no verbs in the URL.
 * - `GET /orders`        → listOrders
 * - `GET /orders/:id`    → getOrder(id)
 * - `POST /orders`       → createOrder(body)
 * - known path, wrong method → 405 { error: 'method_not_allowed' }
 * - unknown path         → 404 { error: 'not_found' }
 */
export function route(req: ApiRequest, store: OrderStore): ApiResponse {
  const controllers = makeControllers(store);
  // TODO: dispatch on req.method + req.path. Use the 405 / 404 fallbacks above.
  void controllers;
  return { status: 0, body: null };
}
