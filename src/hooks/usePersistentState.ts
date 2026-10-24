import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

/**
 * Stav uložený v localStorage. `revive` dostane cokoli, co je uložené
 * (i starou nebo poškozenou verzi), a vrátí platný stav.
 */
export function usePersistentState<T>(
  key: string,
  init: () => T,
  revive: (stored: unknown) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return revive(JSON.parse(raw));
    } catch {
      /* úložiště není dostupné nebo je poškozené – začneme znovu */
    }
    return init();
  });

  const latest = useRef(state);
  latest.current = state;

  // Ukládá s krátkým zpožděním (posuvníky mění stav mnohokrát za sekundu)
  // a před zavřením stránky uloží poslední stav hned.
  useEffect(() => {
    const save = () => {
      try {
        localStorage.setItem(key, JSON.stringify(latest.current));
      } catch {
        /* soukromé okno apod. – aplikace funguje i bez ukládání */
      }
    };
    const timer = window.setTimeout(save, 250);
    window.addEventListener('pagehide', save);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pagehide', save);
    };
  }, [key, state]);

  return [state, setState];
}
