# Lab 00 — Toolchain & a Minimal HTTP Service

**Lesson:** 00 · **Goal:** a deliberate `/health` endpoint, decided by pure handler logic and verified by tests.

## What you do
In [`src/health.ts`](src/health.ts), implement `handleRequest(method, url)` — the same decision a
`http.createServer` callback makes, isolated so it is trivially testable (no real socket):

- `GET /health` → `200`, content-type `application/json`, body `{ status: 'ok' }`.
- anything else → `404`, content-type `application/json`, body `{ error: 'not_found' }`.

Run:
```bash
npx vitest run labs/lab-00-setup
```

## Definition of done
- All tests pass; `npm run check` clean.
- In your notebook, trace one request: received → method/url matched → handled → responded, noting the
  status and content type you set **explicitly**. Write 5–8 sentences on what must live server-side and why.

## Submit
Edit `src/`, run the tests, commit and push.
