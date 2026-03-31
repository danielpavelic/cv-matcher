import { NextRequest, NextResponse } from "next/server";
import { analyseRelevance } from "@/lib/analyse-relevance";
import { trackFunnelEvent } from "@/lib/track-event";
import type { CVSection } from "@/lib/parse-cv";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const sessionId = request.cookies.get("session_id")?.value;

  try {
    const { sections, jobDescription, fileType, jobInputMethod } =
      (await request.json()) as {
        sections: CVSection[];
        jobDescription: string;
        fileType?: string;
        jobInputMethod?: string;
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

    const result = await analyseRelevance(sections, jobDescription);

    if (sessionId) {
      void trackFunnelEvent({
        session_id: sessionId,
        funnel_step: "analysed",
        type: "relevance",
        status: "success",
        file_type: fileType || null,
        sections_count: sections.length,
        job_input_method: jobInputMethod || null,
        response_time_ms: Date.now() - startTime,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Relevance analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to analyse relevance";

    if (sessionId) {
      void trackFunnelEvent({
        session_id: sessionId,
        funnel_step: "analysed",
        type: "relevance",
        status: "error",
        response_time_ms: Date.now() - startTime,
        error_message: message,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
