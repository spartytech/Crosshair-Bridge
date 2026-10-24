import type { ReactNode } from 'react';
import { Mono } from './ui';

const GAMES: { name: string; hasCode: boolean; text: ReactNode }[] = [
  {
    name: 'CS2',
    hasCode: true,
    text: (
      <>
        Kód začíná na <Mono>CS</Mono> (nový formát od 30. 9. 2026). Starší kódy <Mono>CSGO-…</Mono> aplikace taky
        přečte a přepočítá na pixely.
      </>
    ),
  },
  {
    name: 'Valorant',
    hasCode: true,
    text: (
      <>
        Nastavení → Crosshair → ikona exportu zkopíruje kód profilu, např. <Mono>0;P;c;5;h;0;…</Mono>
      </>
    ),
  },
  { name: 'Overwatch 2', hasCode: false, text: 'Nemá sdílecí kód. Opiš hodnoty z Možnosti → Ovládání → Zaměřovač.' },
  {
    name: 'Apex, Fortnite, CoD, R6…',
    hasCode: false,
    text: 'Bez kódu a s malou volbou tvarů. Postav si crosshair v záložce Vlastní podle náhledu.',
  },
];

export function GameSupport() {
  return (
    <section aria-labelledby="support-label" className="mt-[22px]">
      <p id="support-label" className="mb-2.5 font-mono text-[11px] leading-none font-semibold tracking-[0.12em] text-muted uppercase">
        Které hry mají kód crosshairu
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
        {GAMES.map((g) => (
          <div key={g.name} className="rounded-lg border border-line bg-surface p-3.5 text-[13.5px]">
            <span
              className={`mb-2 inline-block rounded-full px-[7px] py-1 font-mono text-[10px] leading-none font-semibold tracking-[0.08em] uppercase ${
                g.hasCode ? 'bg-ok/15 text-ok' : 'border border-line bg-sunk text-muted'
              }`}
            >
              {g.hasCode ? 'Kód' : 'Ručně'}
            </span>
            <b className="mb-1 block font-display text-[17px] leading-[1.1] font-bold tracking-[0.03em] uppercase">{g.name}</b>
            {g.text}
          </div>
        ))}
      </div>
    </section>
  );
}
