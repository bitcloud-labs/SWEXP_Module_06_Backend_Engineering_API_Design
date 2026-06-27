# Capstone — FORGE-9400: Ship the Project Forge Backend Platform

**Epic:** FORGE-9400 · **Role:** Backend Software Engineer (release owner)

This is the integrated exercise: no new concepts, but you assemble the module — layered architecture,
boundary validation, authorization (role + ownership, least privilege), a consistent error envelope, and
pagination — into one strict, type-safe module. The full **release report + engineering notebook** are
submitted via the LMS using [`../capstone-submission-template.md`](../capstone-submission-template.md); the
code below is the part the autograder scores.

## What you do
Implement every `// TODO` in [`src/forge.ts`](src/forge.ts):

| Concern | What to do | From |
| --- | --- | --- |
| Domain | `OrderStatus` union; `Order` / `NewOrder = Omit<Order,'id'>` | Lessons 1–2 |
| Envelope | `errorEnvelope(code, message)` | Lesson 6 |
| Data | `InMemoryOrderRepository` behind `OrderRepository` | Lesson 2 |
| Validation | `validateNewOrder` narrows `unknown` → typed value or issues | Lesson 3 |
| Authorization | `policy.canViewOrder` (role + ownership) | Lesson 5 |
| Service | `OrderService` (getOrThrow / place / page) — no HTTP | Lesson 2 |
| Pagination | `clampLimit` | Lesson 6 |
| Handlers | `getOrderHandler` (401→404→403→200), `createOrderHandler`, `listOrdersHandler` | Lessons 1, 3, 5, 6 |

Run:
```bash
npx vitest run assignments/capstone     # behaviour
npm run test:types                       # type-level derivations
npm run check                            # strict, clean
```

## Definition of done
- All capstone tests pass and the project type-checks clean — **zero** `any` / `as` on untrusted input.
- The handler decides `401` **before** `404`/`403`, so an anonymous caller never learns whether a resource
  exists. Your LMS release report proves each quality bar with reproducible evidence.

## The standard
The boundary is untrusted; layers have clear contracts; illegal states are unrepresentable; **fail safe,
not open**; least privilege. A green type-check and a passing test are how "production-ready" becomes true
rather than asserted.
