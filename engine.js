/* Motor de ajedrez: generador de jugadas legales + búsqueda alfa-beta. Sin dependencias. */
var DBL=1,EP=2,CK=4,CQ=8;
var PV={P:100,N:320,B:330,R:500,Q:900,K:0};
var PST={
P:[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
N:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
B:[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
R:[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
Q:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
K:[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20],
KE:[-50,-40,-30,-20,-20,-30,-40,-50,-30,-20,-10,0,0,-10,-20,-30,-30,-10,20,30,30,20,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,20,30,30,20,-10,-30,-30,-30,0,0,0,0,-30,-30,-50,-30,-30,-30,-30,-30,-30,-50]
};
var KN=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
var KD=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
var BD=[[-1,-1],[-1,1],[1,-1],[1,1]], RD=[[-1,0],[1,0],[0,-1],[0,1]];
function isW(p){return p===p.toUpperCase();}
function at(P,r,f){if(r<0||r>7||f<0||f>7)return undefined;return P.b[r*8+f];}
function slide(P,r,f,dirs,a,b){
  for(var i=0;i<dirs.length;i++){var dr=dirs[i][0],df=dirs[i][1],rr=r+dr,ff=f+df;
    while(rr>=0&&rr<8&&ff>=0&&ff<8){var p=P.b[rr*8+ff];if(p){if(p===a||p===b)return true;break;}rr+=dr;ff+=df;}}
  return false;
}
function attacked(P,sq,by){
  var r=sq>>3,f=sq&7,w=by==='w',i;
  var pr=w?r+1:r-1,pc=w?'P':'p';
  if(at(P,pr,f-1)===pc||at(P,pr,f+1)===pc)return true;
  var n=w?'N':'n',k=w?'K':'k';
  for(i=0;i<8;i++){if(at(P,r+KN[i][0],f+KN[i][1])===n)return true;}
  for(i=0;i<8;i++){if(at(P,r+KD[i][0],f+KD[i][1])===k)return true;}
  if(slide(P,r,f,BD,w?'B':'b',w?'Q':'q'))return true;
  if(slide(P,r,f,RD,w?'R':'r',w?'Q':'q'))return true;
  return false;
}
function kingSq(P,c){var k=c==='w'?'K':'k';for(var i=0;i<64;i++)if(P.b[i]===k)return i;return -1;}
function inCheck(P,c){var k=kingSq(P,c);return k>=0&&attacked(P,k,c==='w'?'b':'w');}
function gen(P,capsOnly){
  var ms=[],w=P.t==='w',them=w?'b':'w',b=P.b;
  function enemy(q){return q&&(isW(q)!==w);}
  for(var s=0;s<64;s++){
    var p=b[s];if(!p||isW(p)!==w)continue;
    var r=s>>3,f=s&7,T=p.toUpperCase(),i,to,q;
    if(T==='P'){
      var d=w?-1:1,start=w?6:1,last=w?0:7,r1=r+d;
      var pushP=function(to,cap,fl){
        if((to>>3)===last){var prs=['Q','N','R','B'];for(var j=0;j<4;j++)ms.push({f:s,t:to,p:p,c:cap,fl:fl||0,pr:w?prs[j]:prs[j].toLowerCase()});}
        else ms.push({f:s,t:to,p:p,c:cap,fl:fl||0});
      };
      if(r1>=0&&r1<8){
        if(!b[r1*8+f]){
          if(!capsOnly||r1===last)pushP(r1*8+f,null);
          if(!capsOnly&&r===start&&!b[(r+2*d)*8+f])ms.push({f:s,t:(r+2*d)*8+f,p:p,c:null,fl:DBL});
        }
        for(var k=-1;k<=1;k+=2){var ff=f+k;if(ff<0||ff>7)continue;to=r1*8+ff;
          if(enemy(b[to]))pushP(to,b[to]);
          else if(to===P.ep&&!b[to])ms.push({f:s,t:to,p:p,c:w?'p':'P',fl:EP});}
      }
    } else if(T==='N'||T==='K'){
      var D=T==='N'?KN:KD;
      for(i=0;i<8;i++){var rr=r+D[i][0],fc=f+D[i][1];if(rr<0||rr>7||fc<0||fc>7)continue;to=rr*8+fc;q=b[to];
        if(!q){if(!capsOnly)ms.push({f:s,t:to,p:p,c:null,fl:0});}else if(enemy(q))ms.push({f:s,t:to,p:p,c:q,fl:0});}
      if(T==='K'&&!capsOnly){
        if(w&&s===60){
          if((P.c&1)&&!b[61]&&!b[62]&&b[63]==='R'&&!attacked(P,60,them)&&!attacked(P,61,them)&&!attacked(P,62,them))ms.push({f:60,t:62,p:p,c:null,fl:CK});
          if((P.c&2)&&!b[59]&&!b[58]&&!b[57]&&b[56]==='R'&&!attacked(P,60,them)&&!attacked(P,59,them)&&!attacked(P,58,them))ms.push({f:60,t:58,p:p,c:null,fl:CQ});
        }
        if(!w&&s===4){
          if((P.c&4)&&!b[5]&&!b[6]&&b[7]==='r'&&!attacked(P,4,them)&&!attacked(P,5,them)&&!attacked(P,6,them))ms.push({f:4,t:6,p:p,c:null,fl:CK});
          if((P.c&8)&&!b[3]&&!b[2]&&!b[1]&&b[0]==='r'&&!attacked(P,4,them)&&!attacked(P,3,them)&&!attacked(P,2,them))ms.push({f:4,t:2,p:p,c:null,fl:CQ});
        }
      }
    } else {
      var dirs=T==='B'?BD:T==='R'?RD:BD.concat(RD);
      for(i=0;i<dirs.length;i++){var dr=dirs[i][0],df=dirs[i][1],r2=r+dr,f2=f+df;
        while(r2>=0&&r2<8&&f2>=0&&f2<8){to=r2*8+f2;q=b[to];
          if(!q){if(!capsOnly)ms.push({f:s,t:to,p:p,c:null,fl:0});}
          else{if(enemy(q))ms.push({f:s,t:to,p:p,c:q,fl:0});break;}
          r2+=dr;f2+=df;}}
    }
  }
  return ms;
}
function make(P,m){
  var u={c:P.c,ep:P.ep,h:P.h},b=P.b;
  b[m.t]=m.pr||m.p;b[m.f]=null;
  if(m.fl&EP)b[m.t+(m.p==='P'?8:-8)]=null;
  if(m.fl&CK){b[m.t-1]=b[m.t+1];b[m.t+1]=null;}
  if(m.fl&CQ){b[m.t+1]=b[m.t-2];b[m.t-2]=null;}
  if(m.p==='K')P.c&=~3;if(m.p==='k')P.c&=~12;
  if(m.f===63||m.t===63)P.c&=~1;if(m.f===56||m.t===56)P.c&=~2;
  if(m.f===7||m.t===7)P.c&=~4;if(m.f===0||m.t===0)P.c&=~8;
  P.ep=(m.fl&DBL)?((m.f+m.t)>>1):-1;
  P.h=(m.p==='P'||m.p==='p'||m.c)?0:P.h+1;
  if(P.t==='b')P.f++;
  P.t=P.t==='w'?'b':'w';
  return u;
}
function unmake(P,m,u){
  P.t=P.t==='w'?'b':'w';if(P.t==='b')P.f--;
  var b=P.b;b[m.f]=m.p;
  if(m.fl&EP){b[m.t]=null;b[m.t+(m.p==='P'?8:-8)]=m.c;}else b[m.t]=m.c;
  if(m.fl&CK){b[m.t+1]=b[m.t-1];b[m.t-1]=null;}
  if(m.fl&CQ){b[m.t-2]=b[m.t+1];b[m.t+1]=null;}
  P.c=u.c;P.ep=u.ep;P.h=u.h;
}
function legal(P){var ms=gen(P,false),out=[],me=P.t;for(var i=0;i<ms.length;i++){var u=make(P,ms[i]);if(!inCheck(P,me))out.push(ms[i]);unmake(P,ms[i],u);}return out;}
function evaluate(P){
  var s=0,np=0,q=0,i,p,T,bw=0,bb=0;
  for(i=0;i<64;i++){p=P.b[i];if(!p)continue;T=p.toUpperCase();if(T!=='P'&&T!=='K')np+=PV[T];if(T==='Q')q++;}
  var end=q===0||np<=2600;
  for(i=0;i<64;i++){p=P.b[i];if(!p)continue;T=p.toUpperCase();var w=isW(p);
    var tb=T==='K'?(end?PST.KE:PST.K):PST[T];var v=PV[T]+tb[w?i:(i^56)];
    if(T==='B'){if(w)bw++;else bb++;}
    s+=w?v:-v;}
  if(bw>=2)s+=30;if(bb>=2)s-=30;
  return P.t==='w'?s:-s;
}
function order(ms){
  for(var i=0;i<ms.length;i++){var m=ms[i];
    m.o=(m.c?10000+10*PV[m.c.toUpperCase()]-PV[m.p.toUpperCase()]:0)+(m.pr?PV[m.pr.toUpperCase()]:0);}
  ms.sort(function(a,b){return b.o-a.o;});
}
var nodes=0,stopAt=0,aborted=false;
function qs(P,a,b,qd){
  var sp=evaluate(P);if(sp>=b)return b;if(sp>a)a=sp;
  if(qd>8)return a;
  var ms=gen(P,true),me=P.t;order(ms);
  for(var i=0;i<ms.length;i++){var m=ms[i],u=make(P,m);if(inCheck(P,me)){unmake(P,m,u);continue;}
    var s=-qs(P,-b,-a,qd+1);unmake(P,m,u);if(s>=b)return b;if(s>a)a=s;}
  return a;
}
function ab(P,d,a,b,ply){
  if(((++nodes)&2047)===0&&Date.now()>stopAt)aborted=true;
  if(aborted)return 0;
  if(ply>=40)return evaluate(P);
  var me=P.t,chk=inCheck(P,me);
  if(chk)d++;
  if(d<=0)return qs(P,a,b,0);
  if(P.h>=100)return 0;
  var ms=gen(P,false),n=0;order(ms);
  for(var i=0;i<ms.length;i++){var m=ms[i],u=make(P,m);if(inCheck(P,me)){unmake(P,m,u);continue;}n++;
    var s=-ab(P,d-1,-b,-a,ply+1);unmake(P,m,u);if(aborted)return 0;if(s>=b)return b;if(s>a)a=s;}
  if(n===0)return chk?-100000+ply:0;
  return a;
}
function search(P,o){
  var root=legal(P);if(!root.length)return null;
  stopAt=Date.now()+(o.ms||1000);aborted=false;nodes=0;order(root);
  var list=root.map(function(m){return {m:m,s:0};}),done=null,d;
  for(d=1;d<=o.d;d++){
    var a=-1e9,res=[];
    for(var i=0;i<list.length;i++){var m=list[i].m,u=make(P,m);
      var s=-ab(P,d-1,-1e9,o.n>0?1e9:-a,1);unmake(P,m,u);if(aborted)break;res.push({m:m,s:s});if(s>a)a=s;}
    if(aborted){if(!done)done=res.length?res.sort(function(x,y){return y.s-x.s;}):list;break;}
    res.sort(function(x,y){return y.s-x.s;});list=res;done=res;
    if(res[0].s>90000)break;
  }
  var pick=done[0];
  if(o.n>0){var bv=-1e18;for(var j=0;j<done.length;j++){var v=done[j].s+Math.random()*o.n;if(v>bv){bv=v;pick=done[j];}}}
  return {move:{f:pick.m.f,t:pick.m.t,pr:pick.m.pr||null},score:pick.s};
}
