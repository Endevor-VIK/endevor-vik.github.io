#!/usr/bin/env python3
"""AXIOM ENG/RU source contract. No browser/SEO/performance claims.

Run: python3 tests/test_i18n.py [--root /isolated/checkout]
"""
import argparse
import json
import re
import subprocess
import sys
import unittest
from html.parser import HTMLParser
from pathlib import Path

ARGS = argparse.ArgumentParser()
ARGS.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
OPTIONS, _ = ARGS.parse_known_args()
ROOT = OPTIONS.root.resolve()
LANGS = ('en', 'ru')
ATTRS = ('aria-label', 'alt', 'title', 'placeholder', 'data-text', 'data-showcase-title', 'data-screen-label')
PAGES = ('index.html', 'loader.html', '404.html')
PLACEHOLDER = re.compile(r'\{([A-Za-z_]\w*)\}')


class SourceScan(HTMLParser):
    """Check actual text nodes, including SVG and aria-hidden hints, rather than sampling sections."""
    def __init__(self, filename):
        super().__init__(convert_charrefs=True)
        self.filename = filename
        self.stack = []
        self.pending = None
        self.pending_whitespace = None
        self.keys = set()
        self.runtime_prefixes = set()
        self.errors = []
        self.inline_scripts = []
        self.script = None
        self.bound_count = 0

    def error(self, message):
        self.errors.append(f'{self.filename}:{self.getpos()[0]}: {message}')

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        self.pending = None
        for name in ATTRS:
            value = attrs.get(name, '')
            if value and re.search(r'[^\W\d_]', value, re.UNICODE):
                key = attrs.get('data-i18n-' + name)
                if not key:
                    self.error(f'unbound {name}: {value!r}')
        if tag == 'meta' and attrs.get('name', attrs.get('property', '')) in (
            'description', 'og:title', 'og:description', 'og:image:alt',
            'og:locale', 'twitter:title', 'twitter:description', 'twitter:image:alt'
        ) and attrs.get('content') and not attrs.get('data-i18n-content'):
            self.error(f'unbound metadata: {attrs}')
        for name, value in pairs:
            if name == 'data-i18n-runtime':
                self.runtime_prefixes.add(value)
                self.bound_count += 1
                continue
            if name == 'data-i18n' or name.startswith('data-i18n-'):
                if not value or not value.strip():
                    self.error(f'empty binding {name}')
                else:
                    self.keys.add(value)
                    self.bound_count += 1
        if tag == 'script':
            self.script = [] if not attrs.get('src') else None
        voids = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
        if tag not in voids:
            self.stack.append((tag, attrs))

    def handle_startendtag(self, tag, pairs):
        self.handle_starttag(tag, pairs)
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()

    def handle_endtag(self, tag):
        self.pending = None
        if tag == 'script' and self.script is not None:
            self.inline_scripts.append(''.join(self.script))
            self.script = None
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                self.stack = self.stack[:index]
                break

    def handle_comment(self, text):
        self.pending_whitespace = None
        if text.startswith('i18n:') and '|' in text:
            try:
                metadata = json.loads(text.split('|', 1)[1])
                if not isinstance(metadata, list) or len(metadata) != 2 or not all(isinstance(value, str) and not value.strip() for value in metadata):
                    raise ValueError('expected two whitespace strings')
                self.pending_whitespace = metadata
            except (ValueError, TypeError):
                self.error('Invalid original whitespace metadata in i18n marker')
        self.pending = text[5:].split('|', 1)[0].strip() if text.startswith('i18n:') else None
        if self.pending:
            self.keys.add(self.pending)
            self.bound_count += 1

    def handle_data(self, text):
        if self.stack and self.stack[-1][0] == 'script':
            if self.script is not None:
                self.script.append(text)
            return
        if any(tag in ('style', 'noscript') for tag, _ in self.stack):
            return
        if self.pending and self.pending_whitespace is not None:
            actual = [re.match(r'^\s*', text)[0], re.search(r'\s*$', text)[0]]
            if actual != self.pending_whitespace:
                self.error(f'Marker whitespace differs from its source text: {self.pending}')
            self.pending_whitespace = None
        meaningful = bool(text.strip() and re.search(r'[^\W\d_]', text, re.UNICODE))
        bound_parent = any(attrs.get('data-i18n') or attrs.get('data-i18n-runtime') for _, attrs in self.stack)
        if meaningful and not bound_parent and not self.pending:
            self.error(f'unbound text: {text.strip()!r}')
        if text.strip():
            self.pending = None


def literal_strings(source):
    """Small lexical reader: skip comments so Russian engineering comments remain legal."""
    index = 0
    while index < len(source):
        if source.startswith('//', index):
            end = source.find('\n', index + 2)
            index = len(source) if end < 0 else end + 1
        elif source.startswith('/*', index):
            end = source.find('*/', index + 2)
            index = len(source) if end < 0 else end + 2
        elif source[index] in '\'"`':
            quote, start = source[index], index
            index += 1
            while index < len(source):
                if source[index] == '\\':
                    index += 2
                elif source[index] == quote:
                    index += 1
                    break
                else:
                    index += 1
            yield source[start:index]
        else:
            index += 1


class LocalizationContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalogs = {lang: json.loads((ROOT / 'assets/i18n' / (lang + '.json')).read_text('utf-8')) for lang in LANGS}
        cls.scans = {}
        for filename in PAGES:
            parser = SourceScan(filename)
            parser.feed((ROOT / filename).read_text('utf-8'))
            cls.scans[filename] = parser

    def test_dictionary_integrity(self):
        en, ru = (self.catalogs[lang] for lang in LANGS)
        self.assertEqual(set(en), set(ru), 'ENG/RU key sets differ')
        self.assertGreater(len(en), 500, 'Catalog unexpectedly lost public content')
        for lang, catalog in self.catalogs.items():
            for key, value in catalog.items():
                with self.subTest(lang=lang, key=key):
                    self.assertIsInstance(value, str)
                    self.assertTrue(value.strip(), 'Empty translation')
                    self.assertNotRegex(value, r'<\s*/?\s*[A-Za-z][^>]*>', 'Translation contains HTML')
                    self.assertNotRegex(value, r'\b(?:TODO|TRANSLATE_ME|MISSING_TRANSLATION)\b')
                    self.assertNotEqual(key, value, 'Raw key used as translation')
                    self.assertEqual(set(PLACEHOLDER.findall(value)), set(PLACEHOLDER.findall(en[key])), 'Placeholder mismatch')
                    if lang == 'en':
                        self.assertNotRegex(value, r'[\u0400-\u04ff]', 'Untranslated Cyrillic in ENG')

    def test_all_html_text_and_accessible_attributes_are_bound(self):
        failures = [error for scan in self.scans.values() for error in scan.errors]
        self.assertFalse(failures, '\n' + '\n'.join(failures))
        for filename, scan in self.scans.items():
            with self.subTest(page=filename):
                self.assertGreater(scan.bound_count, 15)
                self.assertFalse(scan.keys - self.catalogs['en'].keys(), f'Unknown keys: {scan.keys - self.catalogs["en"].keys()}')
                for prefix in scan.runtime_prefixes:
                    self.assertTrue(any(key.startswith(prefix + '.') for key in self.catalogs['en']), f'Unknown runtime key prefix: {prefix}')

    def test_dynamic_user_copy_uses_catalogs(self):
        snippets = [(str(path.relative_to(ROOT)), path.read_text('utf-8')) for path in (ROOT/'assets/js').glob('*.js') if path.name != 'i18n.js']
        snippets += [(filename + ':inline', script) for filename, scan in self.scans.items() for script in scan.inline_scripts]
        failures = []
        normalize = lambda value: re.sub(r'\s+', ' ', value).strip()
        catalog_values = {normalize(value) for value in self.catalogs['ru'].values()}
        for filename, source in snippets:
            for literal in literal_strings(source):
                if not re.search(r'[\u0400-\u04ff]', literal):
                    continue
                value = literal[1:-1].replace('\\n', '\n').replace('\\"', '"').replace("\\'", "'")
                if normalize(value) in catalog_values:
                    continue  # Explicit catalogued fallback; browser tests exercise its runtime lookup.
                if '<' in value or '>' in value:
                    # Trusted static templates may retain fallback copy. Each Russian text/attribute fragment
                    # must still exist in the source catalog; runtime browser checks enforce actual translation.
                    fragments = re.findall(r'[\u0400-\u04ff][^<>"\n]*', value)
                    if fragments and all(normalize(fragment) in catalog_values for fragment in fragments):
                        continue
                failures.append(f'{filename}: uncatalogued Cyrillic literal {literal[:140]}')
        self.assertFalse(failures, '\n' + '\n'.join(failures))

    def test_generated_bundle_is_current(self):
        command = ['node', str(ROOT/'assets/i18n/build-catalogs.cjs'), '--check']
        result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=15)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_bootstrap_precedes_public_content(self):
        for filename in PAGES:
            with self.subTest(page=filename):
                html = (ROOT / filename).read_text('utf-8')
                bundle = html.index('assets/i18n/catalogs.js')
                runtime = html.index('assets/js/i18n.js')
                self.assertLess(bundle, runtime)
                self.assertLess(runtime, html.index('<body'))
                self.assertNotIn('hreflang=', html, 'Runtime switching must not manufacture alternate SEO URLs')
        runtime = (ROOT/'assets/js/i18n.js').read_text('utf-8')
        self.assertNotIn('innerHTML', runtime, 'Translations must use text/attribute APIs')
        preferences = (ROOT/'assets/js/language-preference.js').read_text('utf-8')
        self.assertIn('axiom.showcase.language.v1', preferences)


if __name__ == '__main__':
    unittest.main(argv=[sys.argv[0]], verbosity=2)
