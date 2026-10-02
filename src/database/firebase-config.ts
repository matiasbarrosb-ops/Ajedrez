import type { FirebaseOptions } from 'firebase/app';

/**
 * Datos públicos del proyecto de Firebase (no son secretos: van dentro de la página).
 * La seguridad la ponen las reglas de la base de datos (database.rules.json).
 */
export const firebaseConfig: FirebaseOptions | null = {
  apiKey: 'AIzaSyBwwbMVjayXOm8zdMWWCIiOpGno4NxnUYc',
  authDomain: 'ajedrez-f4e68.firebaseapp.com',
  databaseURL: 'https://ajedrez-f4e68-default-rtdb.firebaseio.com',
  projectId: 'ajedrez-f4e68',
  storageBucket: 'ajedrez-f4e68.firebasestorage.app',
  messagingSenderId: '1079253075540',
  appId: '1:1079253075540:web:7a24425ba44a50f159cfc1',
  measurementId: 'G-51LFW3J77C'
};
