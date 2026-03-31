import { NextRequest, NextResponse } from "next/server";
import { trackFunnelEvent } from "@/lib/track-event";
import type { FunnelStep } from "@/lib/track-event";

const ALLOWED_STEPS: FunnelStep[] = ["paid", "downloaded"];

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session_id")?.value;
    if (!sessionId) {
      return NextResponse.json({ ok: true }); // silently skip
    }

    const body = await request.json();
    const { funnelStep, fileType, sectionsCount, jobInputMethod } = body;

    if (!ALLOWED_STEPS.includes(funnelStep)) {
      return NextResponse.json({ ok: true }); // ignore unknown steps
    }

    void trackFunnelEvent({
      session_id: sessionId,
      funnel_step: funnelStep,
      type: funnelStep === "paid" ? "rewrite" : "rewrite",
      status: "success",
      file_type: fileType || null,
      sections_count: sectionsCount || null,
      job_input_method: jobInputMethod || null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never fail
  }
}
