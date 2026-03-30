import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export interface CVSection {
  title: string;
  content: string;
}

export interface ParsedCV {
  rawText: string;
  sections: CVSection[];
  fileName: string;
  fileType: "pdf" | "docx";
}

/**
 * Common CV section headings used to split the document into sections.
 * Case-insensitive matching is used.
 */
const SECTION_PATTERNS = [
  /^(personal\s+(?:details|information|profile|summary))/i,
  /^(profile|summary|objective|about\s+me|personal\s+statement)/i,
  /^(work\s+experience|professional\s+experience|experience|employment\s+history|employment)/i,
  /^(education|academic\s+(?:background|qualifications)|qualifications)/i,
  /^(skills|technical\s+skills|core\s+competencies|competencies|key\s+skills)/i,
  /^(certifications?|certificates?|accreditations?|licences?|licenses?)/i,
  /^(projects?|key\s+projects?|personal\s+projects?)/i,
  /^(languages?)/i,
  /^(publications?|research)/i,
  /^(volunteer(?:ing)?|community|extracurricular)/i,
  /^(awards?|honours?|honors?|achievements?)/i,
  /^(interests?|hobbies?)/i,
  /^(references?)/i,
];

function detectSections(text: string): CVSection[] {
  const lines = text.split("\n");
  const sections: CVSection[] = [];
  let currentTitle = "Header";
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      currentLines.push("");
      continue;
    }

    // Check if this line matches a known section heading
    const isHeading = SECTION_PATTERNS.some((pattern) => pattern.test(trimmed));

    // Also treat short, all-caps lines as headings (common in CVs)
    const isAllCapsHeading =
      trimmed.length > 2 &&
      trimmed.length < 50 &&
      trimmed === trimmed.toUpperCase() &&
      /[A-Z]/.test(trimmed);

    if (isHeading || isAllCapsHeading) {
      // Save previous section
      if (currentLines.some((l) => l.trim())) {
        sections.push({
          title: currentTitle,
          content: currentLines.join("\n").trim(),
        });
      }
      currentTitle = trimmed;
      currentLines = [];
    } else {
      currentLines.push(trimmed);
    }
  }

  // Save last section
  if (currentLines.some((l) => l.trim())) {
    sections.push({
      title: currentTitle,
      content: currentLines.join("\n").trim(),
    });
  }

  return sections;
}

export async function parsePDF(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

export async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function parseCV(
  buffer: Buffer,
  fileName: string
): Promise<ParsedCV> {
  const ext = fileName.toLowerCase().split(".").pop();

  let rawText: string;
  let fileType: "pdf" | "docx";

  if (ext === "pdf") {
    rawText = await parsePDF(buffer);
    fileType = "pdf";
  } else if (ext === "docx" || ext === "doc") {
    rawText = await parseDOCX(buffer);
    fileType = "docx";
  } else {
    throw new Error("Unsupported file type. Please upload a PDF or Word document.");
  }

  const sections = detectSections(rawText);

  return {
    rawText,
    sections,
    fileName,
    fileType,
  };
}
