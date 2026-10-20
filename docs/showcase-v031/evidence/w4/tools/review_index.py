#!/usr/bin/env python3
"""Generate an offline comparison index from retained native screenshot manifests.
No screenshot pixels are edited. Run with the durable w4 evidence directory.
"""
import hashlib,html,json,re,sys
from pathlib import Path
base=Path(sys.argv[1]).resolve()
data={phase:json.loads((base/phase/'manifest.json').read_text()) for phase in ['before','after']}
scenes={'entry':'W01 · Entry','black-sun':'BLACK SUN','what-remains':'WHAT REMAINS','work-02':'WORK 02 · Cartography / WATCH_DOG','work-03':'WORK 03 · Chronicle','work-05':'WORK 05 · Content','factions':'FACTIONS','protected-map':'Protected · Map','protected-omega':'Protected · OMEGA-0','protected-people':'Protected · People','protected-axiom':'Protected · AXIOM ∅','epilogue':'Epilogue → VISION'}
payload={}
for phase,manifest in data.items():
 payload[phase]={'sha':manifest['sourceSha'],'captures':[]}
 for capture in manifest['captures']:
  file=base/phase/capture['path']
  if hashlib.sha256(file.read_bytes()).hexdigest()!=capture['sha256']:raise ValueError(file)
  name=Path(capture['path']).stem
  if name.startswith('work-'):
   scene=name[:7]
   order=0 if '-closed' in name else 1 if '-case' in name else 2 if name.endswith('-open') else 3
  else:
   scene=next((s for s in scenes if name==s or re.fullmatch(re.escape(s)+r'-\d+',name)),None);order=0
  if scene:payload[phase]['captures'].append({'scene':scene,'engine':capture['engine'],'viewport':capture['viewport'],'path':phase+'/'+capture['path'],'name':name,'order':order,'scrollY':capture['scrollY'],'sha256':capture['sha256']})
document='''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>0524.W4 · BEFORE / AFTER</title>
<style>:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#0a0b0f;color:#f1f1f4;font:16px/1.55 system-ui,sans-serif}header{padding:20px 24px;border-bottom:1px solid #41434b}h1{font-size:24px;margin:0 0 8px}p{max-width:110ch;margin:8px 0}label{display:inline-block;margin:12px 16px 4px 0}select{font:inherit;padding:8px;background:#15161b;color:inherit;border:1px solid #777}select:focus-visible,a:focus-visible{outline:3px solid #ff2034}main{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:20px 16px}h2{font-size:18px;overflow-wrap:anywhere}figure{margin:0 0 24px}img{display:block;width:100%;height:auto;border:1px solid #41434b}figcaption{font-size:13px;overflow-wrap:anywhere;color:#bcc1cc;margin-top:6px}a{color:inherit}code{font-size:13px}@media(max-width:700px){main{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}</style>
<header><h1>0524.W4 · BEFORE / AFTER</h1><p>Нативные кадры из одинаковых движков и CSS viewport: DPR1, reduced motion. Каждый раздел показан целиком перекрывающимися сегментами; разная высота сцен отражает редактуру. Кадры не склеены и не ретушированы. Нажмите изображение для исходного разрешения.</p><p>WORK: сначала закрытая карточка с настоящим скриншотом, затем состояние открытого контекста и все его сегменты. В BEFORE раскрытий ещё нет. Новые схемы подписаны как концептуальные. Gate B PENDING · NOT DEPLOYED.</p><label>Сцена <select id="scene"></select></label><label>Движок <select id="engine"><option>chromium</option><option>firefox</option><option>webkit</option></select></label><label>Viewport <select id="viewport"><option>1440x900</option><option>1920x1080</option><option>1366x768</option><option>1024x768</option><option>768x1024</option><option>390x844</option><option>360x800</option></select></label><p id="status" aria-live="polite"></p></header><main></main>
<script id="records" type="application/json">RECORDS</script><script>
const data=JSON.parse(document.getElementById('records').textContent),scenes=SCENES;
const scene=document.getElementById('scene'),engine=document.getElementById('engine'),viewport=document.getElementById('viewport');
for(const [key,title]of Object.entries(scenes)){const o=document.createElement('option');o.value=key;o.textContent=title;scene.append(o)}scene.value='black-sun';
function render(){const main=document.querySelector('main');main.replaceChildren();let total=0;for(const phase of ['before','after']){const col=document.createElement('section'),h=document.createElement('h2');h.textContent=phase.toUpperCase()+' · '+data[phase].sha.slice(0,12);col.append(h);const frames=data[phase].captures.filter(x=>x.scene===scene.value&&x.engine===engine.value&&x.viewport===viewport.value).sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,undefined,{numeric:true}));total+=frames.length;for(const x of frames){const f=document.createElement('figure'),a=document.createElement('a'),i=document.createElement('img'),c=document.createElement('figcaption');a.href=x.path;i.src=x.path;i.alt=phase.toUpperCase()+' · '+scenes[x.scene]+' · '+x.name+' · '+x.viewport;i.loading='lazy';a.append(i);c.textContent=x.name+' · scrollY '+x.scrollY+' · SHA256 '+x.sha256;f.append(a,c);col.append(f)}main.append(col)}document.getElementById('status').textContent=scenes[scene.value]+' · '+engine.value+' · '+viewport.value+' · '+total+' кадров';location.hash=new URLSearchParams({scene:scene.value,engine:engine.value,viewport:viewport.value})}
const q=new URLSearchParams(location.hash.slice(1));for(const s of [scene,engine,viewport]){if(q.has(s.id))s.value=q.get(s.id);s.addEventListener('change',render)}render();
</script></html>'''
document=document.replace('RECORDS',json.dumps(payload,ensure_ascii=False).replace('</','<\\/')).replace('SCENES',json.dumps(scenes,ensure_ascii=False))
(base/'REVIEW.html').write_text(document)
print(json.dumps({'output':str(base/'REVIEW.html'),'bytes':len(document.encode()),'validatedCaptures':sum(len(x['captures']) for x in data.values())}))
