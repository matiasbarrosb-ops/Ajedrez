/* localStorage con manejo de errores (modo privado, almacenamiento bloqueado). */
export const local = {
  get<T>(key: string, fallback: T): T {
    try { const v = localStorage.getItem(key); return v == null ? fallback : (JSON.parse(v) as T); } catch { return fallback; }
  },
  set(key: string, value: unknown): void {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignorar */ }
  },
  remove(key: string): void {
    try { localStorage.removeItem(key); } catch { /* ignorar */ }
  }
};
