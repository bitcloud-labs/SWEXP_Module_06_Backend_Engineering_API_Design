import { test, expectTypeOf } from 'vitest';
import type { Order, OrderStatus, NewOrder } from '../src/forge';

test('OrderStatus is the exact literal union', () => {
  expectTypeOf<OrderStatus>().toEqualTypeOf<'placed' | 'paid' | 'shipped' | 'cancelled'>();
});

test('NewOrder is an Order without its id', () => {
  expectTypeOf<NewOrder>().toEqualTypeOf<Omit<Order, 'id'>>();
});
