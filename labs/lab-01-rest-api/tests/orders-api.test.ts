import { describe, it, expect } from 'vitest';
import { OrderStore, route, type Order } from '../src/orders-api';

const seed: Order[] = [{ id: 'o-1001', customer: 'Ada', status: 'paid', total: 120 }];
const freshStore = () => new OrderStore(seed.map((o) => ({ ...o })));

describe('lab 01 — orders REST API', () => {
  it('GET /orders lists orders with 200', () => {
    const res = route({ method: 'GET', path: '/orders' }, freshStore());
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'o-1001', customer: 'Ada', status: 'paid', total: 120 }]);
  });

  it('GET /orders/:id returns the order with 200', () => {
    const res = route({ method: 'GET', path: '/orders/o-1001' }, freshStore());
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'o-1001', customer: 'Ada', status: 'paid', total: 120 });
  });

  it('GET /orders/:id returns 404 for a missing order', () => {
    const res = route({ method: 'GET', path: '/orders/nope' }, freshStore());
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'not_found' });
  });

  it('POST /orders creates an order: 201, placed status, Location header', () => {
    const store = freshStore();
    const res = route({ method: 'POST', path: '/orders', body: { customer: 'Lin', total: 50 } }, store);
    expect(res.status).toBe(201);
    const created = res.body as Order;
    expect(created.customer).toBe('Lin');
    expect(created.total).toBe(50);
    expect(created.status).toBe('placed');
    expect(created.id).toMatch(/^o-\d+$/);
    expect(res.headers?.Location).toBe(`/orders/${created.id}`);
    // it actually persisted
    const fetched = route({ method: 'GET', path: `/orders/${created.id}` }, store);
    expect(fetched.status).toBe(200);
  });

  it('POST /orders with a bad body returns 400 bad_request', () => {
    const store = freshStore();
    expect(route({ method: 'POST', path: '/orders', body: null }, store).status).toBe(400);
    expect(route({ method: 'POST', path: '/orders', body: { customer: '' } }, store).status).toBe(400);
    expect(
      route({ method: 'POST', path: '/orders', body: { customer: 'X', total: 'lots' } }, store).status,
    ).toBe(400);
  });

  it('a wrong method on a known path returns 405', () => {
    const res = route({ method: 'DELETE', path: '/orders' }, freshStore());
    expect(res.status).toBe(405);
    expect(res.body).toEqual({ error: 'method_not_allowed' });
  });

  it('an unknown path returns 404', () => {
    const res = route({ method: 'GET', path: '/widgets' }, freshStore());
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'not_found' });
  });
});
