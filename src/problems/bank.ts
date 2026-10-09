/*
 * Banco de problemas.
 * - puzzles.json: problemas propios, generados y verificados con el motor (tools/build-puzzles.ts).
 * - lichess.json: selección de la base pública de Lichess (CC0), verificada con el motor (tools/import-lichess.ts).
 *   Se carga aparte (es grande) apenas abre la app; mientras tanto solo están los propios.
 */
import data from './puzzles.json';
import { createStore, useStore } from '../database/store.ts';
import { ChessGame } from '../chess/game.ts';
import { toFen, moveCode, sqIndex } from '../chess/notation.ts';
import { inCheck, legal, make, unmake } from '../engine/core.ts';

export interface PuzzleStepData { accept: string[]; reply?: string }
export interface Puzzle {
  id: string;
  /** posición donde te toca jugar */
  fen: string;
  /** tema principal */
  theme: string;
  /** otros temas que también aparecen */
  tags?: string[];
  rating: number;
  /** en cada turno propio: jugadas aceptadas y la respuesta del rival */
  steps: PuzzleStepData[];
  /** casilla de destino y de origen de la primera jugada (para las pistas 2 y 3) */
  target: number;
  from: number;
  /** problemas de Lichess: posición antes de la jugada del rival y esa jugada, que se muestra al empezar */
  preFen?: string;
  pre?: string;
  /** apertura de la partida (clave de OPENINGS) si la táctica ocurre en la apertura */
  op?: string;
}

export const PUZZLES: Puzzle[] = (data as Puzzle[]).slice();

/* ---------- problemas de Lichess (carga diferida) ---------- */

type Row = [string, string, string, string, number, string, string, string];

class LichessPuzzle implements Puzzle {
  id: string; theme: string; tags: string[]; rating: number; steps: PuzzleStepData[]; target: number; from: number; preFen: string; pre: string; op?: string;
  private _fen: string | null = null;
  constructor(r: Row) {
    const [id, fen, pre, sol, rating, theme, tags, op] = r;
    this.id = 'l' + id; this.preFen = fen; this.pre = pre; this.rating = rating; this.theme = theme;
    this.tags = tags ? tags.split(' ') : []; if (op) this.op = op;
    const s = sol.split(' ');
    this.steps = [];
    for (let i = 0; i < s.length; i += 2) this.steps.push(s[i + 1] ? { accept: [s[i]], reply: s[i + 1] } : { accept: [s[i]] });
    this.from = sqIndex(s[0].slice(0, 2)); this.target = sqIndex(s[0].slice(2, 4));
  }
  get fen(): string {
    if (!this._fen) this._fen = toFen(new ChessGame(this.preFen, [this.pre]).P);
    return this._fen;
  }
}

export const bankStore = createStore<{ ready: boolean }>({ ready: false });
let loading: Promise<void> | null = null;
export function loadLichess(): Promise<void> {
  if (!loading) {
    loading = import('./lichess.json').then(m => {
      const rows = (m.default ?? m) as unknown as Row[];
      for (const r of rows) PUZZLES.push(new LichessPuzzle(r));
      byId.clear();
      bankStore.set({ ready: true });
    }).catch(() => { loading = null; });
  }
  return loading;
}
/** true cuando ya están todos los problemas (dispara la carga si hace falta) */
export function useBankReady(): boolean {
  const { ready } = useStore(bankStore);
  if (!ready) void loadLichess();
  return ready;
}

/**
 * Versión lista para jugar: en la última jugada de un problema de mate se acepta cualquier jugada que dé mate
 * (como en Lichess), no solo la de la solución.
 */
export function playable(p: Puzzle): Puzzle {
  const last = p.steps[p.steps.length - 1];
  if (!last || last.reply) return p;
  const g = new ChessGame(p.preFen ?? p.fen, p.pre ? [p.pre] : []);
  for (const st of p.steps.slice(0, -1)) {
    if (!g.playRef({ f: sqIndex(st.accept[0].slice(0, 2)), t: sqIndex(st.accept[0].slice(2, 4)), pr: st.accept[0][4] || null })) return p;
    if (st.reply && !g.playRef({ f: sqIndex(st.reply.slice(0, 2)), t: sqIndex(st.reply.slice(2, 4)), pr: st.reply[4] || null })) return p;
  }
  const P = g.P, mates: string[] = [];
  for (const m of legal(P)) {
    const u = make(P, m);
    if (inCheck(P, P.t) && legal(P).length === 0) mates.push(moveCode(m));
    unmake(P, m, u);
  }
  if (!mates.includes(last.accept[0])) return p;
  const accept = [last.accept[0], ...mates.filter(c => c !== last.accept[0])];
  return { ...p, fen: p.fen, steps: [...p.steps.slice(0, -1), { accept }] };
}

/* ---------- temas ---------- */

export const THEMES: Record<string, { label: string; hint: string; concept: string; group: 'tactica' | 'mate' | 'final' | 'otro' }> = {
  doble: { label: 'Ataque doble', group: 'tactica', hint: '¿Alguna jugada ataca dos piezas a la vez?', concept: 'Un ataque doble (horquilla) amenaza dos cosas al mismo tiempo: el rival solo puede salvar una.' },
  clavada: { label: 'Clavada', group: 'tactica', hint: '¿Hay una pieza rival que no se puede mover porque detrás está algo más valioso?', concept: 'Una pieza clavada no puede moverse sin dejar expuesta otra más valiosa (o el rey) que está detrás.' },
  ensartada: { label: 'Ensartada', group: 'tactica', hint: 'Ataca la pieza valiosa que está delante: cuando se aparte, capturas la de atrás.', concept: 'La ensartada es una clavada al revés: la pieza valiosa está adelante, se tiene que mover y deja la de atrás.' },
  descubierta: { label: 'Ataque a la descubierta', group: 'tactica', hint: '¿Qué pieza tuya, al moverse, abre la línea de otra?', concept: 'Al mover una pieza se descubre el ataque de otra que estaba detrás: son dos amenazas en una jugada.' },
  jaquedoble: { label: 'Jaque doble', group: 'tactica', hint: 'Busca una jugada que dé jaque con dos piezas a la vez.', concept: 'En un jaque doble el rey recibe jaque de dos piezas: la única defensa es mover el rey.' },
  desviacion: { label: 'Desviación', group: 'tactica', hint: '¿Qué pieza rival está defendiendo algo importante? Oblígala a irse.', concept: 'Desviar es obligar a una pieza defensora a dejar su puesto, con un jaque, una captura o una amenaza.' },
  atraccion: { label: 'Atracción', group: 'tactica', hint: 'A veces conviene sacrificar para atraer al rey o a una pieza a una casilla mala.', concept: 'La atracción obliga a una pieza rival a ir a una casilla donde después sufre una táctica.' },
  defensor: { label: 'Eliminar al defensor', group: 'tactica', hint: '¿Quién defiende la pieza que quieres ganar? Captúralo primero.', concept: 'Si capturas la pieza que defiende otra, esa otra queda sin protección.' },
  interferencia: { label: 'Interferencia', group: 'tactica', hint: 'Pon una pieza en medio de dos piezas rivales que se defienden.', concept: 'La interferencia corta la línea entre una pieza defensora y lo que defiende.' },
  despeje: { label: 'Despeje', group: 'tactica', hint: '¿Hay una pieza tuya que estorba? Muévela con ganancia de tiempo.', concept: 'Despejar es sacar una pieza propia de en medio para abrir una línea o una casilla clave.' },
  intermedia: { label: 'Jugada intermedia', group: 'tactica', hint: 'Antes de recapturar, ¿hay un jaque o una amenaza más fuerte?', concept: 'Una jugada intermedia es una amenaza que se intercala antes de la respuesta esperada.' },
  rayosx: { label: 'Rayos X', group: 'tactica', hint: 'Mira a través de las piezas: una torre o un alfil puede atacar o defender detrás de otra.', concept: 'En un ataque de rayos X una pieza actúa a través de otra que está en la misma línea.' },
  atrapada: { label: 'Pieza atrapada', group: 'tactica', hint: '¿Alguna pieza rival se quedó sin casillas para escapar?', concept: 'Una pieza sin casillas seguras se puede atacar y ganar.' },
  colgada: { label: 'Pieza colgada', group: 'tactica', hint: '¿Hay alguna pieza rival que nadie defiende?', concept: 'Una pieza sin defensa se puede capturar gratis.' },
  sacrificio: { label: 'Sacrificio', group: 'tactica', hint: 'Entregar material puede abrir el camino a algo mucho mejor.', concept: 'Un sacrificio entrega material a cambio de un ataque, un mate o recuperar más después.' },
  tranquila: { label: 'Jugada tranquila', group: 'tactica', hint: 'No todo es jaque o captura: busca una jugada silenciosa que deje al rival sin defensa.', concept: 'Una jugada tranquila no captura ni da jaque, pero crea una amenaza imposible de parar.' },
  defensa: { label: 'Defensa', group: 'tactica', hint: '¿Qué amenaza el rival? Encuentra la única jugada que lo para.', concept: 'A veces la mejor táctica es defenderse con precisión.' },
  coronacion: { label: 'Coronación', group: 'tactica', hint: '¿Hay algún peón cerca de la última fila? ¿Qué pasa si corona?', concept: 'Un peón que corona se convierte en dama: muchas veces vale la pena sacrificar algo para lograrlo.' },
  peonavanzado: { label: 'Peón avanzado', group: 'tactica', hint: 'Ese peón tan adelantado puede ser decisivo.', concept: 'Un peón cerca de coronar obliga al rival a usar piezas para frenarlo.' },
  ataquerey: { label: 'Ataque al rey', group: 'tactica', hint: 'Lleva más piezas al ataque que las que defienden al rey rival.', concept: 'Cuando el rey rival tiene pocos defensores, un ataque directo suele ganar.' },
  reyexpuesto: { label: 'Rey expuesto', group: 'tactica', hint: 'El rey rival no tiene protección: busca jaques.', concept: 'Un rey sin peones delante es vulnerable a jaques y ataques dobles.' },
  f7: { label: 'Ataque a f7 / f2', group: 'tactica', hint: 'La casilla f7 (f2 para las blancas) solo la defiende el rey al principio.', concept: 'En la apertura, f7 y f2 son los puntos débiles: muchas trampas empiezan ahí.' },
  zugzwang: { label: 'Zugzwang', group: 'final', hint: 'A veces la mejor jugada obliga al rival a mover y empeorar.', concept: 'Zugzwang: cualquier jugada que haga el rival empeora su posición.' },
  material: { label: 'Ganar material', group: 'tactica', hint: 'Revisa jaques, capturas y amenazas: una de ellas gana algo.', concept: 'Ganar material es quedarse con más puntos de piezas que el rival.' },
  mate1: { label: 'Mate en 1', group: 'mate', hint: '¿Qué jaque deja al rey sin ninguna casilla libre?', concept: 'Un jaque mate es un jaque del que el rey no puede escapar, taparse ni capturar al atacante.' },
  mate2: { label: 'Mate en 2', group: 'mate', hint: 'Empieza por los jaques y las jugadas que quitan casillas al rey. ¿Qué puede responder el rival?', concept: 'En un mate en 2, la primera jugada deja al rival sin defensa contra el mate siguiente.' },
  mate3: { label: 'Mate en 3 o más', group: 'mate', hint: 'Busca una serie de jaques que vaya cerrando las salidas del rey.', concept: 'Los mates largos se calculan jugada por jugada, imaginando siempre la mejor defensa.' },
  pasillo: { label: 'Mate del pasillo', group: 'mate', hint: '¿Quién defiende la última fila del rival?', concept: 'Un rey en la última fila, tapado por sus peones, cae ante una torre o dama que entra por esa fila.' },
  ahogado: { label: 'Mate de la coz', group: 'mate', hint: 'El rey está rodeado de sus propias piezas: un caballo puede darle mate.', concept: 'El mate de la coz lo da un caballo a un rey encerrado por sus propias piezas.' },
  final: { label: 'Finales', group: 'final', hint: 'En el final, el rey es una pieza de ataque y los peones valen oro.', concept: 'En los finales hay que calcular con precisión: cada tiempo cuenta.' },
  finaltorre: { label: 'Final de torres', group: 'final', hint: 'Torres activas, detrás de los peones pasados.', concept: 'Los finales de torres son los más comunes: la torre activa vale más que un peón.' },
  finalpeon: { label: 'Final de peones', group: 'final', hint: 'Cuenta casillas: oposición, regla del cuadrado y quién corona primero.', concept: 'En los finales de peones un solo tiempo decide la partida.' },
  igualar: { label: 'Salvar la partida', group: 'otro', hint: 'Estás peor: busca la jugada que empata.', concept: 'Cuando vas perdiendo, una táctica defensiva puede salvar medio punto.' }
};
export const themeLabel = (t: string) => THEMES[t]?.label ?? t;
/** ¿el problema practica este tema? (principal o secundario) */
export const hasTheme = (p: Puzzle, t: string) => p.theme === t || !!p.tags?.includes(t);

/* ---------- aperturas ---------- */

/** Aperturas con nombre en español (claves de Lichess). */
export const OPENINGS: Record<string, string> = {
  Sicilian_Defense: 'Defensa Siciliana', French_Defense: 'Defensa Francesa', 'Caro-Kann_Defense': 'Defensa Caro-Kann',
  Italian_Game: 'Apertura Italiana', Ruy_Lopez: 'Apertura Española', Scotch_Game: 'Apertura Escocesa', Scandinavian_Defense: 'Defensa Escandinava',
  Queens_Gambit_Declined: 'Gambito de Dama rehusado', Queens_Gambit_Accepted: 'Gambito de Dama aceptado', Slav_Defense: 'Defensa Eslava',
  Queens_Pawn_Game: 'Juego de peón de dama', Indian_Defense: 'Defensa India', Kings_Indian_Defense: 'India de Rey', 'Nimzo-Indian_Defense': 'Nimzoindia',
  English_Opening: 'Apertura Inglesa', Philidor_Defense: 'Defensa Philidor', Petrovs_Defense: 'Defensa Petrov', Russian_Game: 'Defensa Petrov (Rusa)',
  Kings_Gambit_Accepted: 'Gambito de Rey aceptado', Kings_Gambit_Declined: 'Gambito de Rey rehusado', Kings_Gambit: 'Gambito de Rey',
  Bishops_Opening: 'Apertura de alfil', Vienna_Game: 'Partida Vienesa', Four_Knights_Game: 'Cuatro caballos', Three_Knights_Opening: 'Tres caballos',
  Modern_Defense: 'Defensa Moderna', Pirc_Defense: 'Defensa Pirc', Alekhine_Defense: 'Defensa Alekhine', Dutch_Defense: 'Defensa Holandesa',
  Kings_Pawn_Game: 'Juego de peón de rey', Center_Game: 'Partida del centro', Ponziani_Opening: 'Apertura Ponziani', Englund_Gambit: 'Gambito Englund',
  'Blackmar-Diemer_Gambit': 'Gambito Blackmar-Diemer', Nimzowitsch_Defense: 'Defensa Nimzowitsch', Zukertort_Opening: 'Apertura Zukertort',
  Kings_Indian_Attack: 'Ataque India de Rey', Bird_Opening: 'Apertura Bird', Polish_Opening: 'Apertura Polaca', 'Nimzo-Larsen_Attack': 'Ataque Nimzo-Larsen',
  Horwitz_Defense: 'Defensa Horwitz', English_Defense: 'Defensa Inglesa', Elephant_Gambit: 'Gambito del elefante', Latvian_Gambit: 'Gambito letón',
  Danish_Gambit: 'Gambito danés', Owen_Defense: 'Defensa Owen', Benoni_Defense: 'Defensa Benoni', Grunfeld_Defense: 'Defensa Grünfeld',
  Catalan_Opening: 'Apertura Catalana', London_System: 'Sistema Londres', Trompowsky_Attack: 'Ataque Trompowsky', Budapest_Defense: 'Defensa Budapest',
  Rat_Defense: 'Defensa de la rata', Hungarian_Opening: 'Apertura Húngara', Van_Geet_Opening: 'Apertura Van Geet', Rapport_Jobava_System: 'Sistema Jobava',
  Mieses_Opening: 'Apertura Mieses', Old_Indian_Defense: 'India antigua', Bogo_Indian_Defense: 'Bogoindia', Queens_Indian_Defense: 'India de Dama',
  Semi_Slav_Defense: 'Semieslava', Tarrasch_Defense: 'Defensa Tarrasch', Benko_Gambit: 'Gambito Benko', Colle_System: 'Sistema Colle',
  Richter_Veresov_Attack: 'Ataque Richter-Veresov', Torre_Attack: 'Ataque Torre', Ware_Opening: 'Apertura Ware', Amar_Opening: 'Apertura Amar',
  Saragossa_Opening: 'Apertura Zaragoza', Grob_Opening: 'Apertura Grob', Sodium_Attack: 'Ataque sodio', Clemenz_Opening: 'Apertura Clemenz',
  Lion_Defense: 'Defensa del león', St_George_Defense: 'Defensa San Jorge', Goldsmith_Defense: 'Defensa Goldsmith', Duras_Gambit: 'Gambito Duras',
  Barnes_Defense: 'Defensa Barnes', Borg_Defense: 'Defensa Borg', Carr_Defense: 'Defensa Carr', Crab_Opening: 'Apertura cangrejo',
  Kadas_Opening: 'Apertura Kadas', Paleface_Attack: 'Ataque cara pálida', Portuguese_Opening: 'Apertura Portuguesa', Gedult_Opening: 'Apertura Gedult',
  Anderssen_Opening: 'Apertura Anderssen', Australian_Defense: 'Defensa Australiana', Pterodactyl_Defense: 'Defensa Pterodáctilo',
  Formation: 'Formaciones', Valencia_Opening: 'Apertura Valencia', Tennison_Gambit: 'Gambito Tennison', Ufimtsev_Defense: 'Defensa Ufimtsev'
};
export const openingLabel = (k: string) => OPENINGS[k] ?? k.replace(/_/g, ' ');
/** Aperturas más conocidas, en el orden en que se muestran. */
export const MAIN_OPENINGS = ['Italian_Game', 'Ruy_Lopez', 'Scotch_Game', 'Sicilian_Defense', 'French_Defense', 'Caro-Kann_Defense', 'Scandinavian_Defense',
  'Queens_Gambit_Declined', 'Queens_Gambit_Accepted', 'Slav_Defense', 'Queens_Pawn_Game', 'Kings_Indian_Defense', 'English_Opening', 'Petrovs_Defense',
  'Philidor_Defense', 'Vienna_Game', 'Four_Knights_Game', 'Kings_Gambit_Accepted', 'Pirc_Defense', 'Alekhine_Defense', 'Dutch_Defense', 'Bishops_Opening'];

/* ---------- búsqueda y selección ---------- */

const byId = new Map<string, Puzzle>();
/** Acepta id directo ('p12', 'l00008') o 'tema-n' (el n-ésimo del tema, de menor a mayor rating). */
export function puzzleById(id: string): Puzzle | undefined {
  if (!byId.size) for (const p of PUZZLES) byId.set(p.id, p);
  const direct = byId.get(id);
  if (direct) return direct;
  const m = /^([a-z0-9]+)-(\d+)$/.exec(id);
  if (!m) return undefined;
  return PUZZLES.filter(p => p.theme === m[1])[Number(m[2]) - 1];
}

export function difficultyLabel(r: number): string {
  return r < 900 ? 'Fácil' : r < 1300 ? 'Media' : r < 1700 ? 'Difícil' : 'Muy difícil';
}

export const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** El mismo problema para todos ese día: una táctica (no un mate) de dificultad media. */
export function dailyPuzzle(key = todayKey()): Puzzle {
  const lich = PUZZLES.filter(p => p.pre && p.rating >= 900 && p.rating <= 1600 && THEMES[p.theme]?.group === 'tactica');
  const pool = lich.length ? lich : PUZZLES.filter(p => p.rating >= 900 && p.rating <= 1600);
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

export const LEVELS: { id: string; label: string; min: number; max: number }[] = [
  { id: 'facil', label: 'Fácil', min: 0, max: 899 },
  { id: 'media', label: 'Media', min: 900, max: 1299 },
  { id: 'dificil', label: 'Difícil', min: 1300, max: 1699 },
  { id: 'muydificil', label: 'Muy difícil', min: 1700, max: 9999 }
];

/**
 * Siguiente problema cerca del rating del usuario.
 * - Nunca repite uno ya visto mientras queden sin ver (la ventana de rating se agranda si hace falta).
 * - Sin tema elegido, prefiere tácticas (los mates son 1 de cada 6) y no repite el tema del anterior.
 * - A veces elige un tema débil.
 */
export function pickPuzzle(rating: number, opts: { theme?: string; level?: string; opening?: string; recent?: Set<string>; weakThemes?: string[]; lastTheme?: string } = {}): Puzzle {
  const lv = LEVELS.find(l => l.id === opts.level);
  const base = PUZZLES.filter(p => (!opts.theme || hasTheme(p, opts.theme)) && (!opts.opening || p.op === opts.opening) && (!lv || (p.rating >= lv.min && p.rating <= lv.max)));
  let pool = base.filter(p => !opts.recent?.has(p.id));
  if (!pool.length) pool = base.length ? base : PUZZLES;
  if (!opts.theme && !opts.opening) {
    const wantMate = Math.random() < 1 / 6;
    const kind = pool.filter(p => (THEMES[p.theme]?.group === 'mate') === wantMate && p.theme !== opts.lastTheme);
    if (kind.length >= 20) pool = kind;
  }
  const target = lv ? Math.max(lv.min, Math.min(lv.max, rating)) : rating;
  for (const win of [100, 175, 275, 450, 99999]) {
    const near = pool.filter(p => Math.abs(p.rating - target) <= win);
    if (near.length >= 4 || win === 99999) {
      const list = near.length ? near : pool;
      const weak = list.filter(p => opts.weakThemes?.includes(p.theme));
      const from = weak.length && Math.random() < 0.35 ? weak : list;
      return from[Math.floor(Math.random() * from.length)];
    }
  }
  return pool[0];
}

/** Cuántos problemas quedan sin ver. */
export const unseenCount = (seen: Set<string>) => PUZZLES.filter(p => !seen.has(p.id)).length;
