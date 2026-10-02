/* Sesión del usuario, ajustes y respuestas de bienvenida. Se guardan en el teléfono. */
import { local } from '../lib/storage.ts';
import { setSoundEnabled } from '../lib/sound.ts';
import { createStore } from './store.ts';

export interface User { uid: string; name: string; pinHash: string }

export interface Settings {
  sound: boolean;
  evalBar: boolean;
  coach: boolean;
}

export interface Onboarding {
  done: boolean;
  experience?: 'nunca' | 'mover' | 'aveces' | 'seguido' | 'compito';
  goals?: string[];
}

export const sessionStore = createStore<{ user: User | null; firebase: 'cargando' | 'listo' | 'no-configurado' | 'error' }>({
  user: local.get<User | null>('jm-user', null),
  firebase: 'cargando'
});

export const settingsStore = createStore<Settings>({ sound: true, evalBar: true, coach: true, ...local.get<Partial<Settings>>('jm-settings', {}) });
settingsStore.subscribe(() => { local.set('jm-settings', settingsStore.get()); setSoundEnabled(settingsStore.get().sound); });
setSoundEnabled(settingsStore.get().sound);

export const onboardingStore = createStore<Onboarding>(local.get<Onboarding>('jm-onboarding', { done: false }));
onboardingStore.subscribe(() => local.set('jm-onboarding', onboardingStore.get()));

export function setUser(u: User | null) {
  if (u) local.set('jm-user', u); else local.remove('jm-user');
  sessionStore.set(s => ({ ...s, user: u }));
}
