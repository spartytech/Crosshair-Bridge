import { useState } from 'react';

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

/** Výběr barvy + pole pro hex kód (dá se do něj vložit barva třeba ze hry). */
export function ColorField({ id, label, value, onChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const labelId = `${id}-label`;

  return (
    <div className="grid min-w-0 gap-1 py-1.5">
      <span id={labelId} className="text-[13px] font-medium">
        {label}
      </span>
      <div className="flex min-w-0 items-center gap-2">
        <input
          type="color"
          id={id}
          aria-labelledby={labelId}
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          className="h-8 w-[42px] cursor-pointer rounded-md border border-line bg-sunk p-0.5"
        />
        <input
          aria-labelledby={labelId}
          spellCheck={false}
          value={draft ?? value}
          onChange={(e) => {
            const text = e.target.value.trim();
            setDraft(text);
            if (/^#?[0-9a-f]{6}$/i.test(text)) onChange((text.startsWith('#') ? text : `#${text}`).toLowerCase());
          }}
          onBlur={() => setDraft(null)}
          className="w-[92px] rounded-md border border-line bg-sunk px-2 py-[7px] font-mono text-[13px] text-ink"
        />
      </div>
    </div>
  );
}
