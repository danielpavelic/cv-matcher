import { NextRequest, NextResponse } from "next/server";
import { rewriteCV } from "@/lib/rewrite-cv";
import type { CVSection } from "@/lib/parse-cv";

export async function POST(request: NextRequest) {
  try {
    const { sections, jobDescription } = (await request.json()) as {
      sections: CVSection[];
      jobDescription: string;
    };

    if (!sections?.length) {
      return NextResponse.json(
        { error: "No CV sections provided" },
        { status: 400 }
      );
    }

    if (!jobDescription?.trim()) {
      return NextResponse.json(
        { error: "No job description provided" },
        { status: 400 }
      );
    }

    const result = await rewriteCV(sections, jobDescription);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Rewrite error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to rewrite CV";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
