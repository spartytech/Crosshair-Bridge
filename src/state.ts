import { BACKGROUNDS, GAMES, GAME_ORDER, RESOLUTIONS, ZOOMS, type BackgroundId } from './games';
import type { GameId, Values } from './lib/types';

export type HowToId = 'kovaak' | 'aimlab';
export interface CodeStatus {
  ok: boolean;
  msg: string;
}

export interface AppState {
  game: GameId;
  res: number;
  bg: BackgroundId;
  zoom: number;
  how: HowToId;
  vals: Record<GameId, Values>;
  codes: Partial<Record<GameId, string>>;
  info: Partial<Record<GameId, CodeStatus>>;
}

export const STORAGE_KEY = 'crosshair-bridge-v1';

/** Načte kód hry; vrací nové hodnoty a zprávu pro uživatele. */
export function applyCode(game: GameId, raw: string): { values?: Values; status: CodeStatus } {
  const def = GAMES[game];
  if (!def.code) return { status: { ok: false, msg: 'Tahle hra nemá sdílecí kód.' } };
  if (!raw.trim()) return { status: { ok: false, msg: 'Nejdřív vlož kód do pole.' } };
  try {
    const r = def.code.parse(raw);
    return { values: { ...def.defaults, ...r.values }, status: { ok: true, msg: r.info } };
  } catch (e) {
    return { status: { ok: false, msg: e instanceof Error ? e.message : 'Kód se nepodařilo přečíst.' } };
  }
}

export function initialState(): AppState {
  const vals = Object.fromEntries(GAME_ORDER.map((g) => [g, { ...GAMES[g].defaults }])) as Record<GameId, Values>;
  const state: AppState = { game: 'cs2', res: 0, bg: 'kovaak', zoom: 4, how: 'kovaak', vals, codes: {}, info: {} };
  for (const g of GAME_ORDER) {
    const sample = GAMES[g].code?.sample;
    if (!sample) continue;
    const r = applyCode(g, sample);
    state.codes[g] = sample;
    if (r.values) {
      state.vals[g] = r.values;
      state.info[g] = { ok: true, msg: 'Ukázkový kód · vlož svůj a klikni na Načíst' };
    }
  }
  return state;
}

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null;

/** Sloučí uložený stav s výchozím, takže nové parametry v dalších verzích nic nerozbijí. */
export function reviveState(stored: unknown): AppState {
  const base = initialState();
  if (!isObject(stored)) return base;
  const s = stored;
  if (typeof s.game === 'string' && (GAME_ORDER as string[]).includes(s.game)) base.game = s.game as GameId;
  if (typeof s.res === 'number' && RESOLUTIONS[s.res]) base.res = s.res;
  if (typeof s.bg === 'string' && BACKGROUNDS.some(([id]) => id === s.bg)) base.bg = s.bg as BackgroundId;
  if (typeof s.zoom === 'number' && ZOOMS.some(([z]) => z === s.zoom)) base.zoom = s.zoom;
  if (s.how === 'kovaak' || s.how === 'aimlab') base.how = s.how;
  for (const g of GAME_ORDER) {
    const v = isObject(s.vals) ? s.vals[g] : undefined;
    if (isObject(v)) base.vals[g] = { ...GAMES[g].defaults, ...(v as Values) };
    const c = isObject(s.codes) ? s.codes[g] : undefined;
    if (typeof c === 'string') base.codes[g] = c;
    const i = isObject(s.info) ? s.info[g] : undefined;
    if (isObject(i) && typeof i.ok === 'boolean' && typeof i.msg === 'string') base.info[g] = { ok: i.ok, msg: i.msg };
  }
  return base;
}
