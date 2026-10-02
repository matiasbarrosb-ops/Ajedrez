// Prueba de punta a punta del modo online con dos navegadores (usa la compilación de prueba).
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const SP=process.argv[2]||'.';
(async()=>{
 const br=await chromium.launch(); const errs=[];
 async function mk(n){const c=await br.newContext({viewport:{width:400,height:860}});
  await c.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
  await c.addInitScript(()=>localStorage.setItem('jm-onboarding',JSON.stringify({done:true,experience:'mover',goals:['tactica']})));
  const p=await c.newPage();p.on('pageerror',e=>errs.push(n+' '+e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('409'))errs.push(n+' '+m.text())});return p;}
 const A=await mk('A'),B=await mk('B');
 async function register(p,name,pin){await p.goto('http://localhost:8003/#/entrar');await p.waitForTimeout(400);await p.click('text=¿Primera vez? Crear cuenta');await p.fill('#name',name);await p.fill('#pin',pin);await p.click('button[type=submit]');await p.waitForTimeout(800);}
 await register(A,'Matías','1234');
 console.log('A chip',await A.textContent('.chip'));
 await A.goto('http://localhost:8003/#/jugar');await A.waitForTimeout(300);
 await A.click('.tc >> text=3+2');await A.click('.seg >> text=Blancas');await A.click('text=Crear sala');await A.waitForTimeout(800);
 const code=await A.textContent('.code');console.log('code',code);
 await register(B,'Pedro','5555');
 await B.goto('http://localhost:8003/#/sala/'+code);await B.waitForTimeout(1500);
 console.log('A status',await A.textContent('.status'));console.log('B status',await B.textContent('.status'));
 async function mv(P,f,t){const fi='abcdefgh';const flipped=await P.evaluate(()=>document.querySelector('.play-col > .pbar:last-child .avatar').classList.contains('b'));
  const box=await P.locator('.board').boundingBox();const s=box.width/8;
  const pos=q=>{let c=fi.indexOf(q[0]),r=8-+q[1];if(flipped){c=7-c;r=7-r;}return [box.x+c*s+s/2,box.y+r*s+s/2];};
  const [x1,y1]=pos(f),[x2,y2]=pos(t);await P.mouse.click(x1,y1);await P.mouse.click(x2,y2);await P.waitForTimeout(700);}
 await mv(A,'f2','f3');await mv(B,'e7','e5');await mv(A,'g2','g4');
 console.log('B moves',await B.textContent('.moves'));console.log('A clocks',await A.locator('.clock').allTextContents());
 await mv(B,'d8','h4');await A.waitForTimeout(1500);
 console.log('A result',await A.textContent('.result-card h2'),'|',await A.textContent('.result-card .tally'));
 console.log('B result',await B.textContent('.result-card h2'));
 await A.screenshot({path:SP+'/online-over.png'});
 await A.click('text=Pedir revancha');await B.waitForTimeout(900);
 console.log('B banner',await B.textContent('.banner'));
 await B.click('.result-card >> text=Pedir revancha');await A.waitForTimeout(3000);
 console.log('A after rematch',await A.textContent('.status'),A.url());
 console.log('B after rematch',await B.textContent('.status'));
 await B.click('.ctrls >> text=Tablas');await A.waitForTimeout(900);console.log('A banner',await A.textContent('.banner'));
 await A.click('.banner >> text=Aceptar');await B.waitForTimeout(1200);console.log('B result2',await B.textContent('.result-card h2'));
 await A.goto('http://localhost:8003/#/perfil');await A.waitForTimeout(800);console.log('A records',await A.textContent('.score-list'));
 const db=await (await fetch('http://localhost:8003/__db')).json();console.log('records',JSON.stringify(db.tree.records));
 console.log(errs.join('\n')||'no errors');await br.close();
})();
