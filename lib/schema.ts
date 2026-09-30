import { z } from "zod";
import { PROJECT_TYPES } from "@/content/segments";

// Shared by the client form and POST /api/lead.

export const ROLES = [
  "Real estate developer",
  "Architect",
  "Channel partner",
  "Contractor",
  "Marketing agency",
  "Other",
] as const;
export type Role = (typeof ROLES)[number];

/** Business types we don't take on right now — the form explains and hides the submit button. */
export const UNSERVED_ROLES: readonly Role[] = ["Channel partner", "Contractor"];

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

// Accepts 98765 43210, 09876543210, +91 98765 43210 → normalised to +919876543210.
export const mobileSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|0091|91(?=\d{10}$)|0(?=\d{10}$))/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9"))
  .transform((v) => `+91${v}`);

const stepOneBase = z.object({
  role: z.enum(ROLES, { error: "Choose your business" }),
  other_business: optionalText(150), // required when role is "Other"
  name: z.string().trim().min(2, "Enter your name").max(100),
  mobile: mobileSchema,
  project_type: z.enum(PROJECT_TYPES, { error: "Choose a project type" }),
});

// Applied to every schema that contains step 1 (refined schemas can't be .extend()ed in Zod 4).
function checkRole(v: { role: Role; other_business: string }, ctx: z.RefinementCtx) {
  if (UNSERVED_ROLES.includes(v.role))
    ctx.addIssue({ code: "custom", path: ["role"], message: `We're not taking on ${v.role.toLowerCase()} projects right now.` });
  if (v.role === "Other" && v.other_business.length < 2)
    ctx.addIssue({ code: "custom", path: ["other_business"], message: "Tell us what your business does" });
}

export const stepOneSchema = stepOneBase.superRefine(checkRole);

export const stepTwoSchema = z.object({
  email: z.union([z.email("Enter a valid email, e.g. name@company.com").max(200), z.literal("")]).optional().default(""),
  company: z.string().trim().min(2, "Enter your company, developer or project name").max(150),
  project_location: optionalText(150),
  message: optionalText(2000),
});

export const trackingSchema = z.object({
  event_id: z.uuid(),
  landing_variant: optionalText(60),
  page_url: optionalText(1000),
  utm_source: optionalText(200),
  utm_medium: optionalText(200),
  utm_campaign: optionalText(200),
  utm_content: optionalText(200),
  utm_term: optionalText(200),
  fbclid: optionalText(500),
  gclid: optionalText(500),
  _fbp: optionalText(200),
  _fbc: optionalText(500),
  zoho_id: optionalText(25), // returned by step 1, sent back with step 2
});

const antiSpam = z.object({
  website: z.string().optional().default(""), // honeypot — must stay empty
  turnstile_token: z.string().optional().default(""),
});

export const partialLeadSchema = stepOneBase
  .extend(trackingSchema.shape)
  .extend(antiSpam.shape)
  .extend({ status: z.literal("Partial") })
  .superRefine(checkRole);

export const completeLeadSchema = stepOneBase
  .extend(stepTwoSchema.shape)
  .extend(trackingSchema.shape)
  .extend(antiSpam.shape)
  .extend({ status: z.literal("Complete") })
  .superRefine(checkRole);

export const leadRequestSchema = z.discriminatedUnion("status", [partialLeadSchema, completeLeadSchema]);

export type LeadRequest = z.infer<typeof leadRequestSchema>;
export type StepOne = z.input<typeof stepOneSchema>;
export type StepTwo = z.input<typeof stepTwoSchema>;

/** Field name → first error message, for inline form errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
