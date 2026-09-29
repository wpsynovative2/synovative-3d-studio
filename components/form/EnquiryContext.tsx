"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ProjectType } from "@/content/segments";

type EnquiryState = {
  projectType: ProjectType | "";
  setProjectType: (t: ProjectType | "") => void;
  /** Pre-fill project type (optional) and open the lead form popup. */
  openEnquiry: (projectType?: ProjectType) => void;
  closeEnquiry: () => void;
  isOpen: boolean;
  landingVariant: string;
};

const EnquiryContext = createContext<EnquiryState | null>(null);

export function EnquiryProvider({
  children,
  landingVariant,
  defaultProjectType = "",
}: {
  children: ReactNode;
  landingVariant: string;
  defaultProjectType?: ProjectType | "";
}) {
  const [projectType, setProjectType] = useState<ProjectType | "">(defaultProjectType);
  const [isOpen, setIsOpen] = useState(false);

  const openEnquiry = useCallback((type?: ProjectType) => {
    if (type) setProjectType(type);
    setIsOpen(true);
  }, []);
  const closeEnquiry = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ projectType, setProjectType, openEnquiry, closeEnquiry, isOpen, landingVariant }),
    [projectType, openEnquiry, closeEnquiry, isOpen, landingVariant],
  );
  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return ctx;
}
