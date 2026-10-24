import type { ButtonHTMLAttributes, ReactNode } from 'react';

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export function Panel({ id, label, className = '', children }: { id: string; label: string; className?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={`min-w-0 rounded-[10px] border border-line bg-surface p-[18px] ${className}`}>
      <p id={id} className="mb-2.5 font-mono text-[11px] leading-none font-semibold tracking-[0.12em] text-muted uppercase">
        {label}
      </p>
      {children}
    </section>
  );
}

type ButtonVariant = 'primary' | 'default' | 'ghost';

export function Button({ variant = 'default', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const look = {
    primary: 'border-accent bg-accent text-accent-ink hover:brightness-110',
    default: 'border-line bg-surface text-ink hover:border-accent',
    ghost: 'border-line bg-transparent text-ink hover:border-accent',
  }[variant];
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-lg border px-3.5 py-[11px] text-sm leading-none font-semibold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50 ${look} ${focusRing} ${className}`}
      {...rest}
    />
  );
}

export function Chip({ pressed, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { pressed: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`cursor-pointer rounded-full border px-2.5 py-[7px] text-xs leading-none font-medium ${focusRing} ${
        pressed ? 'border-accent bg-accent-soft text-accent' : 'border-line bg-surface text-muted hover:text-ink'
      }`}
      {...rest}
    />
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <span className="inline-block max-w-full rounded border border-line bg-sunk px-[5px] py-px font-mono text-[12.5px] leading-snug [overflow-wrap:anywhere]">{children}</span>;
}
