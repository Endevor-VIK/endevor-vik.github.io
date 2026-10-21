#!/usr/bin/env python3
"""Expanded structure-only AXIOM Showcase smoke: no browser/performance claims."""
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

BASE = Path(__file__).resolve().parent.parent
index = (BASE/"index.html").read_text("utf-8")
missing = []
ids, anchor_targets, assets, ctas = set(), [], set(), []
screenshot_buttons = 0
class Scan(HTMLParser):
    def handle_starttag(self, tag, pairs):
        global screenshot_buttons
        a = dict(pairs)
        if a.get('id'): ids.add(a['id'])
        if tag == 'a' and 'enter' in a.get('class','').split(): ctas.append(a.get('href'))
        # V0.3.1 W1 (Q-01): the eight screens live in the WORK archive (one trigger per tab panel)
        if tag == 'button' and 'ax-shot-trigger' in a.get('class','').split(): screenshot_buttons += 1
        for field in ('href', 'src', 'poster', 'data-showcase-src'):
            v = a.get(field, '')
            if v.startswith('#'): anchor_targets.append(v[1:])
            elif v and not urlsplit(v).scheme and not v.startswith(('//','data:')): assets.add(v.split('?')[0])
        for fragment in a.get('srcset', '').split(','):
            p = fragment.strip().split()
            if p and not urlsplit(p[0]).scheme: assets.add(p[0].split('?')[0])
scan = Scan();scan.feed(index)
for css in (BASE/'assets/css').glob('*.css'):
    text=css.read_text('utf-8')
    for raw in re.findall(r"url\(\s*['\"]?([^)\'\"\s]+)['\"]?\s*\)", text):
        if not raw.startswith(('data:','#','http:','https:','//')):
            path=(css.parent/raw.split('?')[0]).resolve()
            if not path.is_file(): missing.append(str(path))
for path in assets:
    if not (BASE/unquote(path)).is_file(): missing.append(path)
anchors_missing = sorted(set(anchor_targets)-ids)
sections = ('top','about','creator','work','system','world-guide','manifesto','modules','world','chars','factions','vision','collaboration')
errors=[]
if missing: errors.append(f'Missing assets: {missing}')
if anchors_missing: errors.append(f'Missing anchors: {anchors_missing}')
if set(sections)-ids: errors.append(f'Missing sections: {set(sections)-ids}')
if ctas != ['https://axiomgates.com']*2: errors.append(f'Unexpected CTA: {ctas}')
if screenshot_buttons!=8: errors.append(f'Screenshot triggers: {screenshot_buttons} != 8')
if 'echelon-node-v2.html' in (BASE/'assets/js/index.js').read_text('utf-8'): errors.append('Heavy iframe mount restored')
if len(list((BASE/'assets/showcase/visual-library').glob('*.webp')))!=17: errors.append('Expected 17 concept webps')
if 'axiom-boot-skip' not in index: errors.append('Loader skip missing')
# V2.3 + V0.3.1 contract: internal QA banners must not reach the public page (the V2.2 rule required them; it contradicted smoke_showcase_v23.py)
if 'CONCEPT ART' in index or 'НЕ ДОКАЗАТЕЛЬСТВО РАБОТЫ' in index: errors.append('Internal QA banner leaked to public UI')
# W1.R: WORK B + TYPE A are final (Q-02/Q-03) — no review switch, no Unbounded in the public UI
if 'data-work' in index or 'data-type' in index: errors.append('Review A/B switch still present')
if 'Unbounded' in (BASE/'assets/css/fonts.css').read_text('utf-8'): errors.append('Unbounded still declared')
# W2 (Q-16): the manual AXIOM GATE flag is valid JSON with a known state and a parseable expiry; the CTA keeps its address
import json, datetime
try:
    gate = json.loads((BASE/'assets/status/gate.json').read_text('utf-8'))
    if gate.get('state') not in ('unavailable', 'available'): errors.append('gate.json: state must be "unavailable" or "available"')
    datetime.datetime.fromisoformat(str(gate.get('expires', '')).replace('Z', '+00:00'))
    datetime.date.fromisoformat(str(gate.get('checkedAt', '')))
except (OSError, ValueError) as e: errors.append(f'gate.json invalid: {e}')
if index.count('href="https://axiomgates.com" aria-label="ENTER AXIOM') != 2: errors.append('ENTER AXIOM CTA address changed')
# W2 (C1–C4): Canon-confirmed names, no fictitious canon provenance, no simulated service status, real version labelled as SHOWCASE
v23js = (BASE/'assets/js/showcase-v23.js').read_text('utf-8')
for needle in ('FACELESS BASE', 'AI ZONE', 'LAB / UNDER GLUHAYA', 'EXCLUSION / LIMBO', '// SHOWCASE v0.3.1'):
    if needle not in index: errors.append(f'W2 content missing: {needle}')
for needle in ('~/canon/v3/', 'DOC_ID ::', 'X-CLASS', 'NIGHTMARE PROTOCOL', 'NETWORK STATUS · ONLINE', 'NODES ONLINE', 'в реальном времени', 'MASKED ANOMALY', 'AI_ZONE', 'REL</span><span class="dim">0.3.0.0'):
    if needle in index or needle in v23js: errors.append(f'W2 content regressed: {needle}')
if re.search(r'alt="[^"]*(остров|мост)', index): errors.append('Map alt asserts islands/bridges')
# W2.R: CREATOR decisions D-01…D-17 and the gate flag TTL (D-15: at most 14 days from the observation)
ids = re.findall(r'data-canon-id="([0-9.]+)"', index)
if ids != ['02.01', '02.02', '02.03', '02.04', '02.05', '02.06']: errors.append(f'WORLD canon IDs/order wrong: {ids}')
# W4 Gate A R1 supersedes the simulated NEXARCH signature: the archive is visibly authored reconstruction.
# W4.R A+AD (art freeze 9cf78b0) keeps that label in the archive bar: «АРХИВНОЕ ПРОЧТЕНИЕ / NEXARCH» + «АВТОРСКАЯ РЕКОНСТРУКЦИЯ».
for needle in ('OFFICIALLY DEAD', 'OPERATIONALLY ACTIVE', 'LINK<b>VOIDLINK', 'SYSTEM INTELLIGENCE', 'CONTACTS<b>', 'АРХИВНОЕ ПРОЧТЕНИЕ / NEXARCH', 'АВТОРСКАЯ РЕКОНСТРУКЦИЯ', 'не является цитатой из канонического документа', 'AXIS / AETERNUM', 'NEURO-CONTROL CONGLOMERATE', 'прежние совместные разработки'):
    if needle not in index: errors.append(f'W2.R content missing: {needle}')
for needle in ('TIER 9', 'tier 9', 'T9 ::', 'TIER<b>9', 'WITNESSES', 'NODE<b>VOIDLINK', 'ARTIFICIAL PERSONALITY', '06 CHAPTERS', 'AXIS / DEPTH', 'depth axis', 'BLACK ECHO — не источник', 'STATE<br/><b>NEUTRAL'):
    if needle in index: errors.append(f'W2.R content regressed: {needle}')
# W4.R A+AD (art freeze 9cf78b0): four full surface studies replace W4's «КОНЦЕПТУАЛЬНАЯ СХЕМА» disclosures, stay labelled as
# art, never as live product state, and the eight real screens are named as snapshots of real interfaces.
for needle in ('SURFACE STUDIES / ЭТЮДЫ ИНТЕРФЕЙСОВ', 'художественная визуализация', 'снимков реальных интерфейсов проекта'):
    if 'id="work-surfaces"' in index and needle not in index: errors.append(f'W4.R content missing: {needle}')
for needle in ('20 ENTRIES', 'PING_', 'DRAFT · v0.12', 'CHR-WHITE-CONTOUR'):
    if needle in index: errors.append(f'W4.R fictitious module status returned: {needle}')
try:
    if (datetime.datetime.fromisoformat(gate['expires'].replace('Z', '+00:00')).date() - datetime.date.fromisoformat(gate['checkedAt'])).days > 14: errors.append('gate.json TTL > 14 days')
except (NameError, KeyError, ValueError) as e: errors.append(f'gate.json TTL check: {e}')
if errors: raise SystemExit('\n'.join(errors))
print('PASS / SOURCE STRUCTURE: files, srcset, CSS url(), WORK archive, anchors, CTA, image library, safe loader')
