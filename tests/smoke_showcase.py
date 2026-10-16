#!/usr/bin/env python3
"""Minimal stdlib-only AXIOM showcase structural smoke test. Run from repo root."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

root = Path(__file__).resolve().parents[1]
markup = (root / "index.html").read_text(encoding="utf-8")

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.anchors = []
        self.files = []
        self.entries = []
        self.shots = 0
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if attrs.get("id"): self.ids.add(attrs["id"])
        for field in ("src", "href"):
            val = attrs.get(field)
            if not val: continue
            if field == "href" and val.startswith("#"):
                self.anchors.append(val[1:])
            elif not urlsplit(val).scheme and not val.startswith(("#", "data:", "//")):
                self.files.append(val.split("?")[0])
        if tag == "a" and "enter" in attrs.get("class", "").split():
            self.entries.append(attrs.get("href"))
        if tag == "button" and "show-shot-trigger" in attrs.get("class", "").split():
            self.shots += 1

p = Links()
p.feed(markup)
missing = sorted(set(f for f in p.files if not (root / f).is_file()))
unresolved = sorted(set(a for a in p.anchors if a not in p.ids))
required = ("creator","work","system","manifesto","modules","world","chars","factions","vision","collaboration")
errors = []
if missing: errors.append("Missing assets: " + ", ".join(missing))
if unresolved: errors.append("Missing anchors: " + ", ".join(unresolved))
if any(s not in p.ids for s in required): errors.append("Missing core sections")
if p.entries != ["https://axiomgates.com"] * 2: errors.append("Incorrect ENTER AXIOM destinations")
if p.shots != 8: errors.append("Expected 8 screenshot triggers")
if "content-html/echelon-node-v2.html" in (root/"assets/js/index.js").read_text(encoding="utf-8"):
    errors.append("Heavy ECHELON iframe mount restored")
for asset in ["assets/echelon_city.png", "assets/endeavor_logo_no_text_no_frame.svg", "docs/AXIOM_SYSTEM_VISION_2026.html"]:
    if not (root/asset).is_file(): errors.append("Missing preserved asset: "+asset)
if errors:
    raise SystemExit("\n".join(errors))
print("PASS: original sections, screenshot gallery, static ECHELON, files, anchors and CTAs")
