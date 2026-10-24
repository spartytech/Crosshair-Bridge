import { SENS_ORDER, type SensGameId } from './lib/sens';

export interface SensState {
  from: SensGameId;
  sens: number;
  dpi: number;
  /** Převádět i na jiné DPI (např. při výměně myši). */
  changeDpi: boolean;
  toDpi: number;
}

export const SENS_STORAGE_KEY = 'crosshair-bridge-sens-v1';

export const SENS_LIMITS = {
  sens: { min: 0.001, max: 1000 },
  dpi: { min: 50, max: 32000 },
};

export function initialSensState(): SensState {
  return { from: 'cs2', sens: 1.5, dpi: 800, changeDpi: false, toDpi: 1600 };
}

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null;
const inRange = (x: unknown, { min, max }: { min: number; max: number }): x is number =>
  typeof x === 'number' && x >= min && x <= max;

/** Sloučí uložený stav s výchozím, neplatné hodnoty zahodí. */
export function reviveSensState(stored: unknown): SensState {
  const base = initialSensState();
  if (!isObject(stored)) return base;
  const s = stored;
  if (typeof s.from === 'string' && (SENS_ORDER as string[]).includes(s.from)) base.from = s.from as SensGameId;
  if (inRange(s.sens, SENS_LIMITS.sens)) base.sens = s.sens;
  if (inRange(s.dpi, SENS_LIMITS.dpi)) base.dpi = s.dpi;
  if (typeof s.changeDpi === 'boolean') base.changeDpi = s.changeDpi;
  if (inRange(s.toDpi, SENS_LIMITS.dpi)) base.toDpi = s.toDpi;
  return base;
}
