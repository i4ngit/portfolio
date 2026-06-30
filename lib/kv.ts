import { Redis } from "@upstash/redis";

const kv = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});
import type {
  HeroContent,
  ResearchProject,
  Publication,
  ExperienceEntry,
  Milestone,
  NewsPost,
  ContactContent,
} from "./types";

// Default/seed content shown before real content is saved
const DEFAULTS = {
  hero: {
    name: "Ian Ocampo",
    headline: "Premed Student & Clinical Research Associate",
    bio: "I am a premed student passionate about the intersection of clinical medicine and translational research. My work spans neuroscience, healthcare access, and community medicine, with a goal of becoming a physician-scientist dedicated to underserved populations.\n\nCurrently, I am gaining clinical experience while pursuing research opportunities that bridge bench science with patient outcomes.",
    photoUrl: "/placeholder-photo.jpg",
    cvUrl: "/cv-placeholder.pdf",
    email: "ian.ocampo@university.edu",
    linkedIn: "https://www.linkedin.com/in/ian-ocampo",
    institution: "University Name",
    year: "Class of 202X",
  } satisfies HeroContent,

  research: [
    {
      id: "r1",
      title: "Neuroinflammation Biomarkers in Traumatic Brain Injury",
      lab: "Neurotrauma Research Lab",
      institution: "University Hospital",
      description:
        "Investigating serum biomarkers (GFAP, UCH-L1, S100B) as predictive indicators of long-term neurological outcomes following mild TBI in collegiate athletes.",
      fullDescription:
        "## Background\n\nMild traumatic brain injury (mTBI) affects millions annually, yet reliable prognostic tools remain limited. Blood-based biomarkers offer a non-invasive window into the neurological cascade following head impact.\n\n## Methods\n\nWe recruited a prospective cohort of 60+ collegiate athletes across contact and non-contact sports. Blood samples were collected at baseline, 6 hours, 24 hours, and 2 weeks post-concussion. GFAP, UCH-L1, and S100B concentrations were quantified via ELISA. Cognitive outcomes were assessed using ImPACT testing at corresponding intervals.\n\n## Preliminary Findings\n\nElevated acute GFAP levels (>0.2 ng/mL at 6h) correlated with prolonged return-to-play timelines (r=0.61, p<0.05). S100B showed high sensitivity but poor specificity, consistent with prior literature. UCH-L1 demonstrated the narrowest discriminatory window.",
      findings: "Elevated acute GFAP levels correlated with prolonged return-to-play timelines (r=0.61, p<0.05), supporting its use as a prognostic indicator post-concussion.",
      period: "2024 – Present",
      tags: ["Neuroscience", "Biomarkers", "TBI"],
      techniques: ["ELISA", "Cohort Study", "Biostatistics", "ImPACT"],
      featured: true,
      projectType: "research" as const,
      status: "ongoing" as const,
      piName: "Dr. Jane Smith, MD PhD",
      piTitle: "Associate Professor of Neurology",
      piQuote: "Ian has shown exceptional independence in the lab. His attention to protocol detail and ability to enroll and retain participants has been critical to the study's progress.",
    },
    {
      id: "r2",
      title: "Social Determinants of Health in Rural Emergency Departments",
      lab: "Health Equity Lab",
      institution: "School of Public Health",
      description:
        "Analyzing patient-reported SDOH screening data to identify gaps in resource referral and follow-up care within rural ED settings.",
      fullDescription:
        "## Overview\n\nSocial determinants of health (SDOH) — including food insecurity, housing instability, and transportation barriers — are strongly associated with poor health outcomes. Emergency departments increasingly serve as safety-net settings for patients with unmet social needs.\n\n## Methods\n\nWe performed a retrospective chart review of 800+ patient encounters at two rural ED sites where SDOH screening was embedded in triage intake. Rates of positive screens, referral completion, and 30-day return visits were abstracted and linked to demographic data.\n\n## Findings\n\nOnly 34% of patients screening positive for ≥1 SDOH need received a documented resource referral. Transportation barriers were the most frequently identified need (42%) but had the lowest referral completion rate (18%). Uninsured and Medicaid patients were disproportionately affected.",
      findings: "Only 34% of patients screening positive for SDOH needs received a resource referral; transportation barriers were most common yet least addressed.",
      period: "2023 – 2024",
      tags: ["Health Equity", "Emergency Medicine", "SDOH"],
      techniques: ["Chart Review", "Epidemiology", "Statistical Analysis"],
      featured: false,
      projectType: "research" as const,
      status: "completed" as const,
      piName: "Dr. Marcus Rivera, DrPH",
      piTitle: "Director, Health Equity Research Center",
    },
  ] satisfies ResearchProject[],

  publications: [
    {
      id: "p1",
      title:
        "Preliminary Analysis of GFAP Elevation Following Concussive Impact in Collegiate Athletes",
      authors: "Ocampo I, Smith J, Patel R, et al.",
      journal: "Journal of Neurotrauma",
      year: 2025,
      type: "poster" as const,
      abstract:
        "Poster presented at the National Neurotrauma Symposium 2025. We report preliminary findings from an ongoing cohort study examining acute biomarker elevation following sports-related concussion.",
    },
  ] satisfies Publication[],

  experience: [
    {
      id: "e1",
      role: "Clinical Research Volunteer",
      organization: "University Hospital Emergency Department",
      type: "clinical" as const,
      startDate: "2024-01",
      endDate: "present",
      location: "City, State",
      bullets: [
        "Assist attending physicians in collecting informed consent and enrolling patients into IRB-approved TBI biomarker study",
        "Perform blood draws and coordinate sample processing with the central laboratory",
        "Maintain research database with 150+ enrolled participants",
      ],
    },
    {
      id: "e2",
      role: "Undergraduate Research Assistant",
      organization: "Neurotrauma Research Lab",
      type: "research" as const,
      startDate: "2023-09",
      endDate: "present",
      location: "University Campus",
      bullets: [
        "Conduct ELISA assays for serum biomarker quantification",
        "Perform statistical analysis in R; contributed to two poster abstracts",
        "Attend weekly lab meetings and journal clubs",
      ],
    },
    {
      id: "e3",
      role: "Medical Interpreter Volunteer",
      organization: "Community Health Clinic",
      type: "volunteer" as const,
      startDate: "2022-09",
      endDate: "2023-12",
      location: "City, State",
      bullets: [
        "Provided Spanish-English medical interpretation for 50+ patient visits",
        "Supported healthcare access for uninsured patients in a free clinic setting",
      ],
    },
  ] satisfies ExperienceEntry[],

  milestones: [
    {
      id: "m1",
      title: "MCAT",
      date: "2025-06",
      status: "completed" as const,
      detail: "Score: 5XX",
      category: "academic" as const,
    },
    {
      id: "m2",
      title: "MD Program Applications",
      date: "2025-06",
      status: "completed" as const,
      detail: "AMCAS submitted",
      category: "application" as const,
    },
    {
      id: "m3",
      title: "Research Abstract Accepted",
      date: "2025-03",
      status: "completed" as const,
      detail: "National Neurotrauma Symposium 2025",
      category: "recognition" as const,
    },
    {
      id: "m4",
      title: "Medical School Interviews",
      date: "Fall 2025",
      status: "in-progress" as const,
      category: "application" as const,
    },
    {
      id: "m5",
      title: "Medical School Matriculation",
      date: "Fall 2026",
      status: "upcoming" as const,
      category: "application" as const,
    },
  ] satisfies Milestone[],

  news: [
    {
      id: "n1",
      title: "Poster Accepted at National Neurotrauma Symposium 2025",
      date: "2025-03-15",
      content:
        "Excited to share that our abstract on GFAP biomarkers following sports concussion has been accepted for poster presentation at the National Neurotrauma Symposium in June 2025. This represents our lab's first presentation at a national conference for our ongoing TBI biomarker cohort study.",
      category: "research" as const,
    },
    {
      id: "n2",
      title: "Joined University Hospital TBI Research Study",
      date: "2024-01-20",
      content:
        "I have joined Dr. Smith's neurotrauma research team at University Hospital, where I will be assisting with patient enrollment and sample processing for an NIH-funded study on traumatic brain injury biomarkers.",
      category: "research" as const,
    },
  ] satisfies NewsPost[],

  contact: {
    email: "ian.ocampo@university.edu",
    linkedin: "https://www.linkedin.com/in/ian-ocampo",
    cvUrl: "/cv-placeholder.pdf",
    institution: "University Name",
    department: "Department of Biology / Pre-Health",
    blurb:
      "I am always happy to connect with fellow researchers, clinicians, and mentors. Feel free to reach out about research collaborations, shadowing opportunities, or general inquiries.",
  } satisfies ContactContent,
};

// Generic typed get/set helpers

async function kvGet<T>(key: string, fallback: T): Promise<T> {
  if (!process.env.UPSTASH_REDIS_REST_URL) return fallback;
  try {
    const value = await kv.get<T>(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

async function kvSet<T>(key: string, value: T): Promise<void> {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    throw new Error("REDIS_NOT_CONFIGURED");
  }
  await kv.set(key, value);
}

// Typed accessors

export async function getHero(): Promise<HeroContent> {
  return kvGet("hero", DEFAULTS.hero);
}

export async function setHero(data: HeroContent): Promise<void> {
  return kvSet("hero", data);
}

export async function getResearch(): Promise<ResearchProject[]> {
  return kvGet("research", DEFAULTS.research);
}

export async function setResearch(data: ResearchProject[]): Promise<void> {
  return kvSet("research", data);
}

export async function getPublications(): Promise<Publication[]> {
  return kvGet("publications", DEFAULTS.publications);
}

export async function setPublications(data: Publication[]): Promise<void> {
  return kvSet("publications", data);
}

export async function getExperience(): Promise<ExperienceEntry[]> {
  return kvGet("experience", DEFAULTS.experience);
}

export async function setExperience(data: ExperienceEntry[]): Promise<void> {
  return kvSet("experience", data);
}

export async function getMilestones(): Promise<Milestone[]> {
  return kvGet("milestones", DEFAULTS.milestones);
}

export async function setMilestones(data: Milestone[]): Promise<void> {
  return kvSet("milestones", data);
}

export async function getNews(): Promise<NewsPost[]> {
  return kvGet("news", DEFAULTS.news);
}

export async function setNews(data: NewsPost[]): Promise<void> {
  return kvSet("news", data);
}

export async function getContact(): Promise<ContactContent> {
  return kvGet("contact", DEFAULTS.contact);
}

export async function setContact(data: ContactContent): Promise<void> {
  return kvSet("contact", data);
}
