// Fusionne les modules de src/ en UN SEUL fichier (dist/worker.js) à coller dans
// l'éditeur du tableau de bord Cloudflare (aucun terminal nécessaire).
// Usage : node scripts/bundle.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const order = ['guard', 'knowledge', 'prompt', 'ratelimit', 'providers', 'index'];
let out = '// Fichier généré par `npm run bundle` : ne pas modifier à la main (éditez worker/src/).\n';
for (const name of order) {
  let code = readFileSync(path.join(dir, 'src', `${name}.js`), 'utf8');
  code = code.replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?[ \t]*\r?\n/gm, '');
  code = code.replace(/^export default /m, '@@DEFAULT@@');
  code = code.replace(/^export (async function|function|const|class|let)/gm, '$1');
  code = code.replace('@@DEFAULT@@', 'export default ');
  out += `\n// ===== ${name}.js =====\n${code.trim()}\n`;
}
writeFileSync(path.join(dir, 'dist', 'worker.js'), out);
console.log(`dist/worker.js généré (${out.length} caractères)`);
