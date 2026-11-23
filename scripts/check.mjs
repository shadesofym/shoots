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

let previewCount = 0;
for (const p of data) {
  const source = p.original || p;
  if (!p.previews?.length) throw Error(`Vorschauen fehlen: ${p.src}`);
  let previousWidth = 0;
  for (const preview of p.previews) {
    if (preview.width <= previousWidth || preview.width > source.width || preview.height > source.height) throw Error(`Unzulässige Vorschaugröße: ${preview.src}`);
    if (Math.abs(preview.height - source.height * preview.width / source.width) > .51) throw Error(`Vorschau beschnitten: ${preview.src}`);
    const bytes = readFileSync(resolve(root, preview.src));
    if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') throw Error(`Kein WebP: ${preview.src}`);
    if (createHash('sha256').update(bytes).digest('hex') !== preview.sha256) throw Error(`Vorschau verändert: ${preview.src}`);
    previousWidth = preview.width;
    previewCount++;
  }
}
console.log(`${previewCount} WebP-Vorschauen geprüft: Format, Seitenverhältnis, Größen und Prüfsummen.`);

const fontSources = JSON.parse(readFileSync(resolve(root, 'assets/fonts/sources.json'), 'utf8'));
for (const font of fontSources) {
  const bytes = readFileSync(resolve(root, font.file));
  if (bytes.toString('ascii', 0, 4) !== 'wOF2' || createHash('sha256').update(bytes).digest('hex') !== font.sha256) throw Error(`Schriftdatei verändert: ${font.file}`);
}
if (/fonts\.(googleapis|gstatic)\.com/.test(readFileSync(resolve(root, 'style.css'), 'utf8'))) throw Error('Externe Google-Fonts-Anfrage vorhanden');
console.log(`${fontSources.length} lokale WOFF2-Schriften geprüft.`);
