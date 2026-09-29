// Sales notifications (email + WhatsApp). Providers are env-driven; with nothing configured
// the payload is logged to Vercel logs so a lead is never silently dropped.

export type FailureReason = "BOTH_FAILED" | "SHEET_FAILED" | "ZOHO_FAILED";

const LABELS = [
  ["Name", "name"],
  ["Mobile", "mobile"],
  ["Email", "email"],
  ["Company", "company"],
  ["Role", "role"],
  ["Project type", "project_type"],
  ["Location", "project_location"],
  ["Stage", "project_stage"],
  ["Size", "project_size"],
  ["Message", "message"],
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

async function sendWhatsApp(text: string) {
  const url = process.env.WHATSAPP_API_URL; // WATI / Interakt send-message endpoint
  const key = process.env.WHATSAPP_API_KEY;
  const to = process.env.WHATSAPP_SALES_NUMBER;
  if (!url || !key || !to) return;
  await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ to, text }),
    signal: AbortSignal.timeout(8000),
  });
}

/** Speed-to-lead: tell sales a new lead arrived. Never throws. */
export async function notifySales(lead: Record<string, string>) {
  const title = `New ${lead.status === "Partial" ? "partial " : ""}lead — ${lead.project_type} — ${lead.name}`;
  const body = summary(lead);
  await Promise.allSettled([sendEmail(title, body), sendWhatsApp(`${title}\n${body}`)]);
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
