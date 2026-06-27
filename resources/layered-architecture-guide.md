# Layered Architecture Guide

## Three layers, three jobs
- **Controller** — translate HTTP ↔ domain. Read the request, call a service, shape the response/status. **No business rules.**
- **Service** — the business logic. Operates on the domain; **no HTTP, no DB driver.**
- **Repository** — data access behind an interface. The service calls `repo.find(id)`; SQL vs API vs `Map` is the repo's secret.

```ts
interface OrderRepository { find(id: string): Promise<Order | null>; save(o: Order): Promise<void>; }

class OrderService {
  constructor(private repo: OrderRepository) {}
  async markPaid(id: string): Promise<Order> {
    const o = await this.repo.find(id);
    if (!o) throw new NotFoundError('order', id);
    if (o.status === 'cancelled') throw new ConflictError('cannot pay a cancelled order');
    const u = { ...o, status: 'paid' as const };
    await this.repo.save(u);
    return u;
  }
}
```

## Dependencies point inward
The service depends on the repository **interface**, not a concrete DB class. Inject the implementation (DI): tests pass an in-memory repo, production passes the real one. The domain doesn't import the web framework or the DB driver.

## Why it's testable
`OrderService` can be unit-tested with a fake repo — no server, no DB — asserting the rules. The controller just maps domain outcomes to status codes.

## Domain errors → status codes (in one place)
Throw `NotFoundError`/`ConflictError` from the service; map them to 404/409 in the controller (or one error handler), instead of returning status codes from deep in the logic.

## Gotchas
- A "service" importing the HTTP request or DB driver (leaky layer).
- Repositories returning HTTP-shaped data instead of domain types.
- Business rules in the controller; dependencies pointing outward.
