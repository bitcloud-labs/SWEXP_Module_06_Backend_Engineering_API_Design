# Lesson NN Submission — [Your Name]

**Ticket:** [e.g. AUTH-3001] · **Date:** [date] · **Lesson:** [title]

## 1. Goal / Definition of Done
What the ticket asked; the acceptance criteria you met.

## 2. What I built
The controllers/services/repositories/validators/auth/jobs/ops, and *why this shape*. Note key decisions: which layer holds the logic, how the boundary is validated, how security fails safe, what's idempotent, how errors map to status codes.

```ts
// the key code
```

## 3. Evidence
- **Type-check:** `tsc --noEmit` result; contract errors expected and confirmed.
- **Tests:** Node output for the pure logic / auth (real crypto) / policy / jobs / ops.
- **Endpoints:** request/response transcripts — status codes, `Location`, idempotency replay, 401 vs 403, 429 + `Retry-After`, readiness reflecting a downed dependency.

## 4. Fix at the cause
What you changed and why it addresses the cause — no `any`, no silenced errors, no trusting input.

## 5. AI-usage log
| Asked | AI suggested | Verified (type-check/test/request) | Outcome |
|-------|-------------|-------------------------------------|---------|
| | | | accepted / corrected because… |

## 6. Reflection
What this taught you; where a security/reliability bar caught something; what you'd architect differently.

---
**Checklist:** [ ] boundary validated · [ ] layers with clear contracts · [ ] illegal states unrepresentable · [ ] fails safe / least privilege · [ ] honest status codes · [ ] AI output verified · [ ] commits clean
