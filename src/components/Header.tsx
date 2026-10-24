export function Header() {
  return (
    <header className="mb-[22px] flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <h1 className="m-0 font-display text-[clamp(34px,5vw,48px)] leading-[0.95] font-bold tracking-[0.01em] text-balance uppercase">
          Crosshair <span className="text-accent">Bridge</span>
        </h1>
        <p className="mt-1.5 max-w-[60ch] text-muted">
          Převeď crosshair z CS2, Valorantu nebo Overwatche 2 na průhledné PNG pro aim trenažéry. Vlož kód nebo opiš
          hodnoty, zkontroluj náhled a stáhni obrázek.
        </p>
      </div>
      <div className="font-mono text-xs leading-none font-semibold tracking-[0.06em] text-muted uppercase">
        Výstup: <b className="text-ink">Kovaak's</b> · <b className="text-ink">Aim Lab</b>
      </div>
    </header>
  );
}
