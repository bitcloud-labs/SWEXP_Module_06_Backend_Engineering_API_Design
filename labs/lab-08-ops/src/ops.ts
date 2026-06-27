/**
 * Lab 08 — Pass the Production Readiness Review. See README.md.
 *
 * The operable bits as pure logic: readiness aggregation, boot-time config validation,
 * log redaction, and a graceful-shutdown drain decision.
 *
 * No `any`.
 */

// --- readiness aggregation ---------------------------------------------------

/** Ready only if EVERY dependency check passes. Echo the checks back. */
export function aggregateReadiness(
  checks: Record<string, boolean>,
): { ready: boolean; checks: Record<string, boolean> } {
  // TODO: ready = every value is true; return { ready, checks }.
  return { ready: false, checks };
}

// --- config validation at boot (fail fast) -----------------------------------

export interface Config {
  port: number;
  dbUrl: string;
  jwtSecret: string;
}

/**
 * Validate required env vars (PORT, DATABASE_URL, JWT_SECRET). Missing any →
 * { ok: false, missing: [...] } listing the absent keys (in that order). All present →
 * { ok: true, config }.
 */
export function loadConfig(
  env: Record<string, string | undefined>,
): { ok: true; config: Config } | { ok: false; missing: string[] } {
  // TODO: collect missing of ['PORT','DATABASE_URL','JWT_SECRET']; if any → fail;
  //       else build the typed Config (Number(PORT), etc.).
  return { ok: false, missing: ['PORT', 'DATABASE_URL', 'JWT_SECRET'] };
}

// --- log redaction -----------------------------------------------------------

const SECRET_KEYS = ['password', 'token', 'secret', 'authorization'];

/** Return a copy with secret-ish keys (case-insensitive) replaced by '[REDACTED]'. */
export function redact(entry: Record<string, unknown>): Record<string, unknown> {
  // TODO: for each [k,v], if SECRET_KEYS includes k.toLowerCase() → '[REDACTED]' else v.
  return { ...entry };
}

// --- graceful shutdown decision ----------------------------------------------

/** Keep draining while there is in-flight work AND we are under the deadline. */
export function shouldKeepDraining(inFlight: number, elapsedMs: number, deadlineMs: number): boolean {
  // TODO: inFlight > 0 && elapsedMs < deadlineMs.
  return false;
}
