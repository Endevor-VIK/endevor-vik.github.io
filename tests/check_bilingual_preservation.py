#!/usr/bin/env python3
"""Compare the bilingual task with merged PR #14, without browser/rendering claims."""
import argparse
import json
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'adb87e5b8c8ba778aedfddd0655ec0b957e045ef'
NORMALIZED_CAPTIONS = {'main.manifesto.007', 'main.modules.005', 'main.world.007', 'main.chars.006'}


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args], text=True).strip()


class Structure(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids, self.sections, self.headings, self.canon, self.media, self.urls, self.bindings = ([] for _ in range(7))
        self.feed(source)

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'section':
            self.sections.append(attrs.get('id'))
        if tag in ('h1', 'h2', 'h3'):
            self.headings.append(tag)
        if 'data-canon-id' in attrs:
            self.canon.append(attrs['data-canon-id'])
        if tag in ('picture', 'source', 'img'):
            self.media.append((tag, attrs))
        if tag == 'a' and 'href' in attrs:
            self.urls.append(attrs['href'])
        if attrs.get('data-i18n'):
            self.bindings.append(attrs['data-i18n'])

    def handle_comment(self, text):
        if text.startswith('i18n:'):
            self.bindings.append(text[5:].split('|')[0].strip())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json', type=Path)
    args = parser.parse_args()
    pages = {}
    for filename in ('index.html', 'loader.html', '404.html', 'serafim-veyr/index.html'):
        before = Structure(git('show', BASE + ':' + filename))
        after = Structure((ROOT / filename).read_text())
        checks = {name + '_unchanged': getattr(before, name) == getattr(after, name)
                  for name in ('ids', 'sections', 'headings', 'canon', 'media', 'urls')}
        checks['original_translation_bindings_retained'] = set(before.bindings) <= set(after.bindings)
        pages[filename] = checks
    catalogs = {}
    for language in ('en', 'ru'):
        before = json.loads(git('show', BASE + ':assets/i18n/' + language + '.json'))
        after = json.loads((ROOT / 'assets/i18n' / (language + '.json')).read_text())
        changed = {key: {'before': value, 'after': after.get(key)}
                   for key, value in before.items() if after.get(key) != value}
        catalogs[language] = {'original_keys_preserved': set(before) <= set(after),
                             'original_key_count': len(before),
                             'new_keys': len(set(after) - set(before)),
                             'changed_existing_values': changed,
                             'allowed_changes_only': not changed if language == 'en' else set(changed) == NORMALIZED_CAPTIONS}
    paths = git('diff', '--name-only', BASE).splitlines()
    # Captured PNG evidence under docs is intentionally added by this task.
    # Protect the actual runtime media/fonts, including the independent archive.
    protected_assets_unchanged = not any(
        name.startswith(('assets/', 'serafim-veyr/'))
        and re.search(r'\.(?:png|webp|avif|jpg|woff2?)$', name)
        for name in paths
    )
    passed = (all(all(checks.values()) for checks in pages.values()) and protected_assets_unchanged
              and all(c['original_keys_preserved'] and c['allowed_changes_only'] for c in catalogs.values()))
    report = {'baseline': BASE, 'source_commit': git('rev-parse', 'HEAD'),
              'status': 'PASS' if passed else 'FAIL', 'static': pages, 'catalogs': catalogs,
              'image_font_assets_unchanged': protected_assets_unchanged,
              'scope': 'Source preservation only; rendering, version labels and Canon acceptance are separate.'}
    if args.json:
        args.json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(report['status'] + ': IDs, section/heading order, Canon IDs, media attributes, URLs and original catalog copy')
    raise SystemExit(0 if passed else 1)


if __name__ == '__main__':
    main()
