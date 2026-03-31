import Anthropic from "@anthropic-ai/sdk";
import type { CVSection } from "./parse-cv";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

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

const SYSTEM_PROMPT = `You are an expert CV/resume consultant and ATS optimisation specialist.

YOUR ONE JOB: Take each existing bullet point or statement in the candidate's CV and rephrase it using the job advert's terminology — where the meaning is genuinely the same. That's it. You are a translator, not a writer.

THE GOLDEN RULE:
Every single line in your output MUST map back to a specific line in the original CV. If you cannot point to the exact original line that a rewritten line came from, DELETE IT. You are not allowed to create new bullet points, new responsibilities, or new achievements that don't exist in the original.

HOW TO WORK:
For each bullet/line in the original CV:
1. Read the original statement carefully.
2. Check: does the job advert use different words for the same concept?
3. If YES → rephrase the original using the job advert's wording. The core meaning must remain identical.
4. If NO match → keep the original line as-is or with minor phrasing improvements. Do NOT force a connection.

EXAMPLES OF CORRECT REPHRASING:
- Original: "worked with business teams to deliver projects" + Job says "stakeholder management"
  → "Managed stakeholder relationships across business teams to deliver projects" ✓ (same meaning, job's words)
- Original: "guided junior developers" + Job says "mentoring"
  → "Mentored junior developers" ✓ (same meaning, job's words)
- Original: "set up automated deployments" + Job says "CI/CD pipelines"
  → "Implemented CI/CD pipelines for automated deployments" ✓ (same thing described differently)

EXAMPLES OF FABRICATION (NEVER DO THIS):
- Original: "managed development teams" + Job says "cybersecurity"
  → "Laid out clear vision for Cybersecurity Technology" ✗ FABRICATED — original says nothing about cybersecurity
- Original: "built web applications" + Job says "machine learning"
  → "Developed ML-powered web applications" ✗ FABRICATED — original never mentions ML
- Original: "oversaw technical delivery" + Job says "security architecture"
  → "Designed and implemented security architecture" ✗ FABRICATED — original says nothing about security architecture
- Adding any bullet point that didn't exist in the original ✗ FABRICATED

ABSOLUTE RULES:
1. NEVER change job titles. They must remain exactly as written.
2. NEVER add new bullet points that don't correspond to an original bullet point.
3. NEVER add skills, technologies, or domain expertise the candidate hasn't mentioned.
4. NEVER fabricate achievements, metrics, or responsibilities.
5. NEVER remove real achievements or experience.
6. NEVER change company names, dates, or factual details.
7. The output must have the SAME NUMBER of bullet points per role as the original (or fewer if you merged closely related ones — never more).

WHAT YOU MAY DO:
1. REPHRASE using the job advert's terminology where the meaning is genuinely equivalent.
2. REORDER bullet points to put the most relevant ones first.
3. ADJUST the professional summary to highlight relevant aspects — but only using facts from the original CV.
4. IMPROVE weak phrasing with stronger action verbs — but the described action must remain the same.

FINAL CHECK — for every line you write, ask yourself:
"Does this line exist in the original CV, just worded differently?"
If the answer is NO → delete it and use the original line instead.`;

export async function rewriteCV(
  sections: CVSection[],
  jobDescription: string
): Promise<RewriteResult> {
  const sectionsJSON = JSON.stringify(sections, null, 2);

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16384,
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

Rephrase the CV to use the job advert's terminology where the meaning is genuinely the same. Do NOT add anything new.

PROCESS:
1. For each bullet point in the original CV, check if the job advert uses different words for the same concept.
2. If yes, rephrase using the job advert's words. If no, keep the original or make minor phrasing improvements.
3. Reorder bullets within each role to put the most relevant ones first.
4. The output must have the same bullet points as the original — just rephrased. No new bullets.

RULES:
- Every output line must map to a specific original line. If it doesn't, delete it.
- Keep ALL job titles exactly as written. "Head of Engineering" stays "Head of Engineering".
- Do NOT add skills, technologies, or domain expertise not in the original CV.
- Do NOT invent responsibilities, achievements, or metrics.
- Do NOT add domain-specific terms (e.g. "cybersecurity", "machine learning", "security architecture") unless the original CV explicitly mentions them.
- The "Header" or personal details section (name, address, email, phone, LinkedIn) must be copied EXACTLY as-is with zero changes.
- The candidate must be able to read every line and say "yes, I actually did this".

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

  // Extract JSON from the response — handle markdown fences, preamble text, etc.
  let jsonStr = text;

  // Strip markdown code fences
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1];
  }

  // Find the outermost JSON object
  const startIdx = jsonStr.indexOf("{");
  const endIdx = jsonStr.lastIndexOf("}");
  if (startIdx !== -1 && endIdx !== -1) {
    jsonStr = jsonStr.slice(startIdx, endIdx + 1);
  }

  // Try parsing as-is first
  try {
    return JSON.parse(jsonStr) as RewriteResult;
  } catch (e1) {
    console.error("First parse attempt failed:", (e1 as Error).message);
    console.error("jsonStr length:", jsonStr.length);
    console.error("jsonStr first 200 chars:", JSON.stringify(jsonStr.slice(0, 200)));
    console.error("jsonStr last 200 chars:", JSON.stringify(jsonStr.slice(-200)));
  }

  // Replace literal newlines/tabs/carriage returns inside JSON string values
  // by matching string literals and escaping control chars within them
  const fixed = jsonStr.replace(
    /"(?:[^"\\]|\\.)*"/g,
    (match) =>
      match
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
  );

  try {
    return JSON.parse(fixed) as RewriteResult;
  } catch (e2) {
    console.error("Second parse attempt failed:", (e2 as Error).message);
    console.error("Stop reason:", message.stop_reason);
    console.error("Raw text length:", text.length);
    throw new Error("The AI returned an invalid response. Please try again.");
  }
}
