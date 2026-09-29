const SHEET_NAME = 'Leads';
const COLUMNS = [
  'event_id', 'status', 'name', 'mobile', 'email', 'company', 'role',
  'project_type', 'project_location', 'project_stage', 'project_size',
  'message', 'landing_variant', 'utm_source', 'utm_medium', 'utm_campaign',
  'utm_content', 'utm_term', 'fbclid', 'gclid', 'page_url', 'zoho_sync'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // serialise concurrent submits

    const body = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (!secret || body.secret !== secret) return json({ ok: false, error: 'unauthorised' });

    const lead = body.lead || {};
    if (!lead.event_id || !lead.mobile) return json({ ok: false, error: 'missing event_id or mobile' });

    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd-MM-yyyy HH:mm:ss');
    const row = [timestamp].concat(COLUMNS.map(k => clean(lead[k])));

    // Update the existing row if this Lead ID is already there (Partial → Complete / Zoho sync)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const ids = sheet.getRange(2, 2, lastRow - 1, 1).getValues().flat();
      const idx = ids.indexOf(lead.event_id);
      if (idx !== -1) {
        const r = idx + 2;
        const existing = sheet.getRange(r, 1, 1, row.length).getValues()[0];
        // keep original timestamp; only overwrite cells that have a new value
        const merged = row.map((v, i) => (i === 0 || v === '') ? existing[i] : v);
        sheet.getRange(r, 1, 1, merged.length).setValues([merged]);
        return json({ ok: true, action: 'updated', row: r });
      }
    }

    sheet.appendRow(row);
    return json({ ok: true, action: 'appended', row: sheet.getLastRow() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Stop spreadsheet formula injection (values starting with = + - @)
function clean(v) {
  if (v === undefined || v === null) return '';
  const s = String(v).trim().slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
