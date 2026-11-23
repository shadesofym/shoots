import { cpSync, copyFileSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const dest = resolve(root, 'dist');
rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
let html = readFileSync(resolve(root, 'index.html'), 'utf8');
for (const name of ['script.js', 'style.css']) {
  const hash = createHash('sha256').update(readFileSync(resolve(root, name))).digest('hex').slice(0, 12);
  html = html.replace(`"${name}"`, `"${name}?v=${hash}"`);
  copyFileSync(resolve(root, name), resolve(dest, name));
}
writeFileSync(resolve(dest, 'index.html'), html);
cpSync(resolve(root, 'assets'), resolve(dest, 'assets'), { recursive: true });
console.log('Cloudflare Pages: dist/ bereit. Originalfotos wurden byteidentisch kopiert.');
