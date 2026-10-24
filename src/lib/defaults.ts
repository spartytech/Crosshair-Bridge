import type { CS2Values, CustomValues, OWValues, RGB, ValValues } from './types';

export const CS2_DEFAULTS: CS2Values = {
  screenHeight: 1080,
  color: '#00ffff',
  alpha: 255,
  thickness: 2,
  length: 6,
  gap: 2,
  dot: 0,
  tStyle: 0,
  outlineMode: 1,
  outlineWidth: 1,
  outlineColor: '#000000',
  outlineAlpha: 255,
};

/** Výchozí hodnoty Valorantu – kód obsahuje jen to, co se od nich liší. */
export const VAL_DEFAULTS: ValValues = {
  c: 0,
  u: '#ffffff',
  h: 1,
  t: 1,
  o: 0.5,
  d: 0,
  z: 2,
  a: 1,
  '0b': 1,
  '0t': 2,
  '0l': 6,
  '0g': 0,
  '0v': 6,
  '0o': 3,
  '0a': 0.8,
  '1b': 1,
  '1t': 2,
  '1l': 2,
  '1g': 0,
  '1v': 2,
  '1o': 10,
  '1a': 0.35,
  scale: 0,
};

/** Barvy Valorantu podle indexu `c` (8 = vlastní barva z klíče `u`). */
export const VAL_COLORS: RGB[] = [
  [255, 255, 255],
  [0, 255, 0],
  [127, 255, 0],
  [223, 255, 0],
  [255, 255, 0],
  [0, 255, 255],
  [255, 0, 255],
  [255, 0, 0],
];

export const OW_DEFAULTS: OWValues = {
  type: 'cross',
  color: '#00ff99',
  thickness: 2,
  length: 6,
  gap: 4,
  opacity: 100,
  outline: 50,
  dotSize: 0,
  dotOpacity: 100,
  scale: 1,
};

export const CUSTOM_DEFAULTS: CustomValues = {
  color: '#ffffff',
  alpha: 100,
  thickness: 2,
  length: 5,
  gap: 2,
  tStyle: 0,
  dot: 0,
  dotSize: 2,
  dotAlpha: 100,
  outlineMode: 1,
  outlineWidth: 1,
  outlineColor: '#000000',
  outlineAlpha: 60,
  outer: 0,
  oThickness: 2,
  oLength: 3,
  oGap: 10,
  oAlpha: 50,
  circle: 0,
  cRadius: 14,
  cThickness: 1,
};

export const CS2_SAMPLE_CODE = 'CSBOp9bHebsSeuEGZdkmAoMSfAAScoDsNveuHmxqXvbUJe';
export const VAL_SAMPLE_CODE = '0;P;c;5;h;0;0l;4;0o;2;0a;1;0f;0;1b;0';
