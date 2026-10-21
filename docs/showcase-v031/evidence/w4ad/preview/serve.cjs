/* Loopback-only Git-backed review: /aplus/ (frozen R1.P) and /ad/ (art-direction prototype). No product writes. */
const fs=require('fs'),path=require('path'),http=require('http'),cp=require('child_process');
const ROOT=path.resolve(__dirname,'../../../../..');
const PRODUCT='b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5';
const W4RP=path.join(ROOT,'docs/showcase-v031/evidence/w4rp/preview');
const LOCAL={aplus:{'index.html':path.join(W4RP,'aplus.html'),'r1p.css':path.join(W4RP,'r1p.css')},
 ad:{'index.html':path.join(__dirname,'ad.html'),'r1p.css':path.join(W4RP,'r1p.css'),'ad.css':path.join(__dirname,'ad.css'),'ad.js':path.join(__dirname,'ad.js')}};
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
function makeServer(){
 const cache=new Map();
 return http.createServer((req,res)=>{
  try{
   const p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
   if(p==='/'){res.writeHead(200,{'Content-Type':types['.html']});return res.end('<meta charset="utf-8"><title>W4.AD review</title><p>W4.AD prototype only · R2 NOT AUTHORIZED</p><p><a href="/aplus/">A+ (R1.P frozen)</a> · <a href="/ad/">A+AD (art direction)</a></p>');}
   const m=p.match(/^\/(aplus|ad)(\/.*)?$/);if(!m){res.writeHead(404);return res.end();}
   if(!m[2]){res.writeHead(302,{Location:`/${m[1]}/`});return res.end();}
   let file=m[2].slice(1)||'index.html';
   const proposed=m[1]==='ad'&&/^proposed\/A08_protocol_gate-\d+w\.(avif|webp)$/.test(file)?path.join(__dirname,'proposed-assets',file.slice(9)):null;
   if(file.includes('..')||!(/^assets\/[a-zA-Z0-9_./@ -]+$/.test(file)||LOCAL[m[1]][file]||proposed)){res.writeHead(403);return res.end();}
   let data=cache.get(m[1]+file);
   if(!data){
    if(proposed)data=fs.readFileSync(proposed);
    else if(LOCAL[m[1]][file])data=fs.readFileSync(LOCAL[m[1]][file]);
    else{const o=cp.spawnSync('git',['show',`${PRODUCT}:${file}`],{cwd:ROOT,maxBuffer:16*1024*1024});if(o.status!==0){res.writeHead(404);return res.end();}data=o.stdout;cache.set(m[1]+file,data);}
   }
   res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  }catch{res.writeHead(400);res.end();}
 });
}
module.exports={makeServer,ROOT,PRODUCT};
if(require.main===module){const s=makeServer();s.listen(Number(process.argv[2]||0),'127.0.0.1',()=>console.log('W4.AD review http://127.0.0.1:'+s.address().port+'/'));for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>s.close(()=>process.exit(0)));}
