import { describe, it, expect } from 'vitest';
import {
  InMemoryOrderRepository,
  OrderService,
  errorEnvelope,
  validateNewOrder,
  policy,
  clampLimit,
  getOrderHandler,
  createOrderHandler,
  listOrdersHandler,
  type Order,
  type User,
} from '../src/forge';

const seed = (): Order[] => [
  { id: 'o-1', customerId: 'u-owner', status: 'paid', total: 120 },
  { id: 'o-2', customerId: 'u-other', status: 'placed', total: 30 },
];
const makeService = () => new OrderService(new InMemoryOrderRepository(seed()));

const owner: User = { id: 'u-owner', role: 'customer' };
const stranger: User = { id: 'u-stranger', role: 'customer' };
const support: User = { id: 'u-s', role: 'support' };

describe('capstone — envelope & validation', () => {
  it('errorEnvelope is the one true shape', () => {
    expect(errorEnvelope('not_found', 'gone')).toEqual({ error: { code: 'not_found', message: 'gone' } });
  });
  it('validates a create body', () => {
    expect(validateNewOrder({ customerId: 'u-1', total: 10 })).toEqual({
      ok: true,
      value: { customerId: 'u-1', total: 10 },
    });
    const bad = validateNewOrder({ customerId: '', total: -1 });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.issues.map((i) => i.field).sort()).toEqual(['customerId', 'total']);
    expect(validateNewOrder(null).ok).toBe(false);
  });
});

describe('capstone — repository & service', () => {
  it('creates and lists', () => {
    const repo = new InMemoryOrderRepository();
    const created = repo.create({ customerId: 'u-1', status: 'placed', total: 5 });
    expect(created.id).toMatch(/^o-\d+$/);
    expect(repo.find(created.id)).toEqual(created);
    expect(repo.list()).toHaveLength(1);
  });
  it('service.place produces a placed order; page slices', () => {
    const svc = makeService();
    const placed = svc.place({ customerId: 'u-owner', total: 9 });
    expect(placed.status).toBe('placed');
    expect(svc.page(1)).toHaveLength(1);
    expect(svc.page(99)).toHaveLength(3); // 2 seed + 1 placed
  });
});

describe('capstone — authorization policy', () => {
  it('owner and support can view; stranger cannot', () => {
    const order = seed()[0]!;
    expect(policy.canViewOrder(owner, order)).toBe(true);
    expect(policy.canViewOrder(support, order)).toBe(true);
    expect(policy.canViewOrder(stranger, order)).toBe(false);
  });
});

describe('capstone — clampLimit', () => {
  it('defaults and clamps', () => {
    expect(clampLimit(undefined)).toBe(20);
    expect(clampLimit(99999)).toBe(100);
    expect(clampLimit(0)).toBe(1);
    expect(clampLimit('15')).toBe(15);
  });
});

describe('capstone — GET /orders/:id handler (401 → 404 → 403 → 200)', () => {
  it('401 for an anonymous caller (before leaking existence)', () => {
    const res = getOrderHandler(null, 'o-1', makeService());
    expect(res.status).toBe(401);
    expect(res.body).toEqual(errorEnvelope('unauthorized', expect.any(String) as unknown as string));
  });
  it('404 when the order is missing', () => {
    expect(getOrderHandler(owner, 'missing', makeService()).status).toBe(404);
  });
  it('403 when authenticated but not permitted', () => {
    expect(getOrderHandler(stranger, 'o-1', makeService()).status).toBe(403);
  });
  it('200 with the order for the owner', () => {
    const res = getOrderHandler(owner, 'o-1', makeService());
    expect(res.status).toBe(200);
    expect((res.body as Order).id).toBe('o-1');
  });
});

describe('capstone — POST /orders handler', () => {
  it('401 for an anonymous caller', () => {
    expect(createOrderHandler(null, { customerId: 'u-owner', total: 10 }, makeService()).status).toBe(401);
  });
  it('400 with issues for an invalid body', () => {
    const res = createOrderHandler(owner, { customerId: '', total: -1 }, makeService());
    expect(res.status).toBe(400);
    expect((res.body as { error: { code: string } }).error.code).toBe('validation_failed');
    expect(Array.isArray((res.body as { issues: unknown[] }).issues)).toBe(true);
  });
  it('201 with the created order for a valid body', () => {
    const svc = makeService();
    const res = createOrderHandler(owner, { customerId: 'u-owner', total: 77 }, svc);
    expect(res.status).toBe(201);
    const created = res.body as Order;
    expect(created.status).toBe('placed');
    expect(created.customerId).toBe('u-owner');
    expect(svc.getOrThrow(created.id).total).toBe(77);
  });
});

describe('capstone — GET /orders list handler', () => {
  it('401 for an anonymous caller', () => {
    expect(listOrdersHandler(null, undefined, makeService()).status).toBe(401);
  });
  it('200 with a clamped page', () => {
    const res = listOrdersHandler(owner, 1, makeService());
    expect(res.status).toBe(200);
    const body = res.body as { items: Order[]; limit: number };
    expect(body.limit).toBe(1);
    expect(body.items).toHaveLength(1);
  });
});
