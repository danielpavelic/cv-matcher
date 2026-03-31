import Anthropic from "@anthropic-ai/sdk";
import type { CVSection } from "./parse-cv";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface MatchedRequirement {
  requirement: string;
  status: "strong" | "partial" | "missing";
  evidence: string; // quote or explanation from the CV, or why it's missing
}

export interface RelevanceResult {
  overallScore: number; // 0-100
  matchedRequirements: MatchedRequirement[];
  summary: string; // 1-2 sentence plain language summary
  strongMatches: number;
  partialMatches: number;
  missingMatches: number;
}

const SYSTEM_PROMPT = `You are an expert recruiter and ATS screening specialist. Your job is to objectively analyse how relevant a candidate's CV is to a specific job advert.

You must be honest and fair:
- "strong" means the CV clearly demonstrates this requirement with direct experience.
- "partial" means the CV shows related experience that could apply, but doesn't directly address the requirement.
- "missing" means the CV has no evidence of this requirement.

Do NOT inflate scores to be nice. A realistic, honest assessment helps the candidate understand where they stand.

Extract the key requirements from the job advert (skills, experience, qualifications, responsibilities) and check each one against the CV.`;

export async function analyseRelevance(
  sections: CVSection[],
  jobDescription: string
): Promise<RelevanceResult> {
  const cvText = sections.map((s) => `${s.title}:\n${s.content}`).join("\n\n");

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyse how relevant this CV is to the job advert below.

<job_advert>
${jobDescription}
</job_advert>

<cv>
${cvText}
</cv>

Extract 8-15 key requirements from the job advert and rate the CV against each one.

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "overallScore": 72,
  "summary": "Plain language summary of the match quality in 1-2 sentences.",
  "matchedRequirements": [
    {
      "requirement": "Short description of the requirement from the job advert",
      "status": "strong",
      "evidence": "Brief quote or explanation from the CV that demonstrates this"
    },
    {
      "requirement": "Another requirement",
      "status": "partial",
      "evidence": "What related experience exists and why it's only partial"
    },
    {
      "requirement": "A missing requirement",
      "status": "missing",
      "evidence": "Why this wasn't found in the CV"
    }
  ]
}

The overallScore should reflect the ratio and weight of strong/partial/missing matches. Be realistic — most CVs score between 40-80 for jobs they're somewhat qualified for.`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  let jsonStr = text;
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) jsonStr = fenceMatch[1];

  const startIdx = jsonStr.indexOf("{");
  const endIdx = jsonStr.lastIndexOf("}");
  if (startIdx !== -1 && endIdx !== -1) {
    jsonStr = jsonStr.slice(startIdx, endIdx + 1);
  }

  try {
    const result = JSON.parse(jsonStr) as RelevanceResult;
    result.strongMatches = result.matchedRequirements.filter(
      (r) => r.status === "strong"
    ).length;
    result.partialMatches = result.matchedRequirements.filter(
      (r) => r.status === "partial"
    ).length;
    result.missingMatches = result.matchedRequirements.filter(
      (r) => r.status === "missing"
    ).length;
    return result;
  } catch {
    // Fallback: try fixing control characters inside strings
    const fixed = jsonStr.replace(
      /"(?:[^"\\]|\\.)*"/g,
      (match) =>
        match
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
    );
    const result = JSON.parse(fixed) as RelevanceResult;
    result.strongMatches = result.matchedRequirements.filter(
      (r) => r.status === "strong"
    ).length;
    result.partialMatches = result.matchedRequirements.filter(
      (r) => r.status === "partial"
    ).length;
    result.missingMatches = result.matchedRequirements.filter(
      (r) => r.status === "missing"
    ).length;
    return result;
  }
}
