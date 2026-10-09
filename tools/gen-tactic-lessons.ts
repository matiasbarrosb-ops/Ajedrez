/*
 * Genera las lecciones de Tácticas y de Aperturas a partir de los problemas de Lichess (src/problems/lichess.json).
 * Cada lección: explicación con un ejemplo real en el tablero → 5 problemas de dificultad creciente.
 * Uso: node tools/gen-tactic-lessons.ts   (escribe src/lessons/tactics.ts)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { ChessGame } from '../src/chess/game.ts';
import { toFen, START_FEN } from '../src/chess/notation.ts';

type Row = [string, string, string, string, number, string, string, string];
const rows = JSON.parse(readFileSync('src/problems/lichess.json', 'utf8')) as Row[];

/** posición después de la jugada del rival y SAN de la primera jugada de la solución */
function example(r: Row) {
  const g = new ChessGame(r[1], [r[2]]);
  const fen = toFen(g.P);
  const first = r[3].split(' ')[0];
  const g2 = new ChessGame(r[1], [r[2], first]);
  const es = (g2.hist[1]?.san ?? first).replace(/[KQRBN]/g, c => ({ K: 'R', Q: 'D', R: 'T', B: 'A', N: 'C' } as Record<string, string>)[c]);
  return { fen, san: es, side: g.P.t === 'w' ? 'blancas' : 'negras' };
}

const used = new Set<string>();
function pickLesson(filter: (r: Row) => boolean, lo: number, hi: number, n = 6): Row[] {
  const pool = rows.filter(r => !used.has(r[0]) && filter(r) && r[4] >= lo && r[4] < hi);
  // repartir a lo largo del tramo de rating: de más fácil a más difícil
  const out: Row[] = [];
  if (pool.length < n) return [];
  for (let i = 0; i < n; i++) out.push(pool[Math.floor((i * (pool.length - 1)) / (n - 1))]);
  out.forEach(r => used.add(r[0]));
  return out;
}

interface T { key: string; title: string; glyph: string; recog: string }
const UNITS: { id: string; title: string; desc: string; themes: T[] }[] = [
  { id: 't-dobles', title: 'Ataques dobles', desc: 'Una jugada, dos amenazas', themes: [
    { key: 'doble', title: 'Ataque doble', glyph: 'N', recog: 'Busca piezas rivales sin defensa o el rey: si una sola pieza tuya puede atacar dos de ellas a la vez, el rival no alcanza a salvar ambas. El caballo es el rey de las horquillas.' },
    { key: 'descubierta', title: 'Ataque a la descubierta', glyph: 'B', recog: 'Cuando una pieza tuya tapa la línea de un alfil, torre o dama, moverla "descubre" ese ataque. Si la pieza que se mueve también amenaza algo, son dos ataques en una jugada.' },
    { key: 'jaquedoble', title: 'Jaque doble', glyph: 'K', recog: 'Un jaque doble es una descubierta donde las dos piezas dan jaque. El rey no puede tapar ni capturar ambas: tiene que moverse.' }
  ] },
  { id: 't-lineas', title: 'Clavadas y ensartadas', desc: 'Piezas en la misma línea', themes: [
    { key: 'clavada', title: 'Clavada', glyph: 'B', recog: 'Si una pieza rival está entre tu alfil, torre o dama y algo más valioso (su dama o su rey), no se puede mover. Ataca la pieza clavada con algo barato: no puede escapar.' },
    { key: 'ensartada', title: 'Ensartada', glyph: 'R', recog: 'Ataca primero a la pieza más valiosa que está adelante en la línea. Cuando se aparte, capturas la que estaba detrás.' },
    { key: 'rayosx', title: 'Rayos X', glyph: 'Q', recog: 'Una torre o dama sigue actuando a través de otra pieza en su misma línea: puede defender o atacar una casilla "a través" de ella.' }
  ] },
  { id: 't-defensores', title: 'Sacar al defensor', desc: 'Desviar, atraer y eliminar defensores', themes: [
    { key: 'defensor', title: 'Eliminar al defensor', glyph: 'N', recog: 'Antes de capturar lo que quieres, mira quién lo defiende. Si capturas o cambias a ese defensor, lo demás queda colgado.' },
    { key: 'desviacion', title: 'Desviación', glyph: 'R', recog: 'Una pieza rival defiende algo importante. Oblígala a moverse con un jaque, una captura o una amenaza mayor.' },
    { key: 'atraccion', title: 'Atracción', glyph: 'Q', recog: 'Sacrifica una pieza para atraer al rey o a una pieza rival a una casilla donde después le cae una táctica (horquilla, mate, clavada).' },
    { key: 'interferencia', title: 'Interferencia', glyph: 'B', recog: 'Pon una pieza en medio de dos piezas rivales que se protegen: se corta la defensa.' },
    { key: 'despeje', title: 'Despeje', glyph: 'P', recog: 'A veces una pieza tuya estorba. Muévela con ganancia de tiempo (jaque o amenaza) para abrir una línea o una casilla.' }
  ] },
  { id: 't-sutiles', title: 'Jugadas que se escapan', desc: 'Lo que no es jaque ni captura', themes: [
    { key: 'intermedia', title: 'Jugada intermedia', glyph: 'N', recog: 'Antes de recapturar en automático, pregúntate si hay un jaque o una amenaza más fuerte que intercalar.' },
    { key: 'tranquila', title: 'Jugada tranquila', glyph: 'P', recog: 'La jugada ganadora no siempre da jaque ni captura: a veces es una jugada silenciosa que deja una amenaza imposible de parar.' },
    { key: 'defensa', title: 'Defensa precisa', glyph: 'K', recog: 'Antes de atacar, mira qué amenaza el rival. Hay posiciones donde una sola jugada te salva.' }
  ] },
  { id: 't-material', title: 'Ganar material', desc: 'Piezas colgadas, atrapadas y sacrificios', themes: [
    { key: 'colgada', title: 'Pieza colgada', glyph: 'P', recog: 'Después de cada jugada del rival revisa: ¿dejó alguna pieza sin defensa? Una pieza colgada se gana gratis.' },
    { key: 'atrapada', title: 'Pieza atrapada', glyph: 'B', recog: 'Una pieza rival sin casillas de escape se puede atacar y ganar. Cuenta las casillas a las que puede huir.' },
    { key: 'sacrificio', title: 'Sacrificio', glyph: 'Q', recog: 'Entregar material vale la pena si después ganas más, das mate o abres al rey. Calcula hasta el final antes de sacrificar.' }
  ] },
  { id: 't-rey', title: 'Ataque al rey', desc: 'Cuando el rey rival está débil', themes: [
    { key: 'ataquerey', title: 'Ataque al rey', glyph: 'Q', recog: 'Cuenta atacantes y defensores alrededor del rey rival. Si tienes más piezas cerca, busca jaques y sacrificios que abran su enroque.' },
    { key: 'f7', title: 'Ataque a f7 / f2', glyph: 'B', recog: 'En la apertura, f7 (f2 para blancas) solo la defiende el rey. Alfil y dama apuntando ahí son la base de muchas trampas.' },
    { key: 'reyexpuesto', title: 'Rey expuesto', glyph: 'K', recog: 'Un rey sin peones que lo cubran sufre jaques en cadena, y los jaques suelen esconder ataques dobles.' }
  ] },
  { id: 't-peones', title: 'Peones decisivos', desc: 'Coronar y avanzar', themes: [
    { key: 'coronacion', title: 'Coronación', glyph: 'P', recog: 'Un peón que corona vale una dama. Desvía o sacrifica lo que sea necesario para que llegue.' },
    { key: 'peonavanzado', title: 'Peón avanzado', glyph: 'P', recog: 'Un peón en la sexta o séptima fila obliga al rival a vigilarlo; úsalo para desviar sus piezas.' }
  ] }
];

const LEVELS: [string, number, number][] = [['fácil', 0, 1000], ['media', 1000, 1500], ['difícil', 1500, 9999]];
const units: unknown[] = [];

for (const u of UNITS) {
  const ls: unknown[] = [];
  for (const t of u.themes) {
    LEVELS.forEach(([lvName, lo, hi], li) => {
      const list = pickLesson(r => r[5] === t.key || r[6].split(' ').includes(t.key), lo, hi, 6);
      if (!list.length) return;
      const [ex, ...ps] = list;
      const e = example(ex);
      const steps = [
        { t: 'info', fen: e.fen, text: `${t.recog}\n\nEjemplo de una partida real: juegan ${e.side} y la jugada fue ${e.san}.` },
        ...ps.map((r, i) => ({ t: 'puzzle', id: 'l' + r[0], text: `${t.title} · ${i + 1} de ${ps.length}. ${i === 0 ? 'El rival acaba de jugar. ' : ''}Encuentra la jugada.` }))
      ];
      ls.push({ id: `tac-${t.key}-${li + 1}`, title: `${t.title} · ${lvName}`, glyph: t.glyph, topic: 'tacticas', summary: [t.recog], steps });
    });
  }
  if (ls.length) units.push({ id: u.id, level: 'Tácticas', title: u.title, desc: u.desc, lessons: ls });
}

// ---------- aperturas ----------
const OPEN: { key: string; name: string; moves: string; idea: string }[] = [
  { key: 'Italian_Game', name: 'Apertura Italiana', moves: 'e2e4 e7e5 g1f3 b8c6 f1c4', idea: '1.e4 e5 2.Cf3 Cc6 3.Ac4: el alfil apunta a f7, el punto débil de las negras. Las trampas giran alrededor de f7 y del centro.' },
  { key: 'Ruy_Lopez', name: 'Apertura Española', moves: 'e2e4 e7e5 g1f3 b8c6 f1b5', idea: '1.e4 e5 2.Cf3 Cc6 3.Ab5: el alfil presiona al caballo que defiende e5. Ojo con las clavadas sobre la diagonal del rey.' },
  { key: 'Scotch_Game', name: 'Apertura Escocesa', moves: 'e2e4 e7e5 g1f3 b8c6 d2d4', idea: '1.e4 e5 2.Cf3 Cc6 3.d4: las blancas abren el centro de inmediato. Piezas activas y ataques dobles sobre piezas que salen temprano.' },
  { key: 'Sicilian_Defense', name: 'Defensa Siciliana', moves: 'e2e4 c7c5', idea: '1.e4 c5: las negras pelean por el centro desde el flanco. Posiciones tácticas, con enroques opuestos y ataques al rey.' },
  { key: 'French_Defense', name: 'Defensa Francesa', moves: 'e2e4 e7e6 d2d4 d7d5', idea: '1.e4 e6 2.d4 d5: estructura sólida, pero el alfil de c8 queda encerrado. Muchas tácticas sobre e5, d4 y el enroque negro.' },
  { key: 'Caro-Kann_Defense', name: 'Defensa Caro-Kann', moves: 'e2e4 c7c6 d2d4 d7d5', idea: '1.e4 c6 2.d4 d5: sólida y segura. Las trampas típicas aparecen cuando las negras desarrollan el alfil o la dama demasiado pronto.' },
  { key: 'Scandinavian_Defense', name: 'Defensa Escandinava', moves: 'e2e4 d7d5', idea: '1.e4 d5: la dama negra sale temprano. Las blancas ganan tiempos atacándola; las negras deben cuidar que no la atrapen.' },
  { key: 'Queens_Gambit_Declined', name: 'Gambito de Dama rehusado', moves: 'd2d4 d7d5 c2c4 e7e6', idea: '1.d4 d5 2.c4 e6: lucha por el centro con d4 y c4. Clavadas del alfil sobre el caballo de f6 y presión en la columna c.' },
  { key: 'Queens_Gambit_Accepted', name: 'Gambito de Dama aceptado', moves: 'd2d4 d7d5 c2c4 d5c4', idea: '1.d4 d5 2.c4 dxc4: las negras toman el peón; querer conservarlo suele costar caro.' },
  { key: 'Slav_Defense', name: 'Defensa Eslava', moves: 'd2d4 d7d5 c2c4 c7c6', idea: '1.d4 d5 2.c4 c6: defiende d5 con un peón y deja libre el alfil de c8.' },
  { key: 'Kings_Indian_Defense', name: 'India de Rey', moves: 'd2d4 g8f6 c2c4 g7g6', idea: '1.d4 Cf6 2.c4 g6: las negras ceden el centro para atacarlo después; ataques en el flanco de rey.' },
  { key: 'English_Opening', name: 'Apertura Inglesa', moves: 'c2c4', idea: '1.c4: control del centro desde el flanco, con el alfil en g2 apuntando a la gran diagonal.' },
  { key: 'Petrovs_Defense', name: 'Defensa Petrov', moves: 'e2e4 e7e5 g1f3 g8f6', idea: '1.e4 e5 2.Cf3 Cf6: las negras contraatacan e4. La trampa clásica: copiar las jugadas del rival demasiado tiempo.' },
  { key: 'Philidor_Defense', name: 'Defensa Philidor', moves: 'e2e4 e7e5 g1f3 d7d6', idea: '1.e4 e5 2.Cf3 d6: sólida pero pasiva. Las blancas buscan f7 y la columna e.' },
  { key: 'Vienna_Game', name: 'Partida Vienesa', moves: 'e2e4 e7e5 b1c3', idea: '1.e4 e5 2.Cc3: prepara f4 y ataques rápidos.' },
  { key: 'Four_Knights_Game', name: 'Cuatro caballos', moves: 'e2e4 e7e5 g1f3 b8c6 b1c3 g8f6', idea: 'Los cuatro caballos salen primero. Posiciones simétricas donde una jugada descuidada cuesta material.' },
  { key: 'Kings_Gambit_Accepted', name: 'Gambito de Rey', moves: 'e2e4 e7e5 f2f4 e5f4', idea: '1.e4 e5 2.f4: las blancas entregan un peón para abrir la columna f y atacar f7. Muy táctico.' },
  { key: 'Pirc_Defense', name: 'Defensa Pirc', moves: 'e2e4 d7d6 d2d4 g8f6', idea: '1.e4 d6 2.d4 Cf6: las negras dejan el centro a las blancas y lo atacan después.' },
  { key: 'Alekhine_Defense', name: 'Defensa Alekhine', moves: 'e2e4 g8f6', idea: '1.e4 Cf6: provoca a los peones blancos a avanzar para atacarlos luego.' },
  { key: 'Dutch_Defense', name: 'Defensa Holandesa', moves: 'd2d4 f7f5', idea: '1.d4 f5: controla e4 pero debilita la diagonal del rey negro: cuidado con los jaques en h5.' }
];
const oUnits: unknown[] = [];
const oLessons: unknown[] = [];
for (const o of OPEN) {
  const pool = rows.filter(r => r[7] === o.key && !used.has(r[0]));
  if (pool.length < 10) continue;
  const fen = toFen(new ChessGame(START_FEN, o.moves.split(' ')).P);
  for (const [lvName, lo, hi] of [['1', 0, 1300], ['2', 1300, 9999]] as [string, number, number][]) {
    const list = pickLesson(r => r[7] === o.key, lo, hi, 5);
    if (!list.length) continue;
    oLessons.push({
      id: `ap-${o.key.toLowerCase()}-${lvName}`, title: `${o.name}${lvName === '2' ? ' · avanzado' : ''}`, glyph: 'N', topic: 'aperturas', summary: [o.idea],
      steps: [
        { t: 'info', fen, text: `${o.idea}\n\nAhora vienen tácticas de partidas reales que empezaron así.` },
        ...list.map((r, i) => ({ t: 'puzzle', id: 'l' + r[0], text: `${o.name} · ${i + 1} de ${list.length}. El rival acaba de jugar: encuentra la táctica.` }))
      ]
    });
  }
}
// unidades de aperturas: de abierta (e4 e5) a semiabierta (e4 otras) y cerrada (d4, c4)
const groups: [string, string, string, string[]][] = [
  ['ap-abiertas', 'Aperturas abiertas', '1.e4 e5: Italiana, Española, Escocesa y más', ['Italian_Game', 'Ruy_Lopez', 'Scotch_Game', 'Petrovs_Defense', 'Philidor_Defense', 'Vienna_Game', 'Four_Knights_Game', 'Kings_Gambit_Accepted']],
  ['ap-semiabiertas', 'Defensas contra 1.e4', 'Siciliana, Francesa, Caro-Kann y otras', ['Sicilian_Defense', 'French_Defense', 'Caro-Kann_Defense', 'Scandinavian_Defense', 'Pirc_Defense', 'Alekhine_Defense']],
  ['ap-cerradas', 'Aperturas de peón de dama', 'Gambito de Dama, Eslava, India de Rey, Inglesa', ['Queens_Gambit_Declined', 'Queens_Gambit_Accepted', 'Slav_Defense', 'Kings_Indian_Defense', 'English_Opening', 'Dutch_Defense']]
];
for (const [id, title, desc, keys] of groups) {
  const ls = (oLessons as { id: string }[]).filter(l => keys.some(k => l.id.startsWith(`ap-${k.toLowerCase()}-`)));
  if (ls.length) oUnits.push({ id, level: 'Aperturas', title, desc, lessons: ls });
}

const header = `/* GENERADO por tools/gen-tactic-lessons.ts a partir de los problemas de Lichess. No editar a mano. */\nimport type { Unit } from './data.ts';\n\n`;
writeFileSync('src/lessons/tactics.ts', header + `export const TACTIC_UNITS: Unit[] = ${JSON.stringify(units, null, 1)};\n\nexport const OPENING_UNITS: Unit[] = ${JSON.stringify(oUnits, null, 1)};\n`);
const nT = (units as { lessons: unknown[] }[]).reduce((a, u) => a + u.lessons.length, 0), nO = (oUnits as { lessons: unknown[] }[]).reduce((a, u) => a + u.lessons.length, 0);
console.log(`${nT} lecciones de tácticas en ${units.length} unidades · ${nO} de aperturas en ${oUnits.length} unidades`);
