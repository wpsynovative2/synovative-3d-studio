// Sales notifications (email + WhatsApp). Providers are env-driven; with nothing configured
// the payload is logged to Vercel logs so a lead is never silently dropped.

export type FailureReason = "BOTH_FAILED" | "SHEET_FAILED" | "ZOHO_FAILED";

const LABELS = [
  ["Business", "role"],
  ["Business details", "other_business"],
  ["Name", "name"],
  ["Mobile", "mobile"],
  ["Email", "email"],
  ["Company / developer / project", "company"],
  ["Project type", "project_type"],
  ["Location", "project_location"],
  ["About the project", "message"],
  ["Status", "status"],
  ["Variant", "landing_variant"],
  ["UTM campaign", "utm_campaign"],
  ["Lead ID", "event_id"],
] as const;

function summary(lead: Record<string, string>) {
  return LABELS.filter(([, k]) => lead[k])
    .map(([label, k]) => `${label}: ${lead[k]}`)
    .join("\n");
}

async function sendEmail(subject: string, text: string) {
  const to = process.env.NOTIFY_EMAIL_TO;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) {
    console.warn("[notify] email not configured", { subject, text });
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFY_EMAIL_FROM || "Synovative 3D Studio <leads@synovative3dstudio.in>",
      to: to.split(",").map((s) => s.trim()),
      subject,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Email failed: ${res.status} ${await res.text()}`);
}

/**
 * WhatsApp via Interakt. Business-initiated messages must use a Meta-approved template, so we
 * send the template name + its {{1}}, {{2}}… values. Docs: https://www.interakt.shop/resource-center/send-template-messages
 */
async function sendInteraktTemplate(phone: string, template: string, bodyValues: string[], callbackData: string) {
  const key = process.env.WHATSAPP_API_KEY; // Interakt → Settings → Developer Settings → Secret Key
  if (!key || !template || !phone) return;
  const digits = phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  const res = await fetch("https://api.interakt.ai/v1/public/message/", {
    method: "POST",
    headers: { Authorization: `Basic ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      countryCode: "+91",
      phoneNumber: digits,
      callbackData,
      type: "Template",
      template: {
        name: template,
        languageCode: process.env.WHATSAPP_TEMPLATE_LANG || "en",
        // Interakt rejects empty variables, so fill blanks with a dash.
        bodyValues: bodyValues.map((v) => v || "-"),
      },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Interakt ${res.status}: ${await res.text()}`);
}

/**
 * Speed-to-lead: tell sales a new lead arrived. Never throws.
 * Sales template body must use 5 variables: {{1}} name, {{2}} mobile, {{3}} project type, {{4}} company, {{5}} status.
 */
export async function notifySales(lead: Record<string, string>) {
  const title = `New ${lead.status === "Partial" ? "partial " : ""}lead — ${lead.project_type} — ${lead.name}`;
  const results = await Promise.allSettled([
    sendEmail(title, summary(lead)),
    sendInteraktTemplate(
      process.env.WHATSAPP_SALES_NUMBER || "",
      process.env.WHATSAPP_SALES_TEMPLATE || "",
      [lead.name, lead.mobile, lead.project_type, lead.company, lead.status],
      `sales-alert:${lead.event_id}`,
    ),
  ]);
  for (const r of results) if (r.status === "rejected") console.error("[notify] sales alert failed", r.reason);
}

/**
 * Auto-reply to the lead ("we'll call you within one working day"). Complete leads only. Never throws.
 * Lead template body must use 2 variables: {{1}} first name, {{2}} project type.
 */
export async function notifyLead(lead: Record<string, string>) {
  if (lead.status !== "Complete") return;
  try {
    await sendInteraktTemplate(
      lead.mobile,
      process.env.WHATSAPP_LEAD_TEMPLATE || "",
      [lead.name.split(" ")[0], lead.project_type],
      `lead-reply:${lead.event_id}`,
    );
  } catch (err) {
    console.error("[notify] lead auto-reply failed", err);
  }
}

/** Fallback when the Sheet and/or Zoho write failed, so the lead can be entered by hand. */
export async function emailLeadToSales(lead: Record<string, string>, reason: FailureReason) {
  console.error(`[lead] ${reason}`, lead);
  try {
    await sendEmail(`[ACTION NEEDED] ${reason} — ${lead.name} ${lead.mobile}`, `${summary(lead)}\n\nFull payload:\n${JSON.stringify(lead, null, 2)}`);
  } catch (err) {
    console.error("[lead] fallback email failed", err);
  }
}
