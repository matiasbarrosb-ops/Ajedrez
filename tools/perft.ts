// Prueba del generador de jugadas contra valores conocidos (perft).
import { E, parseFen } from './lib.ts';
function perft(P: E.Position, d: number): number {
  if (!d) return 1;
  let n = 0;
  for (const m of E.legal(P)) { const u = E.make(P, m); n += perft(P, d - 1); E.unmake(P, m, u); }
  return n;
}
const cases: [string, number, number][] = [
  ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 4, 197281],
  ['r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', 3, 97862],
  ['8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', 4, 43238]
];
let ok = true;
for (const [fen, d, exp] of cases) {
  const got = perft(parseFen(fen), d);
  console.log(got === exp ? 'OK ' : 'FALLA', d, got, exp);
  if (got !== exp) ok = false;
}
process.exit(ok ? 0 : 1);
