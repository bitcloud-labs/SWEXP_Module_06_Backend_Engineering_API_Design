/**
 * Lab 02 — Organize the Service Layer. See README.md.
 *
 * Pull business logic into an `OrderService` that depends on an `OrderRepository`
 * interface. The service knows nothing about HTTP or the storage engine. A thin
 * controller maps domain errors → status codes.
 *
 * No `any`, no `as`.
 */

export type OrderStatus = 'placed' | 'paid' | 'shipped' | 'cancelled';
export interface Order {
  id: string;
  customer: string;
  status: OrderStatus;
  total: number;
}

export class NotFoundError extends Error {
  constructor(public resource: string, public id: string) {
    super(`${resource} ${id} not found`);
    this.name = 'NotFoundError';
  }
}
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

/** Data access behind an interface — the service doesn't know Map vs SQL vs API. */
export interface OrderRepository {
  find(id: string): Promise<Order | null>;
  list(): Promise<Order[]>;
  save(order: Order): Promise<void>;
}

/** In-memory repository backed by a Map. */
export class InMemoryOrderRepository implements OrderRepository {
  private orders = new Map<string, Order>();
  constructor(seed: Order[] = []) {
    for (const o of seed) this.orders.set(o.id, o);
  }
  async find(id: string): Promise<Order | null> {
    // TODO: return the order or null.
    return null;
  }
  async list(): Promise<Order[]> {
    // TODO: return all orders.
    return [];
  }
  async save(order: Order): Promise<void> {
    // TODO: upsert the order.
  }
}

/** Business logic. No HTTP, no DB driver — just the domain. */
export class OrderService {
  constructor(private repo: OrderRepository) {}

  /** Fetch an order or throw NotFoundError. */
  async get(id: string): Promise<Order> {
    // TODO: find via the repo; throw new NotFoundError('order', id) when absent.
    throw new NotFoundError('order', id);
  }

  /**
   * Mark an order paid. A cancelled order cannot be paid (ConflictError).
   * Return the updated order WITHOUT mutating the original (immutable update).
   */
  async markPaid(id: string): Promise<Order> {
    // TODO: get the order; if status === 'cancelled' throw new ConflictError(...);
    //       otherwise save a copy with status 'paid' and return it.
    throw new NotFoundError('order', id);
  }
}

export interface ApiResponse {
  status: number;
  body: unknown;
}

/**
 * Thin controller seam: run the work, map domain errors → status codes.
 * - NotFoundError → 404 { error: 'not_found' }
 * - ConflictError → 409 { error: 'conflict', message }
 * - success       → 200 with the value
 */
export async function toResponse<T>(work: () => Promise<T>): Promise<ApiResponse> {
  // TODO: try the work (200 with the value); catch NotFoundError → 404, ConflictError → 409.
  void work;
  return { status: 0, body: null };
}
