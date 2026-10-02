import { useEffect, useState } from 'react';
import { watchRecords, type RecordEntry } from '../database/online.ts';
import type { User } from '../database/session.ts';

/** Marcador por rival (amigos y bots). */
export function Records({ user, limit }: { user: User; limit?: number }) {
  const [rows, setRows] = useState<Record<string, RecordEntry> | null>(null);
  useEffect(() => {
    let off = () => {};
    watchRecords(user.uid, setRows).then(f => { off = f; });
    return () => off();
  }, [user.uid]);
  if (rows === null) return <p className="muted small">Cargando…</p>;
  const list = Object.entries(rows).sort((a, b) => (b[1].last || 0) - (a[1].last || 0)).slice(0, limit);
  if (!list.length) return <p className="muted small">Todavía no hay partidas. Juega contra un bot o un amigo y tus resultados aparecen aquí.</p>;
  return (
    <div className="score-list">
      {list.map(([k, r]) => {
        const total = (r.w || 0) + (r.l || 0) + (r.d || 0);
        return (
          <div className="score-row" key={k}>
            <div className="who">{k.startsWith('~') ? '' : 'vs '}{r.name}<small>{total} partida{total === 1 ? '' : 's'}{r.last ? ` · última ${new Date(r.last).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}` : ''}</small></div>
            <div className="tally-big"><span className="w">{r.w || 0}</span> – <span className="l">{r.l || 0}</span><span className="d">{r.d || 0} tablas</span></div>
          </div>
        );
      })}
    </div>
  );
}
