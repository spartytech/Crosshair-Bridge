import type { GameDef } from '../games/types';
import type { Values } from '../lib/types';
import type { CodeStatus } from '../state';
import { Button } from './ui';

interface Props {
  game: GameDef<Values>;
  code: string;
  status?: CodeStatus;
  onCodeChange: (code: string) => void;
  onLoad: () => void;
  onSample: () => void;
}

export function CodeInput({ game, code, status, onCodeChange, onLoad, onSample }: Props) {
  if (!game.code) {
    return <div className="mt-4 rounded-lg bg-sunk px-3.5 py-3 text-sm text-muted">{game.noCode}</div>;
  }
  const id = `code-${game.id}`;
  return (
    <div className="mt-4 grid gap-2">
      <label htmlFor={id} className="font-semibold">
        {game.code.label}
      </label>
      <div className="flex flex-wrap gap-2">
        <textarea
          id={id}
          rows={2}
          spellCheck={false}
          autoComplete="off"
          placeholder={game.code.placeholder}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onLoad();
            }
          }}
          className="min-h-[52px] min-w-0 flex-[1_1_260px] resize-y rounded-lg border border-line bg-sunk px-3 py-2.5 font-mono text-[13px] leading-[1.45] break-all text-ink focus:outline-2 focus:-outline-offset-1 focus:outline-accent"
        />
        <div className="flex flex-[1_1_100%] gap-1.5 sm:flex-none sm:flex-col">
          <Button variant="primary" className="flex-1 sm:flex-none" onClick={onLoad}>
            Načíst kód
          </Button>
          <Button variant="ghost" className="flex-1 sm:flex-none" onClick={onSample}>
            Ukázka
          </Button>
        </div>
      </div>
      <p aria-live="polite" className={`m-0 min-h-[1.45em] text-[13px] font-medium ${status ? (status.ok ? 'text-ok' : 'text-bad') : ''}`}>
        {status?.msg}
      </p>
      <p className="m-0 text-[13px] text-muted">{game.code.hint}</p>
    </div>
  );
}
