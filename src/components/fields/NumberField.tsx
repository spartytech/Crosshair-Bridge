import { useState } from 'react';
import { clamp } from '../../lib/utils';

interface Props {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  hint?: string;
  onChange: (v: number) => void;
}

/** Číselné pole bez posuvníku. Uloží se jen hodnota v rozsahu, rozepsané číslo zůstane v poli. */
export function NumberField({ id, label, value, min, max, step, hint, onChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (text: string) => {
    setDraft(text);
    const n = parseFloat(text.replace(',', '.'));
    if (!Number.isNaN(n) && n >= min && n <= max) onChange(n);
  };

  return (
    <div className="grid min-w-0 gap-1 py-1.5">
      <label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        aria-describedby={hint ? `${id}-hint` : undefined}
        value={draft ?? String(value)}
        onChange={(e) => commit(e.target.value)}
        onBlur={() => setDraft(null)}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
          e.preventDefault();
          const next = Math.round((value + (e.key === 'ArrowUp' ? step : -step)) / step) * step;
          setDraft(null);
          onChange(clamp(Number(next.toFixed(6)), min, max));
        }}
        className="w-full min-w-0 rounded-md border border-line bg-sunk px-2.5 py-2 font-mono text-[15px] text-ink tabular-nums focus:outline-2 focus:-outline-offset-1 focus:outline-accent"
      />
      {hint && (
        <p id={`${id}-hint`} className="m-0 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
