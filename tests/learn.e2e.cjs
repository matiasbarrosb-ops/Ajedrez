// Prueba de punta a punta: lección, problemas, problema del día, partida, historial y perfil.
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const SP=process.argv[2]||'.';
(async()=>{
 const br=await chromium.launch(); const errs=[];
 const c=await br.newContext({viewport:{width:400,height:860},deviceScaleFactor:2});
 await c.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await c.addInitScript(()=>{ if(!localStorage.getItem('jm-onboarding')) localStorage.setItem('jm-onboarding',JSON.stringify({done:true,experience:'mover',goals:['tactica']})); });
 const p=await c.newPage(); p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error'&&!/409|fonts/.test(m.text()))errs.push(m.text())});
 const B='http://localhost:8003/';
 async function mv(f,t){const fi='abcdefgh';const box=await p.locator('.exercise .board, .play-col .board').first().boundingBox();const s=box.width/8;
   const flipped=await p.evaluate(()=>{const sq=document.querySelector('.board .sq');return sq&&sq.getAttribute('data-sq')==='63';});
   const pos=q=>{let c=fi.indexOf(q[0]),r=8-+q[1];if(flipped){c=7-c;r=7-r;}return [box.x+c*s+s/2,box.y+r*s+s/2];};
   const [x1,y1]=pos(f),[x2,y2]=pos(t);await p.mouse.click(x1,y1);await p.mouse.click(x2,y2);await p.waitForTimeout(500);}
 await p.goto(B+'#/aprender'); await p.waitForTimeout(500);
 await p.screenshot({path:SP+'/learn.png',fullPage:true});
 await p.click('.node.current',{force:true}); await p.waitForTimeout(300);
 await p.click('text=Continuar');
 await mv('d4','d8'); await mv('d8','h8'); await mv('h8','h4');
 await p.screenshot({path:SP+'/lesson-ok.png'});
 console.log('fb1', await p.textContent('.feedback'));
 await p.click('.feedback >> text=Continuar');
 // error a propósito para ver la pista
 await mv('b4','b5'); await mv('b5','b7'); await mv('b7','h7'); await mv('h7','h4');
 console.log('fb2', await p.textContent('.feedback'));
 await p.click('.feedback >> text=Continuar');
 await p.click('text=7'); await p.waitForTimeout(200); console.log('quiz wrong', await p.textContent('.feedback'));
 await p.click('.quiz-opt >> text=14'); await p.click('.feedback >> text=Continuar'); await p.waitForTimeout(300);
 console.log('end', await p.textContent('.lesson-end h1'), await p.textContent('.lesson-end .muted'));
 await p.screenshot({path:SP+'/lesson-end.png'});
 // problema con pistas y solución
 await p.goto(B+'#/problema'); await p.waitForTimeout(500);
 await p.click('text=Pista 1'); await p.click('text=Pista 2'); await p.click('text=Pista 3');
 await p.screenshot({path:SP+'/puzzle-hint.png'});
 console.log('tip', await p.textContent('.tip'));
 await p.click('text=Ver solución'); await p.waitForTimeout(1500);
 // si era mate en 2, sigue: ver solución otra vez hasta terminar
 for (let k=0;k<4;k++){ if(await p.locator('.feedback').count()) break; if(await p.locator('text=Ver solución').count()) await p.click('text=Ver solución'); else if (await p.locator('text=Pista').count()) { await p.click('.ex-btns button'); } await p.waitForTimeout(1200); }
 console.log('puzzle fb', await p.textContent('.feedback'));
 await p.click('.feedback .primary'); await p.waitForTimeout(400);
 console.log('chip', await p.textContent('.result-chip'));
 // error en un problema
 const before = await p.textContent('.puzzle-meta');
 await p.goto(B+'#/problemas'); await p.waitForTimeout(400);
 await p.screenshot({path:SP+'/puzzles.png',fullPage:true});
 // partida corta y abandono
 await p.goto(B+'#/jugar'); await p.click('.bot-card >> nth=0'); await p.click('.tc >> text=Sin reloj'); await p.click('.seg >> text=Blancas'); await p.click('text=Jugar contra Bot 1'); await p.waitForTimeout(400);
 await mv('e2','e4'); await p.waitForTimeout(1500); await mv('d2','d4'); await p.waitForTimeout(1500);
 await p.click('text=Rendirse'); await p.click('text=¿Seguro?'); await p.waitForTimeout(400);
 await p.goto(B+'#/partidas'); await p.waitForTimeout(400); console.log('games', await p.textContent('.game-list'));
 await p.click('.game-row'); await p.waitForTimeout(400); await p.click('[aria-label=Anterior]'); console.log('viewer', await p.textContent('.status'));
 await p.screenshot({path:SP+'/viewer.png'});
 await p.goto(B+'#/'); await p.waitForTimeout(400); await p.screenshot({path:SP+'/home2.png',fullPage:true});
 console.log('goals', await p.textContent('.goals'));
 await p.goto(B+'#/perfil'); await p.waitForTimeout(400); await p.screenshot({path:SP+'/profile2.png',fullPage:true});
 await p.goto(B+'#/entrenar'); await p.waitForTimeout(400); console.log('train', (await p.textContent('.page')).slice(0,200));
 console.log(errs.join('\n')||'no errors'); await br.close();
})();
