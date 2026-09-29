// Zoho CRM (Leads module): OAuth refresh-token flow + upsert deduped on mobile number.
// Custom field API names (Project_Type, Role, …) must match the fields created in Zoho — see Architecture §15.

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

export async function createZohoLead(lead: Record<string, string>) {
  const token = await accessToken();
  const domain = process.env.ZOHO_API_DOMAIN || "https://www.zohoapis.in";
  const [first, ...rest] = (lead.name || "").split(" ");

  const record = {
    First_Name: rest.length ? first : "",
    Last_Name: rest.length ? rest.join(" ") : first || "Unknown",
    Mobile: lead.mobile,
    Email: lead.email || undefined,
    Company: lead.company || lead.name,
    City: lead.project_location || undefined,
    Description: lead.message || undefined,
    Lead_Source: "3D Studio LP",
    Lead_Status: lead.status === "Partial" ? "Partial" : undefined,
    // custom fields
    Project_Type: lead.project_type,
    Role: lead.role || undefined,
    Project_Stage: lead.project_stage || undefined,
    Project_Size: lead.project_size || undefined,
    Landing_Variant: lead.landing_variant || undefined,
    Lead_ID: lead.event_id,
    UTM_Source: lead.utm_source || undefined,
    UTM_Medium: lead.utm_medium || undefined,
    UTM_Campaign: lead.utm_campaign || undefined,
    UTM_Content: lead.utm_content || undefined,
    UTM_Term: lead.utm_term || undefined,
    fbclid: lead.fbclid || undefined,
    gclid: lead.gclid || undefined,
  };

  const res = await fetch(`${domain}/crm/v6/Leads/upsert`, {
    method: "POST",
    headers: { Authorization: `Zoho-oauthtoken ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ data: [record], duplicate_check_fields: ["Mobile"] }),
    signal: AbortSignal.timeout(8000),
  });
  const data = await res.json();
  const result = data?.data?.[0];
  if (!res.ok || result?.status !== "success") throw new Error(`Zoho upsert failed: ${JSON.stringify(data)}`);
  return result;
}
