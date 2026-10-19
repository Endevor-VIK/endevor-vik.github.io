#!/usr/bin/env python3
"""Install only missing shared-library packages into W4's owned /tmp tree, never apt install.
Uses configured official Ubuntu apt repositories and dpkg-deb extraction. No root required.
Delete this owned directory at task completion; Playwright browser cache remains reusable.
"""
from pathlib import Path
import subprocess, re, json, hashlib, os
ROOT = Path('/tmp/axs-0524-w4-webkit-deps')
ROOT.mkdir(exist_ok=True)
(ROOT / '.w4-owned').write_text('0524.W4 rootless WebKit dependency scratch\n')
packages = ['libwoff1','libevent-2.1-7t64','libopus0','libgstreamer-plugins-base1.0-0',
 'libgstreamer-gl1.0-0','libgstreamer-plugins-bad1.0-0','libflite1','libavif16',
 'libharfbuzz-icu0','libenchant-2-2','libhyphen0']
# Shared-library closure, deliberately excludes dictionary alternative packages and
# media plugins: apt-cache --recurse visits every alternative, which is not needed.
packages += ['libabsl20220623t64','libaspell15','libdav1d7','libgav1-1',
 'libgssdp-1.6-0','libgudev-1.0-0','libgupnp-1.6-0','libgupnp-igd-1.6-0',
 'libhunspell-1.7-0','libnice10','liborc-0.4-0t64','libproxy1v5','librav1e0',
 'libsoup-3.0-0','libsvtav1enc1d1','libva-drm2','libva2','libyuv0']
names = sorted(set(packages))
needed=[]
for name in names:
 p=subprocess.run(['dpkg-query','-W','-f=${db:Status-Status}',name],capture_output=True,text=True)
 if p.returncode or p.stdout!='installed':needed.append(name)
debs=ROOT/'debs';debs.mkdir(exist_ok=True)
for f in debs.glob('*.deb'):
 name=subprocess.check_output(['dpkg-deb','-f',str(f),'Package'],text=True).strip()
 if name not in needed:f.unlink()
subprocess.run(['apt-get','download',*needed],cwd=debs,check=True)
libs=ROOT/'root';libs.mkdir(exist_ok=True)
manifest=[]
for f in sorted(debs.glob('*.deb')):
 subprocess.run(['dpkg-deb','-x',str(f),str(libs)],check=True)
 manifest.append({'file':f.name,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
(ROOT/'manifest.json').write_text(json.dumps({'packages':needed,'debs':manifest},indent=2))
webkit=Path.home()/'.cache/ms-playwright/webkit-2311/minibrowser-wpe'
launcher=ROOT/'webkit-headless.sh'
launcher.write_text('#!/bin/sh\n'+
 f'export WEBKIT_EXEC_PATH="{webkit}/bin"\nexport WEBKIT_INJECTED_BUNDLE_PATH="{webkit}/lib"\n'+
 f'export WEBKIT_INSPECTOR_RESOURCES_PATH="{webkit}/share"\n'+
 f'export LD_LIBRARY_PATH="{libs}/usr/lib/x86_64-linux-gnu:{libs}/lib/x86_64-linux-gnu:{webkit}/lib:{webkit}/sys/lib"\n'+
 f'export WEBKIT_FORCE_COMPLEX_TEXT=1\nexec "{webkit}/bin/MiniBrowser" "$@"\n')
launcher.chmod(0o755)
print(json.dumps({'root':str(ROOT),'packages':len(needed),'launcher':str(launcher),'download_bytes':sum(x['bytes'] for x in manifest)}))
