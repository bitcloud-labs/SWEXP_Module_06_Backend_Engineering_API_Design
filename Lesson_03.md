# Lesson 03 — Stop Invalid Requests at the Door

> **Role:** Backend Software Engineer · **Competency:** Validation · **Track:** VAL · **Est. time:** 3–4 hours

---

## 🎫 Engineering Ticket

```
TICKET:      VAL-2010
TITLE:       The API trusts whatever it's sent; validate at the boundary
PRIORITY:    P1 — security & correctness
TYPE:        Feature / Bug
DESCRIPTION: Endpoints currently parse request bodies and use them directly,
             trusting clients to send well-formed data. Validate every request at
             the boundary against a schema, reject bad input with a clear 400, and
             pass only typed, trusted data into the service layer.

ACCEPTANCE CRITERIA:
  - Every request body/params/query validated against a schema at the boundary
  - Invalid input is rejected with 400 and a clear, structured error
  - Only validated, typed data reaches the service layer
  - Validation is centralized (not scattered ad-hoc checks)
```

## 🏢 Business Context

The boundary is untrusted — the lesson you learned validating API responses in Module 05, now applied to *incoming* requests. A backend that trusts its input is one malformed payload away from a corrupted database, a crash, or a security hole. Validating at the door means every request is either rejected with a clear error or proven well-formed before any business logic runs. It's the single highest-leverage correctness-and-security practice in an API.

## 🎯 Learning Objectives

- Validate request bodies, params, and query against a schema at the boundary
- Reject invalid input with a 400 and a structured, useful error
- Pass only validated, typed data into services
- Centralize validation instead of scattering ad-hoc checks

## 📚 Technical Deep Dive

**Parse, don't trust.** Treat the request body as `unknown` until proven (Module 04's discipline). A schema turns `unknown` into a typed value or an error:

```ts
const CreateOrder = z.object({
  customer: z.string().min(1),
  total: z.number().positive(),
  status: z.enum(['placed', 'paid', 'shipped', 'cancelled']),
});
type CreateOrder = z.infer<typeof CreateOrder>;     // type derived from the schema

const parsed = CreateOrder.safeParse(req.body);
if (!parsed.success) return { status: 400, body: { error: 'validation_failed', issues: parsed.error.issues } };
const order: CreateOrder = parsed.data;             // typed & trusted from here
```
(A hand-written validator returning `{ ok: true, value } | { ok: false, errors }` works the same way — the point is a single function that *narrows* unknown input to a trusted type.)

**Validate everything that crosses the boundary:** body, path params (`:id` format), query (pagination, filters), and headers you depend on. Reject early, before any service call.

**A useful 400.** Tell the client *what* was wrong: which fields, which rules. A bare `400 Bad Request` forces guesswork; a structured `{ error: 'validation_failed', issues: [...] }` lets them fix it.

**Validation vs business rules.** Validation answers "is this request well-formed?" (a 400 — *400 = your request is malformed*). Business rules answer "is this operation allowed right now?" (often a 409/422 from the service — e.g. can't pay a cancelled order). Keep them distinct: schema at the boundary, rules in the service.

**Centralize it.** A validation middleware/wrapper that runs the schema and either rejects or passes typed data into the controller keeps every endpoint consistent and the controllers clean.

### Common gotchas
- Using `req.body` directly (trusting the client) — the boundary bug.
- `as` casting the body to a type instead of validating (an unchecked claim, Module 04).
- Vague 400s with no field-level detail.
- Conflating validation (400) with business rules (409/422) — or doing business checks before validating.

## 🧪 Hands-on Labs

Work through **`labs/lab-03-validation.md`**. You'll add boundary validation to the create/update Order endpoints with a schema, return structured 400s for bad input, and pass only typed data to the service. The validators are unit-tested in Node (valid input narrows to a typed value; each bad field is rejected with a useful error) and the endpoint is exercised end-to-end (a malformed body → 400 with issues; a valid body → 201).

## 🔍 Engineering Investigation

Send several malformed requests (missing field, wrong type, out-of-range, extra fields) and record the exact 400 responses. Confirm none of them reached the service (add a log/throw in the service to prove it). Then send a valid request and confirm it passes. Note one bug that would have happened downstream if the bad input had been trusted.

## 🤖 AI Engineering Exercise

Ask an AI to "validate this endpoint's input." **Verify** it validates at the boundary (not deep in the service), returns a structured 400, narrows to a typed value (no `as`), and distinguishes validation from business rules. **Log** where it trusted `req.body` or cast it and your fix.

## 📝 Assignment

Submit: the schema-validated endpoints, the structured 400 responses, passing Node tests of the validators, end-to-end evidence that bad input is rejected (and never reaches the service) while valid input succeeds, and a note distinguishing one validation failure (400) from one business-rule failure (409/422).

## 🚀 Stretch Goal

Add request-size limits and reject unknown/extra fields (strict schemas), and explain how each closes a specific abuse or bug vector.

## ✅ Definition of Done

- [ ] Every boundary input validated against a schema
- [ ] Invalid input rejected with a structured 400
- [ ] Only validated, typed data reaches services
- [ ] Validation centralized; distinct from business rules
- [ ] Validators unit-tested; endpoint verified end-to-end

## 🪞 Reflection

Which malformed input would have done the most damage if trusted? Where's the line between a 400 (validation) and a 409/422 (business rule), and why does keeping them separate matter?
