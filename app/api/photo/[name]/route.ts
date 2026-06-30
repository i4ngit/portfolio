import { NextRequest, NextResponse } from "next/server";
import { getPhoto } from "@/lib/kv";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const data = await getPhoto(name);

  if (!data || !data.startsWith("data:")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const [header, base64] = data.split(",");
  const mime = header.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
  const bytes = Buffer.from(base64, "base64");

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
