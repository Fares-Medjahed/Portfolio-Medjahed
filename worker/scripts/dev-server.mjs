// Serveur local (sans wrangler) : fait tourner le Worker sur http://localhost:8787
// Lit les clés dans worker/.dev.vars. Usage : node scripts/dev-server.mjs
import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import worker from '../src/index.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const env = { ...process.env };
const varsFile = path.join(dir, '..', '.dev.vars');
if (existsSync(varsFile)) {
  for (const line of readFileSync(varsFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !line.trim().startsWith('#')) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
env.ALLOWED_ORIGINS ||= 'http://localhost:8080,http://127.0.0.1:8080';

const server = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const request = new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method,
    headers: { ...req.headers, 'cf-connecting-ip': req.socket.remoteAddress },
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks)
  });
  const response = await worker.fetch(request, env, { waitUntil: (p) => p.catch(() => {}) });
  res.writeHead(response.status, Object.fromEntries(response.headers));
  if (!response.body) return res.end();
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
});
const port = Number(process.env.PORT) || 8787;
server.listen(port, () => console.log(`Chatbot local : http://localhost:${port}/chat`));
