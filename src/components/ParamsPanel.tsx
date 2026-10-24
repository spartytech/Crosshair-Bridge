import type { FieldDef, GameDef } from '../games/types';
import type { Values } from '../lib/types';
import { ColorField } from './fields/ColorField';
import { RangeField } from './fields/RangeField';
import { SelectField } from './fields/SelectField';
import { ToggleField } from './fields/ToggleField';
import { Button, Panel } from './ui';

interface Props {
  game: GameDef<Values>;
  values: Values;
  onChange: (key: string, value: number | string) => void;
  onToCustom: () => void;
  onReset: () => void;
  className?: string;
}

function Field({ field, gameId, values, onChange }: { field: FieldDef<Values>; gameId: string; values: Values; onChange: Props['onChange'] }) {
  if (field.type === 'heading') {
    return (
      <div className="col-span-full mt-3.5 border-t border-line pt-3 font-display text-[15px] leading-none font-bold tracking-[0.06em] text-accent uppercase first:mt-0 first:border-t-0 first:pt-0">
        {field.label}
      </div>
    );
  }
  const id = `f-${gameId}-${field.key}`;
  const value = values[field.key];
  switch (field.type) {
    case 'range':
      return (
        <RangeField
          id={id}
          label={field.label}
          value={Number(value)}
          min={field.min}
          max={field.max}
          step={field.step}
          unit={field.unit}
          onChange={(v) => onChange(field.key, v)}
        />
      );
    case 'toggle':
      return <ToggleField id={id} label={field.label} checked={!!value} onChange={(c) => onChange(field.key, c ? 1 : 0)} />;
    case 'select':
      return <SelectField id={id} label={field.label} value={value} options={field.options} onChange={(v) => onChange(field.key, v)} />;
    case 'color':
      return <ColorField id={id} label={field.label} value={String(value)} onChange={(v) => onChange(field.key, v)} />;
    default:
      return null;
  }
}

export function ParamsPanel({ game, values, onChange, onToCustom, onReset, className }: Props) {
  const visible = game.fields.filter((f) => f.type === 'heading' || !f.when || f.when(values));
  return (
    <Panel id="params-label" label="2 · Parametry" className={className}>
      <h2 className="mt-0 mb-3 font-display text-[22px] leading-[1.1] font-bold tracking-[0.02em] uppercase">{game.title}</h2>
      <div className="grid grid-cols-1 gap-x-[26px] gap-y-1 sm:grid-cols-2">
        {visible.map((f, i) => (
          <Field key={f.type === 'heading' ? `h-${i}` : f.key} field={f} gameId={game.id} values={values} onChange={onChange} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5 border-t border-line pt-3.5">
        {game.id === 'custom' ? (
          <>
            <Button onClick={onReset}>Výchozí hodnoty</Button>
            <span className="text-[13px] text-muted">Mezera 0 = čáry se dotýkají středu, záporná mezera kříž uzavře.</span>
          </>
        ) : (
          <>
            <Button onClick={onToCustom}>Doladit v editoru Vlastní</Button>
            <span className="text-[13px] text-muted">
              Zkopíruje výsledek v pixelech pro zvolené rozlišení, ať můžeš upravit každý pixel.
            </span>
          </>
        )}
      </div>
    </Panel>
  );
}
