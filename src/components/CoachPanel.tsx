/* Chat del entrenador: un mensaje por jugada con su calificación, el porqué y en qué fijarse. */
import { useEffect, useRef, useState } from 'react';
import { QUALITY, type CoachNote, type OpponentNote } from '../coach/coach.ts';
import type { CoachMsg } from '../coach/useCoach.ts';
import { FigSan } from './MoveList.tsx';
import { Icon } from './Icon.tsx';

const moveNo = (ply: number) => `${Math.floor(ply / 2) + 1}.${ply % 2 ? '..' : ''}`;

export function QualityBadge({ q }: { q: number }) {
  return <span className={`qbadge ${QUALITY[q].cls}`}>{QUALITY[q].short} {QUALITY[q].label}</span>;
}

function MoveBubble({ n, sideLabel }: { n: CoachNote; sideLabel?: string }) {
  return (
    <div className={`cbubble ${QUALITY[n.q].cls}`}>
      <div className="cb-h">
        <span className="cb-move">{sideLabel ? `${sideLabel} · ` : ''}{moveNo(n.ply)} <FigSan san={n.san} /></span>
        <QualityBadge q={n.q} />
      </div>
      <ul className="cb-why">{n.opening && <li>{n.opening}</li>}{n.why.map((w, i) => <li key={i}>{w}</li>)}</ul>
      {n.best && (
        <p className="cb-best"><span className="label">Mejor era</span> <strong><FigSan san={n.best} /></strong>{n.bestWhy ? ` — ${n.bestWhy}` : ''}</p>
      )}
      <p className="cb-tip"><span className="label">En qué fijarte</span> {n.tip}</p>
    </div>
  );
}

interface Props {
  msgs: CoachMsg[];
  busy: boolean;
  accuracy: number | null;
  notes: CoachNote[];
  /** en partidas de dos jugadores se indica de quién es la jugada */
  showSide?: boolean;
  /** sin onToggle (modo entrenador) el panel no se puede ocultar */
  onToggle?: () => void;
  enabled: boolean;
}

export function CoachPanel({ msgs, busy, accuracy, notes, showSide, onToggle, enabled }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [legend, setLegend] = useState(false);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs.length, busy]);
  const counts = [0, 0, 0, 0, 0, 0];
  notes.forEach(n => counts[n.q]++);
  return (
    <div className="coach">
      <div className="coach-h">
        <span className="coach-av" aria-hidden="true">{'♞︎'}</span>
        <div className="coach-title"><strong>Entrenador</strong><span className="muted small">{enabled ? (accuracy !== null ? `Precisión ${accuracy}%` : 'Califico cada jugada tuya') : 'Apagado'}</span></div>
        <button className="link" onClick={() => setLegend(l => !l)}>{legend ? 'Cerrar' : 'Niveles'}</button>
        {onToggle && <button className="link" onClick={onToggle}>{enabled ? 'Ocultar' : 'Activar'}</button>}
      </div>
      {legend && (
        <ul className="coach-legend">
          {QUALITY.map((q, i) => <li key={i}><QualityBadge q={i} /> {q.desc}</li>)}
        </ul>
      )}
      {enabled && notes.length > 0 && (
        <div className="coach-counts">{QUALITY.map((q, i) => <span key={i} className={`qcount ${q.cls}`} title={q.label}>{q.short} {counts[i]}</span>)}</div>
      )}
      {enabled && (
        <div className="coach-chat" ref={ref}>
          {!msgs.length && !busy && <div className="cbubble info">Haz tu jugada y te digo qué tan buena fue, por qué, y en qué fijarte.</div>}
          {msgs.map(m => m.kind === 'move'
            ? <MoveBubble key={'m' + m.ply} n={m.note} sideLabel={showSide ? (m.note.side === 'w' ? 'Blancas' : 'Negras') : undefined} />
            : <div key={'o' + m.ply} className={`cbubble info${m.note.slip ? ' slip' : ''}`}><p><strong>Rival · {moveNo(m.ply)} <FigSan san={m.note.san} /></strong></p>{m.note.lines.map((l, i) => <p key={i}>{l}</p>)}</div>)}
          {busy && <div className="cbubble info typing">Analizando tu jugada…</div>}
        </div>
      )}
    </div>
  );
}

/**
 * Comentario de la última jugada, justo debajo de tu reloj: se lee sin bajar la pantalla.
 * Arriba, tu última jugada (calificación, el porqué y la mejor si te equivocaste); abajo, qué hizo el rival después.
 */
export function CoachStrip({ mine, opp, busy, showBest, onShowBest, voiceOn, onVoice, voiceAvailable }: {
  mine: CoachNote | null;
  opp: OpponentNote | null;
  busy: boolean;
  showBest: boolean;
  onShowBest: () => void;
  voiceOn: boolean;
  onVoice: () => void;
  voiceAvailable: boolean;
}) {
  const reason = mine ? (mine.why.find(w => !/^Según el análisis/.test(w)) ?? mine.why[0]) : '';
  const canBest = !!mine && mine.q >= 2 && !!mine.best;
  return (
    <div className={`coach-strip${mine ? ' ' + QUALITY[mine.q].cls : ''}`} aria-live="polite">
      <span className="coach-av sm" aria-hidden="true">{'♞︎'}</span>
      <div className="cs-body">
        {mine ? (
          <>
            <p className="cs-head"><QualityBadge q={mine.q} /> <strong><FigSan san={mine.san} /></strong></p>
            <p className="cs-text">{mine.opening ? `${mine.opening} ` : ''}{reason}{mine.q >= 2 && mine.best ? <> Mejor era <strong><FigSan san={mine.best} /></strong>.</> : null}</p>
          </>
        ) : (
          <p className="cs-text">{busy ? 'Mirando tu jugada…' : 'Haz tu jugada: te digo qué tan buena fue y por qué.'}</p>
        )}
        {opp && <p className={`cs-opp${opp.slip ? ' slip' : ''}`}><span>Rival <FigSan san={opp.san} />:</span> {opp.lines.join(' ')}</p>}
      </div>
      <div className="cs-acts">
        {canBest && <button className="link" onClick={onShowBest}>{showBest ? 'Ocultar' : 'Ver mejor'}</button>}
        {voiceAvailable && (
          <button className="icon-btn sm" onClick={onVoice} aria-pressed={voiceOn} aria-label={voiceOn ? 'Silenciar la voz' : 'Activar la voz'} title={voiceOn ? 'Voz activada' : 'Voz apagada'}>
            <Icon name={voiceOn ? 'sound' : 'mute'} size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
