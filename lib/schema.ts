import { z } from "zod";
import { PROJECT_TYPES } from "@/content/segments";

// Shared by the client form and POST /api/lead.

export const ROLES = ["Developer", "Architect", "Channel partner", "Marketing agency", "Other"] as const;
export const STAGES = ["Pre-launch", "Under construction", "Ready"] as const;
export const SIZES = ["< 1 tower", "2–5 towers", "Township", "Single villa", "Other"] as const;

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")]).optional().default("");

// Accepts 98765 43210, 09876543210, +91 98765 43210 → normalised to +919876543210.
export const mobileSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|0091|91(?=\d{10}$)|0(?=\d{10}$))/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9"))
  .transform((v) => `+91${v}`);

export const stepOneSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  mobile: mobileSchema,
  project_type: z.enum(PROJECT_TYPES, { error: "Choose a project type" }),
});

export const stepTwoSchema = z.object({
  email: z.email("Enter a valid email, e.g. name@company.com").max(200),
  company: z.string().trim().min(2, "Enter your company or developer name").max(150),
  role: z.enum(ROLES, { error: "Tell us who you are" }),
  project_location: optionalText(150),
  project_stage: optionalEnum(STAGES),
  project_size: optionalEnum(SIZES),
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
});

const antiSpam = z.object({
  website: z.string().optional().default(""), // honeypot — must stay empty
  turnstile_token: z.string().optional().default(""),
});

export const partialLeadSchema = stepOneSchema
  .extend(trackingSchema.shape)
  .extend(antiSpam.shape)
  .extend({ status: z.literal("Partial") });

export const completeLeadSchema = stepOneSchema
  .extend(stepTwoSchema.shape)
  .extend(trackingSchema.shape)
  .extend(antiSpam.shape)
  .extend({ status: z.literal("Complete") });

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
