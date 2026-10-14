/*
 * La voz del entrenador en el modo Entrenador: habla como tu rival, en primera persona, con frases cortas.
 * Es un juego entre los dos, no una clase: reacciona a tu jugada ("Yo te ataco… y tú te defiendes. Bien."),
 * cuenta lo que hace él ("Voy a ocupar un poco de espacio en el centro.") y, si te equivocas, te frena:
 * "Echa un vistazo. Ahora puedo capturar tu peón indefenso."
 */
import { CK, CQ, gen, inCheck, legal, make, other, unmake, attacked, type Move, type Position } from '../engine/core.ts';
import { sqName } from '../chess/notation.ts';
import { openingLine, openingOf } from './openings.ts';
import { hanging, sanToSpeech, type CoachNote } from './coach.ts';

/** Las jugadas van marcadas como [[Nc3]]: en pantalla se dibujan con figuras, en voz se leen ("caballo a c3"). */
export const toSpeech = (text: string) => text.replace(/\[\[([^\]]+)\]\]/g, (_, san: string) => sanToSpeech(san));
export const splitSan = (text: string) => text.split(/\[\[([^\]]+)\]\]/g);

export type Mood = 'happy' | 'neutral' | 'worried' | 'sly';
export interface Line { text: string; mood: Mood }

const NAME: Record<string, string> = { P: 'peón', N: 'caballo', B: 'alfil', R: 'torre', Q: 'dama', K: 'rey' };
const FEM: Record<string, boolean> = { R: true, Q: true };
const VAL: Record<string, number> = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 100 };
const T = (p: string) => p.toUpperCase();
const el = (p: string) => (FEM[T(p)] ? 'la ' : 'el ') + NAME[T(p)];
const mi = (p: string) => 'mi ' + NAME[T(p)];
const tu = (p: string) => 'tu ' + NAME[T(p)];
const a = (p: string) => (FEM[T(p)] ? 'a' : 'o');

/** Elige una variante según la jugada, para que no repita siempre lo mismo. */
const pick = <T,>(arr: T[], seed: number) => arr[Math.abs(seed) % arr.length];

/* ---------- tu jugada ---------- */

/**
 * Reacción del entrenador (tu rival) a tu jugada. prevThreat: la jugada anterior del rival te amenazaba algo.
 * Las jugadas malas (Error, Error grave) se tratan aparte con mistakeLine.
 */
export function reactToMove(n: CoachNote, prevThreat: boolean, prevCaptureSq: number | null = null): Line {
  const tags = new Set(n.tags ?? []);
  const s = n.ply;
  const pc = n.piece ? T(n.piece) : 'P';
  const parts: string[] = [];
  let mood: Mood = 'happy';

  if (tags.has('mate')) return { text: pick(['¡Jaque mate! Me ganaste. Bien jugado.', '¡Mate! No tengo nada que hacer. ¡Felicitaciones!'], s), mood: 'happy' };

  // lo concreto primero: capturas, ataques, defensa
  const target = /Amenazas (la|el) (\S+) rival/.exec(n.why.join(' '));
  if (n.captured && n.to === prevCaptureSq && n.q <= 2) parts.push(pick(['Recuperas la pieza. Bien.', 'Me la devuelves. Justo.'], s));
  else if (tags.has('free') && n.q <= 2) parts.push(pick(['¡Ay! Te comiste mi pieza gratis. Bien visto.', '¡Auch! Me ganaste material limpio.'], s));
  else if (tags.has('gain') && n.q <= 2) parts.push('Buen cambio: te quedas con más material.');
  else if (tags.has('fork')) parts.push(pick(['¡Auch! Me atacas dos piezas a la vez.', '¡Un ataque doble! No puedo salvar las dos.'], s));
  else if (n.captured && n.q <= 2) parts.push(T(n.captured) === T(n.piece ?? 'P') ? pick(['Cambiamos piezas. Ok.', 'Cambio parejo.'], s) : `Te comes ${mi(n.captured)}.`);
  else if (tags.has('check') && n.q <= 2) parts.push(pick(['¡Jaque! Me obligas a mover el rey.', 'Jaque. Tengo que defenderme.'], s));
  else if ((tags.has('saved') || tags.has('guard')) && prevThreat) parts.push(pick(['Yo te ataco… y tú te defiendes. Bien.', 'Viste mi amenaza y la paraste. Bien.'], s));
  else if (tags.has('saved') || tags.has('guard')) parts.push('Bien, cuidas tus piezas.');
  else if (tags.has('castle')) parts.push(pick(['Enrocaste. Tu rey ya está a salvo. Bien.', 'Buen enroque: rey protegido y torres conectadas.'], s));
  else if (tags.has('threat')) parts.push(target ? pick([`Uy, me estás atacando ${target[1]} ${target[2]}.`, `Hmm, vas por mi ${target[2]}. Tengo que pensar.`], s) : 'Hmm, me amenazas. Tengo que pensar.');
  else if (tags.has('develop') && tags.has('center')) parts.push(`Claro. Bien. Estás desarrollando tu ${NAME[pc]} y atacando por el centro.`);
  else if (tags.has('develop')) parts.push(pick([`Claro. Bien. Estás desarrollando tu ${NAME[pc]}.`, `Bien, sacas tu ${NAME[pc]} a jugar.`], s));
  else if (tags.has('center')) parts.push(pick(['Buena. Peón al centro.', 'Bien, ocupas el centro.'], s));

  // calificación, corta y directa
  if (n.book && !parts.length) parts.unshift(pick(['Bien hecho, es una buena jugada de apertura.', 'Jugada de libro. Así se empieza.'], s));
  else if (n.q === 0 && !parts.length) parts.push(pick(['¡Esa era la mejor! Bien ahí.', '¡Exacto! Justo lo que había que jugar.'], s));
  else if (n.q === 0) parts.push('Es la mejor jugada.');
  else if (n.q === 1 && !parts.length) parts.push(pick(['Muy buena jugada.', 'Bien jugado. Me lo pones difícil.'], s));
  else if (n.q === 2) {
    mood = 'neutral';
    if (!parts.length) parts.push(pick(['Ok, es una jugada normal.', 'Sirve.'], s));
    if (n.best) parts.push(`Pero había algo mejor: [[${n.best}]].`);
  } else if (n.q === 3) {
    mood = 'sly';
    parts.length = 0;
    parts.push(pick(['Hmm… no es lo más preciso.', 'Esa no es la mejor. Me das un respiro.'], s));
    if (n.best) parts.push(`Ojo: [[${n.best}]] era más fuerte.`);
  }

  // la apertura: solo cuando tu jugada le da nombre (si la nombró él, ya lo dijo al jugar)
  if (n.opening && n.ply < 12 && !n.opening.startsWith('Tu rival')) parts.push(n.opening);
  return { text: parts.slice(0, 3).join(' '), mood };
}

/** Lo que dice cuando tu jugada es un Error o Error grave: te muestra lo que ahora puede hacer él. */
export function mistakeLine(n: CoachNote, Pafter: Position): Line {
  const th = n.threat;
  const s = n.ply;
  if (th?.mate) return { text: '¡Cuidado! Con eso yo tengo jaque mate. Mira la flecha.', mood: 'sly' };
  if (th?.c) {
    const victim = th.c;
    const free = !attacked(Pafter, th.t, other(Pafter.t)) || VAL[T(victim)] > VAL[T(Pafter.b[th.f] ?? 'P')];
    return {
      text: free
        ? pick([`Echa un vistazo. Ahora puedo capturar ${tu(victim)} indefens${a(victim)}.`, `Uy… me dejas ${el(victim)} gratis. Mira la flecha.`], s)
        : `Echa un vistazo. Ahora te puedo ganar ${el(victim)} en ${sqName(th.t)}.`,
      mood: 'sly'
    };
  }
  if (th?.check) return { text: 'Mira bien: ahora te puedo dar un jaque muy molesto.', mood: 'sly' };
  if (n.bestCaptures) return { text: `Te perdiste algo: podías comerte ${mi(n.bestCaptures)}. ¿Lo buscas de nuevo?`, mood: 'sly' };
  if ((n.tags ?? []).includes('kingWalk')) return { text: 'Mover el rey tan pronto lo deja expuesto. Yo aprovecharía eso.', mood: 'sly' };
  if ((n.tags ?? []).includes('earlyQueen')) return { text: 'Tu dama salió muy temprano. Ahora la voy a perseguir.', mood: 'sly' };
  return { text: 'Hmm, con eso me das ventaja. ¿Ves por qué? Intenta otra.', mood: 'sly' };
}

/* ---------- la jugada del entrenador ---------- */

/** Piezas valiosas que ataca la pieza de la casilla sq. */
function attacksFrom(P: Position, sq: number): { sq: number; p: string }[] {
  const p = P.b[sq]!;
  const copy: Position = { ...P, b: P.b.slice(), t: p === p.toUpperCase() ? 'w' : 'b' };
  return gen(copy, true).filter(m => m.f === sq && m.c && T(m.c) !== 'P').map(m => ({ sq: m.t, p: m.c! }));
}

/**
 * Lo que dice el entrenador al hacer su jugada. P es la posición antes de su jugada; codes, las jugadas hasta esta incluida.
 * Devuelve también si te dejó una amenaza (para reconocer después si te defendiste).
 */
export function botLine(P: Position, m: Move, codes: string[] | null): Line & { threat: boolean } {
  const me = P.t, you = other(me);
  const s = codes?.length ?? P.f;
  const opNow = codes ? openingOf(codes) : null, opLine = codes ? openingLine(codes) : null;
  const u = make(P, m);
  try {
    const mate = legal(P).length === 0 && inCheck(P, you);
    if (mate) return { text: '¡Jaque mate! Buena partida. ¿Otra?', mood: 'sly', threat: false };
    const check = inCheck(P, you);
    const targets = attacksFrom(P, m.t).filter(x => VAL[T(x.p)] > VAL[T(m.pr || m.p)] || !attacked(P, x.sq, you));
    const yourHanging = hanging(P, you).filter(sq => VAL[T(P.b[sq]!)] >= 3);
    const myHanging = hanging(P, me).filter(sq => VAL[T(P.b[sq]!)] >= 3);
    const threat = check || targets.length > 0 || yourHanging.length > 0;
    let text: string;
    if (m.c && check) text = `Me como ${tu(m.c)} y te doy jaque.`;
    else if (m.c) text = pick([`Me como ${tu(m.c)}.`, `Capturo ${tu(m.c)}.`], s);
    else if (check) text = pick(['¡Jaque! Mueve tu rey o tápalo.', 'Jaque. ¿Cómo te defiendes?'], s);
    else if (m.fl & (CK | CQ)) text = pick(['Enroco para proteger a mi rey.', 'Pongo a mi rey a salvo.'], s);
    else if (targets.length >= 2) text = '¡Ataque doble! Te ataco dos piezas a la vez.';
    else if (targets.length === 1) text = pick([`Te ataco ${el(targets[0].p)}. ¿Qué vas a hacer?`, `Voy por ${tu(targets[0].p)}. Cuídal${a(targets[0].p)}.`], s);
    else if (opLine && s <= 8 && opNow) text = `Juego ${opNow.replace(/^la Apertura abierta$/, 'la apertura abierta')}.`;
    else if ((T(m.p) === 'N' || T(m.p) === 'B') && (m.f >> 3) === (me === 'w' ? 7 : 0)) text = pick([`Ya es hora de poner en marcha a ${mi(m.p)}.`, `Saco ${mi(m.p)} a jugar.`], s);
    else if (T(m.p) === 'P' && ['d4', 'e4', 'd5', 'e5', 'c4', 'c5'].includes(sqName(m.t)) && s < 16) text = 'Voy a ocupar un poco de espacio en el centro.';
    else if (T(m.p) === 'Q') text = pick(['Mi dama entra al juego.', 'Muevo mi dama. Atento.'], s);
    else if (T(m.p) === 'R') text = pick(['Activo mi torre.', 'Mi torre busca una columna abierta.'], s);
    else if (T(m.p) === 'K') text = 'Muevo mi rey a un lugar más seguro.';
    else if (T(m.p) === 'P') text = pick(['Avanzo un peón.', 'Gano un poco de espacio.'], s);
    else text = pick(['Reacomodo mis piezas.', 'Mejoro la posición de mi pieza.'], s);
    // si te amenaza algo sin decirlo, avisa
    if (!check && !targets.length && yourHanging.length) text += ` Ojo con ${tu(P.b[yourHanging[0]]!)}.`;
    // si él dejó algo colgado, te tira una pista
    if (myHanging.length && !m.c) text += ' Uy… creo que dejé algo suelto.';
    return { text, mood: myHanging.length ? 'worried' : 'neutral', threat };
  } finally {
    unmake(P, m, u);
  }
}
