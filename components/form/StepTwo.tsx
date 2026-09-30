import { Field, TextArea, TextInput } from "./fields";
import type { FormValues } from "./LeadForm";

export function StepTwo({
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
  const bind = (name: keyof FormValues) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (e: { target: { value: string } }) => onChange(name, e.target.value),
  });

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field id={`${p}-company`} label="Company / Developer Name / Project Name" required error={errors.company}>
          <TextInput id={`${p}-company`} autoComplete="organization" {...bind("company")} />
        </Field>
      </div>
      <Field id={`${p}-email`} label="Email" error={errors.email}>
        <TextInput id={`${p}-email`} type="email" autoComplete="email" {...bind("email")} />
      </Field>
      <Field id={`${p}-location`} label="Project location" error={errors.project_location}>
        <TextInput id={`${p}-location`} placeholder="e.g. Thane West" {...bind("project_location")} />
      </Field>
      <div className="sm:col-span-2">
        <Field
          id={`${p}-message`}
          label="Tell us about your project"
          error={errors.message}
          hint="Launch date, number of towers, interiors needed… Drawings can be shared after the call."
        >
          <TextArea id={`${p}-message`} {...bind("message")} />
        </Field>
      </div>
    </div>
  );
}
