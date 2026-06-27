# Lesson 02 — Organize the Service Layer

> **Role:** Backend Software Engineer · **Competency:** Layered Architecture · **Track:** ARCH · **Est. time:** 3–4 hours

---

## 🎫 Engineering Ticket

```
TICKET:      ARCH-2001
TITLE:       The controllers are doing everything; introduce layers
PRIORITY:    P1
TYPE:        Refactor / Architecture
DESCRIPTION: Order logic, data access, and HTTP handling are tangled inside the
             controllers. Introduce a layered architecture — controller → service
             → repository — with clear contracts between layers, so business logic
             is testable in isolation and the data source can change without
             touching HTTP code.

ACCEPTANCE CRITERIA:
  - Three layers with clear responsibilities: controller, service, repository
  - Business logic lives in services and is testable without HTTP
  - Data access is behind a repository interface (swappable implementation)
  - Dependencies point inward; layers depend on contracts, not concretions
```

## 🏢 Business Context

A backend that mixes HTTP parsing, business rules, and SQL in one function is impossible to test, reason about, or change. Layering separates *what the system does* (services) from *how it talks to the world* (controllers) and *how it stores data* (repositories). This is the backend version of componentizing the UI (Module 05): small pieces with clear contracts. It's what lets you unit-test business logic without a server or database, and swap Postgres for an in-memory store in tests.

## 🎯 Learning Objectives

- Separate controller, service, and repository responsibilities
- Put business logic in services that are testable without HTTP
- Define a repository interface and depend on it, not a concrete store
- Keep dependencies pointing inward (toward the domain)

## 📚 Technical Deep Dive

**Three layers, three jobs.**
- **Controller** — translate HTTP ↔ domain. Read the request, call a service, shape the response and status. No business rules.
- **Service** — the business logic. Pure-ish functions over the domain; no knowledge of HTTP or the database.
- **Repository** — data access behind an interface. The service calls `orders.find(id)`; whether that's SQL, an API, or a `Map` is the repository's secret.

```ts
interface OrderRepository {
  find(id: string): Promise<Order | null>;
  list(): Promise<Order[]>;
  save(order: Order): Promise<void>;
}

class OrderService {
  constructor(private repo: OrderRepository) {}
  async markPaid(id: string): Promise<Order> {
    const order = await this.repo.find(id);
    if (!order) throw new NotFoundError('order', id);
    if (order.status === 'cancelled') throw new ConflictError('cannot pay a cancelled order');
    const updated = { ...order, status: 'paid' as const };
    await this.repo.save(updated);
    return updated;
  }
}
```

**Dependencies point inward.** The service depends on the `OrderRepository` *interface*, not a concrete database class. You inject the implementation (dependency injection), so tests pass an in-memory repo and production passes the real one. The domain doesn't know or care.

**Why this is testable.** `OrderService.markPaid` can be unit-tested with a fake repository — no server, no DB — asserting the business rules (can't pay a cancelled order → conflict; missing → not found). The controller just maps those outcomes to status codes.

**Errors as domain types.** Throwing typed domain errors (`NotFoundError`, `ConflictError`) lets the controller map them to status codes in one place, instead of returning status codes from deep in the logic.

### Common gotchas
- A "service" that still imports the HTTP request or the DB driver — leaky layers.
- Repositories that return HTTP-shaped data instead of domain types.
- Business rules in the controller (can't reuse, hard to test).
- Circular dependencies / dependencies pointing outward (domain importing the web framework).

## 🧪 Hands-on Labs

Work through **`labs/lab-02-service-layer.md`**. You'll refactor the Lesson 1 controllers into controller → `OrderService` → `OrderRepository` layers with an in-memory repo, and unit-test the service's business rules in Node (mark-paid succeeds, paying a cancelled order is a conflict, a missing order is not-found) — entirely without HTTP. The layer contracts type-check.

## 🔍 Engineering Investigation

Take one tangled controller and identify each line's true layer (HTTP / business / data). After refactoring, confirm the service has zero HTTP/DB imports and the controller has zero business rules. Swap the in-memory repo for a different fake and confirm the service tests still pass unchanged — evidence the contract holds.

## 🤖 AI Engineering Exercise

Ask an AI to "refactor this controller into layers." **Verify** the service has no HTTP/DB dependencies, the repository is an interface, and business rules moved out of the controller. **Log** where the AI left a leaky layer and how you fixed it.

## 📝 Assignment

Submit the layered Orders module: the controller/service/repository split, the repository interface, passing Node unit tests of the service's business rules (no HTTP/DB), and a note proving the service is free of HTTP/DB imports.

## 🚀 Stretch Goal

Add a second repository implementation (e.g. a file-backed store) and run the *same* service tests against both, demonstrating the interface is a true seam.

## ✅ Definition of Done

- [ ] Controller / service / repository layers with clear responsibilities
- [ ] Business logic in services, testable without HTTP
- [ ] Data access behind a repository interface
- [ ] Dependencies point inward; no leaky layers
- [ ] Service unit tests pass; contracts type-check

## 🪞 Reflection

Which logic was hardest to pull out of the controller, and why? How does depending on a repository *interface* change what you can do in tests?
