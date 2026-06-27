# Lesson 00 — Welcome to the Backend Engineering Team

> **Role:** Backend Software Engineer · **Competency:** Backend Orientation · **Track:** BE · **Est. time:** 2–3 hours

---

## 🎫 Engineering Ticket

```
TICKET:      BE-1000
TITLE:       Onboard to the Project Forge backend platform
PRIORITY:    P1 — blocks all backend work
TYPE:        Onboarding
ASSIGNEE:    You (Backend Software Engineer, Platform Team)
DESCRIPTION: The Forge frontend (Module 05) currently runs against a mock API at
             api.forge.dev. The team is now building the real backend that powers
             it. Set up the toolchain, understand the request/response lifecycle
             and where backend code sits, and stand up a minimal HTTP service you
             can build on for the rest of the module.

ACCEPTANCE CRITERIA:
  - Node + TypeScript toolchain runs; a minimal HTTP service responds locally
  - You can explain the request → handler → response lifecycle
  - You can describe what lives on the backend vs the frontend, and why
  - You understand how this module's pieces fit a production platform
  - Your engineering notebook has a dated first entry
```

## 🏢 Business Context

The frontend is only half the product. Behind every screen sits a backend that owns the data, enforces the rules, authenticates users, and stays up under load — the things you *cannot* trust a browser to do. In Module 05 the frontend talked to a mock; now you build the real service it depends on. A backend is where correctness, security, and reliability are decided, so the discipline you bring here determines whether Forge is a demo or a product.

## 🎯 Learning Objectives

- Set up a Node + TypeScript backend project and run an HTTP service
- Explain the request → handler → response lifecycle
- Articulate the backend/frontend split and why certain work must be server-side
- Map the module's arc (REST → architecture → validation → auth → platform → ops → release)

## 📚 Technical Deep Dive

**A backend is a function of requests.** At its core, an HTTP service receives a request (method, path, headers, body), does work, and returns a response (status code, headers, body). Everything else — frameworks, routers, middleware — is structure around that loop.

```ts
import http from 'node:http';
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});
server.listen(3000);
```

**Why work belongs on the server.** The browser is untrusted: anything it enforces, a user can bypass. Authentication, authorization, validation, business rules, and data access live on the backend because that's the only place they can't be tampered with. (This is the *boundary is untrusted* discipline from Modules 04–05, now from the other side.)

**TypeScript on the backend.** The same type safety from Module 04 applies — typed request/response shapes, typed domain models, illegal states unrepresentable. The compiler is still your first reviewer.

**The module arc.** You'll replace the mock with real REST endpoints, organize them into layers, validate input, authenticate and authorize requests, harden the API into a platform (errors, pagination, rate limits), move slow work to background jobs, make it operationally ready (health, logging, graceful shutdown), and ship it.

### Common gotchas
- Treating the backend like the frontend — trusting input, putting rules in the client.
- Forgetting that every response needs a deliberate status code and content type.
- Skipping types "because it's just an API" — typed contracts matter most at the boundary.

## 🧪 Hands-on Labs

Work through **`labs/lab-00-setup.md`**: set up the Node + TypeScript toolchain, stand up a minimal HTTP service with a `/health` endpoint, type-check it, and verify it responds correctly by making a real request to it.

## 🔍 Engineering Investigation

Start your service and hit `/health` and an unknown path. Record the exact status codes, headers, and bodies. In your notebook, trace one request through the lifecycle (received → matched → handled → responded) and note which decisions (status, content type) you made explicitly.

## 🤖 AI Engineering Exercise

Ask an AI to "set up a basic Node API." **Draft** it, then **verify**: does it type-check, return deliberate status codes, and keep server-only concerns on the server? **Log** what you kept and corrected. The loop all module: **draft → verify (type-check + run/test + measure) → log.**

## 📝 Assignment

1. Stand up the service; paste `node --version` and a real request/response to `/health`.
2. Complete the lab; include the type-check result and the responses for a known and unknown path.
3. Write a 5–8 sentence explainer: "what belongs on the backend vs the frontend, and why."
4. Commit your notebook.

## 🚀 Stretch Goal

Add a second route and a tiny router (a map of `method + path` → handler) instead of an `if` ladder. Note how this sets up the controller structure you'll build in Lesson 1.

## ✅ Definition of Done

- [ ] Node + TypeScript service runs locally
- [ ] `/health` returns a deliberate 200 JSON response; unknown paths return 404
- [ ] Type-check is clean
- [ ] Backend-vs-frontend explainer written
- [ ] Notebook committed

## 🪞 Reflection

What must live on the backend that a browser can never be trusted to do? Where do you expect the request/response discipline to matter most as Forge grows?
