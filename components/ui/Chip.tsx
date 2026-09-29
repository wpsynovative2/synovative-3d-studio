export function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`btn-motion h-9 rounded-full border px-4 text-sm font-medium ${
        active ? "border-brand bg-brand text-on-brand" : "border-line text-ink-soft hover:border-line-strong hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}
