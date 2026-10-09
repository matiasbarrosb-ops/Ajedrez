/* Voz del entrenador: lee en español los comentarios usando la síntesis de voz del navegador (sin archivos ni internet). */
let voice: SpeechSynthesisVoice | null = null;
let ready = false;

function pickVoice() {
  if (typeof speechSynthesis === 'undefined') return;
  const vs = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('es'));
  const pref = ['es-cl', 'es-419', 'es-us', 'es-mx', 'es-ar', 'es-es'];
  voice = vs.sort((a, b) => {
    const ia = pref.indexOf(a.lang.toLowerCase()), ib = pref.indexOf(b.lang.toLowerCase());
    const ra = (ia < 0 ? 9 : ia) - (a.localService ? 0.5 : 0), rb = (ib < 0 ? 9 : ib) - (b.localService ? 0.5 : 0);
    return ra - rb;
  })[0] ?? null;
  ready = true;
}
if (typeof speechSynthesis !== 'undefined') {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export const voiceSupported = () => typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined';

/** Lee el texto en voz alta. Se encola detrás de lo que se está diciendo; si ya hay mucho pendiente, corta lo viejo. */
export function speak(text: string) {
  if (!voiceSupported() || !text) return;
  try {
    if (!ready) pickVoice();
    if (speechSynthesis.pending) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice?.lang ?? 'es-ES';
    if (voice) u.voice = voice;
    u.rate = 1.05;
    u.pitch = 1;
    speechSynthesis.speak(u);
  } catch { /* sin voz disponible */ }
}

export function stopSpeaking() {
  if (voiceSupported()) try { speechSynthesis.cancel(); } catch { /* nada */ }
}
