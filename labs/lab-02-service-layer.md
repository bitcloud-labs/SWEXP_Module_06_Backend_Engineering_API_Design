# Lab 02 — Organize the Service Layer

**Lesson:** 02 · **Goal:** refactor into controller → service → repository; unit-test the service's business rules without HTTP.

## Goal
Pull business logic out of the controller into an `OrderService` that depends on an `OrderRepository` interface, and test the rules with a fake repo — no server, no DB.

## Setup
```bash
cd /tmp/swexp-be
cat > orders-service.ts <<'TS'
export type OrderStatus = 'placed' | 'paid' | 'shipped' | 'cancelled';
export interface Order { id: string; customer: string; status: OrderStatus; total: number; }

export class NotFoundError extends Error { constructor(public resource: string, public id: string) { super(`${resource} ${id} not found`); } }
export class ConflictError extends Error {}

// Data access behind an interface — the service doesn't know if it's a Map, SQL, or an API.
export interface OrderRepository {
  find(id: string): Promise<Order | null>;
  list(): Promise<Order[]>;
  save(order: Order): Promise<void>;
}

// Business logic. No HTTP, no DB driver — just the domain.
export class OrderService {
  constructor(private repo: OrderRepository) {}
  async get(id: string): Promise<Order> {
    const o = await this.repo.find(id);
    if (!o) throw new NotFoundError('order', id);
    return o;
  }
  async markPaid(id: string): Promise<Order> {
    const o = await this.get(id);
    if (o.status === 'cancelled') throw new ConflictError('cannot pay a cancelled order');
    const updated: Order = { ...o, status: 'paid' };
    await this.repo.save(updated);
    return updated;
  }
}
TS
echo "Add an in-memory repository + a thin controller; unit-test the service in Node."
```

## Tasks
1. **Three layers.** Controller (HTTP ↔ domain), `OrderService` (business rules), `OrderRepository` (data access interface). The Lesson 1 controller becomes a thin mapper that calls the service and turns domain errors into status codes (`NotFoundError`→404, `ConflictError`→409).
2. **In-memory repository** implementing `OrderRepository` with a `Map`.
3. **No leaky layers.** The service imports no HTTP and no DB driver; the controller has no business rules.
4. **Unit-test the service** in Node with a fake repo: `markPaid` succeeds and persists; paying a `cancelled` order throws `ConflictError`; a missing order throws `NotFoundError`. No server, no DB.
5. **Prove the seam:** swap the fake repo for a second fake and confirm the same tests pass.

## Deliverable
The controller/service/repository split; the repository interface + in-memory impl; passing Node unit tests of the service rules (no HTTP/DB); and a note confirming the service has zero HTTP/DB imports.

## Cleanup
```bash
rm -f /tmp/swexp-be/orders-service.ts
```

## Check
`../solutions/lab-02-solution.md`.
