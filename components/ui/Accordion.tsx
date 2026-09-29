import type { ReactNode } from "react";
import { ChevronDownIcon } from "./icons";

/** Native <details> accordion — works without JS and is keyboard accessible. */
export function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-b border-line py-5 [&[open]_svg]:rotate-180">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-medium">
        {title}
        <ChevronDownIcon className="shrink-0 text-ink-soft transition-transform" />
      </summary>
      <div className="mt-3 max-w-3xl text-ink-soft">{children}</div>
    </details>
  );
}
