import { parseCS2 } from '../lib/cs2Code';
import {
  CS2_DEFAULTS,
  CS2_SAMPLE_CODE,
  CUSTOM_DEFAULTS,
  OW_DEFAULTS,
  VAL_DEFAULTS,
  VAL_SAMPLE_CODE,
} from '../lib/defaults';
import { customModel, cs2Model, owModel, valModel } from '../lib/models';
import type { CS2Values, CustomValues, GameId, OWValues, ValValues, Values } from '../lib/types';
import { parseValorant } from '../lib/valorantCode';
import { defineGame, type GameDef } from './types';

const OUTLINE_OPTIONS = [
  [0, 'Vypnutý'],
  [1, 'Celý'],
  [2, 'Poloviční (nahoře a vlevo)'],
] as const;

const cs2 = defineGame<CS2Values>({
  id: 'cs2',
  name: 'CS2',
  sub: 'kód',
  title: 'Counter-Strike 2',
  defaults: CS2_DEFAULTS,
  toModel: cs2Model,
  code: {
    label: 'Kód crosshairu z CS2',
    placeholder: 'CS… (46 znaků) nebo CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx',
    hint: 'V CS2: Nastavení → Hra → Crosshair → Sdílet nebo importovat → Kopírovat.',
    sample: CS2_SAMPLE_CODE,
    parse: parseCS2,
  },
  fields: [
    { type: 'heading', label: 'Čáry (hodnoty v pixelech)' },
    { type: 'range', key: 'thickness', label: 'Tloušťka', min: 0, max: 20, step: 1, unit: 'px' },
    { type: 'range', key: 'length', label: 'Délka', min: 0, max: 60, step: 1, unit: 'px' },
    { type: 'range', key: 'gap', label: 'Mezera od středu', min: -10, max: 40, step: 1, unit: 'px' },
    { type: 'range', key: 'screenHeight', label: 'Navrženo pro výšku obrazovky', min: 480, max: 2160, step: 1, unit: 'px' },
    { type: 'toggle', key: 'tStyle', label: 'T-styl (bez horní čáry)' },
    { type: 'toggle', key: 'dot', label: 'Středová tečka' },
    { type: 'heading', label: 'Barva' },
    { type: 'color', key: 'color', label: 'Barva crosshairu' },
    { type: 'range', key: 'alpha', label: 'Krytí', min: 0, max: 255, step: 1 },
    { type: 'heading', label: 'Obrys' },
    { type: 'select', key: 'outlineMode', label: 'Obrys', options: OUTLINE_OPTIONS },
    { type: 'range', key: 'outlineWidth', label: 'Tloušťka obrysu', min: 1, max: 4, step: 1, unit: 'px', when: (v) => v.outlineMode > 0 },
    { type: 'color', key: 'outlineColor', label: 'Barva obrysu', when: (v) => v.outlineMode > 0 },
    { type: 'range', key: 'outlineAlpha', label: 'Krytí obrysu', min: 0, max: 255, step: 1, when: (v) => v.outlineMode > 0 },
  ],
});

const val = defineGame<ValValues>({
  id: 'val',
  name: 'Valorant',
  sub: 'kód',
  title: 'Valorant',
  defaults: VAL_DEFAULTS,
  toModel: valModel,
  code: {
    label: 'Kód profilu z Valorantu',
    placeholder: VAL_SAMPLE_CODE,
    hint: 'Ve Valorantu: Nastavení → Crosshair → ikona exportu u profilu.',
    sample: VAL_SAMPLE_CODE,
    parse: parseValorant,
  },
  fields: [
    { type: 'heading', label: 'Barva a obrys' },
    {
      type: 'select',
      key: 'c',
      label: 'Barva',
      options: [
        [0, 'Bílá'],
        [1, 'Zelená'],
        [2, 'Žlutozelená'],
        [3, 'Zelenožlutá'],
        [4, 'Žlutá'],
        [5, 'Azurová'],
        [6, 'Růžová'],
        [7, 'Červená'],
        [8, 'Vlastní'],
      ],
    },
    { type: 'color', key: 'u', label: 'Vlastní barva', when: (v) => v.c === 8 },
    { type: 'toggle', key: 'h', label: 'Obrysy' },
    { type: 'range', key: 't', label: 'Tloušťka obrysu', min: 1, max: 6, step: 1, unit: 'px', when: (v) => !!v.h },
    { type: 'range', key: 'o', label: 'Krytí obrysu', min: 0, max: 1, step: 0.05, when: (v) => !!v.h },
    { type: 'toggle', key: 'd', label: 'Středová tečka' },
    { type: 'range', key: 'z', label: 'Velikost tečky', min: 1, max: 6, step: 1, unit: 'px', when: (v) => !!v.d },
    { type: 'range', key: 'a', label: 'Krytí tečky', min: 0, max: 1, step: 0.05, when: (v) => !!v.d },
    { type: 'heading', label: 'Vnitřní čáry' },
    { type: 'toggle', key: '0b', label: 'Zobrazit vnitřní čáry' },
    { type: 'range', key: '0a', label: 'Krytí', min: 0, max: 1, step: 0.05, when: (v) => !!v['0b'] },
    { type: 'range', key: '0l', label: 'Délka', min: 0, max: 20, step: 1, unit: 'px', when: (v) => !!v['0b'] },
    { type: 'toggle', key: '0g', label: 'Jiná délka svislých čar', when: (v) => !!v['0b'] },
    { type: 'range', key: '0v', label: 'Délka svislých', min: 0, max: 20, step: 1, unit: 'px', when: (v) => !!v['0b'] && !!v['0g'] },
    { type: 'range', key: '0t', label: 'Tloušťka', min: 0, max: 10, step: 1, unit: 'px', when: (v) => !!v['0b'] },
    { type: 'range', key: '0o', label: 'Odsazení od středu', min: 0, max: 20, step: 1, unit: 'px', when: (v) => !!v['0b'] },
    { type: 'heading', label: 'Vnější čáry' },
    { type: 'toggle', key: '1b', label: 'Zobrazit vnější čáry' },
    { type: 'range', key: '1a', label: 'Krytí', min: 0, max: 1, step: 0.05, when: (v) => !!v['1b'] },
    { type: 'range', key: '1l', label: 'Délka', min: 0, max: 20, step: 1, unit: 'px', when: (v) => !!v['1b'] },
    { type: 'toggle', key: '1g', label: 'Jiná délka svislých čar', when: (v) => !!v['1b'] },
    { type: 'range', key: '1v', label: 'Délka svislých', min: 0, max: 20, step: 1, unit: 'px', when: (v) => !!v['1b'] && !!v['1g'] },
    { type: 'range', key: '1t', label: 'Tloušťka', min: 0, max: 10, step: 1, unit: 'px', when: (v) => !!v['1b'] },
    { type: 'range', key: '1o', label: 'Odsazení od středu', min: 0, max: 40, step: 1, unit: 'px', when: (v) => !!v['1b'] },
    { type: 'heading', label: 'Měřítko' },
    { type: 'toggle', key: 'scale', label: 'Přepočítat z 1080p na moje rozlišení' },
  ],
});

const ow = defineGame<OWValues>({
  id: 'ow',
  name: 'Overwatch 2',
  sub: 'ručně',
  title: 'Overwatch 2',
  defaults: OW_DEFAULTS,
  toModel: owModel,
  noCode: 'Overwatch 2 nemá sdílecí kód. Otevři ve hře Možnosti → Ovládání → Zaměřovač a hodnoty opiš níže.',
  fields: [
    { type: 'heading', label: 'Typ a barva' },
    {
      type: 'select',
      key: 'type',
      label: 'Typ',
      options: [
        ['cross', 'Zaměřovač (kříž)'],
        ['circle', 'Kruh'],
        ['both', 'Kruh a kříž'],
        ['dot', 'Tečka'],
      ],
    },
    { type: 'color', key: 'color', label: 'Barva' },
    { type: 'range', key: 'opacity', label: 'Krytí', min: 0, max: 100, step: 1, unit: '%' },
    { type: 'range', key: 'outline', label: 'Krytí obrysu', min: 0, max: 100, step: 1, unit: '%' },
    { type: 'heading', label: 'Rozměry' },
    { type: 'range', key: 'thickness', label: 'Tloušťka', min: 1, max: 15, step: 1, unit: 'px' },
    { type: 'range', key: 'length', label: 'Délka zaměřovače', min: 0, max: 100, step: 1, unit: 'px', when: (v) => v.type === 'cross' || v.type === 'both' },
    { type: 'range', key: 'gap', label: 'Středová mezera (u kruhu poloměr)', min: 0, max: 100, step: 1, unit: 'px', when: (v) => v.type !== 'dot' },
    { type: 'range', key: 'dotSize', label: 'Velikost tečky', min: 0, max: 30, step: 1, unit: 'px' },
    { type: 'range', key: 'dotOpacity', label: 'Krytí tečky', min: 0, max: 100, step: 1, unit: '%', when: (v) => v.dotSize > 0 },
    { type: 'heading', label: 'Měřítko' },
    { type: 'toggle', key: 'scale', label: 'Škálovat s rozlišením (jako ve hře)' },
  ],
});

const custom = defineGame<CustomValues>({
  id: 'custom',
  name: 'Vlastní',
  sub: 'pixely',
  title: 'Vlastní crosshair',
  defaults: CUSTOM_DEFAULTS,
  toModel: (v) => customModel(v),
  noCode:
    'Pro hry bez kódu (Apex, Fortnite, CoD, R6, PUBG…) nebo pro doladění. Všechny hodnoty jsou přímo pixely v cílovém rozlišení.',
  fields: [
    { type: 'heading', label: 'Hlavní čáry' },
    { type: 'color', key: 'color', label: 'Barva' },
    { type: 'range', key: 'alpha', label: 'Krytí', min: 0, max: 100, step: 1, unit: '%' },
    { type: 'range', key: 'thickness', label: 'Tloušťka', min: 0, max: 20, step: 1, unit: 'px' },
    { type: 'range', key: 'length', label: 'Délka', min: 0, max: 60, step: 1, unit: 'px' },
    { type: 'range', key: 'gap', label: 'Mezera', min: -10, max: 40, step: 1, unit: 'px' },
    { type: 'toggle', key: 'tStyle', label: 'T-styl (bez horní čáry)' },
    { type: 'heading', label: 'Tečka a obrys' },
    { type: 'toggle', key: 'dot', label: 'Středová tečka' },
    { type: 'range', key: 'dotSize', label: 'Velikost tečky', min: 1, max: 12, step: 1, unit: 'px', when: (v) => !!v.dot },
    { type: 'range', key: 'dotAlpha', label: 'Krytí tečky', min: 0, max: 100, step: 1, unit: '%', when: (v) => !!v.dot },
    { type: 'select', key: 'outlineMode', label: 'Obrys', options: OUTLINE_OPTIONS },
    { type: 'range', key: 'outlineWidth', label: 'Tloušťka obrysu', min: 1, max: 4, step: 1, unit: 'px', when: (v) => v.outlineMode > 0 },
    { type: 'color', key: 'outlineColor', label: 'Barva obrysu', when: (v) => v.outlineMode > 0 },
    { type: 'range', key: 'outlineAlpha', label: 'Krytí obrysu', min: 0, max: 100, step: 1, unit: '%', when: (v) => v.outlineMode > 0 },
    { type: 'heading', label: 'Doplňky' },
    { type: 'toggle', key: 'outer', label: 'Vnější čáry' },
    { type: 'range', key: 'oThickness', label: 'Tloušťka vnějších', min: 1, max: 20, step: 1, unit: 'px', when: (v) => !!v.outer },
    { type: 'range', key: 'oLength', label: 'Délka vnějších', min: 1, max: 40, step: 1, unit: 'px', when: (v) => !!v.outer },
    { type: 'range', key: 'oGap', label: 'Mezera vnějších', min: 0, max: 60, step: 1, unit: 'px', when: (v) => !!v.outer },
    { type: 'range', key: 'oAlpha', label: 'Krytí vnějších', min: 0, max: 100, step: 1, unit: '%', when: (v) => !!v.outer },
    { type: 'toggle', key: 'circle', label: 'Kruh' },
    { type: 'range', key: 'cRadius', label: 'Poloměr kruhu', min: 3, max: 80, step: 1, unit: 'px', when: (v) => !!v.circle },
    { type: 'range', key: 'cThickness', label: 'Tloušťka kruhu', min: 1, max: 6, step: 1, unit: 'px', when: (v) => !!v.circle },
  ],
});

export const GAMES: Record<GameId, GameDef<Values>> = { cs2, val, ow, custom };
export const GAME_ORDER: GameId[] = ['cs2', 'val', 'ow', 'custom'];

export const RESOLUTIONS: { W: number; H: number; note?: string }[] = [
  { W: 1920, H: 1080 },
  { W: 2560, H: 1440 },
  { W: 1280, H: 960, note: '4:3' },
  { W: 1440, H: 1080, note: '4:3' },
  { W: 1600, H: 900 },
  { W: 1280, H: 1024 },
  { W: 1680, H: 1050 },
  { W: 3840, H: 2160 },
];

export type BackgroundId = 'kovaak' | 'aimlab' | 'sky' | 'wall';
export const BACKGROUNDS: [BackgroundId, string][] = [
  ['kovaak', "Kovaak's"],
  ['aimlab', 'Aim Lab'],
  ['sky', 'Venku'],
  ['wall', 'Světlá zeď'],
];

export const ZOOMS: [number, string][] = [
  [1, 'Skutečná velikost'],
  [4, '4×'],
  [10, '10×'],
];
