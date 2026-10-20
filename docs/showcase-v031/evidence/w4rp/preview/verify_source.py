#!/usr/bin/env python3
"""Read-only source preservation audit; does not grant artistic acceptance."""
import ast,hashlib,json,re,subprocess
from html.parser import HTMLParser
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[4]
REFS={'before':'6b082e5f262c09a123748273da42277d3a29a6c2','current':'b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5'}
def git(*args):return subprocess.check_output(['git',*args],cwd=ROOT)
def sha(v):return hashlib.sha256(v.encode() if isinstance(v,str) else v).hexdigest()
# Load only extraction functions, never run the generator or mutate the snapshot.
tree=ast.parse((HERE/'build_aplus.py').read_text());space={'re':re}
for n in tree.body:
 if isinstance(n,ast.FunctionDef) and n.name in ['block','sec']:exec(compile(ast.Module(body=[n],type_ignores=[]),'extractors','exec'),space)
block,sec=space['block'],space['sec'];before=git('show',REFS['before']+':index.html').decode();current=git('show',REFS['current']+':index.html').decode();aplus=(HERE/'aplus.html').read_text()
checks=[]
def check(name,pass_,**detail):checks.append(dict(name=name,pass_=pass_,**detail))
patterns={'map':r'<div class="v23-map-composition">','axes':r'<div class="v23-map-axes"[^>]*>','omega':r'<div class="ax-omega">','cards':r'<div class="chars">','axiom':r'<div class="axiom-entity"[^>]*>','viewer':r'<dialog[^>]*id="showcase-lightbox"[^>]*>'}
for name,pat in patterns.items():
 values=[block(s,pat) for s in [before,current,aplus]];check(name+': original=current=A+ exact source',len(set(values))==1,sha256=sha(values[0]))
for id in ['top','axiom','creator','system','world-guide','factions','vision','contact']:
 if re.search(r'<section[^>]*id="'+id+'"',current):check(id+': current=A+ exact whole section',sec(current,id)==sec(aplus,id),sha256=sha(sec(current,id)))
for name,pat in [('real figures',r'<figure class="ax-shot">'),('real case descriptions',r'<div class="ax-case">')]:
 sets=[[block(s[m.start():],pat) for m in re.finditer(pat,s)] for s in [before,current,aplus]];check(name+': eight exact originals',sets[0]==sets[1]==sets[2] and len(sets[0])==8,hashes=[sha(s)for s in sets[0]])
class Structure(HTMLParser):
 def __init__(self):super().__init__();self.tags=[];self.geometry=[];self.svg_depth=0;self.counts={}
 def handle_starttag(self,t,a):
  self.tags.append(t);self.counts[t]=self.counts.get(t,0)+1
  if t=='svg':self.svg_depth+=1
  if self.svg_depth:self.geometry.append((t,a))
 def handle_startendtag(self,t,a):self.handle_starttag(t,a);self.handle_endtag(t)
 def handle_endtag(self,t):
  if t=='svg':self.svg_depth-=1
def signature(s):p=Structure();p.feed(s);return p
oldmods=block(before,r'<div class="modules">');newmods=block(aplus,r'<div class="modules">')
old=[block(oldmods[m.start():],r'<div class="module">')for m in re.finditer(r'<div class="module">',oldmods)];new=[block(newmods[m.start():],r'<div class="module">')for m in re.finditer(r'<div class="module">',newmods)]
for name,a,b in zip(['CHRONICLE','CONTENT','CARTOGRAPHY','WATCH_DOG'],old,new):
 p,q=signature(a),signature(b);check(name+': original frame/graphic tag topology (text br excluded)',[t for t in p.tags if t!='br']==[t for t in q.tags if t!='br'],originalCounts=p.counts,aplusCounts=q.counts);check(name+': exact original SVG element geometry/attributes',p.geometry==q.geometry,sha256=sha(json.dumps(p.geometry)))
for pat in [r'<script[^>]*src="([^"]+)"',r'<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"']:
 c=re.findall(pat,current);a=[x for x in re.findall(pat,aplus)if x!='r1p.css'];check('original scripts/styles retained '+pat,c==a,paths=c)
product_delta=git('diff','--name-only',REFS['current'],'--','index.html','assets','tests').decode().splitlines();check('product/assets/tests freeze unchanged',not product_delta,delta=product_delta)
asset_delta=git('diff','--name-only',REFS['before'],REFS['current'],'--','assets').decode().splitlines();check('all original media/fonts/JS bytes preserved; only W4 stylesheet delta',asset_delta==['assets/css/showcase-v23.css'],delta=asset_delta)
for ref in REFS.values():
 # Record the Git tree, not a second on-disk asset archive.
 tree=git('ls-tree','-r',ref,'--','assets');check(ref[:8]+': assets source tree recorded',bool(tree),treeSha256=sha(tree),entries=len(tree.splitlines()))
report={'kind':'R1P_SOURCE_PRESERVATION_NOT_INDEPENDENT_REVIEW','refs':REFS,'candidate':{'html':sha(aplus),'css':sha((HERE/'r1p.css').read_bytes())},'checks':checks,'summary':{'checks':len(checks),'failed':[c['name']for c in checks if not c['pass_']]}}
(HERE.parent/'source-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report['summary'],ensure_ascii=False));raise SystemExit(bool(report['summary']['failed']))
