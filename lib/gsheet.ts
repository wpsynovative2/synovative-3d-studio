// POST a lead to the Google Apps Script web app (apps-script/Code.gs). Server-only: the
// script URL and secret never reach the browser.

export async function appendLeadToSheet(lead: Record<string, string>) {
  const url = process.env.GSHEET_WEBAPP_URL;
  if (!url) throw new Error("GSHEET_WEBAPP_URL is not set");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: process.env.GSHEET_SECRET, lead }),
    redirect: "follow", // Apps Script answers /exec with a 302 to the result
    signal: AbortSignal.timeout(8000),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Sheet write failed: ${data.error}`);
  return data;
}
