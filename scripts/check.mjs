import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const data = JSON.parse(readFileSync(resolve(root,'photos.json'), 'utf8'));
if (data.length !== 112) throw Error(`Erwartete 112 Fotos, gefunden ${data.length}`);
for (const p of data) {
  const f = resolve(root, p.src);
  if (!existsSync(f)) throw Error(`Foto fehlt: ${p.src}`);
  const sha = createHash('sha256').update(readFileSync(f)).digest('hex');
  if (p.sha256 !== sha) throw Error(`Original verändert: ${p.src}`);
}
const html = readFileSync(resolve(root,'index.html'),'utf8');
for (const p of data) if(!html.includes(p.src)) throw Error(`Nicht in der Galerie: ${p.src}`);
const counts = data.reduce((a,p)=>(a[p.category]=(a[p.category]||0)+1,a),{});
if(counts.portraet!==101 || counts.uo!==11) throw Error('Galerie-Anzahl inkorrekt');
console.log('Prüfung bestanden: 112 eindeutige Originalfotos.');
const embedded = JSON.parse(html.match(/<script type="application\/json" id="photo-data">([\s\S]*?)<\/script>/)[1]);
if (embedded.length !== data.length) throw Error('Eingebettete Galerie-Anzahl inkorrekt');
for (const [i, p] of data.entries()) {
  const { sha256, ...expected } = p;
  if (JSON.stringify(embedded[i]) !== JSON.stringify(expected)) throw Error(`Veraltete Galeriedaten: ${p.src}`);
  if (!p.original) continue;
  const o = p.original;
  if (o.width <= p.width || o.height <= p.height) throw Error(`Keine höhere Auflösung: ${o.src}`);
  if (Math.abs(o.width / o.height - p.width / p.height) > .001) throw Error(`Anderes Bildformat: ${o.src}`);
  if (createHash('sha256').update(readFileSync(resolve(root, o.src))).digest('hex') !== o.sha256) throw Error(`Original verändert: ${o.src}`);
}
console.log('Auflösung, Prüfsummen und eingebettete Bilddaten stimmen überein.');
