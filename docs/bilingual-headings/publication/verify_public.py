#!/usr/bin/env python3
"""Read-only release proof against public Pages; reuse frozen browser assertions.

No local server, request interception, source substitution or package downloads.
Browser harness copies live only in TemporaryDirectory. Existing harnesses retain
last 3 runs / 14 days, with 96/32 MiB caps. HTTP output is one bounded JSON file.
"""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import urllib.request

ROOT = Path(__file__).resolve().parents[3]
SHA = "bfdc1911a59efd46cb6230eb207f873a93d87c94"
BASE = "https://endevor-vik.github.io/"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("kind", choices=["http", "headings", "loader"])
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    if args.kind == "http":
        results = []
        for name in ["index.html", "loader.html", "assets/css/bilingual-headings.css",
                     "assets/js/language-motion.js", "assets/js/i18n.js", "assets/i18n/catalogs.js"]:
            url = BASE + name + "?release=" + SHA
            with urllib.request.urlopen(url, timeout=25) as response:
                data = response.read(1024 * 1024)
                headers = {k: v for k, v in response.headers.items() if k.lower() in
                           {"date", "last-modified", "etag", "age", "x-cache"}}
                status = response.status
            expected = subprocess.check_output(["git", "show", SHA + ":" + name], cwd=ROOT)
            row = dict(path=name, url=url, status=status, bytes=len(data),
                       sha256=sha(data), expected_sha256=sha(expected), equal=data == expected,
                       headers=headers)
            if name == "index.html":
                row["bilingual_count"] = data.count(b'data-heading-mode="bilingual"')
                row["css_link"] = b'bilingual-headings.css' in data
                row["motion_script"] = b'language-motion.js' in data
            results.append(row)
        args.out.parent.mkdir(parents=True, exist_ok=True)
        report = dict(verified_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                      source_sha=SHA, target=BASE, results=results)
        args.out.write_text(json.dumps(report, indent=2) + "\n")
        assert all(r["status"] == 200 and r["equal"] for r in results), report
        assert results[0]["bilingual_count"] == 37, results[0]
        print("HTTP PASS: 6/6 exact byte matches; 37 bilingual headings")
        return

    source = ROOT / "tests/browser" / ("bilingual_headings.cjs" if args.kind == "headings" else "loader_layout.cjs")
    original = source.read_text()
    code = original
    # Browser does not inherit shell HTTPS_PROXY. Resolve it without logging secrets.
    proxy = """const proxyURL=process.env.HTTPS_PROXY||process.env.HTTP_PROXY;
const launchOptions={headless:true};
if(proxyURL){const p=new URL(proxyURL);launchOptions.proxy={server:p.protocol+'//'+p.host};if(p.username)launchOptions.proxy.username=decodeURIComponent(p.username);if(p.password)launchOptions.proxy.password=decodeURIComponent(p.password);}
"""
    code = code.replace("'use strict';", "'use strict';\n" + proxy, 1)
    code = code.replace("launch({headless:true})", "launch(launchOptions)")
    if args.kind == "headings":
        needle = "const served=await serve();server=served.server;"
        assert code.count(needle) == 1
        code = code.replace(needle, "const served={base:'" + BASE + "'};")
        needle = "+'lang='+lang,{waitUntil:'load'}"
        assert code.count(needle) == 1
        code = code.replace(needle, "+'lang='+lang+'&release=" + SHA + "',{waitUntil:'load'}")
        match = "black-sun-review|global-canonical-english-and-russian-semantics|normal-motion-exit-commit-enter-stagger"
    else:
        needle = "const base=await serve();"
        assert code.count(needle) == 1
        code = code.replace(needle, "const base='" + BASE + "';")
        needle = "'?auto=false&duration=250&lang='+lang"
        assert code.count(needle) == 1
        code = code.replace(needle, "'?auto=false&duration=250&lang='+lang+'&release=" + SHA + "'")
        match = "after-(en|ru)-(320x568|390x844|844x390|1440x900)-reduce|keyboard-exit"
    assert "await serve()" not in code, "Local server would still run"
    with tempfile.TemporaryDirectory(prefix="axiom-public-adapter-") as temp:
        adapted = Path(temp) / source.name
        adapted.write_text(code)
        env = dict(os.environ)
        env.setdefault("NODE_PATH", "/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules")
        result = subprocess.run(["node", str(adapted), "--root", str(ROOT), "--out", str(args.out),
                                 "--match", match], env=env)
    runs = sorted(p for p in args.out.glob("run-*") if (p / "report.json").exists())
    if runs:
        file = runs[-1] / "report.json"
        report = json.loads(file.read_text())
        report["public_verification"] = dict(target=BASE, source_sha=SHA,
            source_harness_sha256=sha(original.encode()), adapted_harness_sha256=sha(code.encode()),
            adapter=str(Path(__file__).relative_to(ROOT)), local_server=False,
            request_interception=False, clean_contexts=True, match=match)
        file.write_text(json.dumps(report, indent=2) + "\n")
    raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
