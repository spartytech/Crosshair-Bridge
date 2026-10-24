import type { CrosshairModel } from './types';

/** Obdélník [x0, y0, x1, y1] v celých pixelech. */
export type Rect = [number, number, number, number];

export interface RectGroup {
  a: number;
  rects: Rect[];
}

export interface Layout {
  /** Strana čtvercového obrázku v pixelech. */
  size: number;
  /** Střed obrázku (celé číslo nebo .5 podle parity tloušťky). */
  c: number;
  groups: RectGroup[];
}

/**
 * Spočítá rozložení crosshairu do pixelů. Lichá tloušťka → lichá velikost obrázku,
 * takže střed padne doprostřed pixelu a čáry zůstanou ostré.
 */
export function layoutCrosshair(m: CrosshairModel): Layout {
  const ow = m.outline.mode ? m.outline.w : 0;
  let extent = 1;
  for (const s of m.sets) extent = Math.max(extent, s.T / 2 + Math.max(0, s.g) + Math.max(s.L, s.Lv), s.T / 2);
  if (m.dot) extent = Math.max(extent, m.dot.S / 2);
  if (m.circle) extent = Math.max(extent, m.circle.R + m.circle.T / 2 + 1);
  extent += ow + 1;

  const ref = m.sets[0] ? m.sets[0].T : m.dot ? m.dot.S : 1;
  const odd = ref % 2 === 1;
  const size = Math.max(3, 2 * Math.ceil(extent) + (odd ? 1 : 0));
  const c = size / 2;
  const snap = (r: Rect): Rect => r.map(Math.round) as Rect;

  const groups: RectGroup[] = [];
  for (const s of m.sets) {
    const hb = s.T / 2;
    const start = hb + s.g;
    const rects: Rect[] = [];
    if (s.L > 0) {
      rects.push([c + start, c - hb, c + start + s.L, c + hb]);
      rects.push([c - start - s.L, c - hb, c - start, c + hb]);
    }
    if (s.Lv > 0) {
      rects.push([c - hb, c + start, c + hb, c + start + s.Lv]);
      if (!m.tStyle) rects.push([c - hb, c - start - s.Lv, c + hb, c - start]);
    }
    groups.push({ a: s.a, rects: rects.map(snap) });
  }
  if (m.dot) {
    const h = m.dot.S / 2;
    groups.push({ a: m.dot.a, rects: [snap([c - h, c - h, c + h, c + h])] });
  }
  return { size, c, groups };
}
