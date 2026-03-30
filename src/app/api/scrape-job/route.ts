import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400 }
      );
    }

    // Basic URL validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch the page
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CVMatcher/1.0; +https://cvmatcher.com)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Could not fetch the page (status ${response.status}). Try pasting the job description text instead.`,
        },
        { status: 422 }
      );
    }

    const html = await response.text();

    // Extract text content from HTML — strip tags and clean up
    const text = html
      // Remove script and style blocks
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      // Replace common block elements with newlines
      .replace(/<\/(p|div|h[1-6]|li|tr|br\s*\/?)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      // Remove remaining tags
      .replace(/<[^>]+>/g, " ")
      // Decode common HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      // Clean up whitespace
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();

    if (text.length < 100) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough content from that page. Try pasting the job description text instead.",
        },
        { status: 422 }
      );
    }

    // Truncate if extremely long (some pages have tons of boilerplate)
    const truncated = text.length > 15000 ? text.slice(0, 15000) : text;

    return NextResponse.json({ text: truncated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to scrape job page";
    return NextResponse.json(
      {
        error: `${message}. Try pasting the job description text instead.`,
      },
      { status: 500 }
    );
  }
}
