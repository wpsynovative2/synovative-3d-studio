/** Shown wherever a poster / video path is still empty. */
export function MediaPlaceholder({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex items-end bg-[radial-gradient(120%_90%_at_20%_10%,rgb(95_60_167/0.35),transparent_60%),linear-gradient(160deg,var(--brand-wash),var(--paper-sunken))] ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(var(--ink)_1px,transparent_1px),linear-gradient(90deg,var(--ink)_1px,transparent_1px)] [background-size:32px_32px]" />
      {label && (
        <span className="relative m-4 font-display text-xs tracking-[0.18em] text-ink-soft uppercase">{label}</span>
      )}
    </div>
  );
}
