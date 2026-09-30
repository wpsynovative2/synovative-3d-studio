import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

const control =
  "w-full rounded-xl border bg-paper px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25";

function border(error?: string) {
  return error ? "border-danger" : "border-line-strong";
}

export function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required ? <span className="text-brand"> *</span> : <span className="font-normal text-ink-faint"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-faint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

type Common = { id: string; error?: string; hint?: string };

const describedBy = ({ id, error, hint }: Common) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export function TextInput({ id, error, hint, className = "", ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      id={id}
      aria-invalid={!!error}
      aria-describedby={describedBy({ id, error, hint })}
      className={`${control} ${border(error)} ${className}`}
      {...rest}
    />
  );
}

export function Select({
  id,
  error,
  hint,
  options,
  placeholder = "Select…",
  className = "",
  ...rest
}: Common & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[]; placeholder?: string }) {
  return (
    <div className="relative">
    <select
      id={id}
      aria-invalid={!!error}
      aria-describedby={describedBy({ id, error, hint })}
      className={`${control} ${border(error)} cursor-pointer appearance-none pr-11 ${className}`}
      {...rest}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
      <ChevronDownIcon
        width={18}
        height={18}
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-soft"
      />
    </div>
  );
}

export function TextArea({ id, error, hint, className = "", ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      id={id}
      aria-invalid={!!error}
      aria-describedby={describedBy({ id, error, hint })}
      className={`${control} ${border(error)} min-h-28 ${className}`}
      {...rest}
    />
  );
}
