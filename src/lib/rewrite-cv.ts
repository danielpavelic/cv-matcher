import "server-only";
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
8. ALWAYS write in implied first person — OMIT "I" entirely. Never use "he/she/they" or third person. Start bullets and sentences directly with action verbs (e.g. "Led a team...", "Delivered...", "Managed..."). For summaries/profiles, also omit "I" (e.g. "Results-driven engineer with..." not "I am a results-driven engineer..."). This is standard professional resume convention.
9. ALWAYS ensure the output is grammatically correct, properly punctuated, and lexically accurate. No spelling errors, no broken sentences, no misused words. Every sentence must read naturally and professionally.
10. ALWAYS start bullet points with a strong action verb (e.g. "Drove", "Delivered", "Spearheaded", "Architected", "Optimised", "Established"). Never start with "Was responsible for...", "Helped with...", "Assisted in...", or weak/passive phrasing.
11. USE PRESENT TENSE for the current role (e.g. "Drive technical strategy...", "Lead a team of...") and PAST TENSE for all previous roles (e.g. "Drove technical strategy...", "Led a team of..."). Be consistent — do not mix tenses within the same role.
12. MAINTAIN CONSISTENCY throughout the entire document — consistent formatting, consistent bullet point style, consistent capitalisation, consistent punctuation (e.g. if one bullet ends with a period, all bullets must end with a period). The resume must read as one cohesive document, not a patchwork of different writing styles.
13. SUMMARY/PROFILE SECTION — if the CV has a Summary, Profile, or About section, rewrite it to clearly and concisely communicate these four things (using ONLY facts from the original CV):
    a) WHO YOU ARE — professional identity/title (e.g. "Senior Engineering Leader", "Experienced Marketing Strategist")
    b) YOUR LEVEL — years of experience or seniority level, taken directly from the CV (e.g. "with 20+ years of experience", "senior-level")
    c) YOUR DOMAIN — primary industry or area of expertise (e.g. "in financial services", "across regulated environments", "in SaaS product development")
    d) YOUR BIGGEST VALUE — the candidate's standout strength or achievement, drawn from the CV (e.g. "with a 100% delivery track record", "known for building high-performance teams", "specialising in scaling products from 0 to market")
    Keep it to 2-3 sentences max. Do NOT invent seniority, domains, or achievements not present in the original CV. Mirror the job advert's language where it genuinely fits.

14. VISUAL HIERARCHY — the resume must be scannable at 30% attention. A hiring manager glancing for 6 seconds should immediately see the key points.
    DO:
    - Keep every bullet to 1-2 lines max. If a bullet runs longer, split it or cut the filler.
    - Lead each bullet with the most important information (action + result first, context second).
    - Use concise, punchy language. Every word must earn its place.
    - Leave clean spacing between sections and role blocks.
    DON'T:
    - Write dense paragraphs — break them into bullets.
    - Create walls of text — if a role has more than 6-8 bullets, keep only the most impactful ones and merge the rest.
    - Use filler phrases like "was tasked with", "played a role in", "was involved in" — get to the point.
    - Repeat the same achievement in different words across multiple bullets.

15. MAKE PROMOTIONS OBVIOUS — if the candidate was promoted within the same company, make it stand out. Format it clearly so the reader immediately sees career progression (e.g. "Promoted from Team Lead to Technical Lead within 6 months" or structure the roles visibly under the same company header). Promotions are one of the strongest signals of value — never bury them.

16. EMBED SKILLS INTO ACHIEVEMENTS — don't list skills in isolation. Weave them into accomplishment bullets where possible. Instead of a flat skills list saying "Python, AWS, Docker", show them in action: "Automated cloud provisioning using Python and AWS, reducing deployment time". The skills section can still exist, but the experience section should demonstrate the skills in context. Only do this with skills already mentioned in the original CV.

17. END WITH A SPIKE — scan the entire CV for ONE thing that makes this candidate memorable and ensure it's prominently placed. This could be:
    - Built or co-founded a startup
    - Led a major transformation or turnaround
    - A unique combination of skills (e.g. engineering + business + design)
    - A side project with real traction (users, revenue, recognition)
    - An award, recognition, or standout achievement
    - Featured or published somewhere notable
    If such a spike exists in the original CV, make sure it's not buried — surface it in the summary or as the last memorable bullet. If nothing stands out, do not fabricate one. Not every CV has a spike, and that's fine.

WHAT YOU MAY DO:
1. REPHRASE using the job advert's terminology where the meaning is genuinely equivalent.
2. REORDER bullet points to put the most relevant ones first.
3. ADJUST the professional summary to highlight relevant aspects — but only using facts from the original CV.
4. IMPROVE weak phrasing with stronger action verbs — but the described action must remain the same.
5. MAKE EXISTING BULLETS MORE OUTCOME-FOCUSED — if the original describes an action, rewrite it to emphasise the result or impact, but ONLY using information already present in the CV. For example:
   - Original: "Managed a team of 8 developers" → "Led a team of 8 developers, delivering all projects on schedule" ✓ ONLY if on-time delivery is mentioned elsewhere in that role
   - Original: "Created automated release process" → "Automated the release process, reducing deployment time and eliminating manual errors" ✓ ONLY if this outcome is clearly implied by the context (automation inherently reduces manual work)
   - Original: "Built a developer portal" → "Built a developer portal from ground up, achieving 10k+ monthly visits" ✓ ONLY if the 10k metric exists somewhere in the original CV
   - Original: "Built a developer portal" → "Built a developer portal, increasing developer productivity by 40%" ✗ FABRICATED — that metric was never mentioned
6. USE STRONG RESULT-ORIENTED LANGUAGE — lead with impact where possible:
   - "Responsible for..." → "Drove..." or "Delivered..."
   - "Helped improve..." → "Improved... resulting in..."
   - "Worked on..." → "Contributed to... achieving..."
   But the underlying fact MUST be the same. You are changing "how it's said", not "what happened".

QUANTIFY EVERYTHING POSSIBLE:
- Scan the ENTIRE original CV for any numbers, metrics, percentages, team sizes, user counts, revenue figures, timeframes, or measurable outcomes. Attach them to the most relevant bullet points.
- If a number appears in one section (e.g. "10k+ monthly visits" in achievements), use it in the related bullet (e.g. "Built developer portal, achieving 10k+ monthly visits").
- If the CV mentions a team, always include the size (e.g. "Led a team" → "Led a team of 8 engineers" if "8" appears anywhere in that role).
- If the CV mentions a timeframe, attach it (e.g. "Promoted" → "Promoted within 6 months" if stated elsewhere).
- Quantified bullets are dramatically more impactful for both human readers and ATS systems.

OUTCOME RULES — CRITICAL:
- You may connect an action to its obvious, inherent outcome (e.g. "automated X" → "automated X, eliminating manual effort")
- You may move metrics/results from one bullet to another within the SAME role if it creates a stronger narrative
- You MUST NOT invent percentages, numbers, timeframes, or metrics that don't exist anywhere in the original CV
- You MUST NOT claim outcomes that aren't stated or directly implied
- "Implied" means logically inevitable (automation reduces manual work). "Implied" does NOT mean "sounds reasonable" (managing a team does NOT imply revenue growth).

FINAL CHECK — for every line you write, ask yourself:
1. "Does this line exist in the original CV, just worded differently?" — if NO, delete it.
2. "Are any numbers or metrics in this line present in the original?" — if NO, remove them.
3. "Would the candidate read this and say 'yes, that's exactly what I did and achieved'?" — if NO, tone it down.
4. "Is this written in implied first person with 'I' omitted?" — if NO, fix it. Remove any "I am", "I have", "I led" — just start with the verb.
5. "Is this grammatically correct, properly spelled, and does it read naturally?" — if NO, fix it.
6. "Does every bullet start with a strong action verb?" — if NO, rephrase to lead with one.
7. "Is the current role in present tense and all past roles in past tense?" — if NO, fix the tense.
8. "Is the formatting, style, punctuation, and capitalisation consistent across the entire document?" — if NO, standardise it.

REALITY CHECK — step back and review the ENTIRE resume as a whole before finalising:
1. "Would a stranger understand this candidate's value in 30 seconds?" — if NOT, the summary is too vague or the key achievements are buried. Fix it.
2. "Does this person sound like they DID things, or just WERE PRESENT?" — scan every bullet. Replace any that describe attendance ("was part of", "was involved in", "participated in") with ownership ("drove", "delivered", "built"). If the original doesn't support ownership, keep it honest but make the contribution specific.
3. "Is there proof of impact everywhere?" — every role should have at least one bullet with a measurable outcome or concrete result. If the original CV has numbers anywhere, they should be attached to the right bullets. If a role has zero proof of impact, surface the strongest implied outcome.`;

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

Rephrase the CV to use the job advert's terminology and make it more outcome-focused. Do NOT add anything new.

PROCESS:
1. For each bullet point, check if the job advert uses different words for the same concept. If yes, rephrase using the job advert's words.
2. Make each bullet more results-oriented — lead with impact, connect actions to their outcomes. But ONLY use outcomes that are stated or directly implied in the original CV. Never invent metrics.
3. Reorder bullets within each role to put the most relevant and impactful ones first.
4. The output must have the same bullet points as the original — just rephrased and made more outcome-focused. No new bullets.

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
