import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { setCV } from "@/lib/kv";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.data || !String(body.data).startsWith("data:application/pdf")) {
    return NextResponse.json({ error: "invalid_pdf" }, { status: 400 });
  }

  try {
    await setCV(body.data as string);
    return NextResponse.json({ url: "/api/cv" });
  } catch (err) {
    if ((err as Error).message === "REDIS_NOT_CONFIGURED") {
      return NextResponse.json({ error: "redis_not_configured" }, { status: 503 });
    }
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
