import { describe, it, expect } from 'vitest';
import {
  InMemoryOrderRepository,
  OrderService,
  NotFoundError,
  ConflictError,
  toResponse,
  type Order,
  type OrderRepository,
} from '../src/orders-service';

const seed = (): Order[] => [
  { id: 'o-1', customer: 'Ada', status: 'placed', total: 100 },
  { id: 'o-2', customer: 'Lin', status: 'cancelled', total: 40 },
];

describe('lab 02 — service layer business rules (no HTTP, no DB)', () => {
  it('get returns an existing order', async () => {
    const svc = new OrderService(new InMemoryOrderRepository(seed()));
    expect(await svc.get('o-1')).toMatchObject({ id: 'o-1', customer: 'Ada' });
  });

  it('get throws NotFoundError for a missing order', async () => {
    const svc = new OrderService(new InMemoryOrderRepository(seed()));
    await expect(svc.get('missing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('markPaid succeeds and persists the new status', async () => {
    const repo = new InMemoryOrderRepository(seed());
    const svc = new OrderService(repo);
    const updated = await svc.markPaid('o-1');
    expect(updated.status).toBe('paid');
    expect((await repo.find('o-1'))?.status).toBe('paid');
  });

  it('markPaid does not mutate the original order object (immutable update)', async () => {
    const repo = new InMemoryOrderRepository(seed());
    const original = await repo.find('o-1');
    const svc = new OrderService(repo);
    await svc.markPaid('o-1');
    expect(original?.status).toBe('placed'); // the object we read before is unchanged
  });

  it('markPaid on a cancelled order throws ConflictError', async () => {
    const svc = new OrderService(new InMemoryOrderRepository(seed()));
    await expect(svc.markPaid('o-2')).rejects.toBeInstanceOf(ConflictError);
  });

  it('works against any OrderRepository (swap the seam)', async () => {
    // A second, hand-rolled fake repo — same tests must pass.
    const map = new Map<string, Order>(seed().map((o) => [o.id, o]));
    const fake: OrderRepository = {
      async find(id) {
        return map.get(id) ?? null;
      },
      async list() {
        return [...map.values()];
      },
      async save(o) {
        map.set(o.id, o);
      },
    };
    const svc = new OrderService(fake);
    expect((await svc.markPaid('o-1')).status).toBe('paid');
    await expect(svc.markPaid('o-2')).rejects.toBeInstanceOf(ConflictError);
  });
});

describe('lab 02 — controller maps domain errors → status codes', () => {
  it('success → 200 with the value', async () => {
    const res = await toResponse(async () => ({ id: 'o-1' }));
    expect(res).toEqual({ status: 200, body: { id: 'o-1' } });
  });

  it('NotFoundError → 404', async () => {
    const res = await toResponse(async () => {
      throw new NotFoundError('order', 'x');
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'not_found' });
  });

  it('ConflictError → 409', async () => {
    const res = await toResponse(async () => {
      throw new ConflictError('cannot pay a cancelled order');
    });
    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({ error: 'conflict', message: 'cannot pay a cancelled order' });
  });
});
