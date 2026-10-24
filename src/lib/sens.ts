/**
 * Převod citlivosti myši mezi hrami. Každá hra otočí kameru o `yaw` stupňů
 * na jeden pohyb myši (count) při citlivosti 1. Převod drží stejnou
 * vzdálenost na otočku o 360°, tedy jen citlivost od boku (ne zaměřování).
 */

export type SensGameId = 'cs2' | 'val' | 'ow' | 'apex' | 'cod' | 'r6' | 'fn';

export interface SensGame {
  id: SensGameId;
  name: string;
  yaw: number;
  /** Kolik desetinných míst hra v nastavení přijme. */
  decimals: number;
  unit?: string;
  note?: string;
}

export const SENS_GAMES: Record<SensGameId, SensGame> = {
  cs2: { id: 'cs2', name: 'CS2', yaw: 0.022, decimals: 3 },
  val: { id: 'val', name: 'Valorant', yaw: 0.07, decimals: 3 },
  ow: { id: 'ow', name: 'Overwatch 2', yaw: 0.0066, decimals: 2 },
  apex: { id: 'apex', name: 'Apex Legends', yaw: 0.022, decimals: 2 },
  cod: { id: 'cod', name: 'Call of Duty', yaw: 0.0066, decimals: 2, note: 'MW, Warzone a novější, citlivost Legacy' },
  r6: {
    id: 'r6',
    name: 'Rainbow Six Siege',
    yaw: 0.00572957795,
    decimals: 0,
    note: 'Při výchozím MouseSensitivityMultiplierUnit 0,02. Hra bere jen celá čísla.',
  },
  fn: { id: 'fn', name: 'Fortnite', yaw: 0.005555, decimals: 1, unit: '%', note: 'Citlivost X a Y' },
};

export const SENS_ORDER: SensGameId[] = ['cs2', 'val', 'ow', 'apex', 'cod', 'r6', 'fn'];

const CM_PER_INCH = 2.54;

/** Vzdálenost v cm, o kterou je potřeba posunout myš na otočku o 360°. */
export function cmPer360(game: SensGame, sens: number, dpi: number): number {
  if (sens <= 0 || dpi <= 0) return 0;
  return (360 / (game.yaw * sens * dpi)) * CM_PER_INCH;
}

/** Citlivost v cílové hře se stejnou vzdáleností na 360°, volitelně i pro jiné DPI. */
export function convertSens(sens: number, from: SensGame, to: SensGame, fromDpi: number, toDpi = fromDpi): number {
  if (toDpi <= 0) return 0;
  return (sens * from.yaw * fromDpi) / (to.yaw * toDpi);
}
