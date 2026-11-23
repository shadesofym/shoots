import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const data = JSON.parse(readFileSync(resolve(root,'photos.json'), 'utf8'));
if (data.length !== 135) throw Error(`Erwartete 135 Fotos, gefunden ${data.length}`);
for (const p of data) {
  const f = resolve(root, p.src);
  if (!existsSync(f)) throw Error(`Foto fehlt: ${p.src}`);
  const sha = createHash('sha256').update(readFileSync(f)).digest('hex');
  if (p.sha256 !== sha) throw Error(`Original verändert: ${p.src}`);
}
const html = readFileSync(resolve(root,'index.html'),'utf8');
for (const p of data) if(!html.includes(p.src)) throw Error(`Nicht in der Galerie: ${p.src}`);
const counts = data.reduce((a,p)=>(a[p.category]=(a[p.category]||0)+1,a),{});
if(counts.portraet!==123 || counts.uo!==12) throw Error('Galerie-Anzahl inkorrekt');
console.log('Prüfung bestanden: 135 originale, unveränderte Fotos (123 Porträt, 12 weitere).');
