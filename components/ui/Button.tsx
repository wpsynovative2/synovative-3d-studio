// Button styles copied from synovative.vercel.app.
type Variant = "primary" | "secondary" | "accent" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-full font-display font-semibold tracking-wide btn-motion active:shadow-lift-sm disabled:pointer-events-none disabled:opacity-55 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-on-brand shadow-lift-brand hover:bg-brand-deep",
  secondary: "border-2 border-brand text-brand bg-transparent hover:bg-brand hover:text-on-brand",
  accent: "bg-accent text-[#2a2135] shadow-lift-accent hover:bg-accent-deep hover:text-white",
  ghost: "text-ink hover:bg-brand-wash hover:text-brand",
  link: "",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-[0.95rem] gap-2",
  lg: "px-7 py-3.5 text-base gap-2",
};

const linkStyle =
  "inline-flex items-center gap-2 font-display font-semibold text-brand underline-offset-4 transition-colors duration-300 hover:underline [&_svg]:animate-[arrow-nudge_2.33s_ease-in-out_infinite]";

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  if (variant === "link") return `${linkStyle} ${extra}`;
  return [base, variants[variant], sizes[size], extra].join(" ");
}

export type ButtonVariant = Variant;
export type ButtonSize = Size;
