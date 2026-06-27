# Lab 03 — Stop Invalid Requests at the Door

**Lesson:** 03 · **Goal:** validate request bodies at the boundary, reject bad input with a structured 400, and pass only typed data to the service.

## Goal
Turn the minimal shape-check from Lesson 1 into real boundary validation: a single validator narrows `unknown` → a typed value or a useful error, and nothing invalid reaches the service.

## Setup
```bash
cd /tmp/swexp-be
cat > validation.ts <<'TS'
export type OrderStatus = 'placed' | 'paid' | 'shipped' | 'cancelled';
export interface CreateOrderInput { customer: string; total: number; status: OrderStatus; }

export interface FieldIssue { field: string; message: string; }
export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: FieldIssue[] };

// Parse, don't trust: narrow unknown → typed value, collecting per-field issues.
export function validateCreateOrder(input: unknown): ValidationResult<CreateOrderInput> {
  const issues: FieldIssue[] = [];
  if (typeof input !== 'object' || input === null) return { ok: false, issues: [{ field: '_', message: 'body must be an object' }] };
  const b = input as Record<string, unknown>;
  if (typeof b.customer !== 'string' || b.customer.trim() === '') issues.push({ field: 'customer', message: 'required non-empty string' });
  if (typeof b.total !== 'number' || !(b.total > 0)) issues.push({ field: 'total', message: 'must be a positive number' });
  const statuses: OrderStatus[] = ['placed', 'paid', 'shipped', 'cancelled'];
  if (!statuses.includes(b.status as OrderStatus)) issues.push({ field: 'status', message: `must be one of ${statuses.join(', ')}` });
  if (issues.length) return { ok: false, issues };
  return { ok: true, value: { customer: b.customer as string, total: b.total as number, status: b.status as OrderStatus } };
}
TS
echo "Wire validation into the create endpoint; unit-test it; verify end-to-end."
```

## Tasks
1. **Validate at the boundary.** In the create controller, run `validateCreateOrder(body)` *before* any service call. On `ok: false`, return `400 { error: 'validation_failed', issues }`. On `ok: true`, pass `value` (typed) to the service.
2. **No trust, no `as` on raw input.** The only place that touches `unknown` is the validator; everything downstream is typed.
3. **Distinguish validation from business rules.** A malformed body → 400 (validation). "Can't pay a cancelled order" → 409 (business rule, from the service). Keep them separate.
4. **Unit-test the validator** in Node: a valid body narrows to a typed value; each bad field (missing customer, non-positive total, bad status, non-object body) yields a useful issue.
5. **Verify end-to-end** that a malformed body returns 400 with issues and **never reaches the service** (instrument the service to prove it), while a valid body returns 201.

## Deliverable
The boundary validator; the validated create endpoint returning structured 400s; passing Node validator tests; end-to-end evidence (bad input → 400, never hits the service; valid → 201); and a note distinguishing one 400 from one 409.

## Cleanup
```bash
rm -f /tmp/swexp-be/validation.ts
```

## Check
`../solutions/lab-03-solution.md`.
