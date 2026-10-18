// static server for an immutable snapshot (gzip-less, Pages-like 404)
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.resolve(process.argv[2]),PORT=+process.argv[3];
const T={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.json':'application/json','.woff2':'font/woff2','.jpg':'image/jpeg','.avif':'image/avif'};
http.createServer((q,r)=>{let p=decodeURIComponent(new URL(q.url,'http://x').pathname);let f=path.join(ROOT,p);if(!f.startsWith(ROOT)){r.writeHead(403);return r.end()}
if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');let s=200;if(!fs.existsSync(f)){f=path.join(ROOT,'404.html');s=404}
r.writeHead(s,{'Content-Type':T[path.extname(f)]||'application/octet-stream','Cache-Control':'max-age=600'});fs.createReadStream(f).pipe(r)}).listen(PORT,'127.0.0.1');
