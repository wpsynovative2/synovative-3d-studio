"use client";

import type { ReactNode } from "react";
import type { ProjectType } from "@/content/segments";
import { useEnquiry } from "@/components/form/EnquiryContext";
import { trackCta } from "@/lib/tracking";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./Button";

/** Every "Get … Live" CTA: tracks, optionally pre-fills project type, opens the form popup. */
export function CtaLink({
  children,
  location,
  projectType,
  variant = "primary",
  size = "md",
  className = "",
  onNavigate,
}: {
  children: ReactNode;
  location: string;
  projectType?: ProjectType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onNavigate?: () => void;
}) {
  const { openEnquiry } = useEnquiry();
  return (
    <button
      type="button"
      className={buttonClass(variant, size, className)}
      onClick={() => {
        trackCta(location, projectType ? { segment: projectType } : {});
        onNavigate?.();
        openEnquiry(projectType);
      }}
    >
      {children}
    </button>
  );
}
