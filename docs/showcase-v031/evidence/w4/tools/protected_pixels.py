#!/usr/bin/env python3
"""Compare protected composition; source/computed typography proof stays separate.
Usage: protected_pixels.py <before manifest> <after manifest> <output JSON>.
Masks sticky chrome and pixels outside the selected protected element. Tests native
pixel alignment +/-1, reporting every tolerance explicitly; no image modifications.
Independent lossy WebP screenshots and fractional scroll create high-frequency
differences. Raw and 1.5px low-pass statistics are observations only. This tool
issues no PASS/FAIL verdict; exact source/style proof and visual review govern.
"""
import json,sys
from pathlib import Path
from PIL import Image,ImageChops,ImageStat,ImageFilter
before_path,after_path,out=map(Path,sys.argv[1:4])
before=json.loads(before_path.read_text());after=json.loads(after_path.read_text())
index={x['path']:x for x in before['captures']}
names={'protected-map.webp','protected-omega.webp','protected-people.webp','protected-axiom.webp'}
rows=[]
for item in after['captures']:
 if Path(item['path']).name not in names:continue
 reference=index.get(item['path'])
 if not reference:
  rows.append({'path':item['path'],'status':'NOT_COMPARED','reason':'BEFORE pair missing'});continue
 with Image.open(before_path.parent/reference['path']) as im:a=im.convert('RGB')
 with Image.open(after_path.parent/item['path']) as im:b=im.convert('RGB')
 if a.size!=b.size:
  rows.append({'path':item['path'],'status':'NOT_COMPARED','reason':'Dimensions differ','before':a.size,'after':b.size});continue
 w,h=a.size
 # The native sticky chrome/ticker and progress bar are not protected content.
 chrome=next((x['detail'].get('header',0) for x in before['checks'] if x['engine']==item['engine'] and x['viewport']==item['viewport'] and x['id']=='menu-jump-world-guide'),0)
 top=max(2,int(max(chrome,item.get('stickyChrome',0)))+4)
 bottom=min(h-2,int(item.get('targetBox',{}).get('bottom',h))-2)
 if bottom-top<80:
  rows.append({'path':item['path'],'status':'NOT_COMPARED','reason':'Comparison area too small'});continue
 best=None;composition=None
 for dx,dy in [(0,0),(-1,0),(1,0),(0,-1),(0,1),(-1,-1),(1,-1),(-1,1),(1,1)]:
  x=a.crop((2,top+2,w-2,bottom-2));y=b.crop((2+dx,top+2+dy,w-2+dx,bottom-2+dy))
  diff=ImageChops.difference(x,y).convert('L');hist=diff.histogram();count=x.width*x.height
  stats={'mean_luma_error':round(ImageStat.Stat(diff).mean[0],5),'changed_fraction_gt24':round(sum(hist[25:])/count,6),'alignment':[dx,dy],'pixels':count}
  if best is None or stats['mean_luma_error']<best['mean_luma_error']:best=stats
  blurred=ImageChops.difference(x.filter(ImageFilter.GaussianBlur(1.5)),y.filter(ImageFilter.GaussianBlur(1.5))).convert('L');hist2=blurred.histogram();comp={'mean_luma_error':round(ImageStat.Stat(blurred).mean[0],5),'changed_fraction_gt24':round(sum(hist2[25:])/count,6),'alignment':[dx,dy]}
  if composition is None or comp['mean_luma_error']<composition['mean_luma_error']:composition=comp
  if stats['mean_luma_error']==0:break
 raw_ok=best['mean_luma_error']<=2 and best['changed_fraction_gt24']<=.02
 rows.append({'path':item['path'],'status':'OBSERVED','raw_exploratory_threshold_exceeded':not raw_ok,'crop':[2,top+2,w-2,bottom-2],'raw':best,'low_pass_sigma_1_5':composition})
result={'before_sha':before['sourceSha'],'after_sha':after['sourceSha'],'method':'native RM, matching engine/viewport/DPR1; sticky chrome and outside-target pixels excluded; +/-1 px alignment; raw diagnostics plus symmetric 1.5px Gaussian composition comparison; no design injection; NOT pixel identity',
 'exploratory_thresholds_not_acceptance':{'raw_mean':2,'raw_fraction_gt24':.02},'samples':rows,'summary':{'pairs':len(rows),'not_compared':sum(x['status']=='NOT_COMPARED' for x in rows),'raw_exploratory_threshold_exceeded':sum(x.get('raw_exploratory_threshold_exceeded',False) for x in rows)},
 'verdict':'NONE — diagnostic only; exact source/computed styles and independent visual review are authoritative'}
out.write_text(json.dumps(result,indent=2));print(json.dumps(result['summary']))
