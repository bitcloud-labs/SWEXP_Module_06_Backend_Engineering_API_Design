/**
 * Lab 05 — Stop Unauthorized Access. See README.md.
 *
 * Centralized authorization: pure policy functions (role + ownership), least privilege,
 * default-deny. Then a decision helper that keeps 401 (not authenticated) and
 * 403 (authenticated but forbidden) distinct.
 *
 * No `any`.
 */

export type Role = 'customer' | 'support' | 'admin';
export interface User {
  id: string;
  role: Role;
}
export interface Order {
  id: string;
  customerId: string;
  status: string;
  total: number;
}

/**
 * Centralized policy — pure, trivially testable, least privilege by default.
 *  - canViewOrder:   admin or support (role) OR the owner (ownership).
 *  - canModifyOrder: admin (role) OR the owner.
 *  - canRefundOrder: admin only.
 * Any unknown/extra role must be denied by default (don't enumerate every deny case —
 * grant explicitly, deny otherwise).
 */
export const policy = {
  canViewOrder(user: User, order: Order): boolean {
    // TODO: admin/support → true; else owner check.
    return false;
  },
  canModifyOrder(user: User, order: Order): boolean {
    // TODO: admin → true; else owner check.
    return false;
  },
  canRefundOrder(user: User, _order: Order): boolean {
    // TODO: admin only.
    return false;
  },
};

export interface AuthzDecision {
  status: number; // 200 allowed, 401 unauthenticated, 403 forbidden
  allowed: boolean;
}

/**
 * Decide access for an action.
 * - `user` is `null` when the request is unauthenticated → 401.
 * - authenticated but the policy denies → 403.
 * - authenticated and permitted → 200.
 * Never return 403 to an unauthenticated caller, nor 401 to a forbidden one.
 */
export function authorize(
  user: User | null,
  permitted: (u: User) => boolean,
): AuthzDecision {
  // TODO: null user → 401; else run `permitted(user)` → 200 or 403.
  void permitted;
  return { status: 401, allowed: false };
}
