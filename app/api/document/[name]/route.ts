import { NextResponse } from "next/server";
import { getDocument } from "@/lib/kv";

type Params = Promise<{ name: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  const { name } = await params;
  const data = await getDocument(name);

  if (!data || !data.startsWith("data:application/pdf")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const base64 = data.split(",")[1];
  const bytes = Buffer.from(base64, "base64");

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${name}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
