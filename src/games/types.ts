import type { CrosshairModel, GameId, ParseResult, Values } from '../lib/types';

type Conditional<V> = {
  label: string;
  /** Pole je vidět jen tehdy, když vrátí true. */
  when?(v: V): boolean;
};

type KeyOf<V> = keyof V & string;

export type FieldDef<V> =
  | { type: 'heading'; label: string }
  | (Conditional<V> & { type: 'range'; key: KeyOf<V>; min: number; max: number; step: number; unit?: string })
  | (Conditional<V> & { type: 'toggle'; key: KeyOf<V> })
  | (Conditional<V> & { type: 'select'; key: KeyOf<V>; options: readonly (readonly [number | string, string])[] })
  | (Conditional<V> & { type: 'color'; key: KeyOf<V> });

export interface CodeSupport<V> {
  label: string;
  placeholder: string;
  hint: string;
  sample: string;
  parse(raw: string): ParseResult<V>;
}

export interface GameDef<V extends Values> {
  id: GameId;
  /** Krátký název na přepínači. */
  name: string;
  /** Podtitulek na přepínači (kód / ručně / pixely). */
  sub: string;
  /** Nadpis panelu s parametry. */
  title: string;
  defaults: V;
  fields: FieldDef<V>[];
  toModel(v: V, screenHeight: number): CrosshairModel;
  /** Hry se sdílecím kódem. */
  code?: CodeSupport<V>;
  /** Vysvětlení pro hry bez kódu. */
  noCode?: string;
}

/**
 * Hry mají každá vlastní typ hodnot; ve zbytku aplikace s nimi pracujeme
 * přes obecné `Values`, aby šlo přepínat hry bez rozvětvení typů.
 */
export function defineGame<V extends Values>(def: GameDef<V>): GameDef<Values> {
  return def as unknown as GameDef<Values>;
}
