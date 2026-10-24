/** Barva jako [r, g, b] v rozsahu 0–255. */
export type RGB = [number, number, number];

/** Jedna sada čtyř ramen (kříž). Všechny rozměry jsou v pixelech cílového rozlišení. */
export interface LineSet {
  /** Tloušťka ramene. */
  T: number;
  /** Délka vodorovných ramen. */
  L: number;
  /** Délka svislých ramen. */
  Lv: number;
  /** Mezera od okraje středového čtverce (může být záporná – kříž se uzavře). */
  g: number;
  /** Krytí 0–1. */
  a: number;
}

export interface Dot {
  S: number;
  a: number;
}

export interface Circle {
  R: number;
  T: number;
  a: number;
}

/** 0 = bez obrysu, 1 = celý obrys, 2 = poloviční (nahoře a vlevo, jako v CS2). */
export type OutlineMode = 0 | 1 | 2;

export interface Outline {
  mode: OutlineMode;
  w: number;
  rgb: RGB;
  a: number;
}

/** Herně nezávislý popis crosshairu v pixelech. Z něj se kreslí náhled i PNG. */
export interface CrosshairModel {
  rgb: RGB;
  tStyle: boolean;
  sets: LineSet[];
  dot: Dot | null;
  circle: Circle | null;
  outline: Outline;
}

export type GameId = 'cs2' | 'val' | 'ow' | 'custom';

/** Hodnoty parametrů jedné hry, jak je ukazuje formulář. */
export type Values = Record<string, number | string>;

export type CS2Values = {
  screenHeight: number;
  color: string;
  alpha: number;
  thickness: number;
  length: number;
  gap: number;
  dot: number;
  tStyle: number;
  outlineMode: number;
  outlineWidth: number;
  outlineColor: string;
  outlineAlpha: number;
};

export type ValValues = {
  c: number;
  u: string;
  h: number;
  t: number;
  o: number;
  d: number;
  z: number;
  a: number;
  '0b': number;
  '0t': number;
  '0l': number;
  '0g': number;
  '0v': number;
  '0o': number;
  '0a': number;
  '1b': number;
  '1t': number;
  '1l': number;
  '1g': number;
  '1v': number;
  '1o': number;
  '1a': number;
  scale: number;
};

export type OWType = 'cross' | 'circle' | 'both' | 'dot';

export type OWValues = {
  type: OWType;
  color: string;
  thickness: number;
  length: number;
  gap: number;
  opacity: number;
  outline: number;
  dotSize: number;
  dotOpacity: number;
  scale: number;
};

export type CustomValues = {
  color: string;
  alpha: number;
  thickness: number;
  length: number;
  gap: number;
  tStyle: number;
  dot: number;
  dotSize: number;
  dotAlpha: number;
  outlineMode: number;
  outlineWidth: number;
  outlineColor: string;
  outlineAlpha: number;
  outer: number;
  oThickness: number;
  oLength: number;
  oGap: number;
  oAlpha: number;
  circle: number;
  cRadius: number;
  cThickness: number;
};

export interface ParseResult<V> {
  /** Krátká zpráva pro uživatele, co se načetlo. */
  info: string;
  values: V;
}

/** Chyba s českou zprávou, kterou lze ukázat přímo uživateli. */
export class CodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CodeError';
  }
}
