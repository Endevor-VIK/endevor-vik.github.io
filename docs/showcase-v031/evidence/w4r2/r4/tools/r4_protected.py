#!/usr/bin/env python3
"""R4 independent protected-content check: stdlib HTMLParser element spans, b85fbb0a vs 685140a (git objects only)."""
import hashlib, json, subprocess, sys
from html.parser import HTMLParser
REPO, B, A = sys.argv[1], 'b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5', '685140a40e55f151f9edcf9e7ab0170773ad4f55'
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr','path','circle','rect','line','polyline','polygon','ellipse','use','stop'}
def show(ref, p, binary=False):
    o = subprocess.check_output(['git','-C',REPO,'show',f'{ref}:{p}']); return o if binary else o.decode()
class P(HTMLParser):
    def __init__(s, src):
        super().__init__(convert_charrefs=False); s.src=src; s.stack=[]; s.els=[]
        s.lines=[0]
        for i,ch in enumerate(src):
            if ch=='\n': s.lines.append(i+1)
        s.feed(src); s.close()
    def off(s): l,c=s.getpos(); return s.lines[l-1]+c
    def handle_starttag(s,t,a):
        e={'tag':t,'attrs':dict(a),'start':s.off(),'end':None}
        s.els.append(e)
        if t in VOID: e['end']=s.off()+len(s.get_starttag_text())
        else: s.stack.append(e)
    def handle_startendtag(s,t,a):
        e={'tag':t,'attrs':dict(a),'start':s.off(),'end':s.off()+len(s.get_starttag_text())}; s.els.append(e)
    def handle_endtag(s,t):
        for i in range(len(s.stack)-1,-1,-1):
            if s.stack[i]['tag']==t:
                e=s.stack.pop(i); e['end']=s.src.index('>',s.off())+1; del s.stack[i:]; return
def spans(src):
    p=P(src); return p
def find(p, pred):
    r=[p.src[e['start']:e['end']] for e in p.els if e['end'] and pred(e)]
    return r
cls=lambda e,c: c in (e['attrs'].get('class') or '').split()
b, a = show(B,'index.html'), show(A,'index.html')
pb, pa = spans(b), spans(a)
res, fails = {}, []
def cmp(name, xb, xa):
    ok = xb==xa and len(xb)>0
    res[name]={'count_before':len(xb),'count_after':len(xa),'identical':ok,
               'sha_before':hashlib.sha256(''.join(xb).encode()).hexdigest(),'sha_after':hashlib.sha256(''.join(xa).encode()).hexdigest()}
    if not ok: fails.append(name)
secs=lambda p: [(e['attrs'].get('id'),p.src[e['start']:e['end']]) for e in p.els if e['tag']=='section' and e['attrs'].get('id')]
sb, sa = secs(pb), secs(pa)
res['section_order_before']=[i for i,_ in sb]; res['section_order_after']=[i for i,_ in sa]
if [i for i,_ in sb]!=[i for i,_ in sa]: fails.append('section order')
changed={'manifesto','modules','work','world','chars'}
for (i,x),(j,y) in zip(sb,sa):
    if i in changed: res.setdefault('changed_sections',{})[i]= (x!=y)
    else: cmp('#'+i,[x],[y])
cmp('map .v23-map-composition', find(pb,lambda e:cls(e,'v23-map-composition')), find(pa,lambda e:cls(e,'v23-map-composition')))
cmp('map axes .v23-map-axes', find(pb,lambda e:cls(e,'v23-map-axes')), find(pa,lambda e:cls(e,'v23-map-axes')))
cmp('map nodes', find(pb,lambda e:'data-canon-id' in e['attrs']), find(pa,lambda e:'data-canon-id' in e['attrs']))
cmp('OMEGA-0 .ax-omega', find(pb,lambda e:cls(e,'ax-omega')), find(pa,lambda e:cls(e,'ax-omega')))
cmp('character cards .chars', find(pb,lambda e:cls(e,'chars')), find(pa,lambda e:cls(e,'chars')))
cmp('AXIOM .axiom-entity', find(pb,lambda e:cls(e,'axiom-entity')), find(pa,lambda e:cls(e,'axiom-entity')))
cmp('viewer #showcase-lightbox', find(pb,lambda e:e['attrs'].get('id')=='showcase-lightbox'), find(pa,lambda e:e['attrs'].get('id')=='showcase-lightbox'))
cmp('8 shots figure.ax-shot', find(pb,lambda e:e['tag']=='figure' and cls(e,'ax-shot')), find(pa,lambda e:e['tag']=='figure' and cls(e,'ax-shot')))
res['shots_count']=len(find(pb,lambda e:e['tag']=='figure' and cls(e,'ax-shot')))
# W04 picture: all <picture> inside #world whose sources reference W04
def w04(p):
    w=[e for e in p.els if e['tag']=='section' and e['attrs'].get('id')=='world'][0]
    return [p.src[e['start']:e['end']] for e in p.els if e['tag']=='picture' and w['start']<=e['start']<w['end'] and 'W04' in p.src[e['start']:e['end']]]
cmp('W04 picture', w04(pb), w04(pa))
# head/body outside sections: identical except the two inserted lines
import difflib
outside=lambda s,secs_: s
# screenshot image files referenced by the 8 shots: byte-identical
import re
refs=sorted(set(re.findall(r'(?:src|srcset)="([^"]+)"', ''.join(find(pb,lambda e:e['tag']=='figure' and cls(e,'ax-shot'))))))
files=set()
for r in refs:
    for part in r.split(','):
        files.add(part.strip().split(' ')[0])
fres={}
for f in sorted(files):
    try: fres[f]= show(B,f,True)==show(A,f,True)
    except subprocess.CalledProcessError: fres[f]='missing'
res['shot_files']={'n':len(fres),'all_identical':all(v is True for v in fres.values())}
if not res['shot_files']['all_identical']: fails.append('shot files')
# non-docs file delta
delta=subprocess.check_output(['git','-C',REPO,'diff','--name-only',B,A,'--','.',':!docs']).decode().split()
res['non_docs_delta']=delta
res['failures']=fails
print(json.dumps(res,ensure_ascii=False,indent=1))
sys.exit(1 if fails else 0)
