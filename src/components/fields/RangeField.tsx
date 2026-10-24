import { useState } from 'react';
import { clamp, formatValue } from '../../lib/utils';

interface Props {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}

/** Posuvník s číselným polem. Číslo lze psát volně (i „-"), uloží se, jakmile dává smysl. */
export function RangeField({ id, label, value, min, max, step, unit, onChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (text: string) => {
    setDraft(text);
    const n = parseFloat(text.replace(',', '.'));
    if (!Number.isNaN(n)) onChange(clamp(n, min, max));
  };

  return (
    <div className="grid min-w-0 gap-1 py-1.5">
      <label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </label>
      <div className="flex min-w-0 items-center gap-2">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-w-0 flex-1 accent-accent"
        />
        <input
          type="number"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={draft ?? formatValue(value, step)}
          onChange={(e) => commit(e.target.value)}
          onBlur={() => setDraft(null)}
          className="w-16 rounded-md border border-line bg-sunk px-1.5 py-[5px] text-right font-mono text-[13px] text-ink tabular-nums"
        />
        <span className="w-[1.6em] font-mono text-xs text-muted">{unit}</span>
      </div>
    </div>
  );
}
