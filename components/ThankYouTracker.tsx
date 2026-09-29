"use client";

import { useEffect } from "react";
import { track } from "@/lib/tracking";

/**
 * Fires the Lead conversion once per submission. event_id matches the one sent to /api/lead,
 * so sGTM can dedupe the browser Pixel event against the server CAPI event.
 */
export function ThankYouTracker() {
  useEffect(() => {
    let lead: { event_id?: string; project_type?: string; email?: string; mobile?: string } = {};
    try {
      lead = JSON.parse(sessionStorage.getItem("s3d_lead") || "{}");
      sessionStorage.removeItem("s3d_lead"); // refreshes don't double-count
    } catch {}
    if (!lead.event_id) return;
    track("generate_lead", {
      event_id: lead.event_id,
      project_type: lead.project_type || new URLSearchParams(location.search).get("lt") || "",
      // For enhanced conversions / CAPI; hashing happens in sGTM.
      user_data: { email: lead.email, phone_number: lead.mobile },
    });
  }, []);
  return null;
}
