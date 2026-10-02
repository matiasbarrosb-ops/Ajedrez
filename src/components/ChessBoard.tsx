/*
 * ChessBoard: tablero 8×8 reutilizable.
 * Mover tocando (origen y destino) o arrastrando. Muestra jugadas legales, última jugada, jaque,
 * pistas y marcas. La coronación se elige dentro del propio tablero.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { inCheck, isWhite, type Color, type Move, type Position } from '../engine/core.ts';
import { FILES } from '../chess/notation.ts';
import { glyph } from './pieces.ts';

export interface BoardArrow { f: number; t: number }

interface Props {
  P: Position;
  orientation: Color;
  /** jugadas que el usuario puede hacer ahora; vacío = tablero bloqueado */
  legalMoves: Move[];
  onMove?: (m: Move) => void;
  lastMove?: { f: number; t: number } | null;
  /** cambia cuando hay una jugada nueva que conviene animar */
  animKey?: string | number;
  /** casillas marcadas en azul (pistas) */
  hints?: number[];
  /** casillas marcadas con un círculo (zonas, ejemplos) */
  marks?: number[];
  /** muestra los destinos de esta casilla sin permitir mover (lecciones) */
  showMovesFrom?: number | null;
  showMoves?: Move[];
  coordinates?: boolean;
}

export function ChessBoard({ P, orientation, legalMoves, onMove, lastMove, animKey, hints, marks, showMovesFrom, showMoves, coordinates = true }: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [promo, setPromo] = useState<Move[] | null>(null);
  const skipAnim = useRef(false);
  const dragRef = useRef<{ from: number; wasSel: boolean; x0: number; y0: number; moved: boolean; size: number; ghost: HTMLDivElement; pc: HTMLElement | null } | null>(null);
  const flipped = orientation === 'b';

  // si cambian las jugadas posibles (otra posición), se limpia la selección
  useEffect(() => { setSel(null); setPromo(null); }, [legalMoves]);

  const targets = useMemo(() => {
    const t = new Map<number, boolean>();
    const from = sel ?? showMovesFrom ?? null;
    const pool = sel !== null ? legalMoves : showMoves ?? [];
    if (from !== null) for (const m of pool) if (m.f === from) t.set(m.t, !!P.b[m.t] || !!(m.fl & 2));
    return t;
  }, [sel, legalMoves, showMovesFrom, showMoves, P]);

  const checkSq = useMemo(() => (inCheck(P, P.t) ? P.b.indexOf(P.t === 'w' ? 'K' : 'k') : -1), [P, animKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // animación de la última jugada (no se anima si la pieza se arrastró)
  useLayoutEffect(() => {
    if (!lastMove || animKey === undefined) return;
    if (skipAnim.current) { skipAnim.current = false; return; }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = boardRef.current?.querySelector<HTMLElement>(`[data-sq="${lastMove.t}"] .pc`);
    if (!el) return;
    const pos = (s: number) => { const i = flipped ? 63 - s : s; return [i & 7, i >> 3]; };
    const [fc, fr] = pos(lastMove.f), [tc, tr] = pos(lastMove.t);
    el.classList.add('anim');
    el.style.transition = 'none';
    el.style.transform = `translate(${(fc - tc) * 125}%, ${(fr - tr) * 125 + 2}%)`;
    el.getBoundingClientRect();
    el.style.transition = 'transform .2s cubic-bezier(.3,.7,.4,1)';
    el.style.transform = '';
    const t = setTimeout(() => el.classList.remove('anim'), 230);
    return () => clearTimeout(t);
  }, [animKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const canMoveFrom = (sq: number) => legalMoves.some(m => m.f === sq);
  const sqFromPoint = (x: number, y: number) => {
    const r = boardRef.current!.getBoundingClientRect();
    if (x < r.left || y < r.top || x >= r.right || y >= r.bottom) return -1;
    const c = Math.floor((x - r.left) / (r.width / 8)), w = Math.floor((y - r.top) / (r.height / 8));
    const i = w * 8 + c;
    return flipped ? 63 - i : i;
  };
  const tryMove = (from: number, to: number, dragged: boolean) => {
    const ms = legalMoves.filter(m => m.f === from && m.t === to);
    if (!ms.length) return false;
    setSel(null);
    if (ms.length > 1) { setPromo(ms); skipAnim.current = dragged; return true; }
    skipAnim.current = dragged;
    onMove?.(ms[0]);
    return true;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button > 0 || promo) return;
    const sq = sqFromPoint(e.clientX, e.clientY);
    if (sq < 0) return;
    if (sel !== null && sel !== sq && !canMoveFrom(sq)) { if (!tryMove(sel, sq, false)) setSel(null); return; }
    if (!canMoveFrom(sq)) { setSel(null); return; }
    const wasSel = sel === sq;
    setSel(sq);
    const size = boardRef.current!.getBoundingClientRect().width / 8;
    const p = P.b[sq]!;
    const ghost = document.createElement('div');
    ghost.className = `ghost ${isWhite(p) ? 'w' : 'b'}`;
    ghost.textContent = glyph(p.toUpperCase());
    Object.assign(ghost.style, { width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.86}px`, left: `${e.clientX - size / 2}px`, top: `${e.clientY - size / 2}px`, visibility: 'hidden' });
    document.body.appendChild(ghost);
    const pc = boardRef.current!.querySelector<HTMLElement>(`[data-sq="${sq}"] .pc`);
    dragRef.current = { from: sq, wasSel, x0: e.clientX, y0: e.clientY, moved: false, size, ghost, pc };
    try { boardRef.current!.setPointerCapture(e.pointerId); } catch { /* sin captura */ }
    e.preventDefault();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current; if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 5) {
      d.moved = true; d.ghost.style.visibility = 'visible'; d.pc?.classList.add('lifted');
    }
    d.ghost.style.left = `${e.clientX - d.size / 2}px`;
    d.ghost.style.top = `${e.clientY - d.size / 2}px`;
  };
  const endDrag = () => {
    const d = dragRef.current; if (!d) return null;
    d.ghost.remove(); d.pc?.classList.remove('lifted');
    dragRef.current = null;
    return d;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = endDrag(); if (!d) return;
    const to = sqFromPoint(e.clientX, e.clientY);
    if (d.moved) { if (to >= 0 && to !== d.from) tryMove(d.from, to, true); return; }
    if (d.wasSel) setSel(null);
  };

  const squares = [];
  for (let i = 0; i < 64; i++) {
    const sq = flipped ? 63 - i : i, r = sq >> 3, f = sq & 7;
    const light = ((r + f) & 1) === 0;
    let cls = `sq ${light ? 'l' : 'd'}`;
    if (lastMove && (sq === lastMove.f || sq === lastMove.t)) cls += ' hl';
    if (sq === sel) cls += ' hl';
    if (hints?.includes(sq)) cls += ' hint';
    if (sq === checkSq) cls += ' check';
    if (marks?.includes(sq)) cls += ' mark';
    if (targets.has(sq)) cls += targets.get(sq) ? ' tgt cap' : ' tgt';
    const p = P.b[sq];
    squares.push(
      <div key={sq} className={cls} data-sq={sq}>
        {coordinates && (i & 7) === 0 && <span className="co rk">{8 - r}</span>}
        {coordinates && i >> 3 === 7 && <span className="co fl">{FILES[f]}</span>}
        {p && <span className={`pc ${isWhite(p) ? 'w' : 'b'}`}>{glyph(p.toUpperCase())}</span>}
      </div>
    );
  }

  return (
    <div className="board-wrap">
      <div className={`board${legalMoves.length ? ' live' : ''}`} ref={boardRef} role="grid" aria-label="Tablero de ajedrez"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={() => endDrag()}>
        {squares}
      </div>
      {promo && (
        <div className="overlay" onClick={() => setPromo(null)}>
          <div className="card promo-card" onClick={e => e.stopPropagation()}>
            <h3>Coronar peón</h3>
            <div className="promo-row">
              {['Q', 'R', 'B', 'N'].map(T => {
                const m = promo.find(x => x.pr?.toUpperCase() === T)!;
                const names: Record<string, string> = { Q: 'Dama', R: 'Torre', B: 'Alfil', N: 'Caballo' };
                return (
                  <button key={T} className={P.t} aria-label={names[T]} onClick={() => { setPromo(null); onMove?.(m); }}>
                    {glyph(T)}
                  </button>
                );
              })}
            </div>
            <button className="btn-ghost" onClick={() => setPromo(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
