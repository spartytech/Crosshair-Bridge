import type { ReactNode } from 'react';
import type { HowToId } from '../state';
import { Chip, Mono } from './ui';

const STEPS: Record<HowToId, ReactNode[]> = {
  kovaak: [
    <>
      Stáhni <b>PNG pro Kovaak's</b>.
    </>,
    <>
      Ve Steamu klikni pravým na KovaaK's → Spravovat → Procházet místní soubory a obrázek dej do složky{' '}
      <Mono>FPSAimTrainer\crosshairs</Mono>.
    </>,
    <>Ve hře otevři nastavení crosshairu a vyber nový soubor ze seznamu.</>,
    <>
      Barvu crosshairu nech bílou, ať hra nepřebarví barvy z PNG. Měřítko začni na 1.0 a porovnej s náhledem ve
      skutečné velikosti.
    </>,
    <>
      Když se crosshair ve scénáři nezmění, zkontroluj, že zbraň používá výchozí nastavení a že máš vypnutý
      Crosshair Bloom.
    </>,
  ],
  aimlab: [
    <>
      Stáhni <b>PNG pro Aim Lab</b>. Je průhledné ve velikosti celé obrazovky a crosshair má přesně uprostřed, takže
      sedí i bez škálování.
    </>,
    <>V Aim Labu otevři Settings → Crosshair.</>,
    <>U položky Type zvol vlastní obrázek a nahraj PNG.</>,
    <>Ulož přes Save Changes. Pokud se obrázek neuloží, přepni hru dočasně do angličtiny, ulož a jazyk vrať.</>,
  ],
};

export function HowTo({ value, onChange }: { value: HowToId; onChange: (v: HowToId) => void }) {
  return (
    <div className="mt-3.5">
      <div role="group" aria-label="Návod" className="mb-2.5 flex flex-wrap gap-1.5">
        <Chip pressed={value === 'kovaak'} onClick={() => onChange('kovaak')}>
          Návod: Kovaak's
        </Chip>
        <Chip pressed={value === 'aimlab'} onClick={() => onChange('aimlab')}>
          Návod: Aim Lab
        </Chip>
      </div>
      <ol className="m-0 grid list-decimal gap-[7px] pl-5 text-sm">
        {STEPS[value].map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
