import { describe, it, expect } from 'vitest';
import { validateCreateOrder } from '../src/validation';

const fieldsWithIssues = (input: unknown): string[] => {
  const r = validateCreateOrder(input);
  return r.ok ? [] : r.issues.map((i) => i.field);
};

describe('lab 03 — boundary validation', () => {
  it('a valid body narrows to a typed value', () => {
    const r = validateCreateOrder({ customer: 'Ada', total: 100, status: 'placed' });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toEqual({ customer: 'Ada', total: 100, status: 'placed' });
    }
  });

  it('a non-object body is rejected with a single `_` issue', () => {
    for (const bad of [null, 42, 'nope', undefined]) {
      const r = validateCreateOrder(bad);
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.issues).toHaveLength(1);
        expect(r.issues[0]?.field).toBe('_');
      }
    }
  });

  it('flags a missing / empty customer', () => {
    expect(fieldsWithIssues({ total: 10, status: 'placed' })).toContain('customer');
    expect(fieldsWithIssues({ customer: '   ', total: 10, status: 'placed' })).toContain('customer');
  });

  it('flags a non-positive or non-numeric total', () => {
    expect(fieldsWithIssues({ customer: 'A', total: 0, status: 'placed' })).toContain('total');
    expect(fieldsWithIssues({ customer: 'A', total: -5, status: 'placed' })).toContain('total');
    expect(fieldsWithIssues({ customer: 'A', total: 'lots', status: 'placed' })).toContain('total');
  });

  it('flags an invalid status', () => {
    expect(fieldsWithIssues({ customer: 'A', total: 10, status: 'archived' })).toContain('status');
    expect(fieldsWithIssues({ customer: 'A', total: 10 })).toContain('status');
  });

  it('collects multiple issues at once', () => {
    const fields = fieldsWithIssues({ customer: '', total: -1, status: 'bad' });
    expect(fields).toEqual(expect.arrayContaining(['customer', 'total', 'status']));
    expect(fields.length).toBe(3);
  });

  it('every issue carries a non-empty message', () => {
    const r = validateCreateOrder({ customer: '', total: -1, status: 'bad' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      for (const issue of r.issues) expect(issue.message.length).toBeGreaterThan(0);
    }
  });
});
