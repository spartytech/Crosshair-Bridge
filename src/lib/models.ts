import { CUSTOM_DEFAULTS, VAL_COLORS } from './defaults';
import type { CS2Values, CrosshairModel, CustomValues, LineSet, OWValues, ValValues } from './types';
import { hexToRgb, rgbToHex, roundHalfEven, toOutlineMode } from './utils';

/** CS2: hodnoty jsou pixely pro `screenHeight`, přepočítají se na cílovou výšku. */
export function cs2Model(v: CS2Values, H: number): CrosshairModel {
  const f = H / (v.screenHeight || 1080);
  const r = (x: number) => roundHalfEven(x * f);
  const T = v.thickness > 0 ? Math.max(1, r(v.thickness)) : 0;
  const L = r(v.length);
  const g = r(v.gap);
  const a = v.alpha / 255;
  return {
    rgb: hexToRgb(v.color),
    tStyle: !!v.tStyle,
    sets: T > 0 && L > 0 ? [{ T, L, Lv: L, g, a }] : [],
    dot: v.dot ? { S: Math.max(1, T || r(1)), a } : null,
    circle: null,
    outline: {
      mode: toOutlineMode(v.outlineMode),
      w: Math.max(1, Math.round(v.outlineWidth)),
      rgb: hexToRgb(v.outlineColor),
      a: v.outlineAlpha / 255,
    },
  };
}

/** Valorant: odsazení se měří od středu, ne od okraje středového čtverce. */
export function valModel(v: ValValues, H: number): CrosshairModel {
  const f = v.scale ? H / 1080 : 1;
  const r = (x: number) => Math.max(0, Math.round(x * f));
  const sets: LineSet[] = [];
  for (const p of ['0', '1'] as const) {
    if (!v[`${p}b` as const]) continue;
    const T = r(v[`${p}t` as const]);
    const L = r(v[`${p}l` as const]);
    const Lv = v[`${p}g` as const] ? r(v[`${p}v` as const]) : L;
    if (T > 0 && (L > 0 || Lv > 0)) {
      sets.push({ T, L, Lv, g: r(v[`${p}o` as const]) - T / 2, a: v[`${p}a` as const] });
    }
  }
  return {
    rgb: v.c === 8 ? hexToRgb(v.u) : VAL_COLORS[v.c] ?? VAL_COLORS[0],
    tStyle: false,
    sets,
    dot: v.d ? { S: Math.max(1, r(v.z)), a: v.a } : null,
    circle: null,
    outline: { mode: v.h ? 1 : 0, w: Math.max(1, r(v.t)), rgb: [0, 0, 0], a: v.o },
  };
}

/** Overwatch 2: hodnoty jsou pixely pro 1080p, volitelně škálované jako ve hře. */
export function owModel(v: OWValues, H: number): CrosshairModel {
  const f = v.scale ? H / 1080 : 1;
  const r = (x: number) => Math.max(0, Math.round(x * f));
  const T = Math.max(1, r(v.thickness));
  const L = r(v.length);
  const g = r(v.gap);
  const a = v.opacity / 100;
  const cross = v.type === 'cross' || v.type === 'both';
  const circ = v.type === 'circle' || v.type === 'both';
  return {
    rgb: hexToRgb(v.color),
    tStyle: false,
    sets: cross && L > 0 ? [{ T, L, Lv: L, g: g - T / 2, a }] : [],
    dot: v.dotSize > 0 ? { S: Math.max(1, r(v.dotSize)), a: v.dotOpacity / 100 } : null,
    circle: circ ? { R: Math.max(2, g), T, a } : null,
    outline: { mode: v.outline > 0 ? 1 : 0, w: 1, rgb: [0, 0, 0], a: v.outline / 100 },
  };
}

/** Vlastní editor: hodnoty už jsou pixely v cílovém rozlišení. */
export function customModel(v: CustomValues): CrosshairModel {
  const sets: LineSet[] = [];
  if (v.thickness > 0 && v.length > 0) {
    sets.push({ T: v.thickness, L: v.length, Lv: v.length, g: v.gap, a: v.alpha / 100 });
  }
  if (v.outer && v.oThickness > 0 && v.oLength > 0) {
    sets.push({ T: v.oThickness, L: v.oLength, Lv: v.oLength, g: v.oGap, a: v.oAlpha / 100 });
  }
  return {
    rgb: hexToRgb(v.color),
    tStyle: !!v.tStyle,
    sets,
    dot: v.dot ? { S: Math.max(1, v.dotSize), a: v.dotAlpha / 100 } : null,
    circle: v.circle ? { R: v.cRadius, T: Math.max(1, v.cThickness), a: v.alpha / 100 } : null,
    outline: {
      mode: toOutlineMode(v.outlineMode),
      w: Math.max(1, v.outlineWidth),
      rgb: hexToRgb(v.outlineColor),
      a: v.outlineAlpha / 100,
    },
  };
}

/** Převede libovolný model zpět na hodnoty vlastního editoru (pro „Doladit v editoru Vlastní"). */
export function modelToCustom(m: CrosshairModel): CustomValues {
  const c: CustomValues = { ...CUSTOM_DEFAULTS };
  const [s0, s1] = m.sets;
  c.color = rgbToHex(...m.rgb);
  c.tStyle = m.tStyle ? 1 : 0;
  if (s0) {
    c.thickness = s0.T;
    c.length = Math.max(s0.L, s0.Lv);
    c.gap = Math.round(s0.g);
    c.alpha = Math.round(s0.a * 100);
  } else {
    c.thickness = 0;
  }
  if (s1) {
    c.outer = 1;
    c.oThickness = s1.T;
    c.oLength = Math.max(s1.L, s1.Lv);
    c.oGap = Math.max(0, Math.round(s1.g));
    c.oAlpha = Math.round(s1.a * 100);
  }
  c.dot = m.dot ? 1 : 0;
  if (m.dot) {
    c.dotSize = m.dot.S;
    c.dotAlpha = Math.round(m.dot.a * 100);
  }
  c.circle = m.circle ? 1 : 0;
  if (m.circle) {
    c.cRadius = m.circle.R;
    c.cThickness = m.circle.T;
  }
  c.outlineMode = m.outline.mode;
  c.outlineWidth = m.outline.w;
  c.outlineColor = rgbToHex(...m.outline.rgb);
  c.outlineAlpha = Math.round(m.outline.a * 100);
  return c;
}

export function isEmptyModel(m: CrosshairModel): boolean {
  return !m.sets.length && !m.dot && !m.circle;
}
