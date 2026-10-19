#!/usr/bin/env node
/* 0524.W4: sequential Lighthouse pairs on one Pages-like localhost server.
 * Existing dependencies only. Full reports/profiles stay in owned /tmp runs.
 * See docs/showcase-v031/evidence/w4/tools/PERF_RUNNER.md. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const zlib = require('zlib'), crypto = require('crypto'), cp = require('child_process');
const { pathToFileURL } = require('url');
const BASE = '/tmp/axs-0524-w4-perf', MARKER = '.w4-perf-owned.json';
const LOG_LIMIT = 64 * 1024, RUN_LIMIT = 128 * 1024 * 1024;
const KEEP = 3, AGE = 14 * 864e5;
const TYPES = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml', '.avif':'image/avif', '.webp':'image/webp', '.png':'image/png',
  '.jpg':'image/jpeg', '.ico':'image/x-icon', '.woff2':'font/woff2', '.txt':'text/plain; charset=utf-8' };
const TEXT = new Set(['.html','.css','.js','.svg','.json','.txt']);
const uid = () => typeof process.getuid === 'function' ? process.getuid() : null;
function help() { process.stdout.write(`0524.W4 Lighthouse runner (no downloads)\n\n`+
  `node tests/browser/w4_perf.cjs --before-root <immutable root> --before-sha <SHA>\n`+
  `  --after-root <immutable root> --after-sha <SHA> [--pairs 5]\n`+
  `  [--repo <Git repository>] [--out ${BASE}/run-<name>] [--check]\n\n`+
  `Before the first product change: --baseline-only --pairs 1 (omit after arguments).\n`+
  `NODE_PATH must resolve Lighthouse 12.8.2, Playwright 1.61.1 and chrome-launcher;\n`+
  `CHROME_PATH must name the existing Chromium 149 binary. --check never launches Chrome.\n`+
  `Run only in a coordinated browser-free CPU window. Each pair: BEFORE then AFTER,\n`+
  `mobile then desktop, sequentially; each observation gets a fresh Chrome profile.\n`); }
function parse(args) {
  const opts = {};
  for (let i=0;i<args.length;i++) {
    const key=args[i];
    if (['--help','--baseline-only','--check'].includes(key)) opts[key.slice(2)]=true;
    else if (['--before-root','--before-sha','--after-root','--after-sha','--pairs','--repo','--out','--worker'].includes(key)) {
      if (!args[i+1] || args[i+1].startsWith('--')) throw Error('Missing value for '+key);
      opts[key.slice(2)]=args[++i];
    } else throw Error('Unknown argument '+key);
  }
  return opts;
}
function packageInfo(name) {
  const entry=require.resolve(name); let dir=path.dirname(entry);
  for (;;) {
    const file=path.join(dir,'package.json');
    if (fs.existsSync(file)) { const p=JSON.parse(fs.readFileSync(file)); if(p.name===name)return {entry,root:dir,version:p.version}; }
    const up=path.dirname(dir); if(up===dir)throw Error('Package metadata missing for '+name); dir=up;
  }
}
function git(repo, ...args) { return cp.execFileSync('git',['-C',repo,...args],{encoding:'utf8',maxBuffer:4*1024*1024}).trim(); }
function source(repo, root, ref) {
  if(!root || !ref)throw Error('Both source root and source SHA are required');
  root=fs.realpathSync(root); const commit=git(repo,'rev-parse',ref+'^{commit}');
  const files=git(repo,'ls-tree','-r',commit,'--','index.html','404.html','loader.html','assets').split('\n').filter(Boolean);
  const digest=crypto.createHash('sha256'); let bytes=0;
  for(const line of files) {
    const m=/^(100644|100755) blob ([a-f0-9]+)\t(.+)$/.exec(line);
    if(!m)throw Error('Unsupported product tree entry '+line);
    const file=path.join(root,m[3]);
    if(!fs.existsSync(file)||!fs.lstatSync(file).isFile()||fs.realpathSync(file)!==file)throw Error('Missing/nonregular source '+file);
    const data=fs.readFileSync(file), blob=crypto.createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');
    if(blob!==m[2])throw Error('Source differs from '+commit+': '+m[3]);
    digest.update(m[3]+'\0'+blob+'\n'); bytes+=data.length;
  }
  if(!files.some(x=>x.endsWith('\tindex.html')))throw Error('No index.html in source commit');
  return {root,commit,productManifestSha256:digest.digest('hex'),files:files.length,sourceBytes:bytes};
}
function hostGuard() {
  const raw=cp.execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',
    'Get-Volume -DriveLetter C | Select-Object Size,SizeRemaining | ConvertTo-Json -Compress'],{encoding:'utf8',timeout:20000}).replace(/^\uFEFF/,'').trim();
  const v=JSON.parse(raw), freeGiB=Number(v.SizeRemaining)/2**30, freePercent=100*Number(v.SizeRemaining)/Number(v.Size);
  if(!Number.isFinite(freeGiB)||!Number.isFinite(freePercent))throw Error('Unusable Windows host disk measurement');
  if(freeGiB<10||freePercent<5)throw Error('HOST CRITICAL: '+freeGiB.toFixed(2)+' GiB / '+freePercent.toFixed(2)+'%');
  return {checkedAt:new Date().toISOString(),freeGiB,freePercent,warning:freeGiB<25||freePercent<10,
    expectedMaximumRunMiB:RUN_LIMIT/2**20,source:'Windows Get-Volume C'};
}
function owned(dir) {
  try { const p=JSON.parse(fs.readFileSync(path.join(dir,MARKER)));return p.kind==='axs-0524-w4-perf'&&p.uid===uid(); } catch {return false;}
}
function safeRemove(dir) {
  if(path.dirname(dir)!==BASE||!owned(dir)||fs.realpathSync(dir)!==dir)throw Error('Refusing retention removal '+dir);
  fs.rmSync(dir,{recursive:true,force:false});
}
function outputDir(requested) {
  fs.mkdirSync(BASE,{recursive:true}); if(fs.realpathSync(BASE)!==BASE)throw Error('Output base may not be a symlink');
  const out=path.resolve(requested||path.join(BASE,'run-'+new Date().toISOString().replace(/[:.]/g,'-')+'-'+process.pid));
  if(path.dirname(out)!==BASE||!/^run-[A-Za-z0-9_.-]+$/.test(path.basename(out)))throw Error('--out must be a direct run-* child of '+BASE);
  if(fs.existsSync(out))throw Error('Refusing existing output '+out);
  const old=fs.readdirSync(BASE).map(n=>path.join(BASE,n)).filter(p=>fs.lstatSync(p).isDirectory()&&owned(p)).sort((a,b)=>fs.statSync(b).mtimeMs-fs.statSync(a).mtimeMs);
  for(const [i,dir] of old.entries())if(i>=KEEP-1||Date.now()-fs.statSync(dir).mtimeMs>AGE)safeRemove(dir);
  fs.mkdirSync(out);fs.writeFileSync(path.join(out,MARKER),JSON.stringify({kind:'axs-0524-w4-perf',uid:uid(),createdAt:new Date().toISOString()}));
  fs.mkdirSync(path.join(out,'reports'));fs.mkdirSync(path.join(out,'profiles'));return out;
}
function capLog(file) {
  if(!fs.existsSync(file)||fs.statSync(file).size<=LOG_LIMIT)return;
  const fd=fs.openSync(file,'r'), end=fs.statSync(file).size, tail=Buffer.alloc(LOG_LIMIT);
  fs.readSync(fd,tail,0,LOG_LIMIT,end-LOG_LIMIT);fs.closeSync(fd);fs.writeFileSync(file,tail);
}
function footprint(dir) {
  let n=0;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);n+=e.isDirectory()?footprint(p):e.isFile()?fs.statSync(p).size:0;}return n;
}
async function worker(configFile) {
  const c=JSON.parse(fs.readFileSync(configFile)), profile=c.profileDir;
  if(!profile.startsWith(BASE+'/run-')||path.basename(path.dirname(profile))!=='profiles'||fs.existsSync(profile))throw Error('Invalid worker profile');
  fs.mkdirSync(profile);let chrome, stopping=false;
  const cleanup=async()=>{if(stopping)return;stopping=true;if(chrome)try{await chrome.kill();}catch{}fs.rmSync(profile,{recursive:true,force:true});};
  const stop=()=>{cleanup().finally(()=>process.exit(130));};process.once('SIGTERM',stop);process.once('SIGINT',stop);
  const logTimer=setInterval(()=>{for(const n of ['chrome-out.log','chrome-err.log'])capLog(path.join(profile,n));},1000);logTimer.unref();
  try {
    const launcher=await import(pathToFileURL(c.launcherEntry).href);
    // chrome-launcher converts Linux profiles to Windows UNC paths under WSL,
    // even for Linux Chrome. Reuse its public default flags and own the Linux
    // process/profile directly; no launcher-created Windows TEMP directory.
    const outFd=fs.openSync(path.join(profile,'chrome-out.log'),'a'),errFd=fs.openSync(path.join(profile,'chrome-err.log'),'a');
    const proc=cp.spawn(c.chromePath,[...launcher.Launcher.defaultFlags(),'--remote-debugging-port=0',
      '--user-data-dir='+profile,'--headless=new','--no-sandbox','--disable-gpu','about:blank'],
      {detached:true,cwd:profile,stdio:['ignore',outFd,errFd],env:process.env});
    fs.closeSync(outFd);fs.closeSync(errFd);let spawnError;proc.once('error',e=>{spawnError=e;});
    if(proc.pid)fs.writeFileSync(path.join(profile,'chrome.pid'),String(proc.pid));
    chrome={pid:proc.pid,port:0,kill:()=>new Promise(resolve=>{
      if(proc.exitCode!==null||proc.signalCode!==null)return resolve();
      const timer=setTimeout(resolve,3000);const done=()=>{clearTimeout(timer);resolve();};proc.once('close',done);
      try{process.kill(-proc.pid,'SIGKILL');}catch{done();}
    })};
    const activePort=path.join(profile,'DevToolsActivePort'),deadline=Date.now()+20000;
    while(!fs.existsSync(activePort)){
      if(spawnError)throw spawnError;
      if(proc.exitCode!==null||proc.signalCode!==null)throw Error('Linux Chrome exited before DevTools was ready');
      if(Date.now()>deadline)throw Error('Linux Chrome DevTools startup timed out');
      await new Promise(resolve=>setTimeout(resolve,50));
    }
    chrome.port=Number(fs.readFileSync(activePort,'utf8').split('\n')[0]);
    if(!Number.isInteger(chrome.port)||chrome.port<1)throw Error('Invalid Chrome DevTools port');
    const lighthouse=(await import(pathToFileURL(c.lighthouseEntry).href)).default;
    const config=c.formFactor==='desktop'?(await import(pathToFileURL(c.desktopConfig).href)).default:undefined;
    const result=await lighthouse(c.url,{port:chrome.port,logLevel:'error',output:'json',
      onlyCategories:['performance','accessibility','best-practices','seo']},config);
    if(!result||result.lhr.runtimeError)throw Error('Lighthouse runtime error: '+JSON.stringify(result?.lhr.runtimeError));
    const json=JSON.stringify(result.lhr);if(Buffer.byteLength(json)>8*1024*1024)throw Error('Full Lighthouse report exceeds 8 MiB budget');
    fs.writeFileSync(c.report,json);
  } finally { clearInterval(logTimer);await cleanup(); }
}
function killOwnChrome(profile) {
  try {const pid=Number(fs.readFileSync(path.join(profile,'chrome.pid'),'utf8'));
    if(pid>1&&fs.readFileSync('/proc/'+pid+'/cmdline','utf8').includes(profile))process.kill(-pid,'SIGKILL');
  } catch {}
}
function runChild(configFile,logFile,profile) {
  return new Promise((resolve,reject)=>{
    const child=cp.spawn(process.execPath,[__filename,'--worker',configFile],{detached:true,stdio:['ignore','pipe','pipe'],env:process.env});
    let tail=Buffer.alloc(0), timedOut=false;
    const collect=data=>{tail=Buffer.concat([tail,data]);if(tail.length>LOG_LIMIT)tail=tail.subarray(tail.length-LOG_LIMIT);};
    child.stdout.on('data',collect);child.stderr.on('data',collect);
    const killTimer=setTimeout(()=>{timedOut=true;child.kill('SIGTERM');},180000);
    const hardTimer=setTimeout(()=>{killOwnChrome(profile);try{process.kill(-child.pid,'SIGKILL');}catch{}},186000);
    const stop=()=>{child.kill('SIGTERM');};process.once('SIGTERM',stop);process.once('SIGINT',stop);
    child.once('error',reject);
    child.once('close',(code,signal)=>{
      clearTimeout(killTimer);clearTimeout(hardTimer);process.removeListener('SIGTERM',stop);process.removeListener('SIGINT',stop);
      fs.writeFileSync(logFile,tail);killOwnChrome(profile);fs.rmSync(profile,{recursive:true,force:true});
      if(code!==0||timedOut)reject(Error('LH worker failed '+path.basename(logFile)+': '+JSON.stringify({code,signal,timedOut})+' '+tail.toString().slice(-1500)));
      else resolve();
    });
  });
}
async function pagesServer(roots) {
  let arm='before', counts={};
  const server=http.createServer((req,res)=>{
    const root=roots[arm].root;let f;
    try{f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400);return res.end();}
    if(f!==root&&!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
    if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');let status=200;
    if(!fs.existsSync(f)){f=path.join(root,'404.html');status=404;}
    if(!fs.realpathSync(f).startsWith(root+path.sep)||!fs.statSync(f).isFile()){res.writeHead(403);return res.end();}
    const ext=path.extname(f),headers={'Content-Type':TYPES[ext]||'application/octet-stream','Cache-Control':'max-age=600'};
    const gzip=TEXT.has(ext)&&/\bgzip\b/.test(req.headers['accept-encoding']||'');if(gzip){headers['Content-Encoding']='gzip';headers.Vary='Accept-Encoding';}
    const key=path.relative(root,f);counts[key]??={requests:0,bodyBytes:0,gzip};const count=counts[key];count.requests++;
    res.writeHead(status,headers);const read=fs.createReadStream(f), stream=gzip?read.pipe(zlib.createGzip()):read;
    stream.on('data',b=>{count.bodyBytes+=b.length;});stream.on('error',()=>res.destroy());res.on('close',()=>{read.destroy();stream.destroy();});stream.pipe(res);
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  return {url:'http://127.0.0.1:'+server.address().port+'/',activate(next){arm=next;counts={};},snapshot:()=>counts,
    close:()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections?.();})};
}
const median=a=>{const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;};
function stats(values) {values=values.filter(Number.isFinite);if(!values.length)return null;const mean=values.reduce((a,b)=>a+b,0)/values.length;
  return {n:values.length,median:median(values),min:Math.min(...values),max:Math.max(...values),standardDeviation:Math.sqrt(values.reduce((n,v)=>n+(v-mean)**2,0)/values.length)};}
function observation(lhr) {
  const a=lhr.audits, value=id=>a[id]?.numericValue??null, items=id=>a[id]?.details?.items||[];
  const score=id=>lhr.categories[id]?.score==null?null:Math.round(lhr.categories[id].score*100);
  const network=items('network-requests'),long=items('long-tasks');
  const cleanUrl=u=>typeof u==='string'?u.replace(/^http:\/\/127\.0\.0\.1:\d+\//,'/'):u;
  const node=(list)=>{for(const x of list||[]){if(x.node?.snippet)return x.node.snippet;const found=node(x.items);if(found)return found;}return null;};
  return {lighthouseVersion:lhr.lighthouseVersion,chromeUserAgent:lhr.environment?.hostUserAgent||lhr.userAgent,
    settings:lhr.configSettings, warnings:lhr.runWarnings,metrics:{
      performance:score('performance'),accessibility:score('accessibility'),bestPractices:score('best-practices'),seo:score('seo'),
      fcpMs:value('first-contentful-paint'),lcpMs:value('largest-contentful-paint'),tbtMs:value('total-blocking-time'),
      cls:value('cumulative-layout-shift'),transferBytes:value('total-byte-weight'),speedIndexMs:value('speed-index')},
    diagnostics:{networkRequests:network.length,worldLibraryRequests:network.filter(x=>x.url?.includes('/world-library/')).length,
      longTasks:{count:long.length,totalMs:long.reduce((n,x)=>n+(x.duration||0),0),maxMs:Math.max(0,...long.map(x=>x.duration||0)),
        longest:long.slice().sort((x,y)=>y.duration-x.duration).slice(0,8).map(x=>({url:cleanUrl(x.url),startTime:x.startTime,duration:x.duration}))},
      largestTransfers:network.slice().sort((x,y)=>(y.transferSize||0)-(x.transferSize||0)).slice(0,12).map(x=>({url:cleanUrl(x.url),transferSize:x.transferSize,resourceSize:x.resourceSize,statusCode:x.statusCode,resourceType:x.resourceType})),
      mainThread:items('mainthread-work-breakdown').map(x=>({group:x.group,duration:x.duration})),
      renderBlocking:items('render-blocking-resources').map(x=>({url:cleanUrl(x.url),totalBytes:x.totalBytes,wastedMs:x.wastedMs})),
      lcpElement:node(items('largest-contentful-paint-element'))}};
}
function summarise(runs) {
  const result={};for(const ff of ['mobile','desktop']){result[ff]={};for(const arm of ['before','after']){
    const rows=runs.filter(x=>x.formFactor===ff&&x.arm===arm);if(!rows.length)continue;
    result[ff][arm]=Object.fromEntries(Object.keys(rows[0].metrics).map(k=>[k,stats(rows.map(x=>x.metrics[k]))]));
  }if(result[ff].after){result[ff].medianDeltas=Object.fromEntries(Object.keys(result[ff].before).map(k=>[k,result[ff].after[k]&&result[ff].before[k]?result[ff].after[k].median-result[ff].before[k].median:null]));}}
  return result;
}
async function main(opts) {
  const repo=fs.realpathSync(opts.repo||path.resolve(__dirname,'../..')), baseline=!!opts['baseline-only'];
  const pairs=Number(opts.pairs||(baseline?1:5));if(!Number.isInteger(pairs)||pairs<1||pairs>5)throw Error('--pairs must be 1..5');
  const lh=packageInfo('lighthouse'),pw=packageInfo('playwright'),launcher=packageInfo('chrome-launcher');
  if(lh.version!=='12.8.2'||pw.version!=='1.61.1')throw Error('Expected Lighthouse12.8.2 / Playwright1.61.1, got '+lh.version+' / '+pw.version);
  if(!process.env.CHROME_PATH||!fs.existsSync(process.env.CHROME_PATH))throw Error('Set CHROME_PATH to the existing Chromium149 binary');
  const roots={before:source(repo,opts['before-root'],opts['before-sha'])};if(!baseline)roots.after=source(repo,opts['after-root'],opts['after-sha']);
  const plan={mode:baseline?'baseline-only':'interleaved-pairs',pairs,sources:roots,environment:{node:process.version,lighthouse:lh.version,playwright:pw.version,chromePath:fs.realpathSync(process.env.CHROME_PATH),
    runnerSha256:crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex')},
    protocol:{server:'One ephemeral localhost server; identical URL and gzip text/max-age=600/MIME/404 rules for both arms',
      order:'For each pair: mobile BEFORE → AFTER, desktop BEFORE → AFTER; no concurrent browser',
      profiles:'Fresh Chrome per observation; Lighthouse default mobile / official desktop config; simulated throttling; default storage reset; first visit/loader enabled',
      retention:'At most 3 owned runs / 14 days; 128 MiB per run; 64 KiB per worker log; profiles removed',
      claim:'Lab measurements; no field INP/CWV or automatic visual/release acceptance'}};
  if(opts.check){process.stdout.write(JSON.stringify(plan,null,2)+'\nCHECK ONLY: no server or Chrome launched.\n');return;}
  plan.host=hostGuard();fs.mkdirSync(BASE,{recursive:true});if(fs.realpathSync(BASE)!==BASE)throw Error('Output base may not be a symlink');
  const lock=path.join(BASE,'.runner-lock');let lockFd;
  try{lockFd=fs.openSync(lock,'wx');fs.writeFileSync(lockFd,String(process.pid));}catch{throw Error('Perf runner lock exists: coordinate owner; no automatic stale-lock deletion');}
  let out,server,interrupted=false;const report={...plan,startedAt:new Date().toISOString(),status:'RUNNING',runs:[]};
  const save=()=>{if(out)fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({...report,summary:summarise(report.runs)},null,2));};
  const signal=()=>{interrupted=true;};process.once('SIGINT',signal);process.once('SIGTERM',signal);
  try {
    out=outputDir(opts.out);report.output=out;save();server=await pagesServer(roots);report.url=server.url;
    process.stdout.write('PERF '+out+'\n');
    for(let pair=1;pair<=pairs;pair++)for(const formFactor of ['mobile','desktop'])for(const arm of Object.keys(roots)){
      if(interrupted)throw Error('Interrupted');server.activate(arm);const tag=String(pair).padStart(2,'0')+'-'+formFactor+'-'+arm;
      const profileDir=path.join(out,'profiles',tag),full=path.join(out,'reports',tag+'.json'),configFile=path.join(out,tag+'.worker.json');
      fs.writeFileSync(configFile,JSON.stringify({url:server.url,formFactor,profileDir,report:full,chromePath:plan.environment.chromePath,
        lighthouseEntry:lh.entry,launcherEntry:launcher.entry,desktopConfig:path.join(lh.root,'core/config/desktop-config.js')}));
      const startedAt=new Date().toISOString();await runChild(configFile,path.join(out,tag+'.log'),profileDir);fs.unlinkSync(configFile);
      const lhr=JSON.parse(fs.readFileSync(full));if(!/Chrome\/149\./.test(lhr.environment?.hostUserAgent||lhr.userAgent||''))throw Error('Expected Chromium149 in measured report');
      const row={pair,formFactor,arm,startedAt,finishedAt:new Date().toISOString(),fullReport:path.relative(out,full),...observation(lhr),serverRequests:server.snapshot()};
      report.runs.push(row);save();process.stdout.write(tag+' '+JSON.stringify(row.metrics)+'\n');
      if(footprint(out)>RUN_LIMIT)throw Error('128 MiB run output ceiling exceeded');
    }
    for(const [arm,s] of Object.entries(roots))if(source(repo,s.root,s.commit).productManifestSha256!==s.productManifestSha256)throw Error('Source changed during measurement '+arm);
    report.status='OBSERVED';
  } catch(e){report.status='INCOMPLETE';report.error=e.message;throw e;}
  finally{
    report.finishedAt=new Date().toISOString();
    try{save();}finally{
      try{if(server)await server.close();}finally{
        try{if(out)fs.rmSync(path.join(out,'profiles'),{recursive:true,force:true});}finally{
          process.removeListener('SIGINT',signal);process.removeListener('SIGTERM',signal);
          if(lockFd!==undefined){fs.closeSync(lockFd);fs.unlinkSync(lock);}
        }
      }
    }
  }
  process.stdout.write('Summary: '+path.join(out,'summary.json')+'\n');
}
(async()=>{const opts=parse(process.argv.slice(2));if(opts.help){help();return;}if(opts.worker)await worker(opts.worker);else await main(opts);})()
  .catch(e=>{process.stderr.write(e.stack+'\n');process.exitCode=1;});
