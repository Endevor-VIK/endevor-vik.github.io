#!/usr/bin/env python3
# W4.AD: A08 protocol_gate derivatives from the CREATOR Visual Library V1 original (941×1672 PNG), never upscaled.
# Same recipe as the W3.C world library: AVIF 4:4:4 q80 (primary) + WebP q92 (fallback), each checked against a LANCZOS
# reference by PSNR and edge retention (Laplacian variance of encode ÷ reference). The archive is read in memory;
# only the one member is decoded. Usage: python3 -I build_a08.py <AXIOM_SHOWCASE_VISUAL_LIBRARY_V1.zip>
import hashlib, io, json, math, os, site, sys, zipfile
sys.path.append(site.getusersitepackages())
from PIL import Image, ImageChops, ImageStat

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'proposed-assets')
MEMBER = 'AXIOM_SHOWCASE_VISUAL_LIBRARY_V1/originals_png/A08_protocol_gate.png'
ORIGINAL_SHA = '736a2df314ca582f7593e204ef975aa062a9f2021c2a80f0d102cebaec1e7416'  # = library manifest original_sha256
WIDTHS = (480, 720, 941)


def lap(im):  # pure Python (no numpy on this host): variance of the 4-neighbour Laplacian over interior pixels
    g = im.convert('L'); w, h = g.size; d = list(g.getdata()); n = s1 = s2 = 0
    for y in range(1, h - 1):
        r = y * w
        for x in range(r + 1, r + w - 1):
            v = d[x - 1] + d[x + 1] + d[x - w] + d[x + w] - 4 * d[x]; n += 1; s1 += v; s2 += v * v
    return s2 / n - (s1 / n) ** 2


def psnr(a, b):
    st = ImageStat.Stat(ImageChops.difference(a, b)); m = sum(st.sum2) / (a.width * a.height * 3)
    return 99.0 if m == 0 else round(10 * math.log10(255 ** 2 / m), 1)


z = zipfile.ZipFile(sys.argv[1])
raw = z.read(MEMBER)
manifest = json.loads(z.read('AXIOM_SHOWCASE_VISUAL_LIBRARY_V1/manifest.json'))
entry = next(x for x in manifest['assets'] if x['id'] == 'A08_protocol_gate')
assert hashlib.sha256(raw).hexdigest() == ORIGINAL_SHA == entry['original_sha256'], 'A08 original does not match library manifest'
src = Image.open(io.BytesIO(raw)).convert('RGB')
assert src.size == (941, 1672), src.size
os.makedirs(OUT, exist_ok=True)
result = {'id': 'A08_protocol_gate', 'archive': os.path.basename(sys.argv[1]), 'member': MEMBER, 'original': {'sha256': ORIGINAL_SHA, 'width': src.width, 'height': src.height},
          'manifestRole': entry.get('intended_role'), 'manifestNote': entry.get('editorial_note'), 'textRule': entry.get('text_recommendation'), 'web': []}
for w in WIDTHS:
    ref = src if w == src.width else src.resize((w, round(src.height * w / src.width)), Image.LANCZOS)
    for fmt, ext, kw in (('AVIF', 'avif', dict(quality=80, speed=4, subsampling='4:4:4')), ('WEBP', 'webp', dict(quality=92, method=6))):
        name = f'A08_protocol_gate-{w}w.{ext}'
        ref.save(os.path.join(OUT, name), fmt, **kw)
        data = open(os.path.join(OUT, name), 'rb').read()
        dec = Image.open(io.BytesIO(data)).convert('RGB')
        result['web'].append({'file': name, 'width': ref.width, 'height': ref.height, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(),
                              'psnr_db': psnr(ref, dec), 'edge_retention': round(lap(dec) / lap(ref), 2)})
with open(os.path.join(OUT, 'derivatives.json'), 'w') as f:
    json.dump(result, f, ensure_ascii=False, indent=1)
print(' '.join(f"{x['file'].split('-')[-1]}:{x['bytes'] // 1024}K/{x['psnr_db']}dB/{x['edge_retention']}" for x in result['web']))
