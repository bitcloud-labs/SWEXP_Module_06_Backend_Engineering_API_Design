import { describe, it, expect } from 'vitest';
import { policy, authorize, type User, type Order, type Role } from '../src/authz';

const order: Order = { id: 'o-1', customerId: 'u-owner', status: 'placed', total: 100 };
const owner: User = { id: 'u-owner', role: 'customer' };
const stranger: User = { id: 'u-other', role: 'customer' };
const support: User = { id: 'u-s', role: 'support' };
const admin: User = { id: 'u-a', role: 'admin' };

describe('lab 05 — authorization policy (role + ownership, least privilege)', () => {
  it('owner can view and modify their own order', () => {
    expect(policy.canViewOrder(owner, order)).toBe(true);
    expect(policy.canModifyOrder(owner, order)).toBe(true);
  });

  it('a stranger cannot view or modify the order', () => {
    expect(policy.canViewOrder(stranger, order)).toBe(false);
    expect(policy.canModifyOrder(stranger, order)).toBe(false);
  });

  it('support can view but not modify or refund', () => {
    expect(policy.canViewOrder(support, order)).toBe(true);
    expect(policy.canModifyOrder(support, order)).toBe(false);
    expect(policy.canRefundOrder(support, order)).toBe(false);
  });

  it('admin can view, modify, and refund', () => {
    expect(policy.canViewOrder(admin, order)).toBe(true);
    expect(policy.canModifyOrder(admin, order)).toBe(true);
    expect(policy.canRefundOrder(admin, order)).toBe(true);
  });

  it('only admin can refund', () => {
    expect(policy.canRefundOrder(owner, order)).toBe(false);
  });

  it('an unknown/extra role is denied by default', () => {
    const rogue = { id: 'u-x', role: 'superuser' as unknown as Role };
    expect(policy.canViewOrder(rogue, order)).toBe(false);
    expect(policy.canModifyOrder(rogue, order)).toBe(false);
    expect(policy.canRefundOrder(rogue, order)).toBe(false);
  });
});

describe('lab 05 — authorize keeps 401 and 403 distinct', () => {
  it('unauthenticated → 401 (not 403)', () => {
    const d = authorize(null, (u) => policy.canViewOrder(u, order));
    expect(d).toEqual({ status: 401, allowed: false });
  });

  it('authenticated owner → 200', () => {
    const d = authorize(owner, (u) => policy.canViewOrder(u, order));
    expect(d).toEqual({ status: 200, allowed: true });
  });

  it('authenticated stranger → 403 (not 401)', () => {
    const d = authorize(stranger, (u) => policy.canViewOrder(u, order));
    expect(d).toEqual({ status: 403, allowed: false });
  });

  it('admin elevated access → 200 on refund', () => {
    const d = authorize(admin, (u) => policy.canRefundOrder(u, order));
    expect(d.status).toBe(200);
  });
});
