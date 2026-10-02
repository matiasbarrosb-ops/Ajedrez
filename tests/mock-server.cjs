// Servidor de pruebas: sirve docs-test/ y una base de datos en memoria en /__db
const http=require('http'),fs=require('fs'),path=require('path');
let tree={},v=0;
function setP(p,val){const ks=p.split('/').filter(Boolean);if(!ks.length){tree=val||{};return;}let o=tree;for(let i=0;i<ks.length-1;i++){if(o[ks[i]]==null||typeof o[ks[i]]!=='object')o[ks[i]]={};o=o[ks[i]];}
 if(val==null)delete o[ks[ks.length-1]];else o[ks[ks.length-1]]=JSON.parse(JSON.stringify(val,(k,x)=>x===null?undefined:x));}
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webmanifest':'application/manifest+json'};
http.createServer((q,s)=>{
 s.setHeader('access-control-allow-origin','*');
 if(q.url.startsWith('/__db')){
  if(q.method==='GET'){s.end(JSON.stringify({v,tree}));return;}
  let b='';q.on('data',d=>b+=d);q.on('end',()=>{const r=JSON.parse(b);
   if(r.v!==undefined&&r.v!==v){s.statusCode=409;s.end(JSON.stringify({v,tree}));return;}
   setP(r.path,r.value);v++;s.end(JSON.stringify({v,tree}));});return;}
 let f=path.join(__dirname,'..','docs-test',decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';
 fs.readFile(f,(e,d)=>{if(e){s.statusCode=404;s.end();return;}s.setHeader('content-type',mime[path.extname(f)]||'text/plain');s.end(d);});
}).listen(8003);
