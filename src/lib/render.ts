import { layoutCrosshair, type Layout } from './geometry';
import type { CrosshairModel, RGB } from './types';
import { clamp } from './utils';

export interface Rendered {
  canvas: HTMLCanvasElement;
  size: number;
  layout: Layout;
}

const css = (rgb: RGB) => `rgb(${rgb.join(',')})`;

function makeLayer(size: number, doc: Document): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = doc.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D není v tomhle prohlížeči dostupný.');
  ctx.imageSmoothingEnabled = false;
  return [canvas, ctx];
}

/**
 * Vykreslí model do průhledného čtvercového canvasu.
 * Obrys se kreslí do vlastní vrstvy a pod čarami se vyřízne, aby krytí čar nemíchalo barvu obrysu.
 */
export function renderCrosshair(m: CrosshairModel, doc: Document = document): Rendered {
  const layout = layoutCrosshair(m);
  const { size, c, groups } = layout;
  const [out, o] = makeLayer(size, doc);
  const strokeCircle = (ctx: CanvasRenderingContext2D, width: number) => {
    if (!m.circle) return;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(c, c, m.circle.R, 0, Math.PI * 2);
    ctx.stroke();
  };

  if (m.outline.mode && m.outline.a > 0) {
    const [layer, x] = makeLayer(size, doc);
    const w = m.outline.w;
    x.fillStyle = x.strokeStyle = css(m.outline.rgb);
    for (const g of groups) {
      for (const [x0, y0, x1, y1] of g.rects) {
        if (m.outline.mode === 2) x.fillRect(x0 - w, y0 - w, x1 - x0 + w, y1 - y0 + w);
        else x.fillRect(x0 - w, y0 - w, x1 - x0 + 2 * w, y1 - y0 + 2 * w);
      }
    }
    if (m.circle) strokeCircle(x, m.circle.T + 2 * w);
    x.globalCompositeOperation = 'destination-out';
    x.fillStyle = x.strokeStyle = '#000';
    for (const g of groups) for (const [x0, y0, x1, y1] of g.rects) x.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (m.circle) strokeCircle(x, m.circle.T);
    o.globalAlpha = clamp(m.outline.a, 0, 1);
    o.drawImage(layer, 0, 0);
    o.globalAlpha = 1;
  }

  const fills: { a: number; draw: (ctx: CanvasRenderingContext2D) => void }[] = groups.map((g) => ({
    a: g.a,
    draw: (ctx) => {
      for (const [x0, y0, x1, y1] of g.rects) ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    },
  }));
  if (m.circle) fills.push({ a: m.circle.a, draw: (ctx) => strokeCircle(ctx, m.circle!.T) });

  for (const f of fills) {
    if (f.a <= 0) continue;
    const [layer, x] = makeLayer(size, doc);
    x.fillStyle = x.strokeStyle = css(m.rgb);
    f.draw(x);
    o.globalAlpha = clamp(f.a, 0, 1);
    o.drawImage(layer, 0, 0);
    o.globalAlpha = 1;
  }

  return { canvas: out, size, layout };
}

/**
 * PNG z vykresleného crosshairu. S `screen` vznikne průhledný obrázek
 * ve velikosti celé obrazovky s crosshairem uprostřed (pro Aim Lab).
 */
export function toPngBlob(r: Rendered, screen?: { W: number; H: number }): Promise<Blob> {
  let canvas = r.canvas;
  if (screen) {
    const full = document.createElement('canvas');
    full.width = screen.W;
    full.height = screen.H;
    const ctx = full.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(r.canvas, Math.floor((screen.W - r.size) / 2), Math.floor((screen.H - r.size) / 2));
    }
    canvas = full;
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Obrázek se nepodařilo vytvořit.'))), 'image/png');
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
