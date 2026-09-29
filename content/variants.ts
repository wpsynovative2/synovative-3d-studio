import type { ProjectType } from "./segments";
import { site } from "./site";

export type Variant = {
  key: string; // sent as landing_variant with every lead
  headline: string;
  subline: string;
  heroPoster: string;
  heroLoopSrc: string;
  leadSegment?: string; // segment slug shown first in Project types
  projectType?: ProjectType; // pre-selected in the form
};

export const defaultVariant: Variant = {
  key: "generic",
  headline: "Sell the project before the first slab is poured.",
  subline:
    "Photoreal 3D walkthrough films for residential, commercial, industrial and villa projects — delivered in weeks, built for launch campaigns.",
  heroPoster: site.hero.poster,
  heroLoopSrc: site.hero.loopSrc,
};

// Ad-variant overrides: a new variant is a config entry, not new code. Hero media left empty — add later.
export const variants: Record<string, Variant> = {
  residential: {
    key: "lp-residential",
    headline: "Let buyers walk through the flat before possession.",
    subline:
      "Photoreal walkthroughs of your towers, sample flats, views and amenities — ready for your launch campaign in weeks.",
    heroPoster: "",
    heroLoopSrc: "",
    leadSegment: "residential",
    projectType: "Residential",
  },
  commercial: {
    key: "lp-commercial",
    headline: "Lease the floor plates before the facade is up.",
    subline:
      "Walkthrough films that take investors and tenants through your offices, retail and frontage — delivered in weeks.",
    heroPoster: "",
    heroLoopSrc: "",
    leadSegment: "commercial",
    projectType: "Commercial",
  },
  industrial: {
    key: "lp-industrial",
    headline: "Show the plant, the flow and the scale in one film.",
    subline:
      "3D walkthroughs that explain layout, logistics and capacity to stakeholders, lenders and tenants.",
    heroPoster: "",
    heroLoopSrc: "",
    leadSegment: "industrial",
    projectType: "Industrial",
  },
  villas: {
    key: "lp-villas",
    headline: "Sell the golden hour, not the floor plan.",
    subline:
      "Villa and bungalow walkthroughs with interiors, landscape and pool — photoreal, lit and styled to sell a lifestyle.",
    heroPoster: "",
    heroLoopSrc: "",
    leadSegment: "villas",
    projectType: "Villa",
  },
  township: {
    key: "lp-township",
    headline: "Fly buyers over the whole township on day one.",
    subline:
      "Aerial master-plan flythroughs showing connectivity, amenity zones and phases — built for plotted and township launches.",
    heroPoster: "",
    heroLoopSrc: "",
    leadSegment: "township",
    projectType: "Township",
  },
};
