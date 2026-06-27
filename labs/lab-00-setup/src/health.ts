/**
 * Lab 00 — Toolchain & a Minimal HTTP Service. See README.md.
 *
 * We test the *handler logic* directly (no real socket): a pure function that maps
 * a request (method + url) to a response (status + body + content type). This is the
 * same decision a real `http.createServer` callback makes — just isolated so it is
 * trivially testable.
 *
 * Implement by deciding on method/url — no `any`, no `as`.
 */

export interface HttpResponse {
  status: number;
  contentType: string;
  body: unknown;
}

/**
 * Route a request to a response.
 * - `GET /health` → 200, content-type `application/json`, body `{ status: 'ok' }`.
 * - anything else  → 404, content-type `application/json`, body `{ error: 'not_found' }`.
 */
export function handleRequest(method: string, url: string): HttpResponse {
  // TODO: return the deliberate 200 health response for `GET /health`,
  //       otherwise the 404 not_found response.
  return { status: 0, contentType: '', body: null };
}
