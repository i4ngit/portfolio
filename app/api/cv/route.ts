import { NextResponse } from "next/server";
import { getCV } from "@/lib/kv";

export async function GET() {
  const data = await getCV();

  if (!data || !data.startsWith("data:application/pdf")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const base64 = data.split(",")[1];
  const bytes = Buffer.from(base64, "base64");

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      // inline = opens in browser tab instead of downloading
      "Content-Disposition": "inline; filename=\"cv.pdf\"",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
