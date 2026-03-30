import { NextRequest, NextResponse } from "next/server";
import { parseCV } from "@/lib/parse-cv";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await parseCV(buffer, file.name);

    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse CV";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
