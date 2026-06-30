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
}

export interface ResearchProject {
  id: string;
  title: string;
  lab: string;
  institution: string;
  description: string;
  period: string;
  tags: string[];
  featured: boolean;
  link?: string;
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
  | "contact";
