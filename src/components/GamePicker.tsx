import { GAMES, GAME_ORDER } from '../games';
import type { GameId } from '../lib/types';

export function GamePicker({ value, onChange }: { value: GameId; onChange: (g: GameId) => void }) {
  return (
    <div role="group" aria-label="Zdrojová hra" className="grid grid-cols-4 gap-1 rounded-[9px] border border-line bg-sunk p-1">
      {GAME_ORDER.map((id) => {
        const g = GAMES[id];
        const active = id === value;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={`min-w-0 cursor-pointer rounded-md px-1.5 py-2.5 text-sm leading-tight font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              active ? 'bg-surface shadow-[0_0_0_1px_var(--line),0_1px_3px_rgb(20_25_40/0.08)]' : ''
            }`}
          >
            {g.name}
            <small className={`mt-[3px] block font-mono text-[10px] leading-tight font-medium tracking-[0.04em] ${active ? 'text-accent' : 'text-muted'}`}>
              {g.sub}
            </small>
          </button>
        );
      })}
    </div>
  );
}
