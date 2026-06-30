import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return uuidv4();
}

export function formatDate(dateStr: string): string {
  try {
    if (dateStr.toLowerCase() === "present") return "Present";
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      return format(parseISO(`${dateStr}-01`), "MMM yyyy");
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return format(parseISO(dateStr), "MMMM d, yyyy");
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function formatPeriod(start: string, end: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export const CATEGORY_LABELS = {
  research: "Research",
  clinical: "Clinical",
  volunteer: "Volunteer",
  academic: "Academic",
  award: "Award",
  general: "General",
  application: "Application",
  recognition: "Recognition",
} as const;

export const STATUS_COLORS = {
  completed: "text-green-accent bg-green-50 border-green-200",
  "in-progress": "text-amber-accent bg-amber-50 border-amber-200",
  upcoming: "text-muted bg-gray-50 border-gray-200",
} as const;

export const TYPE_COLORS: Record<string, string> = {
  research: "bg-navy text-white",
  clinical: "bg-green-accent text-white",
  volunteer: "bg-gray-400 text-white",
  academic: "bg-slate-600 text-white",
  journal: "bg-navy text-white",
  conference: "bg-green-accent text-white",
  poster: "bg-amber-accent text-white",
  preprint: "bg-gray-400 text-white",
};
