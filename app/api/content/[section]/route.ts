import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getHero, setHero,
  getResearch, setResearch,
  getPublications, setPublications,
  getExperience, setExperience,
  getMilestones, setMilestones,
  getNews, setNews,
  getContact, setContact,
} from "@/lib/kv";

type Params = Promise<{ section: string }>;

const GETTERS: Record<string, () => Promise<unknown>> = {
  hero: getHero,
  research: getResearch,
  publications: getPublications,
  experience: getExperience,
  milestones: getMilestones,
  news: getNews,
  contact: getContact,
};

const SETTERS: Record<string, (data: unknown) => Promise<void>> = {
  hero: (d) => setHero(d as Parameters<typeof setHero>[0]),
  research: (d) => setResearch(d as Parameters<typeof setResearch>[0]),
  publications: (d) => setPublications(d as Parameters<typeof setPublications>[0]),
  experience: (d) => setExperience(d as Parameters<typeof setExperience>[0]),
  milestones: (d) => setMilestones(d as Parameters<typeof setMilestones>[0]),
  news: (d) => setNews(d as Parameters<typeof setNews>[0]),
  contact: (d) => setContact(d as Parameters<typeof setContact>[0]),
};

export async function GET(_req: Request, { params }: { params: Params }) {
  const { section } = await params;
  const getter = GETTERS[section];
  if (!getter) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }
  const data = await getter();
  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const { section } = await params;

  const authenticated = await getSession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const setter = SETTERS[section];
  if (!setter) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }

  try {
    const body = await request.json();
    await setter(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg === "REDIS_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: "redis_not_configured" },
        { status: 503 }
      );
    }
    console.error("Save error:", msg);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
