import { after } from "next/server";
import { fieldErrors, leadRequestSchema } from "@/lib/schema";
import { appendLeadToSheet } from "@/lib/gsheet";
import { createZohoLead } from "@/lib/zoho";
import { emailLeadToSales, notifySales } from "@/lib/notify";
import { rateLimited, verifyTurnstile } from "@/lib/spam";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = leadRequestSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });
  }
  const { website, turnstile_token, ...data } = parsed.data;

  // Honeypot hit: pretend success so bots don't retry, but store nothing.
  if (website) return Response.json({ ok: true });

  if (!(await verifyTurnstile(turnstile_token, ip))) {
    return Response.json({ ok: false, error: "Spam check failed. Please refresh and try again." }, { status: 403 });
  }

  const lead: Record<string, string> = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, String(v ?? "")]),
  );

  const [sheet, zoho] = await Promise.allSettled([appendLeadToSheet(lead), createZohoLead(lead)]);
  if (sheet.status === "rejected") console.error("[lead] sheet", sheet.reason);
  if (zoho.status === "rejected") console.error("[lead] zoho", zoho.reason);

  after(async () => {
    // Record the Zoho result in the sheet row (same event_id → updates column W).
    await appendLeadToSheet({
      event_id: lead.event_id,
      mobile: lead.mobile,
      zoho_sync: zoho.status === "fulfilled" ? "OK" : "FAILED",
    }).catch(() => {});

    if (sheet.status === "rejected" && zoho.status === "rejected") {
      await emailLeadToSales(lead, "BOTH_FAILED");
    } else if (sheet.status === "rejected" || zoho.status === "rejected") {
      await emailLeadToSales(lead, sheet.status === "rejected" ? "SHEET_FAILED" : "ZOHO_FAILED");
    }
    await notifySales(lead);
  });

  if (sheet.status === "rejected" && zoho.status === "rejected") {
    // The payload is still emailed + logged in after(), so the lead is not lost.
    return Response.json(
      { ok: false, error: "We couldn't save your request. Please call or WhatsApp us and we'll take it from there." },
      { status: 502 },
    );
  }
  return Response.json({ ok: true });
}
