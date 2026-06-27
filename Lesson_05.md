# Lesson 05 — Stop Unauthorized Access

> **Role:** Backend Software Engineer · **Competency:** Authorization · **Track:** AUTHZ · **Est. time:** 3–4 hours

---

## 🎫 Engineering Ticket

```
TICKET:      AUTHZ-3010
TITLE:       Authenticated users can act on resources that aren't theirs
PRIORITY:    P0 — security
TYPE:        Feature / Bug
DESCRIPTION: Authentication tells us WHO is calling; it doesn't say what they may
             DO. Today any logged-in user can read or modify any order. Add
             authorization: role- and ownership-based checks enforced on the
             server, returning 403 when a verified user lacks permission, with
             least privilege as the default.

ACCEPTANCE CRITERIA:
  - Authorization checks run server-side on every protected action
  - Role-based and ownership-based rules enforced (least privilege default)
  - Authenticated-but-unauthorized requests return 403 (distinct from 401)
  - Authorization decisions are centralized and testable in isolation
```

## 🏢 Business Context

Authentication and authorization are different questions: *who are you* vs *what may you do*. Conflating them — or doing authorization in the frontend — is one of the most common and damaging API vulnerabilities (broken access control). A user editing the URL to access someone else's order must be stopped on the server, every time. Least privilege (deny by default, grant explicitly) keeps the blast radius small when something is misconfigured.

## 🎯 Learning Objectives

- Distinguish authentication (401) from authorization (403)
- Enforce role-based and ownership-based rules on the server
- Default to least privilege (deny unless explicitly allowed)
- Centralize authorization so it's consistent and testable

## 📚 Technical Deep Dive

**401 vs 403.** `401 Unauthorized` means *not authenticated* (we don't know who you are — log in). `403 Forbidden` means *authenticated but not permitted* (we know who you are; you may not do this). Returning the wrong one confuses clients and can leak information.

**Authorization is a pure decision.** Given the authenticated user and the resource/action, return allow/deny. Keeping it pure makes it trivially testable:

```ts
type Role = 'customer' | 'support' | 'admin';
interface User { id: string; role: Role; }

function canViewOrder(user: User, order: Order): boolean {
  if (user.role === 'admin' || user.role === 'support') return true;  // role-based
  return order.customerId === user.id;                                 // ownership-based
}
function canRefundOrder(user: User, order: Order): boolean {
  return user.role === 'admin';                                        // least privilege
}
```

**Enforce on the server, on every action.** The controller (or an authorization middleware) checks permission *after* authentication and *before* the service acts:

```ts
const order = await orders.find(id);
if (!order) return { status: 404, body: { error: 'not found' } };
if (!canViewOrder(req.user, order)) return { status: 403, body: { error: 'forbidden' } };
return { status: 200, body: order };
```
Note the order of checks can itself leak information (404 vs 403 reveals existence) — decide deliberately per resource.

**Least privilege by default.** Start from "deny," grant specific permissions. A new role or endpoint should have *no* access until you add it, not full access until you remember to restrict it.

**Centralize the policy.** Keep authorization rules in one place (a policy module of pure functions) rather than scattered `if (user.role === …)` checks, so the rules are auditable and consistently applied.

### Common gotchas
- Doing authorization only in the frontend (trivially bypassed).
- Using 401 where 403 belongs (or vice versa).
- Checking role but not ownership (any customer can read any order).
- "Allow by default" — forgetting to restrict a new endpoint exposes everything.
- Scattered, duplicated checks that drift apart.

## 🧪 Hands-on Labs

Work through **`labs/lab-05-authz.md`**. You'll build a centralized policy of pure authorization functions (role + ownership) and enforce them in the controllers. The policy is unit-tested in Node (owner can view their order; a stranger cannot; support/admin can; only admin can refund; default-deny for unknown roles) and the endpoints are exercised end-to-end to confirm 403 for authenticated-but-forbidden and 401 for unauthenticated.

## 🔍 Engineering Investigation

As a non-owner customer, attempt to read and modify another user's order; confirm 403. As the owner, confirm success. As an admin, confirm elevated access. With no token, confirm 401 (not 403). Record each, and identify one place where returning 404 instead of 403 is the better information-hiding choice.

## 🤖 AI Engineering Exercise

Ask an AI to "add role-based access control." **Verify** checks run server-side, ownership (not just role) is enforced, 401/403 are used correctly, and the default is deny. **Log** where the AI allowed-by-default, skipped ownership, or relied on the client and your fix.

## 📝 Assignment

Submit: the centralized authorization policy (pure functions), server-side enforcement in the controllers, passing Node tests covering role + ownership + default-deny, end-to-end evidence of 403 (forbidden) vs 401 (unauthenticated), and a note on one 404-vs-403 information-hiding decision.

## 🚀 Stretch Goal

Add attribute-/policy-based rules (e.g. support can refund only within 30 days) or resource scopes, and explain when ABAC beats simple RBAC.

## ✅ Definition of Done

- [ ] Authorization enforced server-side on every protected action
- [ ] Role- and ownership-based rules; least-privilege default
- [ ] 403 for authenticated-but-forbidden; 401 for unauthenticated
- [ ] Policy centralized and unit-tested
- [ ] End-to-end evidence of correct allow/deny

## 🪞 Reflection

Where did checking *role* but not *ownership* leave a hole? Why is "deny by default" safer than "allow by default," and what does that cost in convenience?
