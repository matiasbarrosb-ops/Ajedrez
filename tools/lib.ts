// Utilidades de Node para trabajar con el motor (generar y verificar ejercicios).
// Se ejecuta con: node tools/<script>.ts  (Node 22.18+ entiende TypeScript sin compilar)
import * as E from '../src/engine/core.ts';
import { moveCode, parseFen, toFen } from '../src/chess/notation.ts';

export { E, parseFen, toFen, moveCode };

/** Evaluación de todas las jugadas en la raíz, con ventana completa (valores exactos). */
export function rootScores(P: E.Position, d: number) {
  E.setDeadline(Date.now() + 1e9);
  const out: { m: E.Move; s: number; c: string }[] = [];
  for (const m of E.legal(P)) {
    const u = E.make(P, m);
    const s = -E.ab(P, d - 1, -1e9, 1e9, 1);
    E.unmake(P, m, u);
    out.push({ m, s, c: moveCode(m) });
  }
  out.sort((a, b) => b.s - a.s);
  return out;
}
export const isMate = (P: E.Position) => E.legal(P).length === 0 && E.inCheck(P, P.t);
