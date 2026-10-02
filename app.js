/*
 * Jaque Mate — cliente completo.
 * Modos: contra la compu, dos personas en el mismo teléfono, y online (Firebase Realtime Database).
 * El motor (engine.js) se carga antes como script clásico y deja sus funciones globales.
 */
import { firebaseConfig } from './firebase-config.js';

const FB_VER = '10.12.2';
const Eng = { legal: window.legal, make: window.make, unmake: window.unmake, inCheck: window.inCheck, search: window.search, CK: window.CK, CQ: window.CQ };
const FILES = 'abcdefgh';
const GL = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };
const glyph = T => GL[T] + '︎';
const VAL = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };
const LEVELS = [
  { name: 'Novato', d: 1, ms: 400, n: 380 },
  { name: 'Aficionado', d: 2, ms: 700, n: 150 },
  { name: 'Club', d: 3, ms: 1200, n: 45 },
  { name: 'Experto', d: 4, ms: 2200, n: 8 },
  { name: 'Maestro', d: 6, ms: 3500, n: 0 }
];
const TC = { '3+2': [180000, 2000], '5+0': [300000, 0], '10+0': [600000, 0] };
const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const isW = p => p === p.toUpperCase();
const other = c => (c === 'w' ? 'b' : 'w');
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

/* ================================================================ ajustes */
const S = Object.assign({ oColor: 'r', oTime: 'none', cColor: 'w', level: 3, lTime: 'none', sound: true }, store.get('jm-settings', {}));
const saveSettings = () => store.set('jm-settings', S);

/* ================================================================ motor en un worker */
let worker = null; const cbs = {}; let reqSeq = 0;
try {
  worker = new Worker('engine-worker.js');
  worker.onmessage = e => { const cb = cbs[e.data.id]; delete cbs[e.data.id]; cb && cb(e.data.r); };
  worker.onerror = () => { worker = null; Object.keys(cbs).forEach(id => { const j = cbs[id]; delete cbs[id]; j.fallback(); }); };
} catch (e) { worker = null; }
function askEngine(P, o, cb) {
  const id = ++reqSeq; const Pc = { b: P.b.slice(), t: P.t, c: P.c, ep: P.ep, h: P.h, f: P.f };
  const run = () => setTimeout(() => cb(Eng.search(Pc, o)), 20);
  if (worker) { const w = r => cb(r); w.fallback = run; cbs[id] = w; worker.postMessage({ id, P: Pc, o }); } else run();
}

/* ================================================================ Firebase */
let fb = null, serverOffset = 0;
const serverNow = () => Date.now() + serverOffset;
async function initFirebase() {
  if (!firebaseConfig) return null;
  try {
    const appM = await import(`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-app.js`);
    const dbM = await import(`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-database.js`);
    const app = appM.initializeApp(firebaseConfig);
    const db = dbM.getDatabase(app);
    fb = { db, ...dbM, r: path => dbM.ref(db, path) };
    fb.onValue(fb.r('.info/serverTimeOffset'), s => { serverOffset = s.val() || 0; });
    return fb;
  } catch (e) { console.error('Firebase no cargó', e); return null; }
}

/* ================================================================ cuenta (nombre + PIN) */
let me = store.get('jm-user', null);   // {uid, name, pinHash}
let registering = false;
const normKey = n => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
async function sha(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function setLoginMode(reg) {
  registering = reg;
  $('loginTitle').textContent = reg ? 'Crear cuenta' : 'Entrar';
  $('loginBtn').textContent = reg ? 'Crear cuenta' : 'Entrar';
  $('loginToggle').textContent = reg ? 'Ya tengo cuenta' : '¿Primera vez? Crear cuenta';
  $('loginSub').textContent = reg ? 'Elige un nombre y un PIN de 4 números. Con eso entras desde cualquier teléfono.' : 'Usa tu nombre y tu PIN para que el marcador sepa quién eres.';
  $('loginErr').hidden = true;
}
async function submitLogin(e) {
  e.preventDefault();
  const err = m => { $('loginErr').textContent = m; $('loginErr').hidden = false; };
  const name = $('inName').value.trim().replace(/\s+/g, ' ');
  const pin = $('inPin').value.trim();
  const key = normKey(name);
  if (key.length < 2) return err('El nombre necesita al menos 2 letras o números.');
  if (!/^\d{4}$/.test(pin)) return err('El PIN tiene que ser de 4 números.');
  if (!fb) return err('No hay conexión con el servidor. Revisa tu internet.');
  $('loginBtn').disabled = true;
  try {
    const pinHash = await sha(key + ':' + pin + ':jaque-mate');
    if (registering) {
      const res = await fb.runTransaction(fb.r('users/' + key), cur => (cur ? undefined : { name, pinHash, created: Date.now() }));
      if (!res.committed) { err('Ese nombre ya está ocupado. Prueba con otro o entra con tu PIN.'); return; }
      me = { uid: key, name, pinHash };
    } else {
      const snap = await fb.get(fb.r('users/' + key));
      if (!snap.exists()) { err('No existe una cuenta con ese nombre. Toca “Crear cuenta”.'); return; }
      if (snap.val().pinHash !== pinHash) { err('PIN incorrecto.'); return; }
      me = { uid: key, name: snap.val().name, pinHash };
    }
    store.set('jm-user', me);
    $('inPin').value = '';
    afterLogin();
  } catch (ex) {
    console.error(ex); err('No se pudo conectar. Inténtalo de nuevo.');
  } finally { $('loginBtn').disabled = false; }
}
function logout() {
  if (!confirmTwice('logout', 'Toca otra vez para cerrar sesión')) return;
  leaveRoom(true);
  me = null; store.del('jm-user'); unsubScores();
  renderHeader(); setLoginMode(false); show('vLogin');
}
function afterLogin() {
  renderHeader();
  subScores();
  const q = new URLSearchParams(location.search).get('sala');
  if (q) { joinRoom(q); return; }
  const saved = store.get('jm-room', null);
  if (saved) { resumeRoom(saved, true); return; }
  showMenu();
}

/* ================================================================ estado de partida */
let G = null, sel = null, drag = null, thinking = false, cpuToken = 0, hintToken = 0, lastSave = 0;
const armed = {};
function confirmTwice(key, msg) {
  if (Date.now() - (armed[key] || 0) < 3000) { armed[key] = 0; return true; }
  armed[key] = Date.now(); toast(msg); renderControls(); setTimeout(renderControls, 3100); return false;
}
function startPos() {
  const r = 'rnbqkbnr'.split('');
  return { b: [...r, ...Array(8).fill('p'), ...Array(32).fill(null), ...Array(8).fill('P'), ...r.map(c => c.toUpperCase())], t: 'w', c: 15, ep: -1, h: 0, f: 1 };
}
const posKey = P => P.b.map(p => p || '.').join('') + P.t + P.c + P.ep;
const sqName = i => FILES[i & 7] + (8 - (i >> 3));
const sqIdx = s => FILES.indexOf(s[0]) + (8 - +s[1]) * 8;
const moveCode = m => sqName(m.f) + sqName(m.t) + (m.pr ? m.pr.toLowerCase() : '');
const parseCode = c => ({ f: sqIdx(c.slice(0, 2)), t: sqIdx(c.slice(2, 4)), pr: c[4] || null });

function sanOf(P, m, legalMs) {
  let s;
  if (m.fl & Eng.CK) s = 'O-O'; else if (m.fl & Eng.CQ) s = 'O-O-O';
  else {
    const T = m.p.toUpperCase();
    if (T === 'P') s = (m.c ? FILES[m.f & 7] + 'x' : '') + sqName(m.t) + (m.pr ? '=' + m.pr.toUpperCase() : '');
    else {
      const oth = legalMs.filter(o => o.p === m.p && o.t === m.t && o.f !== m.f); let dis = '';
      if (oth.length) {
        const sf = oth.some(o => (o.f & 7) === (m.f & 7)), sr = oth.some(o => (o.f >> 3) === (m.f >> 3));
        dis = !sf ? FILES[m.f & 7] : !sr ? String(8 - (m.f >> 3)) : sqName(m.f);
      }
      s = T + dis + (m.c ? 'x' : '') + sqName(m.t);
    }
  }
  const u = Eng.make(P, m);
  if (Eng.inCheck(P, P.t)) s += Eng.legal(P).length ? '+' : '#';
  Eng.unmake(P, m, u);
  return s;
}
function insufficient(P) {
  const pcs = []; P.b.forEach((p, i) => { if (p && p.toUpperCase() !== 'K') pcs.push([p.toUpperCase(), i]); });
  if (!pcs.length) return true;
  if (pcs.length === 1 && (pcs[0][0] === 'N' || pcs[0][0] === 'B')) return true;
  if (pcs.every(x => x[0] === 'B') && new Set(pcs.map(x => ((x[1] >> 3) + (x[1] & 7)) % 2)).size === 1) return true;
  return false;
}
function computeOver() {
  const P = G.P;
  if (!G.legal.length) return Eng.inCheck(P, P.t) ? { w: other(P.t), r: 'por jaque mate' } : { w: null, r: 'por rey ahogado' };
  if (P.h >= 100) return { w: null, r: 'por la regla de 50 jugadas' };
  const k = G.keys[G.keys.length - 1];
  if (G.keys.filter(x => x === k).length >= 3) return { w: null, r: 'por triple repetición' };
  if (insufficient(P)) return { w: null, r: 'por material insuficiente' };
  return null;
}
function baseGame(mode) {
  const g = { P: startPos(), hist: [], keys: [], legal: [], mode, human: 'w', level: S.level, tc: 'none', clock: null, over: null, overSeen: false, flipped: false, hint: null, promo: null, recorded: false };
  g.keys = [posKey(g.P)]; g.legal = Eng.legal(g.P);
  return g;
}
function replay(codes) {
  G.P = startPos(); G.hist = []; G.keys = [posKey(G.P)]; G.legal = Eng.legal(G.P);
  for (const c of codes) {
    const mv = typeof c === 'string' ? parseCode(c) : c;
    const m = G.legal.find(x => x.f === mv.f && x.t === mv.t && (x.pr ? x.pr.toLowerCase() : null) === (mv.pr ? mv.pr.toLowerCase() : null));
    if (!m) break;
    const san = sanOf(G.P, m, G.legal); Eng.make(G.P, m);
    G.hist.push({ m, san }); G.keys.push(posKey(G.P)); G.legal = Eng.legal(G.P);
  }
}
function pushMove(m) {
  const san = sanOf(G.P, m, G.legal);
  Eng.make(G.P, m);
  G.hist.push({ m, san }); G.keys.push(posKey(G.P)); G.legal = Eng.legal(G.P);
  return san;
}
function moveSound(m, san, over) {
  if (over) sfx('end'); else if (san.endsWith('+')) sfx('check'); else if (m.c) sfx('cap'); else if (m.fl & (Eng.CK | Eng.CQ)) sfx('castle'); else sfx('move');
}

/* ---------------- partidas locales ---------------- */
function newCpuGame() {
  G = baseGame('cpu');
  G.human = S.cColor === 'r' ? (Math.random() < 0.5 ? 'w' : 'b') : S.cColor;
  G.level = S.level; G.flipped = G.human === 'b';
  startLocal();
}
function newPvpGame() {
  G = baseGame('pvp');
  G.tc = S.lTime;
  G.clock = TC[S.lTime] ? { w: TC[S.lTime][0], b: TC[S.lTime][0], inc: TC[S.lTime][1] } : null;
  startLocal();
}
function startLocal() {
  sel = null; thinking = false; cpuToken++; hintToken++;
  G.lastTick = performance.now();
  show('vGame'); render(); saveLocal(); maybeCpu();
}
function applyLocal(m, animate) {
  const mover = G.P.t;
  const san = pushMove(m);
  if (G.clock) G.clock[mover] += G.clock.inc;
  G.lastTick = performance.now();
  sel = null; G.hint = null; hintToken++; G.promo = null;
  G.over = computeOver(); G.overSeen = false;
  moveSound(m, san, G.over);
  if (G.over) recordCpu();
  render(animate ? { f: m.f, t: m.t } : null); saveLocal(); maybeCpu();
}
function maybeCpu() {
  if (!G || G.mode !== 'cpu' || G.over || G.P.t === G.human) return;
  thinking = true; renderStatus(); renderBars();
  const tok = ++cpuToken, t0 = Date.now(), L = LEVELS[G.level - 1];
  const o = { d: L.d, ms: L.ms, n: L.n + (G.hist.length < 8 && L.n < 20 ? 14 : 0) };
  askEngine(G.P, o, r => {
    if (tok !== cpuToken) return;
    setTimeout(() => {
      if (tok !== cpuToken) return; thinking = false;
      if (!r || !r.move) { render(); return; }
      const m = G.legal.find(x => x.f === r.move.f && x.t === r.move.t && (x.pr || null) === (r.move.pr || null));
      if (m) applyLocal(m, true); else render();
    }, Math.max(0, 420 - (Date.now() - t0)));
  });
}
function undo() {
  if (!G || G.mode === 'online' || !G.hist.length) return;
  cpuToken++; thinking = false;
  let n = 1;
  if (G.mode === 'cpu' && G.P.t === G.human) n = 2;
  n = Math.min(n, G.hist.length);
  const codes = G.hist.slice(0, G.hist.length - n).map(h => moveCode(h.m));
  G.over = null; G.overSeen = false; G.hint = null; G.promo = null; sel = null;
  replay(codes); G.lastTick = performance.now();
  render(); saveLocal(); maybeCpu();
}
function hint() {
  if (!humanTurn() || G.mode === 'online') return;
  const tok = ++hintToken; renderControls();
  askEngine(G.P, { d: 5, ms: 1500, n: 0 }, r => {
    if (tok !== hintToken) return;
    if (r && r.move) G.hint = { f: r.move.f, t: r.move.t };
    hintToken++; render();
  });
}
function resignLocal() {
  if (G.over) return;
  if (!confirmTwice('resign', 'Toca “Rendirse” otra vez para confirmar')) return;
  const loser = G.mode === 'cpu' ? G.human : G.P.t;
  cpuToken++; thinking = false;
  G.over = { w: other(loser), r: 'por abandono' }; G.overSeen = false;
  sfx('end'); recordCpu(); render(); saveLocal();
}
function saveLocal() {
  if (!G || G.mode === 'online') return;
  lastSave = performance.now();
  store.set('jm-local', { mode: G.mode, human: G.human, level: G.level, tc: G.tc, clock: G.clock, over: G.over, overSeen: G.overSeen, flipped: G.flipped, recorded: G.recorded, moves: G.hist.map(h => moveCode(h.m)) });
}
function resumeLocal() {
  const d = store.get('jm-local', null); if (!d) return false;
  G = baseGame(d.mode);
  Object.assign(G, { human: d.human, level: d.level, tc: d.tc, clock: d.clock, over: d.over, overSeen: d.overSeen, flipped: d.flipped, recorded: !!d.recorded });
  replay(d.moves || []);
  startLocal();
  return true;
}
function recordCpu() {
  if (G.mode !== 'cpu' || G.recorded || !G.over || !me || !fb || G.hist.length < 2) return;
  G.recorded = true;
  const res = !G.over.w ? 'd' : G.over.w === G.human ? 'w' : 'l';
  bumpRecord(me.uid, '~cpu' + G.level, 'Compu · ' + LEVELS[G.level - 1].name, res);
}

/* ---------------- online ---------------- */
let roomCode = null, room = null, roomUnsub = null, presenceSet = false, tallyUnsub = null, myColor = null, timeoutClaimAt = 0;
const remoteOver = o => (o ? { w: o.w || 'd', r: o.r } : null);
const localOver = r => (r ? { w: r.w === 'd' ? null : r.w, r: r.r } : null);
const roomMoves = rm => (rm && rm.moves ? rm.moves.split(' ').filter(Boolean) : []);

function onlineReady(errEl) {
  const err = m => { if (errEl) { errEl.textContent = m; errEl.hidden = false; } else toast(m); };
  if (!fb) { err('El modo online no está configurado todavía.'); return false; }
  if (!me) { err('Primero entra con tu cuenta.'); show('vLogin'); return false; }
  return true;
}
function genCode() { let s = ''; for (let i = 0; i < 4; i++) s += CODE_ABC[Math.floor(Math.random() * CODE_ABC.length)]; return s; }
function newRoomData(players, tc, status) {
  return {
    created: Date.now(), host: me.uid, tc, status, players, moves: '',
    clock: TC[tc] ? { w: TC[tc][0], b: TC[tc][0], at: 0, inc: TC[tc][1] } : null
  };
}
async function createRoomWith(data) {
  for (let i = 0; i < 6; i++) {
    const code = genCode();
    const res = await fb.runTransaction(fb.r('rooms/' + code), cur => (cur ? undefined : data));
    if (res.committed) return code;
  }
  throw new Error('no-code');
}
async function createRoom() {
  $('onlineErr').hidden = true;
  if (!onlineReady($('onlineErr'))) return;
  $('createRoomBtn').disabled = true;
  try {
    const color = S.oColor === 'r' ? (Math.random() < 0.5 ? 'w' : 'b') : S.oColor;
    const code = await createRoomWith(newRoomData({ [color]: { uid: me.uid, name: me.name } }, S.oTime, 'waiting'));
    enterRoom(code);
  } catch (e) { console.error(e); $('onlineErr').textContent = 'No se pudo crear la sala. Revisa tu internet.'; $('onlineErr').hidden = false; }
  finally { $('createRoomBtn').disabled = false; }
}
async function joinRoom(raw) {
  const code = String(raw || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  const errEl = $('onlineErr'); errEl.hidden = true;
  if (!onlineReady(errEl)) return;
  if (code.length !== 4) { showMenu(); errEl.textContent = 'El código tiene 4 letras.'; errEl.hidden = false; return; }
  try {
    let why = null;
    const res = await fb.runTransaction(fb.r('rooms/' + code), cur => {
      if (!cur) { why = 'none'; return cur; }
      const p = cur.players || {};
      if ((p.w && p.w.uid === me.uid) || (p.b && p.b.uid === me.uid)) { why = null; return cur; }
      if (cur.status !== 'waiting') { why = 'full'; return; }
      const free = !p.w ? 'w' : !p.b ? 'b' : null;
      if (!free) { why = 'full'; return; }
      p[free] = { uid: me.uid, name: me.name };
      cur.players = p; cur.status = 'playing'; why = null;
      return cur;
    });
    const val = res.snapshot.val();
    if (!val) { showMenu(); errEl.textContent = `No existe la sala ${code}.`; errEl.hidden = false; return; }
    if (!res.committed && why === 'full') { showMenu(); errEl.textContent = 'Esa sala ya tiene dos jugadores.'; errEl.hidden = false; return; }
    enterRoom(code);
  } catch (e) { console.error(e); showMenu(); errEl.textContent = 'No se pudo entrar a la sala.'; errEl.hidden = false; }
}
async function resumeRoom(code, silent) {
  if (!fb || !me) { showMenu(); return; }
  try {
    const snap = await fb.get(fb.r('rooms/' + code));
    const v = snap.val();
    const mine = v && v.players && ((v.players.w && v.players.w.uid === me.uid) || (v.players.b && v.players.b.uid === me.uid));
    if (!mine || (silent && v.status === 'over')) { store.del('jm-room'); showMenu(); return; }
    enterRoom(code);
  } catch (e) { showMenu(); }
}
function enterRoom(code) {
  if (roomUnsub) { roomUnsub(); roomUnsub = null; }
  if (tallyUnsub) { tallyUnsub(); tallyUnsub = null; }
  roomCode = code; room = null; presenceSet = false; myColor = null;
  store.set('jm-room', code);
  const u = new URL(location.href); u.searchParams.set('sala', code); history.replaceState(null, '', u);
  roomUnsub = fb.onValue(fb.r('rooms/' + code), s => onRoom(code, s.val()));
}
function leaveRoom(quiet) {
  if (!roomCode) return;
  const code = roomCode, wasRoom = room;
  if (roomUnsub) { roomUnsub(); roomUnsub = null; }
  if (tallyUnsub) { tallyUnsub(); tallyUnsub = null; }
  if (fb && myColor) { const pr = fb.r(`rooms/${code}/online/${myColor}`); fb.onDisconnect(pr).cancel(); fb.remove(pr); }
  if (fb && wasRoom && wasRoom.status === 'waiting' && wasRoom.host === (me && me.uid)) fb.remove(fb.r('rooms/' + code));
  roomCode = null; room = null; myColor = null; presenceSet = false;
  store.del('jm-room');
  const u = new URL(location.href); u.searchParams.delete('sala'); history.replaceState(null, '', u);
  if (G && G.mode === 'online') G = null;
  if (!quiet) showMenu();
}
function onRoom(code, val) {
  if (code !== roomCode) return;
  if (!val) { toast('La sala se cerró.'); leaveRoom(); return; }
  const prev = room; room = val;
  const p = val.players || {};
  myColor = p.w && p.w.uid === me.uid ? 'w' : p.b && p.b.uid === me.uid ? 'b' : null;
  if (!myColor) { toast('Esa sala ya tiene dos jugadores.'); leaveRoom(); return; }
  if (!presenceSet) {
    presenceSet = true;
    const pr = fb.r(`rooms/${code}/online/${myColor}`);
    fb.set(pr, true); fb.onDisconnect(pr).remove();
  }
  if (val.next && val.next !== code) { toast('¡Revancha! Colores cambiados.'); const nx = val.next; leaveRoom(true); enterRoom(nx); return; }
  if (val.status === 'waiting') { showLobby(code); return; }

  // partida en curso o terminada
  let fresh = false;
  if (!G || G.mode !== 'online' || G.code !== code) {
    G = baseGame('online'); G.code = code; G.human = myColor; G.flipped = myColor === 'b'; G.tc = val.tc;
    fresh = true; sel = null;
    show('vGame');
    const opp = p[other(myColor)];
    if (opp) {
      tallyUnsub = fb.onValue(fb.r(`records/${me.uid}/${opp.uid}`), s => { if (G && G.code === code) { G.tally = s.val(); renderStatus(); renderModal(); } });
    }
  }
  const list = roomMoves(val);
  const mine = G.hist.map(h => moveCode(h.m));
  let anim = null;
  const same = list.length === mine.length && list.every((c, i) => c === mine[i]);
  if (!same) {
    if (list.length === mine.length + 1 && mine.every((c, i) => c === list[i])) {
      const mv = parseCode(list[list.length - 1]);
      const m = G.legal.find(x => x.f === mv.f && x.t === mv.t && (x.pr ? x.pr.toLowerCase() : null) === mv.pr);
      if (m) { const san = pushMove(m); anim = { f: m.f, t: m.t }; if (!fresh) moveSound(m, san, val.status === 'over'); G.hint = null; sel = sel !== null && G.P.b[sel] ? sel : null; }
      else replay(list);
    } else { replay(list); sel = null; }
    G.promo = null;
  }
  const wasOver = !!G.over;
  G.over = val.status === 'over' ? localOver(val.result) : null;
  if (G.over && !wasOver) {
    G.overSeen = false;
    if (!fresh && !anim) sfx('end');
    if (fresh && prev === null && G.over) G.overSeen = false;
  }
  if (val.status === 'over' && !val.recorded) tryRecord(code, val);
  if (val.status === 'over' && val.rematch && val.rematch.w && val.rematch.b && !val.next) makeRematch(code, val);
  render(anim);
}
function sendMove(m, n, over) {
  const code = roomCode, mc = moveCode(m);
  fb.runTransaction(fb.r('rooms/' + code), cur => {
    if (!cur || cur.status !== 'playing') return;
    const mv = roomMoves(cur);
    if (mv.length !== n) return;
    const mover = n % 2 ? 'b' : 'w';
    if (!cur.players[mover] || cur.players[mover].uid !== me.uid) return;
    const now = serverNow();
    if (cur.clock) {
      if (n >= 1) {
        cur.clock[mover] -= Math.max(0, now - cur.clock.at);
        if (cur.clock[mover] <= 0) { cur.clock[mover] = 0; cur.status = 'over'; cur.result = { w: other(mover), r: 'por tiempo' }; return cur; }
      }
      cur.clock[mover] += cur.clock.inc || 0;
      cur.clock.at = now;
    }
    mv.push(mc); cur.moves = mv.join(' '); cur.drawOffer = null;
    if (over) { cur.status = 'over'; cur.result = remoteOver(over); }
    return cur;
  }).then(res => { if (!res.committed && room) onRoom(code, res.snapshot.val()); })
    .catch(e => { console.error(e); toast('No se pudo enviar la jugada. Revisa tu internet.'); if (room) { G.hist = []; onRoom(code, room); } });
}
function applyOnline(m, animate) {
  const n = G.hist.length;
  const san = pushMove(m);
  sel = null; G.promo = null;
  const over = computeOver();
  G.over = over; G.overSeen = false;
  moveSound(m, san, over);
  render(animate ? { f: m.f, t: m.t } : null);
  sendMove(m, n, over);
}
function finishRoom(result, guard) {
  const code = roomCode;
  return fb.runTransaction(fb.r('rooms/' + code), cur => {
    if (!cur || cur.status !== 'playing') return;
    if (guard && !guard(cur)) return;
    cur.status = 'over'; cur.result = result; cur.drawOffer = null;
    return cur;
  });
}
function resignOnline() {
  if (!room || room.status !== 'playing') return;
  if (!confirmTwice('resign', 'Toca “Rendirse” otra vez para confirmar')) return;
  finishRoom({ w: other(myColor), r: 'por abandono' });
}
function offerDraw() {
  if (!room || room.status !== 'playing') return;
  if (room.drawOffer === other(myColor)) { finishRoom({ w: 'd', r: 'por acuerdo' }, cur => cur.drawOffer === other(myColor)); return; }
  fb.set(fb.r(`rooms/${roomCode}/drawOffer`), myColor); toast('Ofreciste tablas.');
}
function declineDraw() { fb.set(fb.r(`rooms/${roomCode}/drawOffer`), null); }
function askRematch() {
  if (!room || room.status !== 'over') return;
  fb.set(fb.r(`rooms/${roomCode}/rematch/${myColor}`), true);
  G.overSeen = true; render();
}
async function makeRematch(code, val) {
  if (makeRematch.busy === code) return; makeRematch.busy = code;
  try {
    const p = val.players;
    const players = { w: p.b, b: p.w };
    const data = newRoomData(players, val.tc, 'playing');
    const nc = await createRoomWith(data);
    const res = await fb.runTransaction(fb.r(`rooms/${code}/next`), cur => (cur ? undefined : nc));
    if (!res.committed) fb.remove(fb.r('rooms/' + nc));
  } catch (e) { console.error(e); makeRematch.busy = null; }
}
function claimTimeout() {
  if (Date.now() - timeoutClaimAt < 2000) return; timeoutClaimAt = Date.now();
  const n = roomMoves(room).length, turn = n % 2 ? 'b' : 'w';
  finishRoom({ w: other(turn), r: 'por tiempo' }, cur => {
    const nn = roomMoves(cur).length; if (nn !== n || !cur.clock || nn < 1) return false;
    return cur.clock[turn] - (serverNow() - cur.clock.at) <= 0;
  });
}
function onlineClock(c) {
  if (!room || !room.clock) return null;
  let v = room.clock[c];
  const n = roomMoves(room).length, turn = n % 2 ? 'b' : 'w';
  if (room.status === 'playing' && n >= 1 && c === turn) v -= serverNow() - room.clock.at;
  return v;
}
async function tryRecord(code, val) {
  if (tryRecord.busy === code) return; tryRecord.busy = code;
  try {
    const res = await fb.runTransaction(fb.r(`rooms/${code}/recorded`), cur => (cur ? undefined : true));
    if (!res.committed) return;
    const n = roomMoves(val).length;
    if (n < 2) return; // partidas de menos de 2 jugadas no cuentan
    const w = val.players.w, b = val.players.b, win = val.result.w;
    await Promise.all([
      bumpRecord(w.uid, b.uid, b.name, win === 'd' ? 'd' : win === 'w' ? 'w' : 'l'),
      bumpRecord(b.uid, w.uid, w.name, win === 'd' ? 'd' : win === 'b' ? 'w' : 'l'),
      fb.push(fb.r('games'), { at: Date.now(), w, b, result: win, r: val.result.r, moves: val.moves, tc: val.tc || 'none' })
    ]);
  } catch (e) { console.error(e); }
}
function bumpRecord(uid, opp, oppName, res) {
  return fb.runTransaction(fb.r(`records/${uid}/${opp}`), cur => {
    cur = cur || { w: 0, l: 0, d: 0 };
    cur.name = oppName; cur[res] = (cur[res] || 0) + 1; cur.last = Date.now();
    return cur;
  }).catch(e => console.error(e));
}

/* ---------------- marcador del menú ---------------- */
let scoresUnsub = null, scores = null;
function subScores() {
  unsubScores();
  if (!fb || !me) { scores = null; renderScores(); return; }
  scoresUnsub = fb.onValue(fb.r('records/' + me.uid), s => { scores = s.val() || {}; renderScores(); });
}
function unsubScores() { if (scoresUnsub) { scoresUnsub(); scoresUnsub = null; } }
function renderScores() {
  const el = $('scoreList');
  if (!fb) { el.innerHTML = '<div class="empty">El marcador se activa cuando el modo online esté configurado.</div>'; return; }
  if (!me) { el.innerHTML = '<div class="empty">Entra con tu cuenta para guardar tus resultados.</div>'; return; }
  if (scores === null) { el.innerHTML = '<div class="empty">Cargando…</div>'; return; }
  const rows = Object.entries(scores).sort((a, b) => (b[1].last || 0) - (a[1].last || 0));
  if (!rows.length) { el.innerHTML = '<div class="empty">Todavía no hay partidas. Juega una online o contra la compu y aparecerá aquí.</div>'; return; }
  el.innerHTML = rows.map(([k, r]) => {
    const total = (r.w || 0) + (r.l || 0) + (r.d || 0);
    const cpu = k.startsWith('~cpu');
    return `<div class="score-row"><div class="who">${cpu ? '' : 'vs '}${esc(r.name || k)}<small>${total} partida${total === 1 ? '' : 's'}${r.last ? ' · última ' + new Date(r.last).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : ''}</small></div>
      <div class="tally-big"><span class="w">${r.w || 0}</span> – <span class="l">${r.l || 0}</span><span class="d">${r.d || 0} tablas</span></div></div>`;
  }).join('');
}

/* ================================================================ sonido */
let AC = null;
function tone(fr, dur, type, vol, when) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime + (when || 0), o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(fr, t); g.gain.setValueAtTime(vol || 0.15, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + dur + 0.02);
  } catch (e) {}
}
function sfx(k) {
  if (!S.sound) return;
  if (k === 'move') tone(540, 0.06, 'triangle', 0.22);
  else if (k === 'castle') { tone(540, 0.05, 'triangle', 0.2); tone(480, 0.06, 'triangle', 0.2, 0.07); }
  else if (k === 'cap') { tone(260, 0.09, 'square', 0.07); tone(170, 0.12, 'triangle', 0.2); }
  else if (k === 'check') { tone(880, 0.07, 'sine', 0.14); tone(660, 0.12, 'sine', 0.12, 0.08); }
  else if (k === 'end') { [523, 659, 784].forEach((f, i) => tone(f, 0.5, 'sine', 0.08, i * 0.06)); }
  else if (k === 'start') { tone(660, 0.08, 'sine', 0.12); tone(880, 0.1, 'sine', 0.12, 0.09); }
}

/* ================================================================ vistas */
function show(id) {
  for (const v of ['vLogin', 'vMenu', 'vLobby', 'vGame']) $(v).hidden = v !== id;
  window.scrollTo(0, 0);
}
function showMenu() {
  if (G && G.mode === 'online') G = null;
  cpuToken++; thinking = false;
  syncSetup(); renderScores();
  const local = store.get('jm-local', null);
  $('resumeBtn').hidden = !(local && local.moves && local.moves.length && !local.over);
  const r = store.get('jm-room', null);
  $('resumeRoomBtn').hidden = !r; if (r) $('resumeRoomBtn').textContent = `Volver a tu partida online (${r})`;
  $('onlineOff').hidden = !!fb && !!me; $('onlineOn').hidden = !(fb && me);
  if (!fb) $('onlineOff').textContent = firebaseConfig ? 'No se pudo conectar con el servidor. Revisa tu internet y recarga.' : 'El modo online todavía no está configurado (falta el archivo de Firebase).';
  else if (!me) $('onlineOff').innerHTML = 'Para jugar online necesitas una cuenta. <button class="link" id="goLogin">Entrar o crear cuenta</button>';
  const gl = $('goLogin'); if (gl) gl.onclick = () => { setLoginMode(false); show('vLogin'); };
  show('vMenu');
}
function showLobby(code) {
  $('lobbyCode').textContent = code;
  const link = location.origin + location.pathname + '?sala=' + code;
  $('linkField').value = link;
  $('shareBtn').hidden = !navigator.share;
  show('vLobby');
}
function renderHeader() {
  const c = $('userChip');
  c.hidden = !me; if (me) c.textContent = me.name;
  $('waves').style.display = S.sound ? '' : 'none';
  $('soundBtn').setAttribute('aria-pressed', S.sound);
}
let toastT = 0;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600); }

/* ================================================================ render de partida */
const board = $('board');
function renderBoard(anim) {
  const P = G.P, last = G.hist.length ? G.hist[G.hist.length - 1].m : null;
  const tg = new Map();
  if (sel !== null) G.legal.forEach(m => { if (m.f === sel) tg.set(m.t, !!P.b[m.t] || !!(m.fl & 2)); });
  const chkSq = Eng.inCheck(P, P.t) ? P.b.indexOf(P.t === 'w' ? 'K' : 'k') : -1;
  let html = '';
  for (let i = 0; i < 64; i++) {
    const sq = G.flipped ? 63 - i : i, r = sq >> 3, f = sq & 7;
    let cls = 'sq ' + (((r + f) & 1) ? 'd' : 'l');
    if (last && (sq === last.f || sq === last.t)) cls += ' hl';
    if (sq === sel) cls += ' hl';
    if (G.hint && (sq === G.hint.f || sq === G.hint.t)) cls += ' hint';
    if (sq === chkSq) cls += ' check';
    if (tg.has(sq)) cls += ' tgt' + (tg.get(sq) ? ' cap' : '');
    let inner = '';
    if ((i & 7) === 0) inner += `<span class="co rk">${8 - r}</span>`;
    if ((i >> 3) === 7) inner += `<span class="co fl">${FILES[f]}</span>`;
    const p = P.b[sq];
    if (p) inner += `<span class="pc ${isW(p) ? 'w' : 'b'}">${glyph(p.toUpperCase())}</span>`;
    html += `<div class="${cls}" data-sq="${sq}">${inner}</div>`;
  }
  board.innerHTML = html;
  if (anim && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const el = board.querySelector(`[data-sq="${anim.t}"] .pc`);
    if (el) {
      const d = s => { const i = G.flipped ? 63 - s : s; return [i & 7, i >> 3]; };
      const [fc, fr] = d(anim.f), [tc, tr] = d(anim.t);
      el.classList.add('anim'); el.style.transition = 'none';
      // el glifo ocupa el 80% de la casilla: 125% de su ancho = una casilla
      el.style.transform = `translate(${(fc - tc) * 125}%,${(fr - tr) * 125 + 2}%)`;
      el.getBoundingClientRect();
      el.style.transition = 'transform .2s cubic-bezier(.3,.7,.4,1)'; el.style.transform = 'translateY(2%)';
      setTimeout(() => el.classList.remove('anim'), 230);
    }
  }
}
function capsFor(c) {
  const start = { P: 8, N: 2, B: 2, R: 2, Q: 1 }, cnt = { P: 0, N: 0, B: 0, R: 0, Q: 0, K: 0 };
  let mat = 0;
  G.P.b.forEach(p => { if (!p) return; const T = p.toUpperCase(); if ((isW(p) ? 'w' : 'b') !== c) cnt[T]++; mat += (isW(p) ? 1 : -1) * VAL[T]; });
  let s = ''; ['P', 'N', 'B', 'R', 'Q'].forEach(T => { s += glyph(T).repeat(Math.max(0, start[T] - cnt[T])); });
  const adv = c === 'w' ? mat : -mat;
  return s + (adv > 0 ? `<span class="adv">+${adv}</span>` : '');
}
function nameFor(c) {
  if (G.mode === 'pvp') return c === 'w' ? 'Blancas' : 'Negras';
  if (G.mode === 'cpu') return c === G.human ? (me ? me.name : 'Tú') : 'Compu · ' + LEVELS[G.level - 1].name;
  const p = room && room.players && room.players[c];
  return p ? (c === myColor ? p.name + ' (tú)' : p.name) : '…';
}
function fmt(ms) {
  ms = Math.max(0, ms);
  if (ms < 10000) return (ms / 1000).toFixed(1).replace('.', ',');
  const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}
function bars() { const top = G.flipped ? 'w' : 'b'; return [[$('barTop'), top], [$('barBot'), other(top)]]; }
function renderBars() {
  for (const [el, c] of bars()) {
    const av = el.querySelector('.avatar');
    let cls = 'avatar ' + c;
    if (G.mode === 'online' && room && c !== myColor) cls += room.online && room.online[c] ? ' on' : ' off';
    av.className = cls; av.textContent = glyph('K');
    el.querySelector('.pname').textContent = nameFor(c);
    el.querySelector('.caps').innerHTML = capsFor(c);
    const hasClock = clockMs(c) !== null;
    el.querySelector('.tag').textContent = (thinking && G.P.t === c && !hasClock) ? 'pensando…' : '';
  }
  renderClocks();
}
function clockMs(c) {
  if (G.mode === 'online') return onlineClock(c);
  return G.clock ? G.clock[c] : null;
}
function renderClocks() {
  if (!G) return;
  for (const [el, c] of bars()) {
    const ck = el.querySelector('.clock'), v = clockMs(c);
    if (v === null || v === undefined) { ck.hidden = true; continue; }
    ck.hidden = false; ck.textContent = fmt(v);
    ck.classList.toggle('on', !G.over && G.P.t === c);
    ck.classList.toggle('low', v < 20000);
  }
}
function figSan(s) { return s.replace(/[KQRBN]/g, ch => `<span class="fig">${glyph(ch)}</span>`); }
function renderMoves() {
  const el = $('moves'); let h = '';
  const li = G.hist.length - 1;
  for (let i = 0; i < G.hist.length; i += 2) {
    const odd = (i / 2) % 2 ? ' row-odd' : '';
    const a = G.hist[i], b = G.hist[i + 1];
    h += `<div class="n${odd}">${i / 2 + 1}.</div><div class="${odd}${li === i ? ' last' : ''}">${figSan(a.san)}</div><div class="${odd}${b && li === i + 1 ? ' last' : ''}">${b ? figSan(b.san) : ''}</div>`;
  }
  el.innerHTML = h; el.scrollTop = el.scrollHeight;
}
function resultText() {
  const o = G.over; if (!o) return null;
  let title;
  if (!o.w) title = 'Tablas';
  else if (G.mode === 'cpu' || G.mode === 'online') title = o.w === G.human ? '¡Ganaste!' : (G.mode === 'cpu' ? 'Ganó la compu' : 'Perdiste');
  else title = o.w === 'w' ? 'Ganan blancas' : 'Ganan negras';
  const score = !o.w ? '½ – ½' : o.w === 'w' ? '1 – 0' : '0 – 1';
  let reason = o.r.charAt(0).toUpperCase() + o.r.slice(1);
  if (G.mode === 'online' && G.hist.length < 2) reason += ' · no cuenta para el marcador (menos de 2 jugadas)';
  return { title, reason, score };
}
function tallyLine() {
  if (G.mode !== 'online' || !room) return '';
  const opp = room.players[other(myColor)]; if (!opp) return '';
  const t = G.tally || { w: 0, l: 0, d: 0 };
  return `Marcador vs ${opp.name}: ${t.w || 0} ganadas · ${t.l || 0} perdidas · ${t.d || 0} tablas`;
}
function renderStatus() {
  const el = $('status'); const rt = resultText();
  const tl = tallyLine();
  if (rt) { el.innerHTML = `${esc(rt.title)} <small>${esc(rt.reason)} · ${rt.score}</small>`; }
  else if (thinking) { el.innerHTML = 'La compu está pensando…<small>Nivel ' + G.level + ' · ' + LEVELS[G.level - 1].name + '</small>'; }
  else {
    const chk = Eng.inCheck(G.P, G.P.t);
    let t;
    if (G.mode === 'pvp') t = G.P.t === 'w' ? 'Juegan blancas' : 'Juegan negras';
    else if (G.mode === 'cpu') t = 'Tu turno';
    else t = G.P.t === myColor ? 'Tu turno' : 'Turno de ' + ((room.players[G.P.t] || {}).name || 'tu rival');
    if (chk) t += ' · ¡Jaque!';
    let sub;
    if (G.hint) sub = 'Pista: mueve la pieza marcada en azul';
    else if (G.mode === 'online') sub = tl || ('Sala ' + G.code);
    else if (G.hist.length) sub = 'Jugada ' + (Math.floor(G.hist.length / 2) + 1);
    else sub = G.mode === 'cpu' ? 'Juegas con ' + (G.human === 'w' ? 'blancas' : 'negras') + '. Arrastra o toca una pieza.' : 'Arrastra o toca una pieza para mover.';
    el.innerHTML = `${esc(t)}<small>${esc(sub)}</small>`;
  }
  // aviso online (tablas, revancha, desconexión)
  const bn = $('banner'); let bh = '';
  if (G.mode === 'online' && room) {
    const opp = other(myColor), oppName = esc((room.players[opp] || {}).name || 'Tu rival');
    if (room.status === 'playing') {
      if (room.drawOffer === opp) bh = `<span class="grow">${oppName} ofrece tablas.</span><button class="btn hot" data-act="draw">Aceptar</button><button class="btn" data-act="nodraw">Rechazar</button>`;
      else if (room.drawOffer === myColor) bh = `<span class="grow muted">Ofreciste tablas. Esperando respuesta…</span>`;
      else if (!(room.online && room.online[opp])) bh = `<span class="grow muted">${oppName} está desconectado. Puede volver con el código ${esc(G.code)}.</span>`;
    } else if (room.status === 'over') {
      const rm = room.rematch || {};
      if (rm[opp] && !rm[myColor]) bh = `<span class="grow">${oppName} quiere la revancha.</span><button class="btn hot" data-act="rematch">Aceptar</button>`;
      else if (rm[myColor] && !rm[opp]) bh = `<span class="grow muted">Pediste la revancha. Esperando a ${oppName}…</span>`;
    }
  }
  bn.innerHTML = bh; bn.hidden = !bh;
}
function humanTurn() {
  if (!G || G.over || thinking || G.promo) return false;
  if (G.mode === 'pvp') return true;
  if (G.mode === 'online') return !!room && room.status === 'playing' && G.P.t === myColor;
  return G.P.t === G.human;
}
function renderControls() {
  if (!G) return;
  const btn = (act, gl, label, opts = {}) => `<button class="btn${opts.cls ? ' ' + opts.cls : ''}" data-act="${act}"${opts.dis ? ' disabled' : ''}><span class="gl">${gl}</span>${label}</button>`;
  const resignArmed = Date.now() - (armed.resign || 0) < 3000;
  let h = '';
  if (G.mode === 'online') {
    const over = !room || room.status !== 'playing';
    if (over) {
      const asked = room && room.rematch && room.rematch[myColor];
      h += btn('rematch', '&#8635;', asked ? 'Pedida' : 'Revancha', { dis: !room || room.status !== 'over' || asked, cls: asked ? '' : 'hot' });
    } else {
      const theyOffer = room.drawOffer === other(myColor);
      h += btn('draw', '&#189;', theyOffer ? 'Aceptar tablas' : 'Tablas', { dis: room.drawOffer === myColor, cls: theyOffer ? 'hot' : '' });
    }
    h += btn('flip', '&#8645;', 'Girar');
    h += btn('resign', '&#9873;', resignArmed ? '¿Seguro?' : 'Rendirse', { dis: over, cls: resignArmed ? 'warn' : '' });
  } else {
    h += btn('undo', '&#8630;', 'Deshacer', { dis: !G.hist.length });
    if (G.mode === 'cpu') h += btn('hint', '&#9734;', 'Pista', { dis: !humanTurn() });
    h += btn('flip', '&#8645;', 'Girar');
    h += btn('resign', '&#9873;', resignArmed ? '¿Seguro?' : 'Rendirse', { dis: !!G.over, cls: resignArmed ? 'warn' : '' });
  }
  $('ctrls').innerHTML = h;
}
function renderModal() {
  const show_ = !!G.over && !G.overSeen; $('modal').hidden = !show_;
  if (show_) {
    const rt = resultText();
    $('mTitle').textContent = rt.title; $('mReason').textContent = rt.reason; $('mScore').textContent = rt.score;
    const tl = tallyLine(); $('mTally').hidden = !tl; $('mTally').textContent = tl;
    $('mAgain').textContent = G.mode === 'online' ? 'Pedir revancha' : 'Otra partida';
    const asked = G.mode === 'online' && room && room.rematch && room.rematch[myColor];
    $('mAgain').disabled = !!asked;
  }
  const pr = $('promo'); pr.hidden = !G.promo;
  if (G.promo) {
    const c = G.P.t;
    $('promoRow').innerHTML = ['Q', 'R', 'B', 'N'].map(T => `<button class="${c}" data-pr="${T}" aria-label="${{ Q: 'Dama', R: 'Torre', B: 'Alfil', N: 'Caballo' }[T]}">${glyph(T)}</button>`).join('');
  }
}
function render(anim) { if (!G) return; renderBoard(anim); renderBars(); renderMoves(); renderStatus(); renderControls(); renderModal(); }

/* ================================================================ entrada en el tablero */
function canMoveFrom(sq) { const p = G.P.b[sq]; return !!p && humanTurn() && (isW(p) ? 'w' : 'b') === G.P.t; }
function commitMove(m, animate) { if (G.mode === 'online') applyOnline(m, animate); else applyLocal(m, animate); }
function tryMove(from, to, animate) {
  const ms = G.legal.filter(m => m.f === from && m.t === to);
  if (!ms.length) return false;
  if (ms.length > 1) { G.promo = { ms, animate }; sel = null; render(); return true; }
  commitMove(ms[0], animate); return true;
}
function sqFromPoint(x, y) {
  const r = board.getBoundingClientRect();
  if (x < r.left || y < r.top || x >= r.right || y >= r.bottom) return -1;
  const c = Math.floor((x - r.left) / (r.width / 8)), w = Math.floor((y - r.top) / (r.height / 8));
  const i = w * 8 + c; return G.flipped ? 63 - i : i;
}
let ghost = null;
function dropGhost() { if (ghost) { ghost.remove(); ghost = null; } }
board.addEventListener('pointerdown', e => {
  if (!G || e.button > 0) return;
  const sq = sqFromPoint(e.clientX, e.clientY); if (sq < 0) return;
  if (sel !== null && sel !== sq && !canMoveFrom(sq)) { if (tryMove(sel, sq, true)) return; sel = null; renderBoard(); return; }
  if (!canMoveFrom(sq)) { if (sel !== null) { sel = null; renderBoard(); } return; }
  const wasSel = sel === sq; sel = sq; renderBoard();
  const pc = board.querySelector(`[data-sq="${sq}"] .pc`);
  const size = board.getBoundingClientRect().width / 8;
  ghost = document.createElement('div'); ghost.className = 'ghost ' + (isW(G.P.b[sq]) ? 'w' : 'b');
  ghost.textContent = pc.textContent; ghost.style.width = ghost.style.height = size + 'px'; ghost.style.fontSize = (size * 0.86) + 'px';
  ghost.style.left = (e.clientX - size / 2) + 'px'; ghost.style.top = (e.clientY - size / 2) + 'px'; ghost.style.visibility = 'hidden';
  document.body.appendChild(ghost);
  drag = { from: sq, wasSel, x0: e.clientX, y0: e.clientY, moved: false, size, pc };
  try { board.setPointerCapture(e.pointerId); } catch (_) {}
  e.preventDefault();
});
board.addEventListener('pointermove', e => {
  if (!drag) return;
  if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 5) { drag.moved = true; ghost.style.visibility = 'visible'; drag.pc.classList.add('lifted'); }
  ghost.style.left = (e.clientX - drag.size / 2) + 'px'; ghost.style.top = (e.clientY - drag.size / 2) + 'px';
});
board.addEventListener('pointerup', e => {
  if (!drag) return; const d = drag; drag = null; dropGhost();
  const to = sqFromPoint(e.clientX, e.clientY);
  if (d.moved) { if (to >= 0 && to !== d.from && tryMove(d.from, to, false)) return; renderBoard(); return; }
  if (d.wasSel) { sel = null; renderBoard(); }
});
board.addEventListener('pointercancel', () => { drag = null; dropGhost(); if (G) renderBoard(); });

/* ================================================================ botones */
$('ctrls').addEventListener('click', onAct);
$('banner').addEventListener('click', onAct);
function onAct(e) {
  const b = e.target.closest('[data-act]'); if (!b || b.disabled || !G) return;
  const a = b.dataset.act;
  if (a === 'undo') undo();
  else if (a === 'hint') hint();
  else if (a === 'flip') { G.flipped = !G.flipped; render(); saveLocal(); }
  else if (a === 'resign') G.mode === 'online' ? resignOnline() : resignLocal();
  else if (a === 'draw') offerDraw();
  else if (a === 'nodraw') declineDraw();
  else if (a === 'rematch') askRematch();
}
$('promoRow').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || !G.promo) return;
  const m = G.promo.ms.find(x => x.pr.toUpperCase() === b.dataset.pr); const an = G.promo.animate; G.promo = null; commitMove(m, an);
});
$('promoCancel').onclick = () => { G.promo = null; render(); };
$('mAgain').onclick = () => {
  if (G.mode === 'online') askRematch();
  else if (G.mode === 'cpu') newCpuGame(); else newPvpGame();
};
$('mMenu').onclick = () => goMenu();
$('mClose').onclick = () => { G.overSeen = true; renderModal(); saveLocal(); };
$('leaveBtn').onclick = () => goMenu();
$('homeBtn').onclick = () => { if (!$('vLogin').hidden) return; goMenu(); };
function goMenu() {
  if (G && G.mode === 'online') { leaveRoomSoft(); }
  else { saveLocal(); showMenu(); }
}
// Salir de una partida online sin abandonarla: se puede volver desde el menú.
function leaveRoomSoft() {
  const code = roomCode;
  if (room && (room.status === 'over')) { leaveRoom(); return; }
  if (roomUnsub) { roomUnsub(); roomUnsub = null; }
  if (tallyUnsub) { tallyUnsub(); tallyUnsub = null; }
  if (fb && myColor) { const pr = fb.r(`rooms/${code}/online/${myColor}`); fb.onDisconnect(pr).cancel(); fb.remove(pr); }
  roomCode = null; room = null; myColor = null; presenceSet = false; G = null;
  const u = new URL(location.href); u.searchParams.delete('sala'); history.replaceState(null, '', u);
  showMenu();
}
$('cpuBtn').onclick = newCpuGame;
$('pvpBtn').onclick = newPvpGame;
$('resumeBtn').onclick = () => resumeLocal();
$('resumeRoomBtn').onclick = () => { const r = store.get('jm-room', null); if (r) resumeRoom(r, false); };
$('createRoomBtn').onclick = createRoom;
$('joinBtn').onclick = () => joinRoom($('joinCode').value);
$('joinCode').addEventListener('keydown', e => { if (e.key === 'Enter') joinRoom($('joinCode').value); });
$('cancelRoomBtn').onclick = () => leaveRoom();
$('copyBtn').onclick = async () => {
  const v = $('linkField').value;
  try { await navigator.clipboard.writeText(v); toast('Enlace copiado'); }
  catch (e) { $('linkField').select(); toast('Selecciona y copia el enlace'); }
};
$('shareBtn').onclick = async () => {
  try { await navigator.share({ title: 'Jaque Mate', text: `¡Juguemos ajedrez! Sala ${$('lobbyCode').textContent}`, url: $('linkField').value }); } catch (e) {}
};
$('loginForm').addEventListener('submit', submitLogin);
$('loginToggle').onclick = () => setLoginMode(!registering);
$('skipLogin').onclick = () => showMenu();
$('userChip').onclick = logout;
$('soundBtn').onclick = () => { S.sound = !S.sound; saveSettings(); renderHeader(); if (S.sound) sfx('move'); };

function bindSeg(id, key) {
  $(id).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S[key] = b.dataset.v; syncSetup(); saveSettings(); });
}
bindSeg('segOColor', 'oColor'); bindSeg('segOTime', 'oTime'); bindSeg('segCColor', 'cColor'); bindSeg('segLTime', 'lTime');
$('lvl').addEventListener('input', e => { S.level = +e.target.value; syncSetup(); saveSettings(); });
function syncSetup() {
  for (const [id, key] of [['segOColor', 'oColor'], ['segOTime', 'oTime'], ['segCColor', 'cColor'], ['segLTime', 'lTime']])
    $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S[key]));
  $('lvl').value = S.level; $('lvlName').textContent = LEVELS[S.level - 1].name;
}

/* ================================================================ reloj */
function tick() {
  if (!G) return;
  const now = performance.now(), dt = now - (G.lastTick || now); G.lastTick = now;
  if (G.mode === 'online') {
    if (!room || room.status !== 'playing' || !room.clock) return;
    const n = roomMoves(room).length, turn = n % 2 ? 'b' : 'w';
    if (n >= 1 && onlineClock(turn) <= 0) claimTimeout();
    renderClocks(); return;
  }
  if (!G.clock || G.over || !G.hist.length) return;
  const c = G.P.t; G.clock[c] -= dt;
  if (G.clock[c] <= 0) {
    G.clock[c] = 0; cpuToken++; thinking = false; G.promo = null;
    G.over = { w: other(c), r: 'por tiempo' }; G.overSeen = false; sfx('end'); render(); saveLocal(); return;
  }
  renderClocks();
  if (now - lastSave > 3000) saveLocal();
}

/* ================================================================ arranque */
async function boot() {
  syncSetup(); renderHeader(); setLoginMode(false);
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  setInterval(tick, 100);
  await initFirebase();
  if (me && fb) {
    // confirma que la cuenta guardada sigue siendo válida
    try {
      const s = await fb.get(fb.r('users/' + me.uid));
      if (!s.exists() || s.val().pinHash !== me.pinHash) { me = null; store.del('jm-user'); }
    } catch (e) {}
  }
  if (me) { afterLogin(); return; }
  if (fb) { show('vLogin'); return; }
  showMenu();
}
boot();
