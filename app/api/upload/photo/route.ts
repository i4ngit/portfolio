import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { setPhoto } from "@/lib/kv";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.data || !String(body.data).startsWith("data:image/")) {
    return NextResponse.json({ error: "invalid_image" }, { status: 400 });
  }

  const name = String(body.name ?? "headshot").replace(/[^a-z0-9-]/g, "");

  try {
    await setPhoto(name, body.data as string);
    return NextResponse.json({ url: `/api/photo/${name}` });
  } catch (err) {
    if ((err as Error).message === "REDIS_NOT_CONFIGURED") {
      return NextResponse.json({ error: "redis_not_configured" }, { status: 503 });
    }
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
