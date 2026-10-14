/*
 * ChessBoard: tablero 8×8 reutilizable.
 * Mover tocando (origen y destino) o arrastrando. Muestra jugadas legales, última jugada, jaque,
 * pistas y marcas. La coronación se elige dentro del propio tablero.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { inCheck, isWhite, type Color, type Move, type Position } from '../engine/core.ts';
import { FILES } from '../chess/notation.ts';
import { glyph } from './pieces.ts';

export interface BoardArrow { f: number; t: number; tone?: 'good' | 'bad' }
/** Ícono sobre una casilla: cómo estuvo la jugada (libro, mejor, buena, error…). */
export type BadgeKind = 'book' | 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
export interface BoardBadge { sq: number; kind: BadgeKind }

function BadgeIcon({ kind }: { kind: BadgeKind }) {
  if (kind === 'book') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5C5.5 5 8.5 5 12 7c3.5-2 6.5-2 9-.5V19c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5z" fill="#fff" /><path d="M12 7v12.5" stroke="#a5713f" strokeWidth="1.6" /></svg>;
  if (kind === 'good') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10.5V20H4v-9.5zM9 20h8.2a2 2 0 0 0 2-1.7l1.1-6A2 2 0 0 0 18.3 10H14V6.2A2.2 2.2 0 0 0 11.8 4L9 10.4z" fill="#fff" /></svg>;
  if (kind === 'best') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill="#fff" /></svg>;
  const txt = kind === 'excellent' ? '!' : kind === 'inaccuracy' ? '?!' : kind === 'mistake' ? '?' : '??';
  return <span>{txt}</span>;
}

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
  /** ícono de calidad sobre una casilla (modo entrenador) */
  badge?: BoardBadge | null;
  /** flechas (verde: mejor jugada; roja: amenaza del rival) */
  arrows?: BoardArrow[];
}

export function ChessBoard({ P, orientation, legalMoves, onMove, lastMove, animKey, hints, marks, showMovesFrom, showMoves, coordinates = true, badge, arrows }: Props) {
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
        {badge && badge.sq === sq && <span className={`qicon ${badge.kind}`} key={`${badge.kind}${animKey}`}><BadgeIcon kind={badge.kind} /></span>}
      </div>
    );
  }

  return (
    <div className="board-wrap">
      <div className={`board${legalMoves.length ? ' live' : ''}`} ref={boardRef} role="grid" aria-label="Tablero de ajedrez"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={() => endDrag()}>
        {squares}
      </div>
      {arrows && arrows.length > 0 && (
        <svg className="arrows" viewBox="0 0 8 8" aria-hidden="true">
          {arrows.map((a, i) => {
            const c = (s: number) => { const k = flipped ? 63 - s : s; return [(k & 7) + 0.5, (k >> 3) + 0.5]; };
            const [x1, y1] = c(a.f), [x2, y2] = c(a.t);
            const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
            const ux = dx / L, uy = dy / L, nx = -uy, ny = ux, hw = 0.12, hl = 0.42, hh = 0.3;
            const sx = x1 + ux * 0.2, sy = y1 + uy * 0.2, bx = x2 - ux * hl, by = y2 - uy * hl;
            const pts = [[sx + nx * hw, sy + ny * hw], [bx + nx * hw, by + ny * hw], [bx + nx * hh, by + ny * hh], [x2, y2], [bx - nx * hh, by - ny * hh], [bx - nx * hw, by - ny * hw], [sx - nx * hw, sy - ny * hw]];
            return <polygon key={i} className={a.tone === 'bad' ? 'bad' : 'good'} points={pts.map(p => p.map(v => v.toFixed(3)).join(',')).join(' ')} />;
          })}
        </svg>
      )}
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
