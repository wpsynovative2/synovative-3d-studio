"use client";

import { useEffect, useRef } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { useEnquiry } from "./EnquiryContext";
import { LeadForm } from "./LeadForm";

/** Lead form popup opened by every CTA on the page. */
export function EnquiryModal() {
  const { isOpen, closeEnquiry } = useEnquiry();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => document.getElementById("modal-lead-name")?.focus());
    }
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={closeEnquiry}
      onClick={(e) => e.target === dialogRef.current && closeEnquiry()}
      aria-label="Get your walkthrough quote"
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(100vw-1.5rem,40rem)] overflow-visible bg-transparent p-0 text-ink"
    >
      {isOpen && (
        <div className="relative max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-card">
          <button
            type="button"
            onClick={closeEnquiry}
            className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-paper-sunken text-ink-soft btn-motion hover:bg-accent hover:text-[#2a2135]"
            aria-label="Close form"
          >
            <CloseIcon width={18} height={18} />
          </button>
          <LeadForm idPrefix="modal-lead" />
        </div>
      )}
    </dialog>
  );
}
