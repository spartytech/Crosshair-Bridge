import { describe, expect, it } from 'vitest';
import { bytesToCode, checksum, parseCS2 } from '../lib/cs2Code';
import { CS2_SAMPLE_CODE, VAL_SAMPLE_CODE } from '../lib/defaults';
import { layoutCrosshair } from '../lib/geometry';
import { cs2Model, valModel } from '../lib/models';
import { parseValorant } from '../lib/valorantCode';

/** Vzorový kód z dokumentace akiver/csgo-sharecode. */
const DOC_EXAMPLE = 'CSvbPubOq37zTGqtsPTP5QTrp5CB4xFXiKRLfzJsm49ZRe';

function legacyV1Code(): string {
  // gap -3, obrys 1, zelená, alfa 200, tloušťka 1, velikost 2, statický styl, tečka
  const b = new Array(18).fill(0);
  b[1] = 1;
  b[2] = 256 - 30;
  b[3] = 2;
  b[5] = 255;
  b[7] = 200;
  b[8] = 3;
  b[9] = 256 - 30;
  b[10] = 1 | 8;
  b[11] = 0xaa;
  b[12] = 10;
  b[13] = ((1 | 4) << 4) | (4 << 1);
  b[14] = 20;
  b[0] = checksum(b);
  return 'CSGO-' + bytesToCode(b, 25).match(/.{5}/g)!.join('-');
}

describe('CS2 kódy', () => {
  it('čte vzorový kód z dokumentace', () => {
    const v = parseCS2(DOC_EXAMPLE).values;
    expect(v).toMatchObject({ screenHeight: 768, color: '#ff0000', alpha: 255, thickness: 1, length: 5, gap: 0, dot: 1, outlineMode: 0 });
  });

  it('čte ukázkový kód aplikace', () => {
    const v = parseCS2(CS2_SAMPLE_CODE).values;
    expect(v).toMatchObject({ screenHeight: 1080, color: '#00ffff', thickness: 2, length: 6, gap: 2, outlineMode: 1 });
  });

  it('odhalí poškozený kód podle kontrolního součtu', () => {
    const broken = CS2_SAMPLE_CODE.slice(0, -1) + (CS2_SAMPLE_CODE.endsWith('f') ? 'e' : 'f');
    expect(() => parseCS2(broken)).toThrow(/Kontrolní součet/);
  });

  it('odmítne text, který není kód', () => {
    expect(() => parseCS2('ahoj')).toThrow(/nevypadá jako kód/);
  });

  it('přepočítá starý kód CSGO- na pixely pro 1080p', () => {
    const r = parseCS2(legacyV1Code());
    expect(r.values).toMatchObject({ color: '#32fa32', alpha: 200, thickness: 2, length: 4, gap: 1, dot: 1, outlineMode: 1 });
  });

  it('škáluje pixely podle cílové výšky', () => {
    const v = parseCS2(CS2_SAMPLE_CODE).values;
    expect(cs2Model(v, 1440).sets[0]).toMatchObject({ T: 3, L: 8, g: 3 });
  });
});

describe('Valorant kódy', () => {
  it('čte ukázkový kód', () => {
    const v = parseValorant(VAL_SAMPLE_CODE).values;
    expect(v).toMatchObject({ c: 5, h: 0, '0l': 4, '0o': 2, '0a': 1, '1b': 0 });
  });

  it('čte vlastní barvu a samostatnou svislou délku jen ze sekce P', () => {
    const v = parseValorant('0;s;1;P;c;8;u;FF00AAFF;d;1;z;3;0g;1;0v;8;1b;0;S;c;1').values;
    expect(v).toMatchObject({ c: 8, u: '#ff00aa', d: 1, z: 3, '0g': 1, '0v': 8 });
  });

  it('odsazení měří od středu', () => {
    const m = valModel(parseValorant(VAL_SAMPLE_CODE).values, 1080);
    expect(m.sets).toEqual([{ T: 2, L: 4, Lv: 4, g: 1, a: 1 }]);
  });
});

describe('Rozložení pixelů', () => {
  it('nechává mezeru mezi středem a rameny', () => {
    const layout = layoutCrosshair(cs2Model(parseCS2(CS2_SAMPLE_CODE).values, 1080));
    expect(layout.size).toBe(22);
    expect(layout.groups[0].rects).toEqual([
      [14, 10, 20, 12],
      [2, 10, 8, 12],
      [10, 14, 12, 20],
      [10, 2, 12, 8],
    ]);
  });
});
