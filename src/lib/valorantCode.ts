import { VAL_DEFAULTS } from './defaults';
import { CodeError, type ParseResult, type ValValues } from './types';
import { clamp } from './utils';

type Section = 'G' | 'P' | 'A' | 'S';

const INT_KEYS = ['c', 'h', 't', 'd', 'z', '0b', '0t', '0l', '0g', '0v', '0o', '1b', '1t', '1l', '1g', '1v', '1o'] as const;
const FLOAT_KEYS = ['o', 'a', '0a', '1a'] as const;

/**
 * Kód profilu z Valorantu, např. `0;P;c;5;h;0;0l;4;0o;2;0a;1;0f;0;1b;0`.
 * Čte se primární crosshair (sekce P); chybějící klíče mají výchozí hodnotu hry.
 */
export function parseValorant(raw: string): ParseResult<ValValues> {
  const code = String(raw).trim();
  if (!/^\d+;/.test(code)) {
    throw new CodeError('Tohle nevypadá jako kód z Valorantu. Kód začíná číslem a středníkem, třeba 0;P;c;5;…');
  }

  const tokens = code.split(';').map((s) => s.trim());
  const sections: Record<Section, Record<string, string>> = { G: {}, P: {}, A: {}, S: {} };
  let current: Section = 'G';
  for (let i = 1; i < tokens.length; ) {
    const tok = tokens[i];
    if (tok === 'P' || tok === 'A' || tok === 'S') {
      current = tok;
      i++;
      continue;
    }
    if (tok === '') {
      i++;
      continue;
    }
    sections[current][tok] = tokens[i + 1] ?? '';
    i += 2;
  }

  const p = sections.P;
  const v: ValValues = { ...VAL_DEFAULTS };

  for (const k of INT_KEYS) {
    const n = parseFloat(p[k]);
    if (!Number.isNaN(n)) v[k] = Math.round(n);
  }
  for (const k of FLOAT_KEYS) {
    const n = parseFloat(p[k]);
    if (!Number.isNaN(n)) v[k] = n;
  }
  if (p.u && /^[0-9a-f]{6}/i.test(p.u)) v.u = '#' + p.u.slice(0, 6).toLowerCase();
  if (p['0g'] === undefined) v['0v'] = v['0l'];
  if (p['1g'] === undefined) v['1v'] = v['1l'];
  v.c = clamp(v.c, 0, 8);

  return {
    info: Object.keys(p).length
      ? 'Kód z Valorantu načten (primární crosshair)'
      : 'Kód neobsahuje vlastní nastavení, použity výchozí hodnoty Valorantu',
    values: v,
  };
}
