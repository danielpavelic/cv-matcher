import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import type { RewrittenSection } from "./rewrite-cv";

const FONT = "Calibri";
const COLOR = "1A1A1A"; // near-black for all text
const FONT_SIZE_NAME = 28; // 14pt
const FONT_SIZE_CONTACT = 20; // 10pt
const FONT_SIZE_HEADING = 24; // 12pt
const FONT_SIZE_BODY = 22; // 11pt
const FONT_SIZE_SMALL = 20; // 10pt

/**
 * Detect if a section is the personal/header section containing contact details.
 */
function isPersonalSection(title: string): boolean {
  const t = title.toLowerCase();
  return (
    t === "header" ||
    t.includes("personal") ||
    t.includes("contact") ||
    t.includes("details")
  );
}

/**
 * Extract name and contact lines from the personal/header section content.
 */
function parsePersonalDetails(content: string): {
  name: string | null;
  contactLines: string[];
} {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return { name: null, contactLines: [] };

  // First line that looks like a name (short, no @, no http, no phone pattern)
  let name: string | null = null;
  const contactLines: string[] = [];

  for (const line of lines) {
    if (
      !name &&
      line.length < 60 &&
      !/@|http|www\.|\.com|\.ie|\.org/i.test(line) &&
      !/^\d{3,}/.test(line) &&
      !/^(name|address|phone|email|linkedin)/i.test(line)
    ) {
      name = line;
    } else {
      // Clean up "Label: value" format — keep it as-is for the document
      contactLines.push(line);
    }
  }

  // If all lines got pushed to contact and none looked like a name,
  // check if the first line contains "Name:" prefix
  if (!name && contactLines.length > 0) {
    const first = contactLines[0];
    const nameMatch = first.match(/^name:\s*(.+)/i);
    if (nameMatch) {
      name = nameMatch[1].trim();
      contactLines.shift();
    }
  }

  return { name, contactLines };
}

/**
 * Detect sub-headings within content (company names, role titles, etc.)
 * These are typically lines that end with dates or are short + followed by bullets.
 */
function isSubHeading(line: string, nextLine?: string): boolean {
  // Line ending with a date range pattern
  if (/\(\w+\s+\d{4}\s*[-–]\s*(present|\w+\s+\d{4})\)\s*$/i.test(line))
    return true;
  // Line with company + location pattern
  if (/^[A-Z][\w\s&.,'-]+-\s+[\w\s,]+$/.test(line) && line.length < 80)
    return true;
  // "Key deliverables:", "Key Achievements:" etc.
  if (/^key\s+(deliverables|achievements|responsibilities):/i.test(line))
    return true;
  return false;
}

/**
 * Generate a professional Word document from rewritten CV sections.
 */
export async function generateDOCX(
  sections: RewrittenSection[],
  candidateName?: string
): Promise<Blob> {
  const children: Paragraph[] = [];

  // Find the personal/header section
  const personalSection = sections.find((s) => isPersonalSection(s.title));
  const otherSections = sections.filter((s) => !isPersonalSection(s.title));

  // ── Personal details header ──
  if (personalSection) {
    const { name, contactLines } = parsePersonalDetails(
      personalSection.rewrittenContent
    );

    const displayName = name || candidateName;

    if (displayName) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: displayName,
              bold: true,
              size: FONT_SIZE_NAME,
              font: FONT,
              color: COLOR,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        })
      );
    }

    // Contact details — centered, on one or two lines, separated by pipes
    if (contactLines.length > 0) {
      // Group contact items into lines of reasonable length
      const contactStr = contactLines
        .map((l) => l.replace(/^(address|phone|email|linkedin|website):\s*/i, ""))
        .join("  |  ");

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactStr,
              size: FONT_SIZE_CONTACT,
              font: FONT,
              color: "666666",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
        })
      );
    }

    // Divider line after personal details
    children.push(
      new Paragraph({
        border: {
          bottom: {
            color: "333333",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 8,
          },
        },
        spacing: { after: 200 },
      })
    );
  } else if (candidateName) {
    // Fallback: just show the name if no personal section found
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: candidateName,
            bold: true,
            size: FONT_SIZE_NAME,
            font: FONT,
            color: COLOR,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );
    children.push(
      new Paragraph({
        border: {
          bottom: {
            color: "333333",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 8,
          },
        },
        spacing: { after: 200 },
      })
    );
  }

  // ── Content sections ──
  for (const section of otherSections) {
    // Section heading — bold, uppercase, black, with bottom border
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: FONT_SIZE_HEADING,
            font: FONT,
            color: COLOR,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 40 },
        border: {
          bottom: {
            color: "333333",
            space: 2,
            style: BorderStyle.SINGLE,
            size: 4,
          },
        },
      })
    );

    // Empty line after heading
    children.push(
      new Paragraph({ spacing: { after: 80 } })
    );

    // Section content
    const lines = section.rewrittenContent.split("\n");
    for (let idx = 0; idx < lines.length; idx++) {
      const trimmed = lines[idx].trim();
      if (!trimmed) {
        // Preserve blank lines as spacing
        children.push(new Paragraph({ spacing: { after: 80 } }));
        continue;
      }

      const isBullet = /^[-•*]\s/.test(trimmed);
      const text = isBullet ? trimmed.replace(/^[-•*]\s*/, "") : trimmed;
      const nextLine = lines[idx + 1]?.trim();

      if (!isBullet && isSubHeading(trimmed, nextLine)) {
        // Sub-heading (company name, role title, "Key Achievements:" etc.)
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text,
                bold: true,
                size: FONT_SIZE_BODY,
                font: FONT,
                color: COLOR,
              }),
            ],
            spacing: { before: 160, after: 40 },
          })
        );
      } else if (isBullet) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text,
                size: FONT_SIZE_BODY,
                font: FONT,
                color: COLOR,
              }),
            ],
            bullet: { level: 0 },
            spacing: { after: 40 },
          })
        );
      } else {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text,
                size: FONT_SIZE_BODY,
                font: FONT,
                color: COLOR,
              }),
            ],
            spacing: { after: 60 },
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,   // 0.5 inch
              right: 1080, // 0.75 inch
              bottom: 720,
              left: 1080,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  return buffer;
}

/**
 * Generate HTML for PDF export (print-to-PDF).
 * Single color scheme, professional layout, CV best practices.
 */
export function generatePDFHTML(
  sections: RewrittenSection[],
  candidateName?: string
): string {
  const personalSection = sections.find((s) => isPersonalSection(s.title));
  const otherSections = sections.filter((s) => !isPersonalSection(s.title));

  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { margin: 0.6in 0.75in; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Calibri, 'Segoe UI', Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.45;
    color: #1a1a1a;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
  }

  /* Personal details */
  .header { text-align: center; margin-bottom: 6px; }
  .name {
    font-size: 18pt;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 4px;
  }
  .contact {
    font-size: 10pt;
    color: #666;
    margin-bottom: 4px;
  }
  .header-divider {
    border: none;
    border-top: 2px solid #333;
    margin: 10px 0 16px 0;
  }

  /* Section headings */
  h2 {
    font-size: 12pt;
    font-weight: 700;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 1px solid #333;
    padding-bottom: 3px;
    margin-top: 18px;
    margin-bottom: 10px;
  }

  /* Sub-headings (company, role, etc.) */
  .sub-heading {
    font-weight: 700;
    margin-top: 10px;
    margin-bottom: 3px;
  }

  /* Body text */
  p {
    margin: 3px 0;
  }
  ul {
    margin: 3px 0;
    padding-left: 18px;
  }
  li {
    margin: 2px 0;
  }

  /* Spacing after each section */
  .section { margin-bottom: 4px; }
</style>
</head>
<body>`;

  // ── Personal details ──
  if (personalSection) {
    const { name, contactLines } = parsePersonalDetails(
      personalSection.rewrittenContent
    );
    const displayName = name || candidateName;

    html += `<div class="header">`;
    if (displayName) {
      html += `<div class="name">${escapeHtml(displayName)}</div>`;
    }
    if (contactLines.length > 0) {
      const contactStr = contactLines
        .map((l) =>
          l.replace(/^(address|phone|email|linkedin|website):\s*/i, "")
        )
        .join("&nbsp; | &nbsp;");
      html += `<div class="contact">${contactStr}</div>`;
    }
    html += `</div><hr class="header-divider">`;
  } else if (candidateName) {
    html += `<div class="header"><div class="name">${escapeHtml(candidateName)}</div></div><hr class="header-divider">`;
  }

  // ── Content sections ──
  for (const section of otherSections) {
    html += `<div class="section">`;
    html += `<h2>${escapeHtml(section.title)}</h2>`;

    const lines = section.rewrittenContent.split("\n");
    let inList = false;

    for (let idx = 0; idx < lines.length; idx++) {
      const trimmed = lines[idx].trim();
      if (!trimmed) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        continue;
      }

      const isBullet = /^[-•*]\s/.test(trimmed);
      const text = isBullet ? trimmed.replace(/^[-•*]\s*/, "") : trimmed;
      const nextLine = lines[idx + 1]?.trim();

      if (!isBullet && isSubHeading(trimmed, nextLine)) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<p class="sub-heading">${escapeHtml(text)}</p>`;
      } else if (isBullet) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${escapeHtml(text)}</li>`;
      } else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<p>${escapeHtml(text)}</p>`;
      }
    }
    if (inList) html += "</ul>";
    html += `</div>`;
  }

  html += `</body></html>`;
  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
