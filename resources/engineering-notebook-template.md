# Engineering Notebook — Template

Your professional record. One entry per lesson/lab. Evidence is the type-check output, the test results, and the request/response transcripts.

---

## [Date] — Lesson NN: [Title] (TICKET-ID)

### Ticket / goal
What was asked; the acceptance criteria / Definition of Done.

### What I built
The controllers/services/repositories/validators/auth/jobs/ops and the key decisions — where logic lives (which layer), how the boundary is validated, how security fails safe, what's idempotent. *Why* this shape.

### Evidence
- **Type-check:** `tsc --noEmit` result; contract errors I expected and confirmed.
- **Tests:** Node results for service rules / validators / policy / auth (real crypto) / backoff / ops logic.
- **Endpoints:** request/response transcripts (status codes, `Location`, idempotency replay, 401/403, 429, readiness).

### Fixes
What I changed and why it addresses the cause (not a workaround). No `any`; no silenced errors; no trusting input.

### AI usage log
- Asked: …
- AI suggested: …
- Verified: type-check / test / request said …
- Outcome: accepted / corrected because …

### Reflection
What this taught me; where a security/reliability bar caught something; what I'd architect differently.

---

**Standards:** the boundary is untrusted; layers with clear contracts; illegal states unrepresentable; fail safe, not open; least privilege; measure first, design for failure; **draft → verify → log** for AI.
