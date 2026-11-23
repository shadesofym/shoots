import { cpSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const dest = resolve(root, 'dist');
rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
for (const name of ['index.html', 'script.js', 'style.css']) copyFileSync(resolve(root, name), resolve(dest, name));
cpSync(resolve(root, 'assets'), resolve(dest, 'assets'), { recursive: true });
console.log('Cloudflare Pages: dist/ bereit. Originalfotos wurden byteidentisch kopiert.');
