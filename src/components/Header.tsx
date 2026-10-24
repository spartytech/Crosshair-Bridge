export type ToolId = 'crosshair' | 'sens';

const TOOLS: { id: ToolId; hash: string; name: string; sub: string; intro: string }[] = [
  {
    id: 'crosshair',
    hash: '#crosshair',
    name: 'Crosshair',
    sub: 'PNG pro trenažéry',
    intro:
      'Převeď crosshair z CS2, Valorantu nebo Overwatche 2 na průhledné PNG pro aim trenažéry. Vlož kód nebo opiš hodnoty, zkontroluj náhled a stáhni obrázek.',
  },
  {
    id: 'sens',
    hash: '#citlivost',
    name: 'Citlivost',
    sub: 'převod mezi hrami',
    intro:
      'Přenes citlivost myši z jedné hry do ostatních. Zadej citlivost a DPI, aplikace spočítá stejnou vzdálenost na otočku o 360° v každé hře.',
  },
];

export function toolFromHash(hash: string): ToolId {
  return TOOLS.find((t) => t.hash === hash)?.id ?? 'crosshair';
}

export function Header({ tool }: { tool: ToolId }) {
  const current = TOOLS.find((t) => t.id === tool) ?? TOOLS[0];
  return (
    <header className="mb-[22px] grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h1 className="m-0 font-display text-[clamp(34px,5vw,48px)] leading-[0.95] font-bold tracking-[0.01em] text-balance uppercase">
            Crosshair <span className="text-accent">Bridge</span>
          </h1>
          <p className="mt-1.5 max-w-[60ch] text-muted">{current.intro}</p>
        </div>
        {tool === 'crosshair' && (
          <div className="font-mono text-xs leading-none font-semibold tracking-[0.06em] text-muted uppercase">
            Výstup: <b className="text-ink">Kovaak's</b> · <b className="text-ink">Aim Lab</b>
          </div>
        )}
      </div>

      <nav aria-label="Nástroje" className="grid max-w-[460px] grid-cols-2 gap-1 rounded-[9px] border border-line bg-sunk p-1">
        {TOOLS.map((t) => {
          const active = t.id === tool;
          return (
            <a
              key={t.id}
              href={t.hash}
              aria-current={active ? 'page' : undefined}
              className={`min-w-0 rounded-md px-3 py-2.5 text-center text-sm leading-tight font-semibold text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                active ? 'bg-surface shadow-[0_0_0_1px_var(--line),0_1px_3px_rgb(20_25_40/0.08)]' : 'hover:text-accent'
              }`}
            >
              {t.name}
              <small className={`mt-[3px] block font-mono text-[10px] leading-tight font-medium tracking-[0.04em] ${active ? 'text-accent' : 'text-muted'}`}>
                {t.sub}
              </small>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
