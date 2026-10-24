interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleField({ id, label, checked, onChange }: Props) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-3 py-[9px] text-[13px] font-medium">
      <span>{label}</span>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="relative h-[22px] w-[38px] flex-none rounded-full bg-line transition-colors peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent after:absolute after:top-[3px] after:left-[3px] after:size-4 after:rounded-full after:bg-surface after:shadow-[0_1px_2px_rgb(0_0_0/0.25)] after:transition-transform after:content-[''] peer-checked:after:translate-x-4"
      />
    </label>
  );
}
