// Utilidades de Node para trabajar con el motor (generar/verificar ejercicios).
const fs=require('fs'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','engine.js'),'utf8');
const E=new Function(src+';return {legal,make,unmake,inCheck,search,ab,evaluate,gen,attacked,setStop:function(t){stopAt=t;aborted=false;},CK:CK,CQ:CQ};')();
const FILES='abcdefgh';
function fen2pos(f){const [b,t,c,ep,h,fm]=f.split(' ');const B=[];for(const ch of b.replace(/\//g,'')){if(/\d/.test(ch))for(let i=0;i<+ch;i++)B.push(null);else B.push(ch);}
 let cc=0;if(c.includes('K'))cc|=1;if(c.includes('Q'))cc|=2;if(c.includes('k'))cc|=4;if(c.includes('q'))cc|=8;
 return {b:B,t,c:cc,ep:ep==='-'?-1:(FILES.indexOf(ep[0])+(8-+ep[1])*8),h:+(h||0),f:+(fm||1)};}
function pos2fen(P){let s='';for(let r=0;r<8;r++){let e=0;for(let f=0;f<8;f++){const p=P.b[r*8+f];if(!p)e++;else{if(e){s+=e;e=0;}s+=p;}}if(e)s+=e;if(r<7)s+='/';}
 let c='';if(P.c&1)c+='K';if(P.c&2)c+='Q';if(P.c&4)c+='k';if(P.c&8)c+='q';
 return `${s} ${P.t} ${c||'-'} ${P.ep<0?'-':FILES[P.ep&7]+(8-(P.ep>>3))} ${P.h} ${P.f}`;}
const sq=i=>FILES[i&7]+(8-(i>>3));
const code=m=>sq(m.f)+sq(m.t)+(m.pr?m.pr.toLowerCase():'');
function rootScores(P,d){E.setStop(Date.now()+1e9);const out=[];for(const m of E.legal(P)){const u=E.make(P,m);const s=-E.ab(P,d-1,-1e9,1e9,1);E.unmake(P,m,u);out.push({m,s,c:code(m)});}out.sort((a,b)=>b.s-a.s);return out;}
function findMove(P,c){return E.legal(P).find(m=>code(m)===c);}
function isMate(P){return E.legal(P).length===0&&E.inCheck(P,P.t);}
module.exports={E,fen2pos,pos2fen,code,sq,rootScores,findMove,isMate};
