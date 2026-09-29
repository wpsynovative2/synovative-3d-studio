import type { ProjectType } from "./segments";

export type WorkCategory = Extract<ProjectType, "Residential" | "Commercial" | "Industrial" | "Villa" | "Township">;

export const WORK_FILTERS: { label: string; value: WorkCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Industrial", value: "Industrial" },
  { label: "Villas", value: "Villa" },
  { label: "Townships", value: "Township" },
];

export type Project = {
  id: string;
  name: string;
  city: string;
  category: WorkCategory;
  duration: string; // e.g. "1:45"
  poster: string;
  preview: string; // short muted loop shown on the card
  src: string; // full film (HLS .m3u8 or MP4) for the lightbox
};

// Films play in the lightbox from public/videos/web (streaming-ready copies of the originals).
export const projects: Project[] = [
  {
    id: "hill-galaxy",
    name: "Hill Galaxy Phase 2",
    city: "",
    category: "Residential",
    duration: "5:17",
    poster: "/videos/web/hill-galaxy-poster.jpg",
    preview: "/videos/web/hill-galaxy-preview.mp4",
    src: "/videos/web/hill-galaxy.mp4",
  },
  {
    id: "khatu-shyam",
    name: "Khatu Shyam",
    city: "",
    category: "Residential",
    duration: "1:46",
    poster: "/videos/web/khatu-shyam-poster.jpg",
    preview: "/videos/web/khatu-shyam-preview.mp4",
    src: "/videos/web/khatu-shyam.mp4",
  },
  {
    id: "madar",
    name: "Madar",
    city: "Mira Road",
    category: "Residential",
    duration: "2:39",
    poster: "/videos/web/madar-poster.jpg",
    preview: "/videos/web/madar-preview.mp4",
    src: "/videos/web/madar.mp4",
  },
  {
    id: "neminath",
    name: "Neminath",
    city: "",
    category: "Industrial",
    duration: "1:00",
    poster: "/videos/web/neminath-poster.jpg",
    preview: "/videos/web/neminath-preview.mp4",
    src: "/videos/web/neminath.mp4",
  },
  {
    id: "flat-interior",
    name: "Flat interior visualisation",
    city: "",
    category: "Residential",
    duration: "0:21",
    poster: "/videos/web/flat-interior-poster.jpg",
    preview: "/videos/web/flat-interior-preview.mp4",
    src: "/videos/web/flat-interior.mp4",
  },
];
