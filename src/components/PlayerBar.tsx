import type { Color, Position } from '../engine/core.ts';
import { capturedBy } from '../chess/game.ts';
import { formatClock } from '../chess/clock.ts';
import { glyph } from './pieces.ts';

interface Props {
  color: Color;
  name: string;
  rating?: number | null;
  P: Position;
  /** ms restantes; null = sin reloj */
  clockMs?: number | null;
  active?: boolean;
  status?: 'online' | 'offline' | null;
  tag?: string;
}

export function PlayerBar({ color, name, rating, P, clockMs, active, status, tag }: Props) {
  const cap = capturedBy(P, color);
  return (
    <div className="pbar">
      <div className={`avatar ${color}${status ? ' ' + status : ''}`}>{glyph('K')}</div>
      <div className="pinfo">
        <div className="pname">{name}{rating ? <span className="prating"> {rating}</span> : null}</div>
        <div className="caps">
          {cap.pieces.map(glyph).join('')}
          {cap.advantage > 0 && <span className="adv">+{cap.advantage}</span>}
        </div>
      </div>
      {tag && <div className="tag">{tag}</div>}
      {clockMs != null && (
        <div className={`clock${active ? ' on' : ''}${clockMs < 20000 ? ' low' : ''}`}>{formatClock(clockMs)}</div>
      )}
    </div>
  );
}
