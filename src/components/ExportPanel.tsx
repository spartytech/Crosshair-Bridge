import { useState } from 'react';
import { RESOLUTIONS } from '../games';
import { downloadBlob, toPngBlob, type Rendered } from '../lib/render';
import type { GameId } from '../lib/types';
import type { HowToId } from '../state';
import { HowTo } from './HowTo';
import { Panel } from './ui';

interface Props {
  gameId: GameId;
  rendered: Rendered;
  disabled: boolean;
  res: number;
  onRes: (i: number) => void;
  how: HowToId;
  onHow: (h: HowToId) => void;
}

export function ExportPanel({ gameId, rendered, disabled, res, onRes, how, onHow }: Props) {
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const screen = RESOLUTIONS[res] ?? RESOLUTIONS[0];

  const save = async (fullScreen: boolean) => {
    try {
      const blob = await toPngBlob(rendered, fullScreen ? screen : undefined);
      const name = fullScreen ? `crosshair-${gameId}-${screen.W}x${screen.H}.png` : `crosshair-${gameId}-${rendered.size}px.png`;
      downloadBlob(blob, name);
      setStatus({ ok: true, msg: `Staženo jako ${name}. Najdeš ho ve složce Stažené soubory.` });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : 'Obrázek se nepodařilo uložit.' });
    }
  };

  const exportBtn =
    'cursor-pointer rounded-lg border p-3 text-left text-sm leading-tight font-semibold disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

  return (
    <Panel id="export-label" label="3 · Export">
      <div className="mb-3.5 flex items-center gap-2.5">
        <label htmlFor="res" className="text-[13px] font-semibold whitespace-nowrap">
          Tvoje rozlišení v trenažéru
        </label>
        <select
          id="res"
          value={res}
          onChange={(e) => onRes(Number(e.target.value))}
          className="w-full min-w-0 rounded-md border border-line bg-sunk px-2 py-[7px] text-[13px] text-ink"
        >
          {RESOLUTIONS.map((r, i) => (
            <option key={i} value={i}>
              {r.W} × {r.H}
              {r.note ? ` (${r.note})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => save(false)}
          className={`${exportBtn} border-accent bg-accent text-accent-ink hover:brightness-110`}
        >
          PNG pro Kovaak's
          <small className="mt-1 block font-mono text-[11px] font-medium opacity-80">
            {rendered.size} × {rendered.size} px
          </small>
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => save(true)}
          className={`${exportBtn} border-line bg-surface text-ink hover:border-accent`}
        >
          PNG pro Aim Lab
          <small className="mt-1 block font-mono text-[11px] font-medium opacity-80">
            {screen.W} × {screen.H} px, průhledné
          </small>
        </button>
      </div>

      <p aria-live="polite" className={`mt-2.5 mb-0 min-h-[1.45em] text-[13px] font-medium ${status ? (status.ok ? 'text-ok' : 'text-bad') : ''}`}>
        {status?.msg}
      </p>

      <HowTo value={how} onChange={onHow} />
    </Panel>
  );
}
