import json, sys, re
from PIL import Image
meta = json.load(open(sys.argv[1]))
def lum(rgb):
    def ch(c):
        c = c/255; return c/12.92 if c <= .03928 else ((c+.055)/1.055)**2.4
    r,g,b = rgb[:3]; return .2126*ch(r)+.7152*ch(g)+.0722*ch(b)
def parse(c):
    m = re.findall(r'[\d.]+', c); return tuple(float(x) for x in m[:3])
res = {}
for w, m in meta.items():
    ims = [Image.open(s).convert('RGB') for s in m['shots']]; d = m['dpr']; res[w] = {}
    for it in m['items']:
        tl = lum(parse(it['color'])); worst = None
        for im in ims:
            for (l, t, r, b) in it['rects']:
                box = im.crop((int(l*d), int(t*d), int(r*d), int(b*d)))
                px = sorted(lum(p) for p in box.getdata())
                if not px: continue
                p95 = px[int(len(px)*.95)-1 if len(px) > 1 else 0]; mean = sum(px)/len(px)
                for bg in (p95,):
                    hi, lo = max(tl, bg), min(tl, bg); cr = (hi+.05)/(lo+.05)
                    if worst is None or cr < worst[0]: worst = (round(cr, 2), round(bg, 4), round(mean, 4))
        res[w][it['sel']] = {'textLum': round(tl, 3), 'worstContrastP95': worst[0], 'bgP95Lum': worst[1], 'bgMeanLum': worst[2]}
print(json.dumps(res, indent=1)); json.dump(res, open(sys.argv[2], 'w'), indent=1)
