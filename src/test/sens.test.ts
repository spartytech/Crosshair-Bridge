import { describe, expect, it } from 'vitest';
import { cmPer360, convertSens, SENS_GAMES } from '../lib/sens';
import { reviveSensState } from '../sensState';

const { cs2, val, ow, fn } = SENS_GAMES;

describe('převod citlivosti', () => {
  it('CS2 → Valorant dělí poměrem 0,07 / 0,022', () => {
    expect(convertSens(1, cs2, val, 800)).toBeCloseTo(0.3143, 4);
  });

  it('CS2 → Overwatch 2 násobí 10/3', () => {
    expect(convertSens(1.5, cs2, ow, 800)).toBeCloseTo(5, 6);
  });

  it('CS2 1,5 odpovídá Fortnite 5,94 %', () => {
    expect(convertSens(1.5, cs2, fn, 800)).toBeCloseTo(5.941, 3);
  });

  it('dvojnásobné DPI půlí citlivost', () => {
    expect(convertSens(2, cs2, cs2, 400, 800)).toBeCloseTo(1, 9);
  });

  it('převod tam a zpět vrátí původní hodnotu', () => {
    const v = convertSens(0.42, val, fn, 1600);
    expect(convertSens(v, fn, val, 1600)).toBeCloseTo(0.42, 9);
  });

  it('CS2 1 při 800 DPI je 51,95 cm na 360°', () => {
    expect(cmPer360(cs2, 1, 800)).toBeCloseTo(51.95, 2);
  });

  it('stejná citlivost v cm/360 napříč hrami', () => {
    const v = convertSens(0.35, val, ow, 800);
    expect(cmPer360(ow, v, 800)).toBeCloseTo(cmPer360(val, 0.35, 800), 9);
  });
});

describe('uložený stav citlivosti', () => {
  it('zahodí neplatné hodnoty a nechá platné', () => {
    const s = reviveSensState({ from: 'xyz', sens: -1, dpi: 1600, changeDpi: 'ano', toDpi: 400 });
    expect(s).toEqual({ from: 'cs2', sens: 1.5, dpi: 1600, changeDpi: false, toDpi: 400 });
  });
});
