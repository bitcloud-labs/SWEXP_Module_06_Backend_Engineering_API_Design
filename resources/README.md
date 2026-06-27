# Resources — Backend Engineering & API Design

Working references to keep open while you build the Forge backend. Quick-reference cheatsheets and playbooks, not reading assignments.

| Resource | Use it for |
|----------|-----------|
| `backend-setup-guide.md` | Node + TS toolchain; the type-check + HTTP-test loop |
| `rest-api-reference.md` | resources, methods, status codes, controllers |
| `layered-architecture-guide.md` | controller / service / repository contracts |
| `validation-guide.md` | boundary validation; structured 400s |
| `authentication-guide.md` | password hashing, signed tokens, fail-safe |
| `authorization-guide.md` | role + ownership, 401 vs 403, least privilege |
| `api-platform-standards.md` | error envelope, pagination, idempotency, rate limiting |
| `background-processing-guide.md` | queues, retries/backoff, idempotency, DLQ |
| `operational-readiness-checklist.md` | health, logs, config, graceful shutdown |
| `http-status-code-reference.md` | which status code for which outcome |
| `error-handling-guide.md` | domain errors → status codes, one envelope |
| `ai-workflow-guide.md` | draft → verify (type-check + test/run + measure) → log |
| `engineering-notebook-template.md` | the notebook structure you submit |

**Threads through all of them:** the boundary is untrusted; layers with clear contracts; make illegal states unrepresentable; fail safe, not open; least privilege; measure first, design for failure.
