#!/usr/bin/env python3
"""R4 independent recompute of W4.R perf budgets B1-B6 from RAW Lighthouse reports (not from executor summaries).
Usage: r4_perf_recompute.py <summary-a.json> <raw-dir-a> <summary-b.json> <raw-dir-b> ... (pairs of summary/rawdir)"""
import json, sys, statistics as st, os, hashlib
args=sys.argv[1:]; obs=[]; mismatches=[]
def lh(rep):
    a=rep['audits'];c=rep['categories']
    sc=lambda k: round(c[k]['score']*100) if c[k]['score'] is not None else None
    return {'performance':sc('performance'),'accessibility':sc('accessibility'),'bestPractices':sc('best-practices'),'seo':sc('seo'),
            'fcpMs':a['first-contentful-paint']['numericValue'],'lcpMs':a['largest-contentful-paint']['numericValue'],
            'tbtMs':a['total-blocking-time']['numericValue'],'cls':a['cumulative-layout-shift']['numericValue'],
            'lcpElement':(a.get('largest-contentful-paint-element',{}).get('details',{}).get('items') or [{}])[0].get('items',[{}])[0].get('node',{}).get('snippet','')[:90] if a.get('largest-contentful-paint-element') else None,
            'renderBlocking':[i.get('url','').split('/')[-1] for i in (a.get('render-blocking-resources',{}).get('details') or {}).get('items',[])] or [i.get('url','').split('/')[-1] for i in ((a.get('render-blocking-insight') or {}).get('details') or {}).get('items',[])],
            'requestedUrl':rep.get('requestedUrl'),'finalUrl':rep.get('finalDisplayedUrl') or rep.get('finalUrl'),'runtimeError':rep.get('runtimeError'),'runWarnings':rep.get('runWarnings')}
for si in range(0,len(args),2):
    summ=json.load(open(args[si])); raw=args[si+1]; tag=os.path.basename(args[si])
    for r in summ['runs']:
        rep=json.load(open(os.path.join(raw,r['fullReport'])))
        m=lh(rep)
        for k in ('performance','accessibility','bestPractices','seo','fcpMs','lcpMs','tbtMs','cls'):
            if abs((r['metrics'][k] or 0)-(m[k] or 0))>1e-6: mismatches.append((tag,r['fullReport'],k,r['metrics'][k],m[k]))
        obs.append({'run':tag,'pair':r['pair'],'ff':r['formFactor'],'arm':r['arm'],**m})
out={'n_observations':len(obs),'summary_vs_raw_mismatches':mismatches,'profiles':{},'budgets':[]}
med=st.median
for ff in ('mobile','desktop'):
    P={}
    for k in ('performance','accessibility','bestPractices','seo','fcpMs','lcpMs','tbtMs','cls'):
        b=[o[k] for o in obs if o['ff']==ff and o['arm']=='before']; a=[o[k] for o in obs if o['ff']==ff and o['arm']=='after']
        pairs={}
        for o in obs:
            if o['ff']==ff: pairs.setdefault((o['run'],o['pair']),{})[o['arm']]=o[k]
        d=[v['after']-v['before'] for v in pairs.values()]
        P[k]={'n_before':len(b),'n_after':len(a),'median_before':med(b),'median_after':med(a),'paired_delta_median':med(d),'after_values':sorted(round(x,1) for x in a),'before_values':sorted(round(x,1) for x in b),'mean_after':st.mean(a),'sd_after':st.pstdev(a)}
    P['lcpElements_after']=sorted(set(o['lcpElement'] for o in obs if o['ff']==ff and o['arm']=='after'))
    P['lcpElements_before']=sorted(set(o['lcpElement'] for o in obs if o['ff']==ff and o['arm']=='before'))
    P['renderBlocking_after']=sorted(set(x for o in obs if o['ff']==ff and o['arm']=='after' for x in o['renderBlocking']))
    P['runtimeErrors']=[o['runtimeError'] for o in obs if o['ff']==ff and o['runtimeError']]
    out['profiles'][ff]=P
B=out['budgets']
def add(id_,name,ok,detail): B.append({'id':id_,'check':name,'pass':bool(ok),'detail':detail})
m,d=out['profiles']['mobile'],out['profiles']['desktop']
add('B1','mobile perf AFTER >= 90',m['performance']['median_after']>=90,m['performance']['median_after'])
add('B1','desktop perf AFTER >= 95',d['performance']['median_after']>=95,d['performance']['median_after'])
for ff,P in (('mobile',m),('desktop',d)):
    for k,bid in (('lcpMs','B2'),('fcpMs','B5')):
        dl=P[k]['paired_delta_median'];pct=dl/P[k]['median_before']*100
        add(bid,f'{ff} {k} paired delta not (>+10% AND >+150ms)',not(pct>10 and dl>150),{'delta_ms':round(dl,1),'pct':round(pct,2)})
    add('B3',f'{ff} CLS delta<=0.02 and AFTER<=0.1',P['cls']['paired_delta_median']<=0.02 and P['cls']['median_after']<=0.1,{'delta':P['cls']['paired_delta_median'],'after':P['cls']['median_after']})
    add('B4',f'{ff} TBT delta<=50'+(' and AFTER<=200' if ff=='mobile' else ''),P['tbtMs']['paired_delta_median']<=50 and (ff!='mobile' or P['tbtMs']['median_after']<=200),{'delta':P['tbtMs']['paired_delta_median'],'after':P['tbtMs']['median_after']})
    for k in ('accessibility','bestPractices','seo'):
        add('B6',f'{ff} {k} AFTER >= BEFORE',P[k]['median_after']>=P[k]['median_before'],[P[k]['median_before'],P[k]['median_after']])
add('B2','mobile LCP AFTER median <= 2500',m['lcpMs']['median_after']<=2500,round(m['lcpMs']['median_after'],1))
out['budget_summary']=f"{sum(b['pass'] for b in B)}/{len(B)}"
print(json.dumps(out,ensure_ascii=False,indent=1))
