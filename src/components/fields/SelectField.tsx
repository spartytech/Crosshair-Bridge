interface Props {
  id: string;
  label: string;
  value: number | string;
  options: readonly (readonly [number | string, string])[];
  onChange: (v: number | string) => void;
}

export function SelectField({ id, label, value, options, onChange }: Props) {
  return (
    <div className="grid min-w-0 gap-1 py-1.5">
      <label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </label>
      <select
        id={id}
        value={String(value)}
        onChange={(e) => {
          const opt = options.find(([v]) => String(v) === e.target.value);
          if (opt) onChange(opt[0]);
        }}
        className="w-full min-w-0 rounded-md border border-line bg-sunk px-2 py-[7px] text-[13px] text-ink"
      >
        {options.map(([v, l]) => (
          <option key={String(v)} value={String(v)}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
