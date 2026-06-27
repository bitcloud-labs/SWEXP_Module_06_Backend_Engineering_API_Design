import { describe, it, expect } from 'vitest';
import { handleRequest } from '../src/health';

describe('lab 00 — minimal HTTP service (handler logic)', () => {
  it('GET /health returns 200 with { status: "ok" }', () => {
    const res = handleRequest('GET', '/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /health responds as JSON', () => {
    expect(handleRequest('GET', '/health').contentType).toBe('application/json');
  });

  it('unknown paths return 404 not_found', () => {
    const res = handleRequest('GET', '/missing');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'not_found' });
    expect(res.contentType).toBe('application/json');
  });

  it('a non-GET method on /health is not the health response', () => {
    // /health is a GET resource; other methods fall through to 404 here.
    expect(handleRequest('POST', '/health').status).toBe(404);
  });
});
