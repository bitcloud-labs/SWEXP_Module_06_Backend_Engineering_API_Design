# Lab 05 — Stop Unauthorized Access

**Lesson:** 05 · **Goal:** a centralized authorization policy (role + ownership, least privilege); enforce it server-side; 403 vs 401 end-to-end.

## Goal
Add authorization on top of authentication so users can only act on what they're permitted to — proven with a unit-tested policy and end-to-end 403/401 checks.

## Setup
```bash
cd /tmp/swexp-be
cat > authz.ts <<'TS'
export type Role = 'customer' | 'support' | 'admin';
export interface User { id: string; role: Role; }
export interface Order { id: string; customerId: string; status: string; total: number; }

// Centralized policy — pure functions, trivially testable. Least privilege by default.
export const policy = {
  canViewOrder(user: User, order: Order): boolean {
    if (user.role === 'admin' || user.role === 'support') return true;   // role-based
    return order.customerId === user.id;                                  // ownership-based
  },
  canModifyOrder(user: User, order: Order): boolean {
    if (user.role === 'admin') return true;
    return order.customerId === user.id;
  },
  canRefundOrder(user: User, _order: Order): boolean {
    return user.role === 'admin';                                         // least privilege
  },
};
TS
echo "Enforce the policy in controllers AFTER auth; unit-test it; verify 403 vs 401 end-to-end."
```

## Tasks
1. **Centralized policy.** Keep authorization in pure `policy.*` functions (role + ownership). Default to deny — a new role/action has no access until granted.
2. **Enforce server-side, after auth, before the service acts.** Authenticated but not permitted → **403**. No/invalid token → **401** (from auth, Lesson 4). Decide deliberately when 404 (hide existence) beats 403.
3. **401 vs 403 are distinct.** Don't return 403 to an unauthenticated caller or 401 to a forbidden one.
4. **Unit-test the policy** in Node: owner can view/modify their order; a stranger cannot; support/admin can view; only admin can refund; an unknown/extra role is denied by default.
5. **Verify end-to-end:** as owner → 200; as non-owner → 403; with no token → 401; as admin → elevated access.

## Deliverable
The centralized policy; server-side enforcement; passing Node tests (role + ownership + default-deny); end-to-end evidence of 200/403/401; and a note on one 404-vs-403 information-hiding choice.

## Cleanup
```bash
rm -f /tmp/swexp-be/authz.ts
```

## Check
`../solutions/lab-05-solution.md`.
