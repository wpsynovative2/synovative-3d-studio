// Capture UTMs / click IDs on landing and keep them for the session, so a lead that browses
// before converting is still attributed to the ad that brought them in.

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;
const STORAGE_KEY = "s3d_attribution";

export type Attribution = Record<(typeof KEYS)[number], string>;

function read(): Partial<Attribution> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function captureAttribution(): Attribution {
  const stored = read();
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Partial<Attribution> = {};
  for (const k of KEYS) {
    const v = params.get(k);
    if (v) fromUrl[k] = v;
  }
  // A fresh ad click (new UTMs in the URL) replaces the stored set.
  const merged = Object.keys(fromUrl).length ? fromUrl : stored;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {}
  return Object.fromEntries(KEYS.map((k) => [k, merged[k] ?? ""])) as Attribution;
}

function cookie(name: string): string {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

/** Meta browser IDs. _fbc is synthesised from fbclid when the Pixel hasn't set it yet. */
export function metaIds(fbclid: string) {
  const fbp = cookie("_fbp");
  let fbc = cookie("_fbc");
  if (!fbc && fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  return { _fbp: fbp, _fbc: fbc };
}
