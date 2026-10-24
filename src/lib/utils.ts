import type { OutlineMode, RGB } from './types';

/** Zaokrouhlení „half to even", stejně jako přepočet starých kódů v CS2. */
export function roundHalfEven(x: number): number {
  const f = Math.floor(x);
  const d = x - f;
  if (Math.abs(d - 0.5) < 1e-9) return f % 2 === 0 ? f : f + 1;
  return Math.round(x);
}

export function clamp(x: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, x));
}

export function hexToRgb(hex: string): RGB {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return [255, 255, 255];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
}

export function toOutlineMode(n: number): OutlineMode {
  if (n === 2) return 2;
  return n > 0 ? 1 : 0;
}

export function formatValue(x: number, step: number): string {
  return step < 1 ? Number(x).toFixed(2) : String(Math.round(x));
}
