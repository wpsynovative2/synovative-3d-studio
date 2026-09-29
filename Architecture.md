# Architecture — synovative3dstudio.in

Single-page, ad-traffic landing page for **Synovative 3D Studio**, selling 3D walkthrough films to real-estate developers, builders and architects (primary market: Mumbai MMR).

The page has one job: turn paid traffic (Meta + Google Ads) into qualified enquiries. Every section ends in a CTA, the lead form is never more than one scroll or one tap away, and every lead is tracked back to the ad that produced it.

---

## 1. Goals and success metrics

| Metric | Target / note |
|---|---|
| Primary conversion | Lead form submit (→ `/thank-you`) |
| Secondary conversions | Click-to-call, WhatsApp click |
| Quality signal | Leads that are developers / architects with a live or upcoming project |
| Page speed | LCP < 2.5s on 4G mobile, CLS < 0.1 |
| Form completion rate | Track step 1 → step 2 drop-off |

Offer rules for all copy and CTAs: **no "free" offers** (no free samples, free renders, free demo). Sell speed, quality and sales impact instead.

---

## 2. Tech stack

Matches the main Synovative site (Next.js on Vercel) so components and tokens can be shared.

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Same as synovative.vercel.app, SSG for speed |
| Styling | Tailwind CSS with tokens copied from the main site | Exact visual match |
| Hosting | Vercel, domain `synovative3dstudio.in` | Edge CDN, preview deploys per ad variant |
| Video | Mux or Cloudflare Stream (HLS, adaptive bitrate) | Hero video must not block LCP; adaptive quality on 4G |
| Forms | Next.js Route Handler `POST /api/lead` | Server-side validation, CRM push, CAPI event |
| CRM | Zoho CRM (Leads module) via REST API | Existing agency CRM |
| Lead sheet | Google Sheet written by a Google Apps Script web app (`doPost`) | Every lead also lands in a sheet the team can see, filter and share instantly |
| Notifications | Email to sales + WhatsApp (via WATI / Interakt or Zoho flow) | Speed-to-lead |
| Tracking | GTM (web) → server GTM on Stape → Meta CAPI, GA4, Google Ads | Survives iOS / ad-blocker loss, dedupes with Pixel |
| Anti-spam | Honeypot field + Cloudflare Turnstile (invisible) | Keeps junk out of CRM |

---

## 3. Design system

### 3.1 Source of truth

Take the palette, typography, radius, spacing and button styles **exactly** from synovative.vercel.app. Do not re-pick values by eye: copy `tailwind.config.*` and `globals.css` (CSS variables) from the main site's repo into this project, or publish them as a shared package (`@synovative/tokens`) that both sites import.

### 3.2 Confirmed values from the live site

| Token | Value | Where it appears |
|---|---|---|
| `--color-ink` / theme color | `#17131f` | `meta theme-color`; deep aubergine-black base |
| `--color-brand` | `#5f3ca7` | Brand purple (used in the site's placeholder artwork and accents) |

Everything else (surface, muted text, borders, secondary accent, fonts, radius scale, shadows) must be pulled from the main site's config files — list them here once copied:

```
--color-ink:        #17131f
--color-brand:      #5f3ca7
--color-surface:    <copy from main site>
--color-surface-2:  <copy from main site>
--color-text:       <copy from main site>
--color-text-muted: <copy from main site>
--color-border:     <copy from main site>
--font-display:     <copy from main site>
--font-body:        <copy from main site>
--radius-*:         <copy from main site>
```

### 3.3 Theme behaviour carried over from the main site

- Full-bleed hero video with a scroll cue, same as the main site's home hero.
- Same header treatment (logo left, primary CTA button right), same footer structure.
- Same button styles: primary (brand fill) for "Get Your ___ Project Live" CTAs, secondary (outline) for "See walkthroughs" / "Call" actions.
- Same voice: plain, specific, slightly dry ("Film that sells the space, not the camera").

### 3.4 Landing-page-specific additions

- **Sticky mobile action bar** (bottom): Call · WhatsApp · Get a quote.
- **Sticky desktop header CTA** that stays visible after scrolling past the hero.
- Video cards with a poster frame and play icon; clicking opens a lightbox player (no autoplay except the hero).

---

## 4. Page structure

Single route `/` with anchor sections, plus `/thank-you` and `/privacy`. Navigation is anchors only — no links out to the main site above the footer (every exit link is a lost lead).

```
┌──────────────────────────────────────────────┐
│ Header: logo · anchors · [Call] [Get a quote]│
├──────────────────────────────────────────────┤
│ 1  HERO — full-bleed 3D walkthrough video    │
│    headline · 2 CTAs · trust strip           │
├──────────────────────────────────────────────┤
│ 2  Project types (Residential, Commercial…)  │
│    each card → its own CTA                   │
├──────────────────────────────────────────────┤
│ 3  Showreel / portfolio (filter by type)     │
├──────────────────────────────────────────────┤
│ 4  Why walkthroughs sell (outcomes)          │
├──────────────────────────────────────────────┤
│ 5  What you get (deliverables)               │
├──────────────────────────────────────────────┤
│ 6  Process + timeline                        │
├──────────────────────────────────────────────┤
│ 7  Numbers + client logos                    │
├──────────────────────────────────────────────┤
│ 8  Testimonials                              │
├──────────────────────────────────────────────┤
│ 9  FAQ                                       │
├──────────────────────────────────────────────┤
│ 10 Final CTA + lead form                     │
├──────────────────────────────────────────────┤
│ Footer                                       │
└──────────────────────────────────────────────┘
[ Mobile sticky bar: Call | WhatsApp | Get a quote ]
```

### 4.1 Header (`<SiteHeader />`)
- Logo (links to `#top`), anchors: Projects · Work · Process · FAQ.
- Right side: phone number (click-to-call) + **[ Get a Quote ]** primary button → scrolls to `#enquiry`.
- Becomes solid + compact after 80px scroll.

### 4.2 Hero (`<HeroVideo />`) — `#top`
- **Background:** the 3D walkthrough showreel, `autoplay muted loop playsinline`, 15–30s cut, HLS stream, with a compressed poster image as the LCP element.
- Dark gradient overlay (from `--color-ink`) for text legibility.
- Headline (example): *Sell the project before the first slab is poured.*
- Sub-line: *Photoreal 3D walkthrough films for residential, commercial, industrial and villa projects — delivered in weeks, built for launch campaigns.*
- CTAs: **[ Get Your Project Live in 3D ]** (primary → `#enquiry`) · **[ Watch the Showreel ]** (secondary → opens full showreel with sound in lightbox).
- Trust strip under CTAs: projects delivered · developers served · average delivery time.
- Optional sound toggle on the hero video.

### 4.3 Project types (`<ProjectTypes />`) — `#projects`
One card per segment: poster image/looping 5s clip, one-line pitch, and a segment-specific CTA that pre-fills the form's "Project type" field.

| Segment | Pitch angle | CTA |
|---|---|---|
| Residential projects | Show buyers the flat, the view and the amenities before possession | **Get Your Residential Project Live** |
| Commercial projects | Walk investors and tenants through offices, retail and frontage | **Get Your Commercial Project Live** |
| Industrial projects | Explain plant layout, logistics flow and scale to stakeholders | **Get Your Industrial Project Live** |
| Villas & bungalows | Sell a lifestyle: interiors, landscape, pool, golden-hour light | **Get Your Villa Project Live** |
| Townships & plotted developments | Aerial master-plan flythroughs, connectivity, amenity zones | **Get Your Township Live** |
| Hospitality & interiors | Hotels, clubhouses, show-flat interiors | **Get Your Interior Walkthrough** |

CTA behaviour: `onClick → setProjectType(segment) → scroll to #enquiry → focus Name field`.

### 4.4 Showreel / portfolio (`<WorkGallery />`) — `#work`
- Filter chips: All · Residential · Commercial · Industrial · Villas · Townships.
- Grid of video cards (poster + duration + project name + city). Click → lightbox player.
- Videos load only on click (no preloading of gallery videos).
- Section CTA: **[ Want one like this? Get a Quote ]**. Inside the lightbox, a CTA under the player: **[ Get a walkthrough like this ]** (pre-fills project type from the video's category).

### 4.5 Why walkthroughs sell (`<Outcomes />`)
Three to four outcome blocks, written for developers:
- Pre-launch and under-construction selling — buyers see the finished project.
- Faster site-visit conversion — sales team pitches with a film, not a floor plan.
- One asset, every channel — ads, reels, sales gallery screens, channel-partner WhatsApp.
- Clarity for approvals and investors.
- CTA: **[ Start Selling Before Construction ]**

### 4.6 What you get (`<Deliverables />`)
- Exterior walkthrough film (60–120s)
- Interior walkthrough (sample flat / show unit)
- Aerial flythrough and master-plan animation
- Amenity and lifestyle shots
- Vertical cut-downs for Reels / Shorts / ads
- Still renders (bonus frames from the same scene)
- Voice-over, music and branding
- CTA: **[ Get the Full Package Quote ]**

### 4.7 Process (`<Process />`) — `#process`
A real sequence, so numbered steps are appropriate:
1. Share drawings (CAD / elevations / floor plans) and brief
2. 3D modelling and material approval
3. Lighting, landscaping and camera path approval
4. Animation and render
5. Edit, music, voice-over, revisions
6. Final delivery in all formats

Show typical timeline per project size. CTA: **[ Send Us Your Drawings ]** (opens form with a note field hint "Drawings can be shared after the call").

### 4.8 Numbers + logos (`<ProofBar />`)
- Studio-specific counters (walkthroughs delivered, sq. ft. visualised, developers served). **Use real 3D-studio numbers only** — the main site's agency-wide figures are not interchangeable.
- Developer logo strip (clients who approved logo usage).
- CTA: **[ Join These Developers ]**

<!-- ### 4.9 Testimonials (`<Testimonials />`)
- 3–5 quotes from developers / marketing heads, name + role + company.
- Prefer quotes that mention sales impact of walkthroughs.
- CTA: **[ Get Your Project Live ]** -->

### 4.10 FAQ (`<FAQ />`) — `#faq`
Accordion. Suggested questions:
- How long does a walkthrough take?
- What do you need from us to start?
- How many revisions are included?
- Can you work from 2D drawings only?
- Do you deliver formats for ads and Reels?
- Do you work outside Mumbai?
- How is pricing decided? (by area, number of scenes, interior count, duration)

Each answer can end with an inline CTA link to `#enquiry`. Add `FAQPage` JSON-LD.

### 4.11 Final CTA + lead form (`<Enquiry />`) — `#enquiry`
Two-column on desktop (pitch + contact options left, form right), stacked on mobile with form first.
- Heading: *Tell us about your project.*
- Left side: phone, WhatsApp, email, office address, working hours.
- Right side: lead form (spec in §6).

### 4.12 Footer (`<SiteFooter />`)
Logo, one-line description, contact, social icons, link to synovative.in, privacy policy, © line. Mirrors the main site's footer.

### 4.13 Persistent CTAs
- **Mobile sticky bar** (`<MobileActionBar />`), visible after the hero: `Call` (tel:) · `WhatsApp` (wa.me with pre-filled message) · `Get a Quote` (→ `#enquiry`). Hidden when the form is in view.
- **Desktop header CTA** always visible.
- Optional **exit-intent / 45s-delay modal** on desktop only, with a short 3-field form. Show once per session. Test before keeping.

---

## 5. CTA inventory

| Location | Label | Action | Tracking event |
|---|---|---|---|
| Header | Get a Quote | scroll `#enquiry` | `cta_click {location: header}` |
| Header | Phone number | `tel:` | `call_click` |
| Hero | Get Your Project Live in 3D | scroll `#enquiry` | `cta_click {location: hero}` |
| Hero | Watch the Showreel | lightbox | `video_play {id: showreel}` |
| Project cards | Get Your {Segment} Project Live | prefill + scroll | `cta_click {segment}` |
| Gallery | Want one like this? / Get a walkthrough like this | prefill + scroll | `cta_click {location: gallery}` |
| Outcomes | Start Selling Before Construction | scroll | `cta_click` |
| Deliverables | Get the Full Package Quote | scroll | `cta_click` |
| Process | Send Us Your Drawings | scroll | `cta_click` |
| Proof / Testimonials | Join These Developers / Get Your Project Live | scroll | `cta_click` |
| Mobile bar | Call · WhatsApp · Get a Quote | tel / wa.me / scroll | `call_click` / `whatsapp_click` / `cta_click` |
| Form | Get My Walkthrough Quote | submit | `Lead` |

Rule: one CTA vocabulary. The submit button says what happens ("Get My Walkthrough Quote"), and the thank-you page confirms the same thing ("Your quote request is in").

---

## 6. Lead form

### 6.1 Fields (two-step to reduce friction)

**Step 1 (always visible)**
| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | yes | |
| Mobile | tel | yes | Indian format, `+91` prefix, 10 digits starting 6–9 |
| Project type | select | yes | Residential / Commercial / Industrial / Villa / Township / Interiors / Other — pre-filled by segment CTAs |

**Step 2**
| Field | Type | Required | Notes |
|---|---|---|---|
| Email | email | yes | |
| Company / developer name | text | yes | Qualification signal |
| I am a | select | yes | Developer / Architect / Channel partner / Marketing agency / Other |
| Project location | text | no | |
| Project stage | select | no | Pre-launch / Under construction / Ready |
| Approx. project size | select | no | e.g. < 1 tower / 2–5 towers / Township / Single villa |
| Message | textarea | no | |

**Hidden fields:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`, `_fbp`, `_fbc`, `landing_variant`, `page_url`, `event_id` (UUID generated client-side for Pixel/CAPI dedup).

Step 1 is saved as a partial lead on "Next" so abandoned step-2 users can still be called.

### 6.2 Validation and spam
- Client: zod schema shared with server.
- Server: re-validate with the same schema, reject honeypot hits, verify Turnstile token, rate-limit by IP (e.g. 5/min).

---

## 7. Lead pipeline

```
Browser form
   │  POST /api/lead  (JSON + event_id + UTMs + fbp/fbc)
   ▼
Next.js Route Handler
   ├─► validate (zod) + Turnstile + honeypot
   ├─► Google Sheet: POST to Apps Script web app → append row   (see §7.1)
   ├─► Zoho CRM: create/update Lead
   │      Lead_Source = "3D Studio LP"
   │      map UTMs, project type, role, stage → custom fields
   │      dedupe on mobile number
   ├─► Notify sales: email + WhatsApp template to sales number
   ├─► Auto-reply to lead: WhatsApp/email "We'll call you within X working hours"
   └─► return 200 → client redirects to /thank-you?lt=<project_type>
                         │
                         ▼
              /thank-you fires Lead event (Pixel + GA4 + Google Ads)
              server side: sGTM sends Lead to Meta CAPI with same event_id
```

The Sheet write and the Zoho write run in parallel (`Promise.allSettled`), so a slow or failing Zoho call never delays the Sheet row, and the reverse. The user is redirected to `/thank-you` as long as **at least one** of them succeeded.

Failure handling: if both fail, email the full lead payload to sales immediately and log it (Vercel logs) for manual entry. If only one fails, email an alert naming the failed destination so the row or CRM record can be added by hand. A lead must never be lost because a downstream API failed.

### 7.1 Google Sheet via Apps Script

**Why server-to-script, not browser-to-script:** the browser posts only to our own `/api/lead`. The Next.js route then calls the Apps Script URL with a shared secret. This keeps the script URL and secret out of the page source, so nobody can spam the sheet directly, and it works with the same validation and Turnstile check as the CRM.

#### Sheet layout

Spreadsheet: **"Synovative 3D Studio — Leads"**, tab **`Leads`**. Row 1 headers (the script writes in this exact order):

| Col | Header | Source |
|---|---|---|
| A | Timestamp (IST) | set by script |
| B | Lead ID | `event_id` |
| C | Status | `Partial` (step 1 only) / `Complete` |
| D | Name | form |
| E | Mobile | form |
| F | Email | form |
| G | Company | form |
| H | Role | form (Developer / Architect / …) |
| I | Project type | form |
| J | Project location | form |
| K | Project stage | form |
| L | Project size | form |
| M | Message | form |
| N | Landing variant | hidden |
| O | UTM source | hidden |
| P | UTM medium | hidden |
| Q | UTM campaign | hidden |
| R | UTM content | hidden |
| S | UTM term | hidden |
| T | fbclid | hidden |
| U | gclid | hidden |
| V | Page URL | hidden |
| W | Zoho sync | `OK` / `FAILED` (updated by the API route) |

Sales-team columns (call status, remarks, site-visit date) go **to the right of column W** so the script never overwrites them.

**Partial → Complete:** step 1 creates a row with `Status = Partial`. When step 2 is submitted with the same Lead ID, the script finds that row and updates it to `Complete` instead of adding a duplicate.

#### Apps Script (`Code.gs`)

```javascript
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
```

Notes on the script:
- Apps Script `doPost` cannot read custom request headers, so the shared secret travels in the JSON body.
- `LockService` prevents two simultaneous submissions from colliding on the same row.
- The `clean()` function stops a lead typing `=HYPERLINK(...)` into a field and having it run as a formula.
- Mobile numbers are prefixed as text only if they start with `+`; set column E's number format to **Plain text** so `+91…` is kept as typed.

#### Deployment steps

1. Create the spreadsheet and the `Leads` tab with the headers above; freeze row 1.
2. **Extensions → Apps Script**, paste `Code.gs`.
3. **Project Settings → Script properties**: add `SHARED_SECRET` = a long random string (same value as `GSHEET_SECRET` in Vercel).
4. **Deploy → New deployment → Web app**: *Execute as:* Me (the agency Google account that owns the sheet). *Who has access:* Anyone. Copy the `/exec` URL into `GSHEET_WEBAPP_URL`.
5. After any script change, use **Manage deployments → Edit → New version** so the same URL keeps working.
6. Share the sheet (view or edit) with the sales team; never share the script URL or secret.

#### Calling it from Next.js (`lib/gsheet.ts`)

```typescript
export async function appendLeadToSheet(lead: Record<string, string>) {
  const res = await fetch(process.env.GSHEET_WEBAPP_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.GSHEET_SECRET, lead }),
    redirect: 'follow',              // Apps Script answers /exec with a 302 to the result
    signal: AbortSignal.timeout(8000),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Sheet write failed: ${data.error}`);
  return data;
}
```

Used in `app/api/lead/route.ts`:

```typescript
const [sheet, zoho] = await Promise.allSettled([
  appendLeadToSheet(lead),
  createZohoLead(lead),
]);

// record Zoho result in the sheet row (same event_id → updates column W)
await appendLeadToSheet({
  event_id: lead.event_id,
  mobile: lead.mobile,
  zoho_sync: zoho.status === 'fulfilled' ? 'OK' : 'FAILED',
}).catch(() => {});

if (sheet.status === 'rejected' && zoho.status === 'rejected') {
  await emailLeadToSales(lead, 'BOTH_FAILED');
} else if (sheet.status === 'rejected' || zoho.status === 'rejected') {
  await emailLeadToSales(lead, sheet.status === 'rejected' ? 'SHEET_FAILED' : 'ZOHO_FAILED');
}
```

#### Optional add-ons in the sheet
- **New-lead email alert** from the script (`MailApp.sendEmail` after `appendRow`) if sales want it without depending on the website's email service.
- **Conditional formatting**: highlight `Partial` rows (to call first) and `FAILED` in column W.
- **Daily summary**: a time-driven trigger that emails yesterday's lead count by project type and UTM campaign.

Quotas to know: Apps Script web apps handle this page's volume easily (hundreds of leads a day), but a single run is limited to 6 minutes and there is a daily cap on `MailApp` emails, so keep the email alerts on the website side for high volume.

---

## 8. Tracking and attribution

| Layer | Setup |
|---|---|
| Web GTM | Loaded with `next/script` (afterInteractive). Consent-aware. |
| Server GTM | Stape container on a first-party subdomain (e.g. `track.synovative3dstudio.in`) |
| Meta | Pixel (browser) + Conversions API (server) with shared `event_id` for dedup; send hashed email/phone (`em`, `ph`), `fbp`, `fbc`, client IP and UA |
| GA4 | Via sGTM; `generate_lead` as key event |
| Google Ads | Conversion on `/thank-you` + enhanced conversions (hashed email/phone) |

### Event map
| Event | Trigger | Meta | GA4 |
|---|---|---|---|
| Page view | load | PageView | page_view |
| Hero/gallery video play | play / 25 / 50 / 75 / 100% | ViewContent (on 50%) | video_progress |
| CTA click | any CTA | — | cta_click (with location/segment) |
| Form step 1 complete | "Next" | InitiateCheckout-style custom `LeadStart` | form_start |
| Lead | successful submit | Lead | generate_lead |
| Call / WhatsApp click | tap | Contact | contact_click |

Optimise Meta campaigns on `Lead`; once volume allows, pass qualified-lead status back from Zoho as an offline/CRM event so the algorithm learns lead quality, not just form fills.

---

## 9. Performance budget

| Item | Budget |
|---|---|
| Hero poster (LCP) | AVIF/WebP, ≤ 120 KB, `priority` via `next/image` |
| Hero video | HLS; starts after poster paints; lowest rendition ≤ 800 kbps; on `Save-Data` or slow connection show poster + play button instead of autoplay |
| JS (first load) | ≤ 120 KB gzipped |
| Fonts | Self-hosted via `next/font`, `display: swap`, max 2 families |
| Gallery | Posters lazy-loaded; players mount only on click |
| Third-party | GTM only; everything else routed through sGTM |

Respect `prefers-reduced-motion`: pause hero autoplay and show poster with a play button.

---

## 10. SEO and meta

This is a paid-traffic page, but it should still rank for brand and "3D walkthrough Mumbai" searches.
- Title: `3D Walkthrough Videos for Real Estate | Synovative 3D Studio`
- Description focused on residential, commercial, industrial and villa walkthroughs in Mumbai.
- JSON-LD: `Organization`, `LocalBusiness`, `VideoObject` (showreel), `FAQPage`.
- OG image: frame from the showreel.
- Ad-variant URLs (`/lp/*`) set to `noindex` with canonical to `/`.

---

## 11. Ad variants

Keep one codebase, many message-matched pages:
- `/` — generic
- `/lp/residential`, `/lp/commercial`, `/lp/industrial`, `/lp/villas`, `/lp/township`

Each variant reuses all sections but swaps: hero headline, hero video, first project card, pre-selected project type, and testimonial order. Driven by a single content config (`content/variants.ts`), so a new variant is a config entry, not new code. `landing_variant` is sent with every lead.

---

## 12. Folder structure

```
synovative3dstudio/
├─ app/
│  ├─ layout.tsx               # fonts, GTM, header/footer, tokens
│  ├─ page.tsx                 # generic landing
│  ├─ lp/[segment]/page.tsx    # message-matched variants (SSG)
│  ├─ thank-you/page.tsx       # conversion page
│  ├─ privacy/page.tsx
│  └─ api/lead/route.ts        # validation → Zoho → notify
├─ components/
│  ├─ layout/ SiteHeader, SiteFooter, MobileActionBar
│  ├─ sections/ HeroVideo, ProjectTypes, WorkGallery, Outcomes,
│  │            Deliverables, Process, ProofBar, Testimonials, FAQ, Enquiry
│  ├─ ui/ Button, VideoCard, VideoLightbox, Accordion, Chip
│  └─ form/ LeadForm, StepOne, StepTwo, fields
├─ content/
│  ├─ projects.ts              # portfolio videos (id, category, poster, stream id)
│  ├─ segments.ts              # project types + CTA labels
│  ├─ testimonials.ts
│  ├─ faq.ts
│  └─ variants.ts              # per-ad-variant overrides
├─ lib/
│  ├─ zoho.ts                  # token refresh + createLead
│  ├─ gsheet.ts                # POST lead to Apps Script web app
│  ├─ notify.ts                # email / WhatsApp
│  ├─ tracking.ts              # dataLayer helpers, event_id
│  ├─ utm.ts                   # capture + persist UTMs / click IDs
│  └─ schema.ts                # zod lead schema (shared)
├─ apps-script/Code.gs        # copy of the Sheet script, kept in git
├─ styles/globals.css          # tokens copied from main Synovative site
├─ tailwind.config.ts          # extended from main site config
└─ public/ posters, logos, og-image
```

---

## 13. Environment variables

```
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_API_DOMAIN=https://www.zohoapis.in
GSHEET_WEBAPP_URL=https://script.google.com/macros/s/<deployment-id>/exec
GSHEET_SECRET=
NOTIFY_EMAIL_TO=
WHATSAPP_API_KEY=
WHATSAPP_SALES_NUMBER=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_SGTM_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_PHONE_NUMBER=
MUX_TOKEN_ID= / CLOUDFLARE_STREAM_TOKEN=
```

---

## 14. Accessibility baseline

- Hero video has a visible pause control and is `aria-hidden` as decoration; showreel lightbox has captions where there is voice-over.
- All CTAs are real `<a>`/`<button>` elements with visible focus rings.
- Form fields have labels (not placeholder-only), inline errors that say how to fix the input.
- Text over video meets 4.5:1 contrast (enforced by the ink gradient overlay).

---

## 15. Open items

- [ ] Copy exact tokens (colors, fonts, radius, shadows) from the main Synovative site repo into §3.2.
- [ ] Final hero showreel cut (15–30s loop + full version with sound).
- [ ] Portfolio videos tagged by category with approval to publish.
- [ ] Real 3D-studio numbers for the proof bar.
- [ ] Developer testimonials specific to walkthroughs.
- [ ] Create the Leads sheet, deploy the Apps Script web app, set `SHARED_SECRET` and add the URL + secret to Vercel.
- [ ] Decide who on the sales team gets access to the Leads sheet.
- [ ] Zoho CRM custom fields for project type, role, stage, size, landing variant.
- [ ] WhatsApp Business number and approved message templates.
- [ ] Privacy policy page.
- [ ] Decide on exit-intent modal (A/B test before keeping).
