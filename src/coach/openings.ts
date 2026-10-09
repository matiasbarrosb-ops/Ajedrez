/* Nombre de la apertura según las primeras jugadas (formato e2e4). Gana la coincidencia más larga. */
const OPENINGS: [string, string][] = [
  ['e2e4', 'la Apertura del peón de rey'], ['d2d4', 'la Apertura del peón de dama'], ['c2c4', 'la Apertura Inglesa'], ['g1f3', 'la Apertura Réti'],
  ['e2e4 c7c5', 'la Defensa Siciliana'], ['e2e4 c7c5 c2c3', 'la Siciliana Alapin'], ['e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 a7a6', 'la Siciliana Najdorf'],
  ['e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6', 'la Siciliana Dragón'],
  ['e2e4 e7e6', 'la Defensa Francesa'], ['e2e4 c7c6', 'la Defensa Caro-Kann'], ['e2e4 d7d5', 'la Defensa Escandinava'], ['e2e4 d7d6', 'la Defensa Pirc'],
  ['e2e4 g8f6', 'la Defensa Alekhine'], ['e2e4 g7g6', 'la Defensa Moderna'],
  ['e2e4 e7e5', 'la Apertura abierta'], ['e2e4 e7e5 g1f3 b8c6 f1b5', 'la Apertura Española'], ['e2e4 e7e5 g1f3 b8c6 f1c4', 'la Apertura Italiana'],
  ['e2e4 e7e5 g1f3 b8c6 f1c4 f8c5', 'el Giuoco Piano'], ['e2e4 e7e5 g1f3 b8c6 f1c4 g8f6', 'la Defensa de los dos caballos'],
  ['e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 b2b4', 'el Gambito Evans'],
  ['e2e4 e7e5 g1f3 b8c6 d2d4', 'la Apertura Escocesa'], ['e2e4 e7e5 g1f3 b8c6 b1c3 g8f6', 'la Apertura de los cuatro caballos'],
  ['e2e4 e7e5 g1f3 g8f6', 'la Defensa Petrov'], ['e2e4 e7e5 g1f3 d7d6', 'la Defensa Philidor'], ['e2e4 e7e5 f2f4', 'el Gambito de Rey'],
  ['e2e4 e7e5 b1c3', 'la Apertura Vienesa'], ['e2e4 e7e5 f1c4', 'la Apertura de alfil'], ['e2e4 e7e5 d2d4', 'el Gambito del Centro'],
  ['d2d4 d7d5 c2c4', 'el Gambito de Dama'], ['d2d4 d7d5 c2c4 e7e6', 'el Gambito de Dama rehusado'], ['d2d4 d7d5 c2c4 d5c4', 'el Gambito de Dama aceptado'],
  ['d2d4 d7d5 c2c4 c7c6', 'la Defensa Eslava'], ['d2d4 d7d5 c1f4', 'el Sistema Londres'], ['d2d4 g8f6 c1f4', 'el Sistema Londres'],
  ['d2d4 d7d5 g1f3 g8f6 c1f4', 'el Sistema Londres'], ['d2d4 g8f6 g1f3 d7d5 c1f4', 'el Sistema Londres'],
  ['d2d4 g8f6', 'la Defensa India'], ['d2d4 g8f6 c2c4 g7g6', 'la Defensa India de Rey'], ['d2d4 g8f6 c2c4 g7g6 b1c3 d7d5', 'la Defensa Grünfeld'],
  ['d2d4 g8f6 c2c4 e7e6 b1c3 f8b4', 'la Defensa Nimzo-India'], ['d2d4 g8f6 c2c4 e7e6 g1f3 b7b6', 'la Defensa India de Dama'],
  ['d2d4 f7f5', 'la Defensa Holandesa'], ['c2c4 e7e5', 'la Inglesa invertida'], ['g1f3 d7d5 g2g3', 'la Apertura Réti']
];

/** La secuencia sigue una línea conocida de apertura (todas sus jugadas son de teoría). */
export function isTheory(codes: string[]): boolean {
  if (!codes.length || codes.length > 10) return false;
  const s = codes.join(' ');
  return OPENINGS.some(([k]) => k === s || k.startsWith(s + ' '));
}

export function openingOf(codes: string[]): string | null {
  const s = codes.join(' ');
  let best: string | null = null, bl = 0;
  for (const [k, n] of OPENINGS) {
    const kl = k.split(' ').length;
    if (kl <= codes.length && kl > bl && (s === k || s.startsWith(k + ' '))) { best = n; bl = kl; }
  }
  return best;
}

/**
 * Frase sobre la apertura después de la jugada número codes.length (codes incluye la jugada).
 * Solo habla cuando la apertura cambia de nombre: con tu jugada o con la del rival justo antes.
 */
export function openingLine(codes: string[]): string | null {
  const now = openingOf(codes);
  if (!now) return null;
  if (now !== openingOf(codes.slice(0, -1))) {
    return `${codes.length === 1 ? 'Partiste con' : codes.length === 2 ? 'Respondiste con' : 'Entraste en'} ${now}.`;
  }
  if (codes.length > 2 && now !== openingOf(codes.slice(0, -2))) {
    return `Tu rival te llevó ${now.replace(/^el /, 'al ').replace(/^la /, 'a la ')}.`;
  }
  return null;
}
