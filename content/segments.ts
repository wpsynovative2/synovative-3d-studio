export const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Villa",
  "Township",
  "Interiors",
  "Other",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export type Segment = {
  slug: string;
  title: string;
  projectType: ProjectType;
  pitch: string;
  cta: string;
  poster: string; // empty = placeholder artwork
  clip: string; // full-length muted loop, card-sized (public/videos/web); empty = poster only
};

export const segments: Segment[] = [
  {
    slug: "residential",
    title: "Residential projects",
    projectType: "Residential",
    pitch:
      "Show buyers the flat, the view and the amenities before possession.",
    cta: "Get Your Residential Project Live",
    poster: "/videos/web/card-residential.jpg",
    clip: "/videos/web/card-residential-full.mp4",
  },
  {
    slug: "commercial",
    title: "Commercial projects",
    projectType: "Commercial",
    pitch: "Walk investors and tenants through offices, retail and frontage.",
    cta: "Get Your Commercial Project Live",
    poster: "",
    clip: "",
  },
  {
    slug: "industrial",
    title: "Industrial projects",
    projectType: "Industrial",
    pitch: "Explain plant layout, logistics flow and scale to stakeholders.",
    cta: "Get Your Industrial Project Live",
    poster: "/videos/web/card-industrial.jpg",
    clip: "/videos/web/card-industrial-full.mp4",
  },
  {
    slug: "villas",
    title: "Villas & bungalows",
    projectType: "Villa",
    pitch: "Sell a lifestyle: interiors, landscape, pool, golden-hour light.",
    cta: "Get Your Villa Project Live",
    poster: "",
    clip: "",
  },
  {
    slug: "township",
    title: "Townships & plotted developments",
    projectType: "Township",
    pitch: "Aerial master-plan flythroughs, connectivity and amenity zones.",
    cta: "Get Your Township Live",
    poster: "/videos/web/card-township.jpg",
    clip: "/videos/web/card-township-full.mp4",
  },
  {
    slug: "interiors",
    title: "Interiors",
    projectType: "Interiors",
    pitch:
      "Hotels, clubhouses and show-flat interiors, lit and styled to sell.",
    cta: "Get Your Interior Walkthrough",
    poster: "/videos/web/lounge.jpg",
    clip: "/videos/web/card-interiors-full.mp4",
  },
];
