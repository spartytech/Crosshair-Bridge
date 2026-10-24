import { useCallback, useState } from 'react';
import { NumberField } from '../components/fields/NumberField';
import { ToggleField } from '../components/fields/ToggleField';
import { Button, Chip, Panel } from '../components/ui';
import { usePersistentState } from '../hooks/usePersistentState';
import { cmPer360, convertSens, SENS_GAMES, SENS_ORDER, type SensGameId } from '../lib/sens';
import { initialSensState, reviveSensState, SENS_LIMITS, SENS_STORAGE_KEY, type SensState } from '../sensState';

const NOTES: { title: string; text: string }[] = [
  {
    title: 'Zaměřování a scope',
    text: 'Převod platí pro citlivost od boku. Citlivost při míření (ADS, scope) počítá každá hra jinak, nastav ji ve hře zvlášť.',
  },
  {
    title: 'Windows a myš',
    text: 'Rychlost ukazatele ve Windows nech na výchozích 10 z 20 a vypni „Zvýšit přesnost ukazatele“. DPI zadávej podle softwaru myši.',
  },
];

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-sunk px-3 py-2.5">
      <p className="m-0 font-mono text-[10px] leading-tight font-semibold tracking-[0.08em] text-muted uppercase">{label}</p>
      <p className="m-0 mt-1 font-mono text-[20px] leading-tight font-semibold tabular-nums">
        {value}
        {unit && <span className="ml-1 text-xs font-medium text-muted">{unit}</span>}
      </p>
    </div>
  );
}

export function SensPage() {
  const [state, setState] = usePersistentState<SensState>(SENS_STORAGE_KEY, initialSensState, reviveSensState);
  const patch = useCallback((p: Partial<SensState>) => setState((s) => ({ ...s, ...p })), [setState]);
  const [copied, setCopied] = useState<{ ok: boolean; msg: string } | null>(null);

  const from = SENS_GAMES[state.from];
  const toDpi = state.changeDpi ? state.toDpi : state.dpi;
  const cm = cmPer360(from, state.sens, state.dpi);

  const copy = async (id: SensGameId, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ok: true, msg: `Citlivost pro ${SENS_GAMES[id].name} (${text}) je ve schránce.` });
    } catch {
      setCopied({ ok: false, msg: 'Schránka není dostupná, opiš číslo ručně.' });
    }
  };

  return (
    <>
      <div className="grid items-start gap-x-[22px] gap-y-[18px] min-[901px]:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        <Panel id="sens-source-label" label="1 · Tvoje citlivost" className="min-[901px]:sticky min-[901px]:top-3.5">
          <div role="group" aria-label="Hra, ze které převádíš" className="flex flex-wrap gap-1.5">
            {SENS_ORDER.map((id) => (
              <Chip key={id} pressed={id === state.from} onClick={() => patch({ from: id })}>
                {SENS_GAMES[id].name}
              </Chip>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-3">
            <NumberField
              id="sens-value"
              label={`Citlivost · ${from.name}${from.unit ? ` (${from.unit})` : ''}`}
              value={state.sens}
              step={from.decimals === 0 ? 1 : 0.01}
              {...SENS_LIMITS.sens}
              onChange={(sens) => patch({ sens })}
            />
            <NumberField id="sens-dpi" label="DPI myši" value={state.dpi} step={50} {...SENS_LIMITS.dpi} onChange={(dpi) => patch({ dpi })} />
          </div>

          <ToggleField id="sens-change-dpi" label="Převést i na jiné DPI" checked={state.changeDpi} onChange={(changeDpi) => patch({ changeDpi })} />
          {state.changeDpi && (
            <NumberField
              id="sens-to-dpi"
              label="Nové DPI"
              value={state.toDpi}
              step={50}
              hint="Výsledky vpravo budou pro tohle DPI, otočka o 360° zůstane stejně dlouhá."
              {...SENS_LIMITS.dpi}
              onChange={(toDpi) => patch({ toDpi })}
            />
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Stat label="Na otočku 360°" value={cm.toFixed(1)} unit="cm" />
            <Stat label="Na otočku 360°" value={(cm / 2.54).toFixed(1)} unit="in" />
          </div>
        </Panel>

        <Panel id="sens-result-label" label={`2 · Citlivost v ostatních hrách · ${toDpi} DPI`}>
          <ul className="m-0 grid list-none gap-2 p-0">
            {SENS_ORDER.map((id) => {
              const g = SENS_GAMES[id];
              const value = convertSens(state.sens, from, g, state.dpi, toDpi).toFixed(g.decimals);
              const isSource = id === state.from;
              return (
                <li
                  key={id}
                  className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-3.5 py-3 ${isSource ? 'border-accent bg-accent-soft' : 'border-line bg-surface'}`}
                >
                  <div className="min-w-0 flex-[1_1_160px]">
                    <b className="font-display text-[17px] leading-[1.1] font-bold tracking-[0.03em] uppercase">{g.name}</b>
                    {isSource && (
                      <span className="ml-2 inline-block rounded-full bg-accent px-[7px] py-1 align-[2px] font-mono text-[10px] leading-none font-semibold tracking-[0.08em] text-accent-ink uppercase">
                        Zdroj
                      </span>
                    )}
                    {g.note && <small className="mt-0.5 block text-xs text-muted">{g.note}</small>}
                  </div>
                  <span className="font-mono text-[22px] leading-none font-semibold tabular-nums">
                    {value}
                    {g.unit && <span className="ml-0.5 text-sm text-muted">{g.unit}</span>}
                  </span>
                  <Button variant="ghost" className="px-3 py-2 text-xs" aria-label={`Kopírovat citlivost pro ${g.name}`} onClick={() => copy(id, value)}>
                    Kopírovat
                  </Button>
                </li>
              );
            })}
          </ul>
          <p aria-live="polite" className={`mt-2.5 mb-0 min-h-[1.45em] text-[13px] font-medium ${copied ? (copied.ok ? 'text-ok' : 'text-bad') : ''}`}>
            {copied?.msg}
          </p>
        </Panel>
      </div>

      <section aria-labelledby="sens-notes-label" className="mt-[22px]">
        <p id="sens-notes-label" className="mb-2.5 font-mono text-[11px] leading-none font-semibold tracking-[0.12em] text-muted uppercase">
          Než to nastavíš
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
          <div className="rounded-lg border border-line bg-surface p-3.5 text-[13.5px]">
            <b className="mb-1 block font-display text-[17px] leading-[1.1] font-bold tracking-[0.03em] uppercase">Kovaak's a Aim Lab</b>
            Oba trenažéry umí měřítko citlivosti podle hry. Zvol v nastavení {from.name} a zadej stejné číslo, případně
            zvol měřítko cm/360 a zadej {cm.toFixed(1)}.
          </div>
          {NOTES.map((n) => (
            <div key={n.title} className="rounded-lg border border-line bg-surface p-3.5 text-[13.5px]">
              <b className="mb-1 block font-display text-[17px] leading-[1.1] font-bold tracking-[0.03em] uppercase">{n.title}</b>
              {n.text}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
