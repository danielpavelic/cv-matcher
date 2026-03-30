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

/**
 * Generate a professional Word document from rewritten CV sections.
 * Returns a Blob ready for download.
 */
export async function generateDOCX(
  sections: RewrittenSection[],
  candidateName?: string
): Promise<Blob> {
  const children: Paragraph[] = [];

  // Optional name header
  if (candidateName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: candidateName,
            bold: true,
            size: 32, // 16pt
            font: "Calibri",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
    children.push(
      new Paragraph({
        border: {
          bottom: {
            color: "999999",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { after: 300 },
      })
    );
  }

  for (const section of sections) {
    // Section heading
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            font: "Calibri",
            color: "2563EB",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        border: {
          bottom: {
            color: "E5E7EB",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 4,
          },
        },
      })
    );

    // Section content — split by newlines for proper paragraphs
    const lines = section.rewrittenContent.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Detect bullet points
      const isBullet = /^[-•*]\s/.test(trimmed);
      const text = isBullet ? trimmed.replace(/^[-•*]\s*/, "") : trimmed;

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text,
              size: 22, // 11pt
              font: "Calibri",
            }),
          ],
          bullet: isBullet ? { level: 0 } : undefined,
          spacing: { after: 80 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
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
 * Generate a simple PDF-like HTML string for client-side PDF generation.
 * We use this approach instead of @react-pdf/renderer to avoid SSR issues.
 */
export function generatePDFHTML(
  sections: RewrittenSection[],
  candidateName?: string
): string {
  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { margin: 0.75in; size: A4; }
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #1a1a1a;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
  }
  h1 {
    text-align: center;
    font-size: 18pt;
    margin-bottom: 4px;
    color: #171717;
  }
  .divider {
    border: none;
    border-top: 1px solid #999;
    margin: 12px 0 24px 0;
  }
  h2 {
    font-size: 12pt;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 4px;
    margin-top: 20px;
    margin-bottom: 8px;
  }
  p { margin: 4px 0; }
  ul { margin: 4px 0; padding-left: 20px; }
  li { margin: 2px 0; }
</style>
</head>
<body>`;

  if (candidateName) {
    html += `<h1>${escapeHtml(candidateName)}</h1><hr class="divider">`;
  }

  for (const section of sections) {
    html += `<h2>${escapeHtml(section.title)}</h2>`;
    const lines = section.rewrittenContent.split("\n");
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const isBullet = /^[-•*]\s/.test(trimmed);
      const text = isBullet ? trimmed.replace(/^[-•*]\s*/, "") : trimmed;

      if (isBullet) {
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
