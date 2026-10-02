import { useEffect, useRef } from 'react';
import type { HistoryEntry } from '../chess/game.ts';
import { glyph } from './pieces.ts';

/** SAN con figuras en vez de letras inglesas. */
export function FigSan({ san }: { san: string }) {
  const parts = san.split(/([KQRBN])/);
  return <>{parts.map((p, i) => (/^[KQRBN]$/.test(p) ? <span key={i} className="fig">{glyph(p)}</span> : p))}</>;
}

export function MoveList({ hist }: { hist: HistoryEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [hist.length]);
  const rows = [];
  const last = hist.length - 1;
  for (let i = 0; i < hist.length; i += 2) {
    const odd = (i / 2) % 2 ? ' odd' : '';
    rows.push(
      <div key={i} className={`mrow${odd}`}>
        <span className="n">{i / 2 + 1}.</span>
        <span className={last === i ? 'last' : ''}><FigSan san={hist[i].san} /></span>
        <span className={last === i + 1 ? 'last' : ''}>{hist[i + 1] && <FigSan san={hist[i + 1].san} />}</span>
      </div>
    );
  }
  return <div className="moves" ref={ref}>{rows.length ? rows : <div className="moves-empty">Las jugadas aparecerán aquí.</div>}</div>;
}
