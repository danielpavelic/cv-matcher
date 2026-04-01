import "server-only";
import { getSupabase } from "./supabase";

export type FunnelStep = "analysed" | "improved" | "paid" | "downloaded";
export type AnalyticsType = "relevance" | "rewrite";
export type EventStatus = "success" | "error";

export interface FunnelEvent {
  session_id: string;
  funnel_step: FunnelStep;
  type: AnalyticsType;
  status: EventStatus;
  file_type?: string | null;
  sections_count?: number | null;
  job_input_method?: string | null;
  response_time_ms?: number | null;
  error_message?: string | null;
}

/**
 * Log a funnel event to Supabase.
 * Fire-and-forget — never blocks the caller or throws to the user.
 */
export async function trackFunnelEvent(event: FunnelEvent): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) return; // analytics not configured

    const { error } = await supabase.from("funnel_events").insert(event);
    if (error) {
      console.error("Analytics insert error:", error.message);
    }
  } catch (err) {
    console.error("Analytics tracking failed:", err);
  }
}
