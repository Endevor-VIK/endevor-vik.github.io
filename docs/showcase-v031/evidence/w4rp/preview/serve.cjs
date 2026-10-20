/* Loopback-only Git-backed full landing review. No product writes or copied assets. */
const fs=require('fs'),path=require('path'),http=require('http'),cp=require('child_process');
const ROOT=path.resolve(__dirname,'../../../../..');
const REFS={before:'6b082e5f262c09a123748273da42277d3a29a6c2',current:'b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5',aplus:'b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5'};
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};
function makeServer(){
 const cache=new Map();let cached=0;const limit=24*1024*1024;
 return http.createServer((req,res)=>{
  try{
   const uri=new URL(req.url,'http://127.0.0.1');let p=decodeURIComponent(uri.pathname);
   if(p==='/'){res.writeHead(200,{'Content-Type':types['.html']});return res.end('<meta charset="utf-8"><title>R1.P isolated full LANDING</title><p>R1.P only · Gate R-A CHANGES REQUESTED · R2 NOT AUTHORIZED</p><p><a href="/before/">BEFORE 6b082e5</a> · <a href="/current/">CURRENT b85fbb0</a> · <a href="/aplus/">A+ full snapshot</a></p>');}
   if(p==='/favicon.ico'){res.writeHead(204);return res.end();}
   const m=p.match(/^\/(before|current|aplus)(\/.*)?$/);if(!m){res.writeHead(404);return res.end();}
   if(!m[2]){res.writeHead(302,{Location:'/'+m[1]+'/'});return res.end();}
   const arm=m[1];let file=m[2].slice(1)||'index.html';
   if(file.endsWith('/'))file+='index.html';
   if(file.includes('..')||file.includes('\\')||!(/^(index\.html|404\.html|loader\.html|assets\/[a-zA-Z0-9_./@ -]+)$/.test(file)||(arm==='aplus'&&file==='r1p.css'))){res.writeHead(403);return res.end();}
   const key=arm+':'+file;let data=cache.get(key);
   if(!data){
    if(arm==='aplus'&&(file==='index.html'||file==='r1p.css'))data=fs.readFileSync(path.join(__dirname,file==='index.html'?'aplus.html':file));
    else {const out=cp.spawnSync('git',['show',REFS[arm]+':'+file],{cwd:ROOT,maxBuffer:16*1024*1024});if(out.status!==0){res.writeHead(404);return res.end();}data=out.stdout;}
    while(cached+data.length>limit&&cache.size){const first=cache.keys().next().value;cached-=cache.get(first).length;cache.delete(first);}
    if(data.length<=limit){cache.set(key,data);cached+=data.length;}
   }
   res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-R1P-Source':arm==='aplus'&&file==='index.html'?'isolated snapshot':REFS[arm]});res.end(data);
  }catch{res.writeHead(400);res.end();}
 });
}
module.exports={makeServer,ROOT,REFS};
if(require.main===module){const port=Number(process.argv[2]||0);const server=makeServer();server.listen(port,'127.0.0.1',()=>console.log('R1.P read-only review http://127.0.0.1:'+server.address().port+'/'));for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>server.close(()=>process.exit(0)));}
