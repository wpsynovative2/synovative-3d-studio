import { PROJECT_TYPES } from "@/content/segments";
import { Field, Select, TextInput } from "./fields";
import type { FormValues } from "./LeadForm";

export function StepOne({
  p,
  values,
  errors,
  onChange,
}: {
  p: string;
  values: FormValues;
  errors: Record<string, string>;
  onChange: (name: keyof FormValues, value: string) => void;
}) {
  return (
    <div className="grid gap-5">
      <Field id={`${p}-name`} label="Name" required error={errors.name}>
        <TextInput
          id={`${p}-name`}
          name="name"
          autoComplete="name"
          placeholder="Enter Full Your Name"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={errors.name}
        />
      </Field>

      <Field id={`${p}-mobile`} label="Mobile" required error={errors.mobile}>
        <div className="flex">
          <span className="grid place-items-center rounded-l-xl border border-r-0 border-line-strong bg-paper-sunken px-3 text-sm font-semibold text-ink-soft">
            +91
          </span>
          <TextInput
            id={`${p}-mobile`}
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            maxLength={14}
            value={values.mobile}
            onChange={(e) => onChange("mobile", e.target.value)}
            error={errors.mobile}
            className="rounded-l-none"
          />
        </div>
      </Field>

      <Field
        id={`${p}-project-type`}
        label="Project type"
        required
        error={errors.project_type}
      >
        <Select
          id={`${p}-project-type`}
          name="project_type"
          options={PROJECT_TYPES}
          value={values.project_type}
          onChange={(e) => onChange("project_type", e.target.value)}
          error={errors.project_type}
        />
      </Field>
    </div>
  );
}
