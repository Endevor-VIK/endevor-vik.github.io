// Pages-like static server for an immutable snapshot: gzip for text types, max-age=600, 404 fallback.
const http=require('http'),fs=require('fs'),path=require('path'),zlib=require('zlib');
const ROOT=path.resolve(process.argv[2]),PORT=+process.argv[3];
const T={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.json':'application/json; charset=utf-8','.woff2':'font/woff2','.jpg':'image/jpeg','.avif':'image/avif','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
const GZ=new Set(['.html','.css','.js','.svg','.json','.txt','.md']);
http.createServer((q,r)=>{let p=decodeURIComponent(new URL(q.url,'http://x').pathname);let f=path.join(ROOT,p);if(!f.startsWith(ROOT)){r.writeHead(403);return r.end()}
 if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');let s=200;if(!fs.existsSync(f)){f=path.join(ROOT,'404.html');s=404}
 const ext=path.extname(f),h={'Content-Type':T[ext]||'application/octet-stream','Cache-Control':'max-age=600'};
 if(GZ.has(ext)&&/gzip/.test(q.headers['accept-encoding']||'')){h['Content-Encoding']='gzip';h['Vary']='Accept-Encoding';r.writeHead(s,h);fs.createReadStream(f).pipe(zlib.createGzip()).pipe(r)}
 else{r.writeHead(s,h);fs.createReadStream(f).pipe(r)}}).listen(PORT,'127.0.0.1');
