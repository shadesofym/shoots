"""Regenerate gallery derivatives with Pillow; full-resolution sources stay untouched."""
from hashlib import sha256
from pathlib import Path
import json
import re
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
photos = json.loads((ROOT / 'photos.json').read_text())
for photo in photos:
    source = photo.get('original', photo)
    source_bytes = (ROOT / source['src']).read_bytes()
    assert sha256(source_bytes).hexdigest() == source['sha256'], source['src']
    with Image.open(ROOT / source['src']) as image:
        assert image.size == (source['width'], source['height'])
        widths = sorted({min(width, image.width) for width in (480, 960, 1600, 2400)})
        photo['previews'] = []
        for width in widths:
            height = round(image.height * width / image.width)
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            path = Path('assets/previews') / photo['category'] / f"{Path(photo['filename']).stem}-{width}.webp"
            target = ROOT / path
            target.parent.mkdir(parents=True, exist_ok=True)
            options = {'icc_profile': image.info['icc_profile']} if image.info.get('icc_profile') else {}
            resized.save(target, 'WEBP', quality=90, method=6, **options)
            photo['previews'].append({'src': path.as_posix(), 'width': width, 'height': height,
                                      'sha256': sha256(target.read_bytes()).hexdigest()})
    print(photo['filename'], flush=True)
(ROOT / 'photos.json').write_text(json.dumps(photos, ensure_ascii=False, indent=2) + '\n')
embedded = [{k: v for k, v in photo.items() if k != 'sha256'} for photo in photos]
html_path = ROOT / 'index.html'
html = html_path.read_text()
html, count = re.subn(r'(<script type="application/json" id="photo-data">).*?(</script>)',
                     lambda m: m[1] + json.dumps(embedded, ensure_ascii=False) + m[2], html, flags=re.S)
assert count == 1
html_path.write_text(html)
