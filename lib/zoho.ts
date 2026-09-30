// Zoho CRM (Leads module): OAuth refresh-token flow + create / update deduped on mobile number.
// Scope needed: ZohoCRM.modules.leads.ALL

const ACCOUNTS_URL = "https://accounts.zoho.in/oauth/v2/token";

let cached: { token: string; expires: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token;
  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN } = process.env;
  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) throw new Error("Zoho env vars are not set");

  const body = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  });
  const res = await fetch(ACCOUNTS_URL, { method: "POST", body, signal: AbortSignal.timeout(8000) });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Zoho token refresh failed: ${JSON.stringify(data)}`);
  cached = { token: data.access_token, expires: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cached.token;
}

/*
 * Maps the lead onto the agency CRM's EXISTING Leads fields (no custom fields needed):
 *   Industry      ← "Your business" (see INDUSTRY)    Single_Line_1 ("Business Category") ← other_business
 *   Phone         ← mobile                             Street ← project location
 *   Interested_Service ← "3D WalkThrough Video"        UTM_Parameter ← UTMs / click IDs / variant / URL
 *   Description   ← "Webform submission" + readable enquiry summary incl. Lead ID
 */
const SERVICE = "3D WalkThrough Video";

// Form "Your business" → Zoho Industry picklist. Send the label shown in Zoho: renamed default options
// keep an old internal value (e.g. "Real Estate Developer" is internally "ASP (Application Service
// Provider)"), and sending that shows up in Zoho as a separate stray option. If Zoho rejects a value,
// write() retries without Industry.
const INDUSTRY: Record<string, string> = {
  "Real estate developer": "Real Estate Developer",
  Architect: "Architect",
  "Marketing agency": "White Labeling",
  Other: "Small/Medium Enterprise",
};

function leadSource(lead: Record<string, string>) {
  const src = `${lead.utm_source} ${lead.utm_medium}`.toLowerCase();
  if (lead.fbclid || /facebook|instagram|meta|\bfb\b|\big\b/.test(src)) return "Meta";
  if (lead.gclid || /google|adwords|youtube/.test(src)) return "Advertisement";
  return "Website Form";
}

function enquiryBlock(lead: Record<string, string>) {
  const date = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const lines = [
    "Webform submission",
    `3D walkthrough enquiry — synovative3dstudio.in (${date})${lead.status === "Partial" ? " [PARTIAL: step 1 only, call first]" : ""}`,
    `Business: ${lead.role}${lead.other_business ? ` (${lead.other_business})` : ""}`,
    `Project type: ${lead.project_type}`,
    lead.company && `Company / developer / project: ${lead.company}`,
    lead.project_location && `Location: ${lead.project_location}`,
    lead.message && `About the project: ${lead.message}`,
    `Lead ID: ${lead.event_id}`,
  ];
  return lines.filter(Boolean).join("\n");
}

function utmBlock(lead: Record<string, string>) {
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "landing_variant", "page_url"];
  return keys.filter((k) => lead[k]).map((k) => `${k}=${lead[k]}`).join("\n") || undefined;
}

type ZohoLead = { id: string; Phone?: string | null; Description?: string | null; Interested_Service?: string[] | null };

async function zoho(path: string, init: RequestInit = {}) {
  const token = await accessToken();
  const domain = process.env.ZOHO_API_DOMAIN || "https://www.zohoapis.in";
  return fetch(`${domain}/crm/v6${path}`, {
    ...init,
    headers: { Authorization: `Zoho-oauthtoken ${token}`, "Content-Type": "application/json", ...init.headers },
    signal: AbortSignal.timeout(8000),
  });
}

async function findByMobile(mobile: string): Promise<ZohoLead | null> {
  const digits = mobile.replace(/\D/g, "").slice(-10);
  const res = await zoho(`/Leads/search?phone=${digits}&fields=id,Phone,Description,Interested_Service`);
  if (res.status === 204) return null; // no match
  const data = await res.json();
  if (!res.ok) throw new Error(`Zoho search failed: ${JSON.stringify(data)}`);
  return data?.data?.[0] ?? null;
}

async function write(method: "POST" | "PUT", path: string, record: Record<string, unknown>) {
  const send = async (rec: Record<string, unknown>) => {
    const res = await zoho(path, { method, body: JSON.stringify({ data: [rec] }) });
    const data = await res.json();
    return { ok: res.ok && data?.data?.[0]?.status === "success", data };
  };
  let { ok, data } = await send(record);

  // Industry value not in the Zoho picklist yet → save without it rather than lose the lead.
  if (!ok && record.Industry && JSON.stringify(data).includes("Industry")) {
    console.warn(`[zoho] Industry "${record.Industry}" rejected — add it to the Leads › Industry picklist`);
    const { Industry, ...rest } = record;
    ({ ok, data } = await send({ ...rest, Description: `Industry: ${Industry}\n${rest.Description ?? ""}` }));
  }
  if (!ok) throw new Error(`Zoho ${method} failed: ${JSON.stringify(data)}`);
  return data.data[0];
}

/**
 * New mobile → create a lead. Same enquiry (partial → complete) → update it in full.
 * Mobile already belongs to an existing CRM lead → only prepend this enquiry to its Description, refresh
 * UTM_Parameter and add the service; never reset its status, stage or owner.
 */
export async function createZohoLead(lead: Record<string, string>) {
  const [first, ...rest] = (lead.name || "").trim().split(/\s+/);
  const block = enquiryBlock(lead);
  const details = {
    Email: lead.email || undefined,
    Street: lead.project_location || undefined,
    Industry: INDUSTRY[lead.role],
    Single_Line_1: lead.role === "Other" ? lead.other_business || undefined : undefined,
    UTM_Parameter: utmBlock(lead),
  };

  // Step 2 carries the id step 1 created (search can lag behind a just-created record). Only trusted
  // if that record really holds this enquiry's Lead ID, so a forged id can't touch other leads.
  let existing: ZohoLead | null = null;
  if (/^\d{10,25}$/.test(lead.zoho_id || "")) {
    const res = await zoho(`/Leads/${lead.zoho_id}?fields=id,Phone,Description,Interested_Service`);
    const rec: ZohoLead | undefined = res.ok ? (await res.json())?.data?.[0] : undefined;
    if (rec?.Description?.includes(`Lead ID: ${lead.event_id}`)) existing = rec;
  }
  existing ??= await findByMobile(lead.mobile);

  if (!existing) {
    return write("POST", "/Leads", {
      First_Name: rest.length ? first : undefined,
      Last_Name: rest.length ? rest.join(" ") : first || "Unknown",
      Phone: lead.mobile,
      Company: lead.company || lead.name,
      Lead_Source: leadSource(lead),
      Lead_Status: "Not Contacted",
      Lead_Stage: "Not Contacted",
      Interested_Service: [SERVICE],
      Description: block,
      ...details,
    });
  }

  const services = Array.from(new Set([...(existing.Interested_Service ?? []), SERVICE]));
  const oldDescription = existing.Description ?? "";
  const sameEnquiry = oldDescription.includes(`Lead ID: ${lead.event_id}`);

  // Replace this enquiry's own block (partial → complete); otherwise stack the new enquiry on top.
  const description = sameEnquiry
    ? oldDescription.replace(/Webform submission[\s\S]*?Lead ID: \S+/, block)
    : [block, oldDescription].filter(Boolean).join("\n\n———\n\n");

  return write("PUT", `/Leads/${existing.id}`, {
    Description: description,
    Interested_Service: services,
    ...(sameEnquiry && lead.company ? { Company: lead.company } : {}),
    ...(!existing.Phone && { Phone: lead.mobile }), // older leads kept the number in Mobile only
    ...details,
  });
}
