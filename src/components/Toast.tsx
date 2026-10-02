import { useEffect, useState } from 'react';
import { createStore, useStore } from '../database/store.ts';

const toastStore = createStore<{ msg: string; id: number } | null>(null);
export function toast(msg: string) { toastStore.set({ msg, id: Date.now() }); }

export function ToastHost() {
  const t = useStore(toastStore);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!t) return;
    setVisible(true);
    const h = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(h);
  }, [t]);
  return visible && t ? <div className="toast" role="status">{t.msg}</div> : null;
}
