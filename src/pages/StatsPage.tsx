/* Estadísticas: resultados, calidad de tus jugadas, precisión, piezas, aperturas y cada partida. */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../database/store.ts';
import { progressStore } from '../profile/progress.ts';
import { computeStats, scorePct, type Wld } from '../statistics/stats.ts';
import { QUALITY } from '../coach/coach.ts';
import { QualityBadge } from '../components/CoachPanel.tsx';
import { FigSan } from '../components/MoveList.tsx';

const PIECE_NAME: Record<string, string> = { P: 'Peón', N: 'Caballo', B: 'Alfil', R: 'Torre', Q: 'Dama', K: 'Rey' };
const RESULT: Record<string, string> = { win: 'Victoria', loss: 'Derrota', draw: 'Tablas' };
const fmtDate = (t: number) => new Date(t).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0);

/** Barra 100% con victorias / tablas / derrotas y sus etiquetas. */
function ResultBar({ r }: { r: Wld }) {
  if (!r.n) return <span className="muted small">—</span>;
  return (
    <div className="rbar-wrap">
      <div className="rbar" role="img" aria-label={`${r.w} victorias, ${r.d} tablas, ${r.l} derrotas`}>
        {r.w > 0 && <span className="rb win" style={{ flexGrow: r.w }} title={`${r.w} victorias`} />}
        {r.d > 0 && <span className="rb draw" style={{ flexGrow: r.d }} title={`${r.d} tablas`} />}
        {r.l > 0 && <span className="rb loss" style={{ flexGrow: r.l }} title={`${r.l} derrotas`} />}
      </div>
      <span className="rbar-l">{r.w} V · {r.d} T · {r.l} D</span>
    </div>
  );
}

/** Barras horizontales con etiqueta y valor. */
function HBars({ rows }: { rows: { label: React.ReactNode; v: number; cls?: string; note?: string }[] }) {
  const max = Math.max(1, ...rows.map(r => r.v));
  return (
    <div className="hbars">
      {rows.map((r, i) => (
        <div key={i} className="hb-row" title={r.note}>
          <span className="hb-l">{r.label}</span>
          <span className="hb-track"><span className={`hb-fill ${r.cls ?? ''}`} style={{ width: `${(100 * r.v) / max}%` }} /></span>
          <span className="hb-v">{r.note ?? r.v}</span>
        </div>
      ))}
    </div>
  );
}

/** Precisión partida a partida, con detalle al pasar el dedo o el mouse. */
function AccuracyChart({ pts }: { pts: { date: number; acc: number; result: string }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  if (pts.length < 2) return <p className="muted small">Juega al menos dos partidas con el entrenador activado para ver cómo evoluciona tu precisión.</p>;
  const W = 600, H = 160, pl = 34, pr = 12, pt = 12, pb = 22;
  const x = (i: number) => pl + (i * (W - pl - pr)) / (pts.length - 1);
  const y = (a: number) => pt + ((100 - a) * (H - pt - pb)) / 100;
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.acc).toFixed(1)}`).join(' ');
  const h = hover !== null ? pts[hover] : null;
  return (
    <div className="chart-wrap">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Precisión en tus últimas partidas"
        onMouseLeave={() => setHover(null)}
        onPointerMove={e => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          setHover(Math.max(0, Math.min(pts.length - 1, Math.round(((px - pl) / (W - pl - pr)) * (pts.length - 1)))));
        }}>
        {[0, 50, 100].map(v => (
          <g key={v}><line x1={pl} x2={W - pr} y1={y(v)} y2={y(v)} className="grid" /><text x={pl - 6} y={y(v) + 4} textAnchor="end" className="lbl">{v}</text></g>
        ))}
        <path d={d} className="line" />
        {h && hover !== null && <line x1={x(hover)} x2={x(hover)} y1={pt} y2={H - pb} className="cross" />}
        {pts.map((p, i) => <circle key={i} cx={x(i)} cy={y(p.acc)} r={hover === i ? 6 : 4} className={`pt ${p.result}`} />)}
        <text x={W - pr} y={y(pts[pts.length - 1].acc) - 10} textAnchor="end" className="lbl strong">{pts[pts.length - 1].acc}%</text>
      </svg>
      {h && <div className="tip">{fmtDate(h.date)} · {RESULT[h.result]} · <strong>{h.acc}%</strong></div>}
    </div>
  );
}

export function StatsPage() {
  const p = useStore(progressStore);
  const s = useMemo(() => computeStats(p.games), [p.games]);
  const [showAll, setShowAll] = useState(false);
  if (!p.games.length) return (
    <div className="page">
      <h1 className="page-title">Estadísticas</h1>
      <section className="card-block"><p className="muted">Todavía no hay partidas. Cada partida que termines suma aquí: resultados, calidad de tus jugadas, piezas que más mueves y aperturas.</p><Link className="primary" to="/jugar">Jugar una partida</Link></section>
    </div>
  );
  const qTotal = s.analyzedMoves;
  const pieceRows = (Object.keys(s.pieces) as (keyof typeof s.pieces)[]).map(k => ({ label: PIECE_NAME[k], v: s.pieces[k], note: `${s.pieces[k]} (${pct(s.pieces[k], s.myMoves)}%)` }));
  const castleN = s.castled.short + s.castled.long + s.castled.never;
  const games = showAll ? s.perGame : s.perGame.slice(0, 15);
  return (
    <div className="page stats-page">
      <h1 className="page-title">Estadísticas</h1>

      <section className="stat-row">
        <div className="stat"><span className="stat-v">{s.total.n}</span><span className="stat-l">Partidas</span></div>
        <div className="stat"><span className="stat-v">{scorePct(s.total)}%</span><span className="stat-l">Puntos ganados</span></div>
        <div className="stat"><span className="stat-v">{s.accuracyAvg ?? '—'}{s.accuracyAvg != null ? '%' : ''}</span><span className="stat-l">Precisión media</span></div>
        <div className="stat"><span className="stat-v">{s.myMoves}</span><span className="stat-l">Jugadas tuyas</span></div>
        <div className="stat"><span className="stat-v">{p.rating}</span><span className="stat-l">Rating</span></div>
      </section>

      <section className="card-block">
        <h2>Resultados</h2>
        <div className="kv"><span>Total</span><ResultBar r={s.total} /></div>
        <div className="kv"><span>Con blancas</span><ResultBar r={s.byColor.w} /></div>
        <div className="kv"><span>Con negras</span><ResultBar r={s.byColor.b} /></div>
        <div className="legend"><span><i className="sw win" />Victoria</span><span><i className="sw draw" />Tablas</span><span><i className="sw loss" />Derrota</span></div>
        <div>
          <span className="label">Últimas {s.form.length} partidas (la más nueva a la derecha)</span>
          <div className="form-row">{s.form.map((r, i) => <span key={i} className={`form-dot ${r}`} title={RESULT[r]}>{r === 'win' ? 'V' : r === 'loss' ? 'D' : 'T'}</span>)}</div>
          <p className="muted small">Mejor racha de victorias: {s.bestStreak}</p>
        </div>
      </section>

      <section className="card-block">
        <div className="card-h"><h2>Calidad de tus jugadas</h2><span className="muted small">{qTotal} analizadas</span></div>
        {qTotal ? (
          <HBars rows={QUALITY.map((q, i) => ({ label: <QualityBadge q={i} />, v: s.quality[i], cls: q.cls, note: `${s.quality[i]} (${pct(s.quality[i], qTotal)}%)` }))} />
        ) : <p className="muted small">Activa el entrenador en tus partidas: cada jugada tuya se califica en 5 niveles y aparece aquí.</p>}
        {qTotal > 0 && (
          <p className="small">{pct(s.quality[3] + s.quality[4], qTotal) > 15
            ? `Cometes errores en el ${pct(s.quality[3] + s.quality[4], qTotal)}% de tus jugadas. Lo que más ayuda: antes de mover, revisa qué piezas tuyas quedan atacadas.`
            : `Solo el ${pct(s.quality[3] + s.quality[4], qTotal)}% de tus jugadas son errores. ¡Bien! Para subir, busca la mejor jugada y no solo una buena.`}</p>
        )}
      </section>

      <section className="card-block">
        <h2>Precisión por partida</h2>
        <AccuracyChart pts={s.accuracySeries} />
      </section>

      <section className="card-block">
        <h2>Cómo juegas</h2>
        <div className="stat-grid">
          <div className="stat"><span className="stat-v">{s.captures}</span><span className="stat-l">Capturas ({pct(s.captures, s.myMoves)}% de tus jugadas)</span></div>
          <div className="stat"><span className="stat-v">{s.checks}</span><span className="stat-l">Jaques dados</span></div>
          <div className="stat"><span className="stat-v">{s.promotions}</span><span className="stat-l">Coronaciones</span></div>
          <div className="stat"><span className="stat-v">{s.avgLength}</span><span className="stat-l">Jugadas por partida (máx. {s.longest})</span></div>
          <div className="stat"><span className="stat-v">{s.avgDurationMin} min</span><span className="stat-l">Duración media</span></div>
          <div className="stat"><span className="stat-v">{castleN ? `${pct(s.castled.short + s.castled.long, castleN)}%` : '—'}</span><span className="stat-l">Partidas en que enrocaste ({s.castled.short} corto · {s.castled.long} largo)</span></div>
        </div>
        <span className="label">Piezas que más mueves</span>
        <HBars rows={pieceRows} />
      </section>

      <section className="card-block">
        <h2>Aperturas</h2>
        <div className="two-col">
          <div>
            <span className="label">Con blancas, tu primera jugada</span>
            <table className="tbl"><thead><tr><th>Jugada</th><th>Partidas</th><th>Puntos</th></tr></thead>
              <tbody>{s.openingsWhite.length ? s.openingsWhite.map(o => <tr key={o.san}><td><FigSan san={o.san} /></td><td>{o.r.n}</td><td>{scorePct(o.r)}%</td></tr>) : <tr><td colSpan={3} className="muted">Sin partidas</td></tr>}</tbody></table>
          </div>
          <div>
            <span className="label">Con negras, tu respuesta</span>
            <table className="tbl"><thead><tr><th>Jugadas</th><th>Partidas</th><th>Puntos</th></tr></thead>
              <tbody>{s.openingsBlack.length ? s.openingsBlack.map(o => <tr key={o.san}><td><FigSan san={o.san} /></td><td>{o.r.n}</td><td>{scorePct(o.r)}%</td></tr>) : <tr><td colSpan={3} className="muted">Sin partidas</td></tr>}</tbody></table>
          </div>
        </div>
      </section>

      <section className="card-block">
        <h2>Por rival</h2>
        <table className="tbl"><thead><tr><th>Rival</th><th>Partidas</th><th>Resultado</th><th>Puntos</th></tr></thead>
          <tbody>{s.byOpponent.map(o => <tr key={o.name}><td>{o.name}{o.rating ? <span className="muted"> · {o.rating}</span> : null}</td><td>{o.r.n}</td><td>{o.r.w}-{o.r.d}-{o.r.l}</td><td>{scorePct(o.r)}%</td></tr>)}</tbody></table>
        <span className="label">Cómo terminan</span>
        <table className="tbl"><thead><tr><th>Final</th><th>Ganaste</th><th>Perdiste</th><th>Tablas</th></tr></thead>
          <tbody>{s.byReason.map(r => <tr key={r.reason}><td>{r.reason}</td><td>{r.win}</td><td>{r.loss}</td><td>{r.draw}</td></tr>)}</tbody></table>
      </section>

      <section className="card-block">
        <h2>Partida por partida</h2>
        <div className="tbl-scroll">
          <table className="tbl"><thead><tr><th>Fecha</th><th>Rival</th><th>Resultado</th><th>Jugadas</th><th>Precisión</th><th>{QUALITY.map((q, i) => <span key={i} className={`qcount ${q.cls}`} title={q.label}>{q.short}</span>)}</th></tr></thead>
            <tbody>{games.map(({ g, myMoves, q }) => (
              <tr key={g.id}>
                <td>{fmtDate(g.date)}</td>
                <td><Link to={`/partidas/${g.id}`}>{g.opponent}</Link></td>
                <td><span className={`res-dot ${g.result}`} /> {RESULT[g.result]}</td>
                <td>{myMoves}</td>
                <td>{g.acc != null ? `${g.acc}%` : '—'}</td>
                <td className="qcells">{q.some(Boolean) ? q.join(' · ') : '—'}</td>
              </tr>
            ))}</tbody></table>
        </div>
        {s.perGame.length > 15 && <button className="link left" onClick={() => setShowAll(v => !v)}>{showAll ? 'Ver menos' : `Ver las ${s.perGame.length} partidas`}</button>}
      </section>
    </div>
  );
}
