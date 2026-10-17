#!/usr/bin/env python3
"""AXIOM SHOWCASE V2.3 static QA. Run in a local repo checkout; no performance claims."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import re
import sys

ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text('utf-8')
ERRORS=[]
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=set();self.anchors=[];self.paths=set();self.map_nodes=0;self.shots=0;self.flows=0;self.entries=[]
    def handle_starttag(self,tag,pairs):
        a=dict(pairs)
        if a.get('id'): self.ids.add(a['id'])
        if tag=='a' and 'enter' in a.get('class','').split(): self.entries.append(a.get('href'))
        if 'v23-map-node' in a.get('class','').split(): self.map_nodes+=1
        if 'ax-shot-trigger' in a.get('class','').split(): self.shots+=1  # V0.3.1 W1 (Q-01): WORK archive triggers
        if 'v23-flow-step' in a.get('class','').split(): self.flows+=1
        for name in ('src','href','poster','data-showcase-src'):
            value=a.get(name,'')
            if value.startswith('#'): self.anchors.append(value[1:])
            elif value and not urlsplit(value).scheme and not value.startswith(('//','data:')):
                self.paths.add(value.split('?')[0])
        for entry in a.get('srcset','').split(','):
            p=entry.strip().split()
            if p and not urlsplit(p[0]).scheme:self.paths.add(p[0].split('?')[0])
p=Page();p.feed(HTML)
for url in p.paths:
    if not (ROOT/url).is_file():ERRORS.append('Missing local asset '+url)
for anchor in set(p.anchors):
    if anchor not in p.ids:ERRORS.append('Missing anchor #'+anchor)
for name in ('top','about','creator','work','system','world-guide','manifesto','modules','world','chars','factions','vision','collaboration'):
    if name not in p.ids:ERRORS.append('Missing section '+name)
if p.entries!=['https://axiomgates.com']*2:ERRORS.append('Unexpected ENTER AXIOM destinations')
if p.shots!=8:ERRORS.append('Expected 8 real screenshot controls')
if p.map_nodes!=6:ERRORS.append('Expected 6 WORLD map selectors')
if p.flows!=4:ERRORS.append('Expected 4 interactive SYSTEM flow steps')
if 'CONCEPT ART' in HTML or 'НЕ ДОКАЗАТЕЛЬСТВО РАБОТЫ' in HTML:ERRORS.append('Internal QA warning leaked to public UI')
for key in ('world-spine-map-960w.webp','world-spine-map-1440w.webp','world-spine-map-2048w.webp'):
    if not (ROOT/'assets/world'/key).is_file():ERRORS.append('Missing WORLD responsive variant '+key)
for i in range(2,10):
    name=['panel-login','panel-dashboard','chronicle','axchat','content-library','viktor-dossier','news-signal','master-graph'][i-2]
    for suffix in ('960w','full'):
        path=ROOT/f'assets/showcase/hq/{i:02d}-{name}-{suffix}.webp'
        if not path.is_file():ERRORS.append('Missing HQ screenshot '+str(path.relative_to(ROOT)))
if len(list((ROOT/'assets/showcase/visual-library').glob('*.webp')))!=17:ERRORS.append('Visual Library no longer contains 17 art assets')
for css in (ROOT/'assets/css').glob('*.css'):
    source=css.read_text('utf-8')
    for raw in re.findall(r"url\(\s*['\"]?([^)\'\"\s]+)['\"]?\s*\)",source):
        if raw.startswith(('data:','#','https:','http:','//')):continue
        if not (css.parent/raw.split('?')[0]).resolve().is_file():ERRORS.append('Missing CSS URL '+str(css)+':'+raw)
for sheet in ('showcase.css','showcase-v22.css','showcase-v23.css'):
    content=(ROOT/'assets/css'/sheet).read_text('utf-8').lower()
    for forbidden in ('#ff8895','#fbc8cc','#f27c90','#ff7a8a','#ff6b79'):
        if forbidden in content:ERRORS.append('Forbidden pink '+sheet+':'+forbidden)
if 'echelon-node-v2.html' in (ROOT/'assets/js/index.js').read_text('utf-8'):ERRORS.append('Heavy ECHELON auto mount restored')
if ERRORS:
    print('\n'.join(ERRORS),file=sys.stderr)
    raise SystemExit(1)
print('SOURCE PASS: 13 sections, 8 screens, 6 map nodes, 4 flow controls, local files, srcset, CSS urls, original lore, CTAs.')
print('NOT TESTED: actual browser layout, runtime keyboard/touch, Web Vitals, CDN/font requests or preview availability.')
