# SHOOTS FOR MOOD

Eigenständige Fotografie-Website im Stil **Cinematic Dark × Future Editorial** für Cloudflare Pages, mit Desktop- und Mobile-Layout.

## Originalfotos

**112 Fotografien in einer gemeinsamen Galerie** aus dem WordPress-Galerieexport:

- `assets/portraet/` – 101 ausgewählte Bilder
- `assets/uo/` – 11 weitere ausgewählte Bilder
- Keine KI-Retusche, keine Farb- oder Kontrastfilter; sämtliche JPEG-Originaldateien sind byteidentisch mit dem Import
- Alle Fotos werden vollständig mit `object-fit: contain` gezeigt; die Galerie lässt Bilder in einer Vollbildansicht öffnen
- `photos.json` enthält Bilddimensionen und SHA-256-Prüfsummen zur Überprüfung

Der Export kann zusätzliche Vorschaubilder und `_backup`-Dateien enthalten. Diese wurden nicht mit den 135 Galerieeinträgen vermischt; die ursprüngliche WordPress-ZIP bleibt als Archiv erhalten.

## Lokal überprüfen

```bash
npm run check
npm run build
python3 -m http.server 8080 --directory dist
```

Im Browser `http://localhost:8080` öffnen und Desktop, Tablet, Mobile, Menü, Bilder und Vollbildansicht überprüfen.

## Cloudflare Pages (GitHub)

1. Vollständigen Projektinhalt (inkl. `assets/`) in das **eigene** GitHub-Repository `shadesofym/shoots` übertragen.
2. Cloudflare → Workers & Pages → SHOOTS-Projekt → Settings → Builds & deployments.
3. **Production branch:** `main`; **Framework preset:** None; **Build command:** `npm run build`; **Build output directory:** `dist`; **Root directory:** `/`.
4. Preview auf der `.pages.dev`-Adresse prüfen, bevor die Domain `shoots.moyodogs.com` umgestellt wird.
5. Die bestehende MOYO-DOGS-Website `moyodogs.com` bleibt unberührt.

Wenn GitHub nicht automatisch veröffentlicht, in den Cloudflare-Projekteinstellungen kontrollieren, welches Repository verbunden wurde.

## Veröffentlichungs-Hinweise

- Die beiden Shooting-Anfrage-Links zeigen **vorläufig** auf `zucht@moyodogs.com`, weil keine eigenständige SHOOTS-Kontaktadresse bestätigt wurde. Vor Livegang gegebenenfalls ersetzen.
- Rechtliche Seiten wie Impressum und Datenschutzhinweise sind noch nicht hinterlegt; vor einem öffentlichen Launch prüfen und ergänzen.
- Der neue Internetauftritt ersetzt nicht automatisch dein bestehendes WordPress: Domain und DNS erst nach erfolgreicher Preview umstellen.

## Bildqualität

Für 111 der 112 Fotografien sind die größeren, bereits wassergezeichneten Dateien aus `fm-selection-j721451.zip` unter `assets/originals/` enthalten. Sie wurden byteidentisch aus den passenden `_backup`-Einträgen übernommen, ohne neue Kompression, Hochskalierung, Retusche oder Beschnitt. `scripts/image-sources.json` dokumentiert die Herkunft; `photos.json` enthält Auflösung und SHA-256 für Vorschau und Original. SKADIANYVOLOW.jpg bleibt bei 1500 × 1000 Pixeln: Das Archiv enthält keine größere Version.

Die Galerie wählt per `srcset`/`sizes` passende WebP-Vorschauen mit 480, 960, 1600 oder bis zu 2400 Pixeln Breite; es wird niemals hochskaliert. Das Titelbild wählt weiterhin zwischen den vorhandenen JPEG-Dateien. Die Lightbox lädt immer das größte vorhandene Original. Auf kleinen Bildschirmen bleiben Bild und beide Pfeile vollständig im Fenster. Der Bildzoom beim Hover entfällt. Die natürliche Unschärfe innerhalb der Fotografien wird nicht verändert.

`npm run check` prüft beide Dateiversionen sowie die Übereinstimmung mit den eingebetteten Galeriedaten. `npm run build` kopiert sämtliche Fotos unverändert. Die Cloudflare-Verbindung kann außerhalb des hier verfügbaren Kontos liegen; maßgeblich ist die tatsächliche Auslieferung auf shoots.moyodogs.com.

## WebP-Galerievorschauen

`assets/previews/` enthält aus den größten vorhandenen Quellen erzeugte WebP-Dateien (Qualität 90). Das gesamte Bild inklusive Wasserzeichen wird proportional verkleinert, ohne Beschnitt, Farbfilter oder Retusche; eingebettete ICC-Farbprofile werden übernommen. Die Galerie lädt Bilder erst in der Nähe des sichtbaren Bereichs. Bei einem Ladefehler fällt sie auf das vorhandene JPEG zurück. Die Lightbox verwendet weiterhin unveränderte JPEG-Originale.

Zum erneuten Erzeugen: Python mit Pillow bereitstellen und `python3 scripts/generate-previews.py` ausführen. Das Skript prüft die Quell-Prüfsummen und aktualisiert `photos.json` sowie die eingebetteten Galeriedaten. Für den Cloudflare-Build sind weder Python noch zusätzliche Pakete nötig; die fertigen Vorschauen sind eingecheckt.

Der Build versieht JavaScript- und CSS-Adressen automatisch mit einem Inhalts-Hash. So erhalten auch wiederkehrende Besucher nach Änderungen die aktuelle Darstellung statt bis zu vier Stunden alte Browser-Cache-Dateien.
