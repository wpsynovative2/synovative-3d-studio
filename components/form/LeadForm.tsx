"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { UNSERVED_ROLES, fieldErrors, stepOneSchema, stepTwoSchema, type Role } from "@/lib/schema";
import { newEventId, track } from "@/lib/tracking";
import { captureAttribution, metaIds, type Attribution } from "@/lib/utm";
import { buttonClass } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useEnquiry } from "./EnquiryContext";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";

export type FormValues = {
  role: string;
  other_business: string;
  name: string;
  mobile: string;
  project_type: string;
  email: string;
  company: string;
  project_location: string;
  message: string;
};

const EMPTY: FormValues = {
  role: "",
  other_business: "",
  name: "",
  mobile: "",
  project_type: "",
  email: "",
  company: "",
  project_location: "",
  message: "",
};

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export function LeadForm({ idPrefix = "lead" }: { idPrefix?: string }) {
  const router = useRouter();
  const { projectType, setProjectType, landingVariant } = useEnquiry();
  const [step, setStep] = useState<1 | 2>(1);
  const [fields, setFields] = useState<FormValues>(EMPTY);
  // Project type lives in context so segment CTAs anywhere on the page can pre-fill it.
  const values: FormValues = { ...fields, project_type: projectType };
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const eventId = useRef("");
  const zohoId = useRef(""); // CRM record created by step 1, so step 2 updates it
  const attribution = useRef<Attribution | null>(null);
  const turnstileToken = useRef("");
  const turnstileWidget = useRef<string | undefined>(undefined);
  const turnstileEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    eventId.current = newEventId();
    attribution.current = captureAttribution();
  }, []);

  const renderTurnstile = () => {
    if (!window.turnstile || !turnstileEl.current || turnstileWidget.current) return;
    turnstileWidget.current = window.turnstile.render(turnstileEl.current, {
      sitekey: TURNSTILE_SITE_KEY,
      appearance: "interaction-only",
      callback: (t: string) => (turnstileToken.current = t),
      "expired-callback": () => (turnstileToken.current = ""),
    });
  };

  const onChange = (name: keyof FormValues, value: string) => {
    if (name === "project_type") setProjectType(value as typeof projectType);
    else setFields((v) => ({ ...v, [name]: value }));
    if (errors[name])
      setErrors((prev) => {
        const rest = { ...prev };
        delete rest[name];
        return rest;
      });
  };

  const unserved = UNSERVED_ROLES.includes(values.role as Role);

  const payload = (status: "Partial" | "Complete") => {
    const attr = attribution.current ?? captureAttribution();
    const body = {
      ...(status === "Partial"
        ? {
            role: values.role,
            other_business: values.other_business,
            name: values.name,
            mobile: values.mobile,
            project_type: values.project_type,
          }
        : values),
      status,
      event_id: eventId.current,
      landing_variant: landingVariant,
      page_url: window.location.href.slice(0, 1000),
      ...attr,
      ...metaIds(attr.fbclid),
      website: honeypot,
      turnstile_token: turnstileToken.current,
      zoho_id: zohoId.current,
    };
    // Turnstile tokens are single-use: get a fresh one for the next request.
    if (turnstileWidget.current) {
      turnstileToken.current = "";
      window.turnstile?.reset(turnstileWidget.current);
    }
    return body;
  };

  const post = (body: unknown) =>
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });

  const next = () => {
    const parsed = stepOneSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    track("form_start", { project_type: values.project_type, event_id: eventId.current });
    track("LeadStart", { project_type: values.project_type });
    // Save step 1 as a partial lead so abandoned step-2 users can still be called.
    post(payload("Partial"))
      .then((r) => r.json())
      .then((d) => {
        if (d?.zoho_id) zohoId.current = d.zoho_id;
      })
      .catch(() => {});
    setStep(2);
    requestAnimationFrame(() => document.getElementById(`${idPrefix}-company`)?.focus());
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (step === 1) return next();

    const parsed = stepTwoSchema.safeParse(values);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      document.getElementById(`${idPrefix}-${Object.keys(errs)[0]}`)?.focus();
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      const res = await post(payload("Complete"));
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setFormError(data.error || "Please check the highlighted fields and try again.");
        setSubmitting(false);
        return;
      }
      try {
        sessionStorage.setItem(
          "s3d_lead",
          JSON.stringify({ event_id: eventId.current, project_type: values.project_type, email: values.email, mobile: values.mobile }),
        );
      } catch {}
      router.push(`/thank-you?lt=${encodeURIComponent(values.project_type)}`);
    } catch {
      setFormError("Network error — please try again, or call / WhatsApp us.");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-card border border-line bg-paper-raised p-6 shadow-lift-lg sm:p-8"
      aria-labelledby={`${idPrefix}-title`}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 id={`${idPrefix}-title`} className="pr-12 font-display text-xl font-semibold">
          {step === 1 ? "Get your walkthrough quote" : "A few details to price it right"}
        </h3>
        <span className="shrink-0 rounded-full bg-accent px-3 py-1 font-display text-xs font-semibold text-[#2a2135]">
          Step {step} of 2
        </span>
      </div>

      <div className="mb-6 h-1 overflow-hidden rounded-full bg-paper-sunken" aria-hidden>
        <div className={`h-full rounded-full bg-brand transition-all duration-500 ${step === 1 ? "w-1/2" : "w-full"}`} />
      </div>

      {step === 1 ? (
        <StepOne p={idPrefix} values={values} errors={errors} onChange={onChange} />
      ) : (
        <StepTwo p={idPrefix} values={values} errors={errors} onChange={onChange} />
      )}

      {/* Honeypot: hidden from people, filled by bots */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${idPrefix}-website`}>Website</label>
        <input
          id={`${idPrefix}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {TURNSTILE_SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="lazyOnload"
            onReady={renderTurnstile}
          />
          <div ref={turnstileEl} className="mt-4" />
        </>
      )}

      {formError && (
        <p className="mt-5 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
          {formError}
        </p>
      )}

      {/* Unserved business types: StepOne shows the explanation, and there's nothing to submit */}
      {!(step === 1 && unserved) && (
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {step === 2 && (
          <button type="button" onClick={() => setStep(1)} className={buttonClass("ghost", "md")}>
            Back
          </button>
        )}
        <button type="submit" disabled={submitting} className={buttonClass("primary", "md", "flex-1 sm:flex-none")}>
          {step === 1 ? (
            <>
              Next <ArrowRightIcon width={16} height={16} />
            </>
          ) : submitting ? (
            "Sending…"
          ) : (
            "Get My Walkthrough Quote"
          )}
        </button>
      </div>
      )}
      <p className={`mt-4 text-xs text-ink-faint ${step === 1 && unserved ? "hidden" : ""}`}>
        We&apos;ll call you within one working day. Your details are used only to respond to this enquiry. See our{" "}
        <a href="/privacy" className="underline hover:text-brand">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
