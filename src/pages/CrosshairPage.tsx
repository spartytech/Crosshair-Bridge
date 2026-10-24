import { useCallback, useMemo } from 'react';
import { CodeInput } from '../components/CodeInput';
import { ExportPanel } from '../components/ExportPanel';
import { GamePicker } from '../components/GamePicker';
import { GameSupport } from '../components/GameSupport';
import { ParamsPanel } from '../components/ParamsPanel';
import { Preview } from '../components/Preview';
import { Panel } from '../components/ui';
import { GAMES, RESOLUTIONS } from '../games';
import { usePersistentState } from '../hooks/usePersistentState';
import { isEmptyModel, modelToCustom } from '../lib/models';
import { renderCrosshair } from '../lib/render';
import type { GameId } from '../lib/types';
import { applyCode, initialState, reviveState, STORAGE_KEY, type AppState } from '../state';

export function CrosshairPage() {
  const [state, setState] = usePersistentState<AppState>(STORAGE_KEY, initialState, reviveState);
  const patch = useCallback((p: Partial<AppState>) => setState((s) => ({ ...s, ...p })), [setState]);

  const game = GAMES[state.game];
  const values = state.vals[state.game];
  const screen = RESOLUTIONS[state.res] ?? RESOLUTIONS[0];

  const model = useMemo(() => game.toModel(values, screen.H), [game, values, screen.H]);
  const rendered = useMemo(() => renderCrosshair(model), [model]);

  const setValue = (key: string, value: number | string) =>
    setState((s) => ({ ...s, vals: { ...s.vals, [s.game]: { ...s.vals[s.game], [key]: value } } }));

  const loadCode = (gameId: GameId, raw: string) =>
    setState((s) => {
      const r = applyCode(gameId, raw);
      return {
        ...s,
        codes: { ...s.codes, [gameId]: raw },
        info: { ...s.info, [gameId]: r.status },
        vals: r.values ? { ...s.vals, [gameId]: r.values } : s.vals,
      };
    });

  const toCustom = () =>
    setState((s) => ({ ...s, game: 'custom', vals: { ...s.vals, custom: modelToCustom(model) } }));

  const resetCustom = () => setState((s) => ({ ...s, vals: { ...s.vals, custom: { ...GAMES.custom.defaults } } }));

  return (
    <>
      <div className="grid items-start gap-x-[22px] gap-y-[18px] [grid-template-areas:'src'_'stage'_'params'] min-[901px]:grid-cols-[minmax(0,1fr)_minmax(0,440px)] min-[901px]:grid-rows-[auto_1fr] min-[901px]:[grid-template-areas:'src_stage'_'params_stage']">
        <Panel id="source-label" label="1 · Zdrojová hra" className="[grid-area:src]">
          <GamePicker value={state.game} onChange={(g) => patch({ game: g })} />
          <CodeInput
            key={state.game}
            game={game}
            code={state.codes[state.game] ?? ''}
            status={state.info[state.game]}
            onCodeChange={(code) => setState((s) => ({ ...s, codes: { ...s.codes, [s.game]: code } }))}
            onLoad={() => loadCode(state.game, state.codes[state.game] ?? '')}
            onSample={() => game.code && loadCode(state.game, game.code.sample)}
          />
        </Panel>

        <div className="grid gap-[18px] [grid-area:stage] min-[901px]:sticky min-[901px]:top-3.5">
          <Preview
            model={model}
            rendered={rendered}
            screen={screen}
            bg={state.bg}
            zoom={state.zoom}
            onBg={(bg) => patch({ bg })}
            onZoom={(zoom) => patch({ zoom })}
          />
          <ExportPanel
            gameId={state.game}
            rendered={rendered}
            disabled={isEmptyModel(model)}
            res={state.res}
            onRes={(res) => patch({ res })}
            how={state.how}
            onHow={(how) => patch({ how })}
          />
        </div>

        <ParamsPanel
          className="[grid-area:params]"
          game={game}
          values={values}
          onChange={setValue}
          onToCustom={toCustom}
          onReset={resetCustom}
        />
      </div>

      <GameSupport />
    </>
  );
}
