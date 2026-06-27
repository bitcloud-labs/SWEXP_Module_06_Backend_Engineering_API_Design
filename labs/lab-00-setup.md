# Lab 00 — Toolchain & a Minimal HTTP Service

**Lesson:** 00 · **Goal:** a running Node + TypeScript HTTP service with a `/health` endpoint, type-checked and verified with a real request.

## Goal
Stand up the backend toolchain, serve a deliberate `/health` response, and confirm it behaves by making a real request to it.

## Setup
```bash
mkdir -p /tmp/swexp-be && cd /tmp/swexp-be
npm init -y >/dev/null
npm i -D typescript @types/node
cat > tsconfig.json <<'JSON'
{ "compilerOptions": {
    "target": "ES2022", "module": "NodeNext", "moduleResolution": "nodenext",
    "strict": true, "noEmit": true, "skipLibCheck": true,
    "lib": ["ES2022"], "types": ["node"] },
  "include": ["*.ts"] }
JSON
cat > server.ts <<'TS'
import http from 'node:http';
export function createServer() {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'not_found' }));
  });
}
TS
echo "Type-check, then verify with a real request:"
tsc --noEmit
```

## Tasks
1. **Type-check** the service: `tsc --noEmit` exits 0.
2. **Serve `/health`** returning a deliberate `200` JSON `{ status: 'ok' }` with a JSON content type; unknown paths return `404 { error: 'not_found' }`.
3. **Verify with a real request.** Write a small `.mjs` test that starts the server on an ephemeral port, `fetch`es `/health` (assert 200 + body) and an unknown path (assert 404), then closes it.
4. **Trace the lifecycle.** In your notebook, follow one request: received → method/url matched → handled → responded, noting the status and content type you set explicitly.
5. **Backend vs frontend.** Write 5–8 sentences on what must live server-side and why.

## Verify (example harness)
```bash
cat > verify.mjs <<'JS'
import http from 'node:http';
import assert from 'node:assert';
const server = http.createServer((req,res)=>{ if(req.method==='GET'&&req.url==='/health'){res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify({status:'ok'}));return;} res.writeHead(404,{'content-type':'application/json'});res.end(JSON.stringify({error:'not_found'})); });
await new Promise(r=>server.listen(0,r));
const p=server.address().port;
const a=await fetch(`http://127.0.0.1:${p}/health`); assert.strictEqual(a.status,200); assert.deepStrictEqual(await a.json(),{status:'ok'});
const b=await fetch(`http://127.0.0.1:${p}/missing`); assert.strictEqual(b.status,404);
server.close(); console.log('HEALTH ENDPOINT VERIFIED');
JS
node verify.mjs
```

## Deliverable
`node --version`; the clean type-check; the verified request/response for `/health` (200) and an unknown path (404); and your backend-vs-frontend explainer.

## Cleanup
```bash
rm -f /tmp/swexp-be/verify.mjs       # keep the project; you'll build on it
```

## Check
`../solutions/lab-00-solution.md`.
