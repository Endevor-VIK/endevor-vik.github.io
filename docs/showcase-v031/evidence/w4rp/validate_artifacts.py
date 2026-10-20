#!/usr/bin/env python3
"""Verify all durable native artifacts, coverage and frozen inputs."""
import hashlib,json,re
from pathlib import Path
from PIL import Image
HERE=Path(__file__).resolve().parent
m=json.loads((HERE/'manifest.json').read_text());checks=[]
def check(name,ok,**data):checks.append(dict(name=name,pass_=ok,**data))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for c in m['captures']:
 p=HERE/'captures'/c['file'];check(c['file'],p.exists() and sha(p)==c['sha256'] and Image.open(p).size==(c['width'],c['height']))
for n,h in m['hashes'].items():check('frozen capture input '+n,sha(HERE/'preview'/n)==h)
for arm in ['before','current','aplus']:
 for width in [1440,1920,390,360]:
  for scene in ['work','doctrine','aftermath','world','characters']:
   f=sorted([c for c in m['captures']if c['arm']==arm and c['width']==width and c['scene']==scene],key=lambda c:c['segment'])
   ok=bool(f) and f[0]['scrollY']<=f[0]['sectionTop'] and f[-1]['scrollY']+f[-1]['height']>=f[-1]['sectionBottom'] and all(b['scrollY']<=a['scrollY']+a['height']-100 for a,b in zip(f,f[1:]))
   check(f'{arm}/{width}/{scene}: complete native pass >=100px overlap',ok)
for f in ['source-validation.json','probe-validation.json']:
 r=json.loads((HERE/f).read_text());check(f+': final assertions',not r.get('error') and not r['summary']['failed'],summary=r['summary'])
probe=json.loads((HERE/'probe-validation.json').read_text())
for n,h in probe['inputs'].items():check('frozen probe input '+n,sha(HERE/'preview'/n)==h)
check('capture run has no errors/failures',not m.get('error') and not m['summary']['failed'])
for href in re.findall(r'href="([^"]+)"',(HERE/'REVIEW.html').read_text()):
 if not href or href.startswith(('http:','https:','#')):continue
 check('review link '+href,(HERE/href.split('#')[0]).resolve().exists())
report={'kind':'R1P_ARTIFACT_INTEGRITY_NOT_ART_APPROVAL','summary':{'checks':len(checks),'failed':[c['name']for c in checks if not c['pass_']]},'checks':checks}
(HERE/'artifact-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report['summary']));raise SystemExit(bool(report['summary']['failed']))
