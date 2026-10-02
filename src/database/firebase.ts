/* Conexión con Firebase Realtime Database. Se carga solo si hay configuración. */
import type { Database, DatabaseReference } from 'firebase/database';
import { firebaseConfig } from './firebase-config.ts';

type DbApi = typeof import('firebase/database');
export interface Fb extends DbApi { db: Database; r: (path: string) => DatabaseReference }

let promise: Promise<Fb | null> | null = null;
let offset = 0;
export const serverNow = () => Date.now() + offset;
export const firebaseConfigured = () => !!firebaseConfig;

export function getFb(): Promise<Fb | null> {
  if (promise) return promise;
  promise = (async () => {
    if (!firebaseConfig) return null;
    try {
      const [{ initializeApp }, api] = await Promise.all([import('firebase/app'), import('firebase/database')]);
      const app = initializeApp(firebaseConfig);
      const db = api.getDatabase(app);
      const fb: Fb = { ...api, db, r: (path: string) => api.ref(db, path) };
      api.onValue(fb.r('.info/serverTimeOffset'), s => { offset = s.val() || 0; });
      return fb;
    } catch (e) {
      console.error('Firebase no cargó', e);
      return null;
    }
  })();
  return promise;
}
