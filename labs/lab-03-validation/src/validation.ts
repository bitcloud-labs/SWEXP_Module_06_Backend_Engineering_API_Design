/**
 * Lab 03 — Stop Invalid Requests at the Door. See README.md.
 *
 * A single validator narrows `unknown` → a typed value OR a list of per-field issues.
 * This is the ONLY place that touches `unknown`; everything downstream is typed.
 *
 * No `any`. The only `as` allowed is the final narrowing once every field is checked.
 */

export type OrderStatus = 'placed' | 'paid' | 'shipped' | 'cancelled';
export interface CreateOrderInput {
  customer: string;
  total: number;
  status: OrderStatus;
}

export interface FieldIssue {
  field: string;
  message: string;
}
export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: FieldIssue[] };

const STATUSES: readonly OrderStatus[] = ['placed', 'paid', 'shipped', 'cancelled'];

/**
 * Parse, don't trust. Rules:
 * - body must be a non-null object (else a single issue on field `_`: "body must be an object").
 * - `customer` — required non-empty string (after trim).
 * - `total`    — must be a number > 0.
 * - `status`   — must be one of: placed, paid, shipped, cancelled.
 * Collect ALL applicable field issues (don't stop at the first) when the body is an object.
 */
export function validateCreateOrder(input: unknown): ValidationResult<CreateOrderInput> {
  // TODO: implement per the rules above.
  //  1. reject non-object/null bodies with the `_` issue.
  //  2. push a FieldIssue for each bad field (customer, total, status).
  //  3. if any issues → { ok: false, issues }; else → { ok: true, value }.
  return { ok: false, issues: [{ field: '_', message: 'not implemented' }] };
}
