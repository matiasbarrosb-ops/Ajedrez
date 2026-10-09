/* Voz del entrenador: lee en español los comentarios usando la síntesis de voz del navegador (sin archivos ni internet). */
let voice: SpeechSynthesisVoice | null = null;
let ready = false;

function pickVoice() {
  if (typeof speechSynthesis === 'undefined') return;
  const vs = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().replace('_', '-').startsWith('es'));
  const pref = ['es-cl', 'es-419', 'es-us', 'es-mx', 'es-ar', 'es-es'];
  voice = vs.sort((a, b) => {
    const ia = pref.indexOf(a.lang.toLowerCase().replace('_', '-')), ib = pref.indexOf(b.lang.toLowerCase().replace('_', '-'));
    const ra = (ia < 0 ? 9 : ia) - (a.localService ? 0.5 : 0), rb = (ib < 0 ? 9 : ib) - (b.localService ? 0.5 : 0);
    return ra - rb;
  })[0] ?? null;
  ready = vs.length > 0;
}
if (typeof speechSynthesis !== 'undefined') {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export const voiceSupported = () => typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined';

/*
 * Los teléfonos no dejan sonar nada hasta que la persona toca la pantalla, y la voz llega más tarde
 * (cuando termina el análisis), fuera de ese toque. Por eso, en el primer toque se "despierta" la voz
 * con una frase vacía y se pide al iPhone que suene aunque el interruptor de silencio esté activado.
 */
let unlocked = false;
export function unlockAudio() {
  if (unlocked) return;
  unlocked = true;
  try {
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    if (nav.audioSession) nav.audioSession.type = 'playback';
  } catch { /* no disponible */ }
  if (voiceSupported()) {
    try {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      speechSynthesis.speak(u);
    } catch { /* sin voz */ }
  }
}
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', unlockAudio, { capture: true });
  document.addEventListener('keydown', unlockAudio, { capture: true });
}

/** Lee el texto en voz alta. Se encola detrás de lo que se está diciendo; si ya hay mucho pendiente, corta lo viejo. */
export function speak(text: string) {
  if (!voiceSupported() || !text) return;
  try {
    if (!ready) pickVoice();
    if (speechSynthesis.pending) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice?.lang ?? 'es-CL';
    if (voice) u.voice = voice;
    u.rate = 1.02;
    u.pitch = 1;
    u.volume = 1;
    speechSynthesis.speak(u);
    // Chrome a veces queda en pausa sin avisar
    if (speechSynthesis.paused) speechSynthesis.resume();
  } catch { /* sin voz disponible */ }
}

export function stopSpeaking() {
  if (voiceSupported()) try { speechSynthesis.cancel(); } catch { /* nada */ }
}
