import { PROJECT_TYPES } from "@/content/segments";
import { ROLES, UNSERVED_ROLES, type Role } from "@/lib/schema";
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
  const unserved = UNSERVED_ROLES.includes(values.role as Role);

  return (
    <div className="grid gap-5">
      <Field id={`${p}-role`} label="Your business" required error={errors.role}>
        <Select
          id={`${p}-role`}
          name="role"
          options={ROLES}
          value={values.role}
          onChange={(e) => onChange("role", e.target.value)}
          error={unserved ? undefined : errors.role}
        />
      </Field>

      {unserved ? (
        <div role="status" className="rounded-xl border border-line bg-accent-wash p-4 text-sm text-ink">
          <p className="font-display font-semibold">We&apos;re not taking on {values.role.toLowerCase()} projects right now.</p>
          <p className="mt-1 text-ink-soft">
            Thanks for thinking of us, and do
            check back later.
          </p>
        </div>
      ) : (
        <>
          {values.role === "Other" && (
            <Field id={`${p}-other_business`} label="What does your business do?" required error={errors.other_business}>
              <TextInput
                id={`${p}-other_business`}
                name="other_business"
                placeholder="e.g. Hotel group, retail brand, school"
                value={values.other_business}
                onChange={(e) => onChange("other_business", e.target.value)}
                error={errors.other_business}
              />
            </Field>
          )}

          <Field id={`${p}-name`} label="Name" required error={errors.name}>
            <TextInput
              id={`${p}-name`}
              name="name"
              autoComplete="name"
              placeholder="Your full name"
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

          <Field id={`${p}-project-type`} label="Project type" required error={errors.project_type}>
            <Select
              id={`${p}-project-type`}
              name="project_type"
              options={PROJECT_TYPES}
              value={values.project_type}
              onChange={(e) => onChange("project_type", e.target.value)}
              error={errors.project_type}
            />
          </Field>
        </>
      )}
    </div>
  );
}
