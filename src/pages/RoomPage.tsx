/* Sala online: espera al rival, partida en vivo, tablas, revancha y marcador. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Color, Move } from '../engine/core.ts';
import { ChessGame, REASON_TEXT } from '../chess/game.ts';
import { parseCode, START_FEN } from '../chess/notation.ts';
import { GameView, ResultOverlay, type Control, type PlayerInfo } from '../components/GameView.tsx';
import { Icon } from '../components/Icon.tsx';
import { toast } from '../components/Toast.tsx';
import { moveSound } from '../hooks/useLocalGame.ts';
import { sfx } from '../lib/sound.ts';
import { useStore } from '../database/store.ts';
import { sessionStore, type User } from '../database/session.ts';
import {
  askRematch, cleanCode, colorOfUser, deleteRoom, finishRoom, joinRoom, makeRematch, offerDraw, recordRoomResult,
  roomClock, roomLink, roomMoves, sendMove, setPresence, watchRecord, watchRoom, type RecordEntry, type Room
} from '../database/online.ts';
import { serverNow } from '../database/firebase.ts';

const EMPTY: Move[] = [];

export function RoomPage() {
  const { code: raw = '' } = useParams();
  const code = cleanCode(raw);
  const { user } = useStore(sessionStore);
  if (!user) return <Navigate to={`/entrar?volver=/sala/${code}`} replace />;
  return <RoomView key={code} code={code} user={user} />;
}

function RoomView({ code, user }: { code: string; user: User }) {
  const nav = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tally, setTally] = useState<RecordEntry | null>(null);
  const [overSeen, setOverSeen] = useState(false);
  const [flip, setFlip] = useState(false);
  const [armedResign, setArmedResign] = useState(0);
  const [, setTick] = useState(0);
  const gameRef = useRef(new ChessGame(START_FEN));
  const lastAnim = useRef(0);
  const timeoutClaim = useRef(0);
  const game = gameRef.current;
  const myColor: Color | null = room ? colorOfUser(room, user.uid) : null;

  // entrar a la sala y escuchar cambios
  useEffect(() => {
    let unsub = () => {}, alive = true;
    (async () => {
      try {
        const outcome = await joinRoom(user, code);
        if (!alive) return;
        if (outcome === 'none') { setError(`No existe la sala ${code}.`); return; }
        if (outcome === 'full') { setError('Esa sala ya tiene dos jugadores.'); return; }
        unsub = await watchRoom(code, r => {
          if (!r) { setError('La sala se cerró.'); return; }
          setRoom(r);
        });
      } catch { setError('No se pudo conectar con la sala. Revisa tu internet.'); }
    })();
    return () => { alive = false; unsub(); };
  }, [code, user]);

  // presencia (punto verde) mientras estoy en la sala
  useEffect(() => {
    if (!myColor) return;
    let off = () => {};
    setPresence(code, myColor).then(f => { off = f; }).catch(() => {});
    return () => off();
  }, [code, myColor]);

  // marcador contra este rival
  const oppUid = room && myColor ? room.players[myColor === 'w' ? 'b' : 'w']?.uid : undefined;
  useEffect(() => {
    if (!oppUid) return;
    let off = () => {};
    watchRecord(user.uid, oppUid, setTally).then(f => { off = f; });
    return () => off();
  }, [oppUid, user.uid]);

  // sincronizar el tablero con las jugadas de la sala
  useEffect(() => {
    if (!room) return;
    if (room.next && room.next !== code) { toast('¡Revancha! Colores cambiados.'); nav(`/sala/${room.next}`, { replace: true }); return; }
    const list = roomMoves(room), mine = game.codes;
    const same = list.length === mine.length && list.every((c, i) => c === mine[i]);
    if (!same) {
      if (list.length === mine.length + 1 && mine.every((c, i) => c === list[i])) {
        const e = game.playRef(parseCode(list[list.length - 1]));
        if (e) { moveSound(e.m, e.san, room.status === 'over'); lastAnim.current = game.hist.length; }
      } else {
        const g2 = new ChessGame(START_FEN, list);
        gameRef.current.P = g2.P; gameRef.current.hist = g2.hist; gameRef.current.keys = g2.keys; gameRef.current.legal = g2.legal;
      }
      setVersion(v => v + 1);
    }
    if (room.status === 'over') {
      if (!room.recorded) void recordRoomResult(code, room);
      if (room.rematch?.w && room.rematch?.b && !room.next) void makeRematch(code, room, user);
    }
  }, [room]); // eslint-disable-line react-hooks/exhaustive-deps

  // al terminar, mostrar el resultado una vez
  const over = room?.status === 'over';
  useEffect(() => { if (over) { setOverSeen(false); } }, [over]);

  // reloj y reclamo por tiempo
  useEffect(() => {
    const h = setInterval(() => {
      if (!room || room.status !== 'playing' || !room.clock) return;
      const n = roomMoves(room).length, turn: Color = n % 2 ? 'b' : 'w';
      const left = roomClock(room, turn) ?? 1;
      if (n >= 1 && left <= 0 && Date.now() - timeoutClaim.current > 2000) {
        timeoutClaim.current = Date.now();
        void finishRoom(code, { w: turn === 'w' ? 'b' : 'w', r: 'tiempo' }, cur => {
          const nn = roomMoves(cur).length;
          return nn === n && !!cur.clock && cur.clock[turn] - (serverNow() - cur.clock.at) <= 0;
        });
      }
      setTick(t => t + 1);
    }, 200);
    return () => clearInterval(h);
  }, [room, code]);

  const myTurn = !!room && room.status === 'playing' && game.turn === myColor;
  const legalMoves = useMemo(() => (myTurn ? game.legal : EMPTY), [myTurn, version]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return (
    <div className="page narrow"><div className="card-lg"><h1>Sala {code}</h1><p className="muted">{error}</p><button className="primary" onClick={() => nav('/jugar')}>Volver a Jugar</button></div></div>
  );
  if (!room || !myColor) return <div className="page narrow"><div className="card-lg"><p className="muted">Conectando con la sala {code}…</p></div></div>;

  if (room.status === 'waiting') return <Lobby code={code} onCancel={async () => { if (room.host === user.uid) await deleteRoom(code).catch(() => {}); nav('/jugar'); }} />;

  const opp: Color = myColor === 'w' ? 'b' : 'w';
  const oppName = room.players[opp]?.name ?? 'Tu rival';
  const result = room.result ? { winner: room.result.w === 'd' ? null : room.result.w, reason: room.result.r } : null;

  const onMove = (m: Move) => {
    const n = game.hist.length;
    const e = game.play(m);
    const res = game.boardResult();
    moveSound(m, e.san, !!res);
    lastAnim.current = game.hist.length;
    setVersion(v => v + 1);
    sendMove(code, user, n, e.code, res ? { w: res.winner ?? 'd', r: res.reason } : null).then(ok => {
      if (!ok) { // la sala cambió antes: se rehace desde lo guardado
        const g2 = new ChessGame(START_FEN, roomMoves(room));
        Object.assign(gameRef.current, { P: g2.P, hist: g2.hist, keys: g2.keys, legal: g2.legal });
        setVersion(v => v + 1);
      }
    }).catch(() => toast('No se pudo enviar la jugada. Revisa tu internet.'));
  };

  const players = {
    [myColor]: { name: `${user.name} (tú)`, clockMs: roomClock(room, myColor) },
    [opp]: { name: oppName, clockMs: roomClock(room, opp), status: room.online?.[opp] ? 'online' : 'offline' }
  } as Record<Color, PlayerInfo>;

  const tallyLine = `Marcador vs ${oppName}: ${tally?.w ?? 0} ganadas · ${tally?.l ?? 0} perdidas · ${tally?.d ?? 0} tablas`;
  let status;
  if (result) status = <>{titleFor(result.winner, myColor)}<small>{REASON_TEXT[result.reason]}{game.hist.length < 2 ? ' · no cuenta para el marcador' : ''}</small></>;
  else status = <>{myTurn ? 'Tu turno' : `Turno de ${oppName}`}{game.inCheck ? ' · ¡Jaque!' : ''}<small>{tallyLine}</small></>;

  let banner = null;
  if (room.status === 'playing') {
    if (room.drawOffer === opp) banner = <><span className="grow">{oppName} ofrece tablas.</span><button className="btn hot" onClick={() => finishRoom(code, { w: 'd', r: 'acuerdo' }, c => c.drawOffer === opp)}>Aceptar</button><button className="btn" onClick={() => offerDraw(code, null)}>Rechazar</button></>;
    else if (room.drawOffer === myColor) banner = <span className="grow muted">Ofreciste tablas. Esperando respuesta…</span>;
    else if (!room.online?.[opp]) banner = <span className="grow muted">{oppName} está desconectado. Puede volver con el código {code}.</span>;
  } else if (room.status === 'over') {
    const rm = room.rematch ?? {};
    if (rm[opp] && !rm[myColor]) banner = <><span className="grow">{oppName} quiere la revancha.</span><button className="btn hot" onClick={() => askRematch(code, myColor)}>Aceptar</button></>;
    else if (rm[myColor] && !rm[opp]) banner = <span className="grow muted">Pediste la revancha. Esperando a {oppName}…</span>;
  }

  const resignArmed = Date.now() - armedResign < 3000;
  const asked = !!room.rematch?.[myColor];
  const controls: Control[] = room.status === 'playing'
    ? [
      { id: 'draw', icon: 'draw', label: room.drawOffer === opp ? 'Aceptar tablas' : 'Tablas', disabled: room.drawOffer === myColor, tone: room.drawOffer === opp ? 'hot' : undefined,
        onClick: () => { if (room.drawOffer === opp) void finishRoom(code, { w: 'd', r: 'acuerdo' }); else { void offerDraw(code, myColor); toast('Ofreciste tablas.'); } } },
      { id: 'flip', icon: 'flip', label: 'Girar', onClick: () => setFlip(f => !f) },
      { id: 'resign', icon: 'flag', label: resignArmed ? '¿Seguro?' : 'Rendirse', tone: resignArmed ? 'warn' : undefined,
        onClick: () => { if (resignArmed) { setArmedResign(0); void finishRoom(code, { w: opp, r: 'abandono' }); sfx('end'); } else setArmedResign(Date.now()); } }
    ]
    : [
      { id: 'rematch', icon: 'undo', label: asked ? 'Pedida' : 'Revancha', disabled: asked, tone: asked ? undefined : 'hot', onClick: () => askRematch(code, myColor) },
      { id: 'flip', icon: 'flip', label: 'Girar', onClick: () => setFlip(f => !f) }
    ];

  const orientation: Color = flip ? opp : myColor;
  return (
    <GameView P={game.P} orientation={orientation} players={players} legalMoves={legalMoves} onMove={onMove} hist={game.hist}
      status={status} banner={banner} controls={controls}
      overlay={result && !overSeen ? (
        <ResultOverlay title={titleFor(result.winner, myColor)} reason={REASON_TEXT[result.reason]} score={!result.winner ? '½ – ½' : result.winner === 'w' ? '1 – 0' : '0 – 1'}
          extra={<p className="tally">{tallyLine}</p>}
          primary={{ label: asked ? 'Revancha pedida' : 'Pedir revancha', disabled: asked, onClick: () => { void askRematch(code, myColor); setOverSeen(true); } }}
          onMenu={() => nav('/jugar')} onClose={() => setOverSeen(true)} />
      ) : null}
      footer={<button className="btn-ghost" onClick={() => nav('/jugar')}>Salir de la sala</button>}
    />
  );
}

function titleFor(w: Color | null, me: Color) { return !w ? 'Tablas' : w === me ? '¡Ganaste!' : 'Perdiste'; }

function Lobby({ code, onCancel }: { code: string; onCancel: () => void }) {
  const link = roomLink(code);
  const copy = async () => { try { await navigator.clipboard.writeText(link); toast('Enlace copiado'); } catch { toast('Selecciona y copia el enlace'); } };
  const share = async () => { try { await navigator.share({ title: 'Jaque Mate', text: `¡Juguemos ajedrez! Sala ${code}`, url: link }); } catch { /* cancelado */ } };
  return (
    <div className="page narrow">
      <div className="card-lg center">
        <p className="label">Sala creada</p>
        <div className="code">{code}</div>
        <p className="muted">Pásale este código a tu rival o mándale el enlace. La partida empieza sola cuando entre.</p>
        <div className="row2">
          {'share' in navigator && <button className="primary" onClick={share}><Icon name="share" /> Compartir</button>}
          <button className="secondary" onClick={copy}><Icon name="copy" /> Copiar enlace</button>
        </div>
        <input className="linkfield" readOnly value={link} aria-label="Enlace de la sala" onFocus={e => e.target.select()} />
        <div className="waiting"><span className="pulse" />Esperando rival…</div>
        <button className="link" onClick={onCancel}>Cancelar sala</button>
      </div>
    </div>
  );
}
