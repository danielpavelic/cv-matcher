import Anthropic from "@anthropic-ai/sdk";
import type { CVSection } from "./parse-cv";

const anthropic = new Anthropic();

export interface RewrittenSection {
  title: string;
  originalContent: string;
  rewrittenContent: string;
  changes: string[]; // brief descriptions of what changed
}

export interface RewriteResult {
  sections: RewrittenSection[];
  summary: {
    totalChanges: number;
    sectionsImproved: number;
    keyImprovements: string[];
  };
}

const SYSTEM_PROMPT = `You are an expert CV/resume consultant who specialises in tailoring CVs to specific job adverts. Your goal is to help candidates get past AI/ATS screening and secure interviews.

CRITICAL RULES:
1. NEVER fabricate experience, skills, qualifications, or achievements the candidate doesn't have.
2. NEVER add technologies, tools, certifications, or roles the candidate hasn't mentioned.
3. ONLY rephrase, reorder, emphasise, or restructure existing experience to be more relevant.
4. You MAY adjust terminology to match the job advert's language (e.g., "managed projects" → "led cross-functional project delivery" if the original clearly implies this).
5. You MAY strengthen weak descriptions by making implicit skills explicit (e.g., if someone "built a React app" you can mention "frontend development" as that's clearly implied).
6. You MAY reorder bullet points to put the most relevant experience first.
7. You MAY adjust the professional summary/profile to better target the role.
8. Keep the same overall structure and sections.
9. Keep the tone professional and natural — not stuffed with keywords.
10. Optimise for ATS keyword matching while keeping the CV readable for humans.`;

export async function rewriteCV(
  sections: CVSection[],
  jobDescription: string
): Promise<RewriteResult> {
  const sectionsJSON = JSON.stringify(sections, null, 2);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is the job advert the candidate is applying for:

<job_advert>
${jobDescription}
</job_advert>

Here are the sections of the candidate's current CV:

<cv_sections>
${sectionsJSON}
</cv_sections>

Please rewrite the CV sections to better match this job advert. Remember: ONLY adjust what's already there, never fabricate.

Respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "sections": [
    {
      "title": "Section Title",
      "originalContent": "the original content unchanged",
      "rewrittenContent": "your improved version",
      "changes": ["brief description of change 1", "brief description of change 2"]
    }
  ],
  "summary": {
    "totalChanges": 12,
    "sectionsImproved": 4,
    "keyImprovements": ["Added relevant keywords from job description", "Strengthened action verbs", "Reordered experience to prioritise relevant roles"]
  }
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Parse the JSON response — handle potential markdown fences
  const cleaned = text
    .replace(/^```json?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const result: RewriteResult = JSON.parse(cleaned);

  return result;
}
