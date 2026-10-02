/* Íconos de línea propios (SVG en línea, heredan el color del texto). */
export type IconName = 'home' | 'play' | 'learn' | 'train' | 'puzzle' | 'games' | 'profile' | 'sound' | 'mute' | 'undo' | 'flip' | 'flag' | 'hint' | 'draw' | 'back' | 'share' | 'copy' | 'lock' | 'check' | 'clock' | 'bolt' | 'fire' | 'robot' | 'users' | 'phone';

const P: Record<IconName, string> = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  play: 'M8 5l11 7-11 7z',
  learn: 'M3 7l9-4 9 4-9 4zM7 9v5c0 1.7 2.2 3 5 3s5-1.3 5-3V9M21 7v6',
  train: 'M6 4v16M18 4v16M3 8h6M15 8h6M3 16h6M15 16h6M9 12h6',
  puzzle: 'M10 3h4v3a2 2 0 1 0 4 0h3v5h-3a2 2 0 1 0 0 4h3v6h-6v-3a2 2 0 1 0-4 0v3H4v-6h3a2 2 0 1 0 0-4H4V6h6z',
  games: 'M4 5h16v14H4zM4 9h16M9 5v14',
  profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6',
  sound: 'M11 5L6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13',
  mute: 'M11 5L6 9H3v6h3l5 4zM16 9l5 6M21 9l-5 6',
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  flip: 'M7 3v14M3 7l4-4 4 4M17 21V7M21 17l-4 4-4-4',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  hint: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z',
  draw: 'M5 9h14M5 15h14',
  back: 'M15 18l-6-6 6-6',
  share: 'M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  check: 'M5 12l5 5 9-10',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  fire: 'M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 8 0 4 3 7 7 7z',
  robot: 'M5 9h14v10H5zM12 5v4M9 13h.01M15 13h.01M9 16h6M3 13v3M21 13v3',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-3.5 3-6 7-6s7 2.5 7 6M16 3.5a4 4 0 0 1 0 7M18 15c2.5.7 4 2.8 4 6',
  phone: 'M7 2h10v20H7zM11 18h2'
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name]} />
    </svg>
  );
}
