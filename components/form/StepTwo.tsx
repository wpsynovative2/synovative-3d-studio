import { ROLES, SIZES, STAGES } from "@/lib/schema";
import { Field, Select, TextArea, TextInput } from "./fields";
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
      <Field id={`${p}-email`} label="Email" required error={errors.email}>
        <TextInput id={`${p}-email`} type="email" autoComplete="email" {...bind("email")} />
      </Field>
      <Field id={`${p}-company`} label="Company / developer name" required error={errors.company}>
        <TextInput id={`${p}-company`} autoComplete="organization" {...bind("company")} />
      </Field>
      <Field id={`${p}-role`} label="I am a" required error={errors.role}>
        <Select id={`${p}-role`} options={ROLES} {...bind("role")} />
      </Field>
      <Field id={`${p}-location`} label="Project location" error={errors.project_location}>
        <TextInput id={`${p}-location`} placeholder="e.g. Thane West" {...bind("project_location")} />
      </Field>
      <Field id={`${p}-stage`} label="Project stage" error={errors.project_stage}>
        <Select id={`${p}-stage`} options={STAGES} {...bind("project_stage")} />
      </Field>
      <Field id={`${p}-size`} label="Approx. project size" error={errors.project_size}>
        <Select id={`${p}-size`} options={SIZES} {...bind("project_size")} />
      </Field>
      <div className="sm:col-span-2">
        <Field
          id={`${p}-message`}
          label="Message"
          error={errors.message}
          hint="Launch date, number of towers, interiors needed… Drawings can be shared after the call."
        >
          <TextArea id={`${p}-message`} {...bind("message")} />
        </Field>
      </div>
    </div>
  );
}
