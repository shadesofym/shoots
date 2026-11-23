# SHOOTS FOR MOOD

Eigenständige Fotografie-Website im Stil **Cinematic Dark × Future Editorial** für Cloudflare Pages, mit Desktop- und Mobile-Layout.

## Originalfotos

**135 unveränderte Fotografien** aus dem WordPress-Galerieexport:

- `assets/portraet/` – 123 Bilder der Galerie «Porträt»
- `assets/uo/` – 12 weitere Bilder; auf der Website als «Weitere Arbeiten» bezeichnet
- Keine KI-Retusche, keine Farb- oder Kontrastfilter; sämtliche Bilddateien sind byteidentisch mit dem Import
- Alle Fotos werden vollständig mit `object-fit: contain` gezeigt; die Galerie lässt Bilder in einer Vollbildansicht öffnen
- `photos.json` enthält Bilddimensionen und SHA-256-Prüfsummen zur Überprüfung

Der Export kann zusätzliche Vorschaubilder und `_backup`-Dateien enthalten. Diese wurden nicht mit den 135 Galerieeinträgen vermischt; die ursprüngliche WordPress-ZIP bleibt als Archiv erhalten.

## Lokal überprüfen

```bash
npm run check
npm run build
python3 -m http.server 8080 --directory dist
```

Im Browser `http://localhost:8080` öffnen und Desktop, Tablet, Mobile, Menü, Filter, Bilder und Vollbildansicht überprüfen.

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
