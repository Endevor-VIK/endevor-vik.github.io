#!/usr/bin/env python3
"""0524.W4: verify the CREATOR's protected source against the accepted baseline.

This checks source boundaries, real evidence and asset provenance, not rendering.
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


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args])


def section(source, identifier):
    found = re.search(r'<section\b[^>]*\bid=["\']' + re.escape(identifier)
                      + r'["\'][^>]*>[\s\S]*?</section>', source)
    if found is None:
        raise ValueError('Missing section: ' + identifier)
    return found.group()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json', type=Path)
    args = parser.parse_args()
    before = git('show', BASE + ':index.html').decode()
    after = (ROOT / 'index.html').read_text()
    failures, protected = [], {}
    for identifier in ('top', 'about', 'creator', 'system', 'world', 'chars', 'vision', 'collaboration'):
        old, new = section(before, identifier), section(after, identifier)
        protected[identifier] = {
            'baseline_sha256': hashlib.sha256(old.encode()).hexdigest(),
            'actual_sha256': hashlib.sha256(new.encode()).hexdigest(),
            'identical': old == new,
        }
        if old != new:
            failures.append('Protected section changed: ' + identifier)
    # III/IV labels and all OMEGA/AXIOM content are inside these entire sections.
    shots = r'<figure class="ax-shot">[\s\S]*?</figure>'
    old_shots, new_shots = re.findall(shots, before), re.findall(shots, after)
    if len(old_shots) != 8 or old_shots != new_shots:
        failures.append('Eight original screenshot figures are not identical')
    old_order = re.findall(r'<section\b[^>]*\bid=["\']([^"\']+)', before)
    new_order = re.findall(r'<section\b[^>]*\bid=["\']([^"\']+)', after)
    if old_order != new_order:
        failures.append('Top-level section order/IDs changed')
    asset_delta = git('diff', '--name-only', BASE, '--', 'assets').decode().splitlines()
    unexpected = [p for p in asset_delta if p != 'assets/css/showcase-v23.css']
    if unexpected:
        failures.append('Unexpected asset or handler changes: ' + ', '.join(unexpected))
    tracked_assets = git('ls-tree', '-r', '--name-only', BASE, '--', 'assets').decode().splitlines()
    missing = [p for p in tracked_assets if not (ROOT / p).is_file()]
    if missing:
        failures.append('Baseline assets missing: ' + ', '.join(missing))
    report = {
        'baseline': BASE, 'checked_head': git('rev-parse', 'HEAD').decode().strip(),
        'protected_sections': protected, 'eight_screens_identical': old_shots == new_shots,
        'section_order_identical': old_order == new_order, 'baseline_asset_files': len(tracked_assets),
        'asset_delta': asset_delta, 'failures': failures,
        'limit': 'Source proof only; shared CSS rendering and runtime behavior require browser checks.',
    }
    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    if failures:
        raise SystemExit('\n'.join(failures))
    print(f'PASS: {len(protected)} protected sections, III/IV, OMEGA/AXIOM, eight real screenshot figures, '
          f'section order and {len(tracked_assets)} baseline assets; only scoped CSS may differ.')
    print(report['limit'])


if __name__ == '__main__':
    main()
