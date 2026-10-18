import json, glob, sys, statistics as st
d=sys.argv[1]; tags=sys.argv[2:]
for tag in tags:
  for ff in ('mobile','desktop'):
    rows=[]
    for f in sorted(glob.glob(f'{d}/lh-{tag}-{ff}-*.json')):
      j=json.load(open(f)); c=j['categories']; a=j['audits']
      rows.append(dict(perf=round(c['performance']['score']*100), a11y=round(c['accessibility']['score']*100), bp=round(c['best-practices']['score']*100), seo=round(c['seo']['score']*100),
        fcp=a['first-contentful-paint']['numericValue']/1000, lcp=a['largest-contentful-paint']['numericValue']/1000, tbt=a['total-blocking-time']['numericValue'], cls=a['cumulative-layout-shift']['numericValue'],
        kb=a['total-byte-weight']['numericValue']/1024, lcpel=(a.get('largest-contentful-paint-element',{}).get('details',{}).get('items',[{}])[0].get('items',[{}])[0].get('node',{}).get('snippet','') if a.get('largest-contentful-paint-element') else '')[:70]))
    if not rows: continue
    med=lambda k: st.median(r[k] for r in rows)
    print(f"{tag:7} {ff:7} n={len(rows)} perf {med('perf'):.0f} ({min(r['perf'] for r in rows)}–{max(r['perf'] for r in rows)}) a11y {med('a11y'):.0f} bp {med('bp'):.0f} seo {med('seo'):.0f} | FCP {med('fcp'):.2f}s LCP {med('lcp'):.2f}s ({min(r['lcp'] for r in rows):.2f}–{max(r['lcp'] for r in rows):.2f}) TBT {med('tbt'):.0f}ms CLS {med('cls'):.3f} KB {med('kb'):.0f}")
    print('        LCP element:', rows[0]['lcpel'])
