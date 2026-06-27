# Backend Setup Guide

## Project + toolchain
```bash
mkdir forge-backend && cd forge-backend
npm init -y
npm i -D typescript @types/node
```
```jsonc
// tsconfig.json
{ "compilerOptions": {
    "target": "ES2022", "module": "NodeNext", "moduleResolution": "nodenext",
    "strict": true, "noEmit": true, "skipLibCheck": true,
    "lib": ["ES2022"], "types": ["node"] },
  "include": ["src"] }
```

## The verify loop (no heavy frameworks needed)
| Command | Does |
|---------|------|
| `tsc --noEmit` | type-checks contracts; no output |
| `node file.mjs` | runs pure logic / unit tests (`node:assert`) |
| in-process `http` server + `fetch` | exercises endpoints end-to-end |

You can verify a whole API with **zero external services**: start `http.createServer(...)` on `listen(0)` (an ephemeral port) and hit it with global `fetch` in the same script.

```js
const server = http.createServer(handler);
await new Promise(r => server.listen(0, r));
const port = server.address().port;
const res = await fetch(`http://127.0.0.1:${port}/health`);
```

## Project shape (layered)
```
src/
  controllers/   # HTTP ↔ domain
  services/      # business logic (no HTTP/DB)
  repositories/  # data access behind interfaces
  domain/        # types, domain errors
  platform/      # error envelope, pagination, rate limit, idempotency
  jobs/          # background queue + workers
  ops/           # health, logging, config, shutdown
```

## Gotchas
- `tsc file.ts` ignores `tsconfig.json` — run `tsc --noEmit` (no file) or `-p`.
- Node 18+ has global `fetch`; `node:crypto` is built in (used for auth).
- Keep `strict: true` — the boundary is exactly where types earn their keep.
