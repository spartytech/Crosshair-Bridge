import { useEffect, useRef, useState } from 'react';
import { BACKGROUNDS, ZOOMS, type BackgroundId } from '../games';
import type { Rendered } from '../lib/render';
import type { CrosshairModel } from '../lib/types';
import { isEmptyModel } from '../lib/models';
import { Chip, Panel } from './ui';

interface Props {
  model: CrosshairModel;
  rendered: Rendered;
  screen: { W: number; H: number };
  bg: BackgroundId;
  zoom: number;
  onBg: (bg: BackgroundId) => void;
  onZoom: (zoom: number) => void;
}

function useDevicePixelRatio(): number {
  const [dpr, setDpr] = useState(() => window.devicePixelRatio || 1);
  useEffect(() => {
    const update = () => setDpr(window.devicePixelRatio || 1);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return dpr;
}

export function Preview({ model, rendered, screen, bg, zoom, onBg, onZoom }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dpr = useDevicePixelRatio();

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    cv.width = rendered.canvas.width;
    cv.height = rendered.canvas.height;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(rendered.canvas, 0, 0);
  }, [rendered]);

  // „Skutečná velikost" = 1 pixel obrázku na 1 fyzický pixel monitoru.
  const scale = zoom === 1 ? 1 / dpr : zoom;
  const s0 = model.sets[0];
  const empty = isEmptyModel(model);
  const lines = s0
    ? `${s0.T} × ${Math.max(s0.L, s0.Lv)} px`
    : model.dot
      ? 'jen tečka'
      : model.circle
        ? 'kruh'
        : 'žádné';

  return (
    <Panel id="preview-label" label="Náhled">
      <div className={`scene scene-${bg} aspect-[4/3] max-w-full rounded-lg border border-line`}>
        <span className="scene-ball" />
        <canvas
          ref={canvasRef}
          aria-label="Náhled crosshairu"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [image-rendering:pixelated]"
          style={{ width: rendered.size * scale, height: rendered.size * scale }}
        />
      </div>

      <div className="mt-2.5 flex flex-wrap justify-between gap-2">
        <div role="group" aria-label="Pozadí" className="flex flex-wrap gap-1.5">
          {BACKGROUNDS.map(([id, label]) => (
            <Chip key={id} pressed={id === bg} onClick={() => onBg(id)}>
              {label}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="Zvětšení" className="flex flex-wrap gap-1.5">
          {ZOOMS.map(([z, label]) => (
            <Chip key={z} pressed={z === zoom} onClick={() => onZoom(z)}>
              {label}
            </Chip>
          ))}
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
        {[
          ['Obrázek', `${rendered.size} × ${rendered.size} px`],
          ['Čáry', lines],
          ['Mezera', s0 ? `${Math.round(s0.g * 10) / 10} px` : '–'],
        ].map(([dt, dd]) => (
          <div key={dt} className="min-w-0 bg-sunk px-2.5 py-2">
            <dt className="mb-[5px] font-mono text-[10px] leading-none font-semibold tracking-[0.1em] text-muted uppercase">{dt}</dt>
            <dd className="m-0 font-mono text-sm leading-tight font-semibold break-words tabular-nums">{dd}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-2.5 mb-0 text-[12.5px] text-muted">
        {empty
          ? 'Crosshair je prázdný. Zapni čáry, tečku nebo kruh.'
          : `Přepočteno pro ${screen.W} × ${screen.H}. ` +
            (zoom === 1
              ? 'Náhled ve skutečné velikosti na tvé obrazovce.'
              : `Náhled je zvětšený ${zoom}×, každý čtvereček je jeden pixel.`)}
      </p>
    </Panel>
  );
}
