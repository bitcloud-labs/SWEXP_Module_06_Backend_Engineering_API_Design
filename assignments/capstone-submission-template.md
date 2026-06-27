# FORGE-9400 Capstone Submission — [Your Name]

**Date:** [date] · **Time spent:** [hours] · **Repo:** [link]

## Executive summary
2–4 sentences: what you shipped, your architecture/security approach (the build order), and the headline result — what's production-ready and how you know.

## Per-phase release record
Repeat for each phase (A REST+layers+validation → B security → C platform+jobs → D ops+release).

### Phase X — [name]
- **What I built:** [endpoints/services/auth/jobs/ops]
- **Key decisions & why:** [layer boundaries, security model, idempotency, etc.]
- **Evidence:** type-check result; Node tests; endpoint request/response transcripts

```ts
// representative code for this phase
```

## Architecture
The controller → service → repository split; the repository interface; proof the service is testable without HTTP (paste the service-test output).

## Security
Authentication: password hashing + token verify-before-trust, failing safe (tampered/expired → 401). Authorization: the centralized policy (role + ownership, least privilege), 403 vs 401. Paste the auth/authz evidence.

## API platform
The consistent error envelope; pagination with a clamped limit; idempotency (a retried unsafe op acts **once** — show the counter); rate limiting (over-limit → **429** + `Retry-After`).

## Background processing
The queue with bounded retries + backoff; an idempotent job; dead-lettering. Evidence: transient recovers; permanent → DLQ after maxAttempts (no infinite loop); duplicate run no-ops.

## Operational readiness
Liveness (trivial) vs readiness (dependency-aware, reflects a downed dependency); structured correlated logs that redact secrets; env config validated at boot (missing → fail fast); graceful shutdown draining in-flight work.

## Production-readiness summary
What each quality bar guarantees and how you verified it. `tsc --noEmit` clean; no `any`.

## AI-usage log
| Asked | AI suggested | Verified (type-check/test/request) | Outcome |
|-------|-------------|-------------------------------------|---------|
| | | | |
Include at least one case where a verifier **overruled** the AI (e.g. trusted `req.body`, fast-hashed password, trust-before-verify token, allow-by-default authz, non-idempotent retry, dep-check in liveness).

## Reflection
The integration decision with the widest blast radius; where a security/reliability bar forced a change you'd have skipped under time pressure; how you'd ship the next service faster.

---
**Self-check vs rubric:** [ ] Architecture [ ] Security [ ] API Platform [ ] Data Platform [ ] Background Processing [ ] Operations [ ] Documentation [ ] Engineering Judgment [ ] AI Workflow
