export interface Affiliation {
  id: string;
  name: string;    // shown as alt text and in the admin list
  logoUrl: string;
}

export interface HeroContent {
  name: string;
  headline: string;
  bio: string;
  photoUrl: string;
  cvUrl: string;
  email: string;
  linkedIn: string;
  institution: string;
  year: string;
  affiliations?: Affiliation[];
}

export interface ResearchProject {
  id: string;
  title: string;
  lab: string;
  institution: string;
  description: string;          // short summary shown on card
  fullDescription?: string;     // expanded methods/findings (markdown)
  findings?: string;            // 1-2 sentence key finding teaser
  period: string;
  tags: string[];
  featured: boolean;
  link?: string;
  projectType?: "research" | "clinical" | "coursework";
  status?: "ongoing" | "completed" | "published";
  coverImage?: string;          // hero image URL
  images?: string[];            // gallery image URLs
  pdfUrl?: string;              // per-project PDF (served via /api/document/[name])
  techniques?: string[];        // for smart recommendations
  piName?: string;
  piTitle?: string;
  piQuote?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  link?: string;
  type: "journal" | "conference" | "poster" | "preprint";
  abstract?: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  type: "research" | "clinical" | "volunteer" | "academic";
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: "completed" | "in-progress" | "upcoming";
  detail?: string;
  category: "academic" | "application" | "recognition" | "research";
}

export interface NewsPost {
  id: string;
  title: string;
  date: string;
  content: string;
  category: "award" | "research" | "clinical" | "general";
}

export interface HobbyCategory {
  id: string;
  name: string;          // "Photography"
  slug: string;           // "photography" — used in the URL
  tagline?: string;       // short description shown under the heading
  coverImage?: string;    // thumbnail shown on the hub page
  images: string[];       // gallery photos
}

export interface ContactContent {
  email: string;
  linkedin: string;
  cvUrl: string;
  institution: string;
  department?: string;
  blurb?: string;
}

export type ContentSection =
  | "hero"
  | "research"
  | "publications"
  | "experience"
  | "milestones"
  | "news"
  | "contact"
  | "hobbies";
