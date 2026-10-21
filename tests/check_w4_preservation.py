#!/usr/bin/env python3
"""0524.W4.R R2: verify the CREATOR's protected source against the accepted baseline.

Contract (Gate R-A + executor amendment, art freeze 9cf78b0): BLACK SUN, WHAT REMAINS and WORK may change as approved;
WORLD and CHARACTERS may change only their external heading/introduction; everything else, every protected interior
(map, axes, OMEGA-0, W04 picture, character cards, AXIOM ∅), the eight real screenshots and section order stay
byte-identical to 6b082e5. This checks source boundaries and asset provenance, not rendering.
Usage: python3 tests/check_w4_preservation.py [--json owned-report.json]
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
BASE = '6b082e5f262c09a123748273da42277d3a29a6c2'
ALLOWED_ASSETS = {'assets/css/showcase-v23.css', 'assets/css/showcase-w4r.css', 'assets/js/showcase-w4r.js',
                  'assets/showcase/visual-library/README.md'} | {
    f'assets/showcase/visual-library/web/A08_protocol_gate-{w}w.{ext}' for w in (480, 720, 941) for ext in ('avif', 'webp')}


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args])


def block(source, pattern):
    found = re.search(pattern, source)
    if found is None:
        raise ValueError('Missing block: ' + pattern)
    tag, depth = re.match(r'<([\w:-]+)', found.group()).group(1), 0
    for token in re.finditer(r'<!--[\s\S]*?-->|</?([\w:-]+)\b[^>]*>', source[found.start():]):
        text = token.group()
        if text.startswith('<!--') or token.group(1) != tag:
            continue
        depth += -1 if text.startswith('</') else 0 if text.endswith('/>') else 1
        if depth == 0:
            return source[found.start():found.start() + token.end()]
    raise ValueError('Unclosed block: ' + pattern)


def section(source, identifier):
    return block(source, r'<section\b[^>]*\bid=["\']' + re.escape(identifier) + r'["\'][^>]*>')


def without(source, patterns):
    """Drop the first occurrence of each external block (heading copy / introduction), if present."""
    for pattern in patterns:
        try:
            source = source.replace(block(source, pattern), '', 1)
        except ValueError:
            pass
    return source


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json', type=Path)
    args = parser.parse_args()
    before = git('show', BASE + ':index.html').decode()
    after = (ROOT / 'index.html').read_text()
    failures, protected = [], {}
    sha = lambda text: hashlib.sha256(text.encode()).hexdigest()

    def compare(name, old, new):
        protected[name] = {'baseline_sha256': sha(old), 'actual_sha256': sha(new), 'identical': old == new}
        if old != new:
            failures.append('Protected source changed: ' + name)

    for identifier in ('top', 'about', 'creator', 'system', 'vision', 'collaboration'):
        compare('#' + identifier, section(before, identifier), section(after, identifier))
    # WORLD / CHARACTERS: only the external heading copy and introduction may differ (Gate R-A, R2.3).
    world_external = [r'<div class="ax-chapter-copy[^"]*">', r'<div class="sec-head v23-map-heading[^"]*">']
    chars_external = [r'<div class="ax-chapter-line">', r'<div class="sec-head[^"]*">']
    compare('#world outside heading/intro', without(section(before, 'world'), world_external),
            without(section(after, 'world'), world_external))
    compare('#chars outside heading/intro', without(section(before, 'chars'), chars_external),
            without(section(after, 'chars'), chars_external))
    for name, pattern in [('map', r'<div class="v23-map-composition">'), ('axes', r'<div class="v23-map-axes"[^>]*>'),
                          ('OMEGA-0', r'<div class="ax-omega">'), ('character cards', r'<div class="chars">'),
                          ('AXIOM ∅', r'<div class="axiom-entity"[^>]*>'),
                          ('viewer', r'<dialog[^>]*id="showcase-lightbox"[^>]*>')]:
        compare(name, block(before, pattern), block(after, pattern))
    compare('W04 picture', block(section(before, 'world'), r'<picture>'), block(section(after, 'world'), r'<picture>'))
    shots = r'<figure class="ax-shot">[\s\S]*?</figure>'
    old_shots, new_shots = re.findall(shots, before), re.findall(shots, after)
    if len(old_shots) != 8 or old_shots != new_shots:
        failures.append('Eight original screenshot figures are not identical')
    old_order = re.findall(r'<section\b[^>]*\bid=["\']([^"\']+)', before)
    new_order = re.findall(r'<section\b[^>]*\bid=["\']([^"\']+)', after)
    if old_order != new_order:
        failures.append('Top-level section order/IDs changed')
    asset_delta = git('diff', '--name-only', BASE, '--', 'assets').decode().splitlines()
    untracked = git('ls-files', '--others', '--exclude-standard', '--', 'assets').decode().splitlines()
    unexpected = sorted(set(asset_delta + untracked) - ALLOWED_ASSETS)
    if unexpected:
        failures.append('Unexpected asset or handler changes: ' + ', '.join(unexpected))
    tracked_assets = git('ls-tree', '-r', '--name-only', BASE, '--', 'assets').decode().splitlines()
    missing = [p for p in tracked_assets if not (ROOT / p).is_file()]
    if missing:
        failures.append('Baseline assets missing: ' + ', '.join(missing))
    report = {
        'baseline': BASE, 'checked_head': git('rev-parse', 'HEAD').decode().strip(),
        'protected': protected, 'eight_screens_identical': old_shots == new_shots,
        'section_order_identical': old_order == new_order, 'baseline_asset_files': len(tracked_assets),
        'asset_delta': sorted(set(asset_delta + untracked)), 'failures': failures,
        'limit': 'Source proof only; shared CSS rendering and runtime behavior require browser checks.',
    }
    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    if failures:
        raise SystemExit('\n'.join(failures))
    print(f'PASS: {len(protected)} protected sources (6 whole sections, WORLD/CHARACTERS outside intros, map, axes, '
          f'OMEGA-0, W04, cards, AXIOM ∅, viewer), eight real screenshots, section order and {len(tracked_assets)} '
          f'baseline assets; only approved W4/W4.R assets differ.')
    print(report['limit'])


if __name__ == '__main__':
    main()
