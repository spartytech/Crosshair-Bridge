import { CS2_DEFAULTS } from './defaults';
import { CodeError, type CS2Values, type ParseResult } from './types';
import { rgbToHex, roundHalfEven, toOutlineMode } from './utils';

/**
 * Sdílecí kódy CS2.
 *
 * - Nový formát (od 30. 9. 2026): „CS" + 44 znaků, 32 bajtů, verze 1, hodnoty v pixelech.
 * - Přechodné kódy z konce září 2026: „CSGO-…", verze 3 a 4, pixely + výška obrazovky.
 * - Staré kódy CS:GO/CS2: „CSGO-…", verze 1, škála závislá na výšce obrazovky (1/480).
 *
 * Rozložení bajtů podle akiver/csgo-sharecode (doc/code_layout.md).
 */
export const CS_ALPHABET = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789';

const OLD_CS_COLORS: [number, number, number][] = [
  [250, 50, 50],
  [50, 250, 50],
  [250, 250, 50],
  [50, 50, 250],
  [50, 250, 250],
];

/** Statické styly; ostatní (dynamické) převádíme jako statické. */
const STATIC_STYLES = [1, 4, 5, 8, 9];

export function codeToBytes(body: string, byteCount: number): number[] {
  let v = 0n;
  for (const c of [...body].reverse()) {
    const i = CS_ALPHABET.indexOf(c);
    if (i < 0) throw new CodeError(`Kód obsahuje znak, který v CS2 kódech nebývá: „${c}".`);
    v = v * 57n + BigInt(i);
  }
  const hex = v.toString(16).padStart(byteCount * 2, '0');
  if (hex.length > byteCount * 2) throw new CodeError('Kód je moc dlouhý.');
  const bytes: number[] = [];
  for (let i = 0; i < byteCount; i++) bytes.push(parseInt(hex.substring(i * 2, i * 2 + 2), 16));
  return bytes;
}

/** Opak {@link codeToBytes} – hodí se pro testy a případný export kódu. */
export function bytesToCode(bytes: number[], length: number): string {
  let v = BigInt('0x' + bytes.map((b) => b.toString(16).padStart(2, '0')).join(''));
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CS_ALPHABET[Number(v % 57n)];
    v /= 57n;
  }
  return out;
}

export function checksum(bytes: number[]): number {
  return bytes.slice(1).reduce((a, x) => a + x, 0) % 256;
}

const s8 = (x: number) => (x >= 128 ? x - 256 : x);
const u32le = (b: number[], i: number) => (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0;

function withStyleNote(info: string, style: number): string {
  return STATIC_STYLES.includes(style) ? info : `${info} · dynamický styl převeden jako statický`;
}

export function parseCS2(raw: string): ParseResult<CS2Values> {
  const code = String(raw).replace(/\s+/g, '');
  const reNew = new RegExp(`^CS[${CS_ALPHABET}]{44}$`);
  const reOld = new RegExp(`^CSGO(-?[${CS_ALPHABET}]{5}){5}$`);

  let b: number[];
  let kind: 'new' | 'old';
  if (reNew.test(code)) {
    b = codeToBytes(code.slice(2), 32);
    kind = 'new';
  } else if (reOld.test(code)) {
    b = codeToBytes(code.replace(/^CSGO|-/g, ''), 18);
    kind = 'old';
  } else {
    throw new CodeError(
      'Tohle nevypadá jako kód z CS2. Nový kód začíná „CS" a má 46 znaků bez pomlček, starý vypadá jako CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx.',
    );
  }
  if (checksum(b) !== b[0]) throw new CodeError('Kontrolní součet nesedí. Zkopíruj kód celý ještě jednou.');

  const version = b[1];

  if (kind === 'new') {
    if (version !== 1) throw new CodeError(`Tuhle verzi kódu CS2 (${version}) zatím neznám.`);
    const height = b[2] | (b[3] << 8);
    const style = b[4] & 15;
    return {
      info: withStyleNote(`Nový pixelový kód CS2 · navrženo pro výšku ${height} px`, style),
      values: {
        ...CS2_DEFAULTS,
        screenHeight: height || 1080,
        color: rgbToHex(b[5], b[6], b[7]),
        alpha: b[8],
        thickness: b[13],
        length: b[16],
        gap: s8(b[15]),
        dot: (b[4] >> 6) & 1,
        tStyle: (b[4] >> 7) & 1,
        outlineMode: toOutlineMode(b[14]),
        outlineWidth: 1,
        outlineColor: rgbToHex(b[9], b[10], b[11]),
        outlineAlpha: b[12],
      },
    };
  }

  if (version === 1) {
    const gap = s8(b[2]) / 10;
    const outline = b[3] / 2;
    const colorIdx = b[10] & 7;
    const outlineOn = (b[10] & 8) === 8;
    const thickness = b[12] / 10;
    const flags = b[13] >> 4;
    const style = (b[13] & 15) >> 1;
    const size = (((b[15] & 0x1f) << 8) + b[14]) / 10;
    const rgb = colorIdx < 5 ? OLD_CS_COLORS[colorIdx] : ([b[4], b[5], b[6]] as [number, number, number]);
    const k = 1080 / 480;
    return {
      info: withStyleNote(
        'Starý kód CS:GO/CS2 (před 22. 9. 2026) · přepočteno na pixely pro 1080p, může se lišit o 1 px',
        style === 4 || style === 1 ? 4 : 2,
      ),
      values: {
        ...CS2_DEFAULTS,
        screenHeight: 1080,
        color: rgbToHex(...rgb),
        alpha: flags & 4 ? b[7] : 255,
        thickness: thickness > 0 ? Math.max(1, roundHalfEven(thickness * k)) : 0,
        length: roundHalfEven(size * k),
        gap: roundHalfEven(4 + gap),
        dot: flags & 1 ? 1 : 0,
        tStyle: flags & 8 ? 1 : 0,
        outlineMode: outlineOn ? 1 : 0,
        outlineWidth: Math.max(1, Math.round(outline)),
        outlineColor: '#000000',
        outlineAlpha: 255,
      },
    };
  }

  if (version === 3 || version === 4) {
    const f = u32le(b, 10);
    const outlineMode = version === 3 ? (b[2] >> 5) & 1 : (f >>> 28) & 3;
    return {
      info: withStyleNote(`Přechodný kód CS2 z konce září 2026 (verze ${version})`, b[2] & 15),
      values: {
        ...CS2_DEFAULTS,
        screenHeight: (b[14] | (b[15] << 8)) || 1080,
        color: rgbToHex(b[3], b[4], b[5]),
        alpha: b[6],
        thickness: (f >>> 23) & 31,
        length: b[8],
        gap: b[7],
        dot: (b[2] >> 6) & 1,
        tStyle: (b[2] >> 7) & 1,
        outlineMode: toOutlineMode(outlineMode),
        outlineWidth: 1,
        outlineColor: '#000000',
        outlineAlpha: 255,
      },
    };
  }

  throw new CodeError(`Tuhle verzi kódu (${version}) neznám.`);
}
