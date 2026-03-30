"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import JobInput from "@/components/JobInput";

interface CVSection {
  title: string;
  content: string;
}

interface ParsedCV {
  rawText: string;
  sections: CVSection[];
  fileName: string;
  fileType: "pdf" | "docx";
}

interface RewrittenSection {
  title: string;
  originalContent: string;
  rewrittenContent: string;
  changes: string[];
}

interface RewriteResult {
  sections: RewrittenSection[];
  summary: {
    totalChanges: number;
    sectionsImproved: number;
    keyImprovements: string[];
  };
}

type Step = "input" | "parsing" | "rewriting" | "preview" | "download";

export default function MatchPage() {
  const [step, setStep] = useState<Step>("input");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [parsedCV, setParsedCV] = useState<ParsedCV | null>(null);
  const [jobData, setJobData] = useState<{
    type: "url" | "text";
    value: string;
  } | null>(null);
  const [jobText, setJobText] = useState<string | null>(null);
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const canProceed = cvFile && jobData;

  async function handleAnalyse() {
    if (!cvFile || !jobData) return;
    setError(null);
    setStep("parsing");

    try {
      const [cvResult, resolvedJobText] = await Promise.all([
        parseCVFile(cvFile),
        resolveJobText(jobData),
      ]);

      setParsedCV(cvResult);
      setJobText(resolvedJobText);
      setStep("rewriting");

      // Now trigger AI rewrite
      const result = await rewriteCVSections(
        cvResult.sections,
        resolvedJobText
      );
      setRewriteResult(result);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    }
  }

  function handlePay() {
    // TODO: Integrate Stripe in Stage 7
    // For now, simulate payment
    setPaid(true);
    setStep("download");
  }

  async function handleDownload(format: "docx" | "pdf") {
    if (!rewriteResult) return;

    if (format === "docx") {
      const { generateDOCX } = await import("@/lib/generate-cv");
      const blob = await generateDOCX(
        rewriteResult.sections,
        extractName(parsedCV)
      );
      downloadBlob(blob, "cv-matched.docx");
    } else {
      const { generatePDFHTML } = await import("@/lib/generate-cv");
      const html = generatePDFHTML(
        rewriteResult.sections,
        extractName(parsedCV)
      );
      // Open in new window for print-to-PDF
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        // Small delay to let styles load
        setTimeout(() => win.print(), 500);
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Progress steps */}
      <div className="mb-12 flex items-center justify-center gap-1 sm:gap-2 text-sm">
        <StepIndicator
          num={1}
          label="Input"
          active={step === "input"}
          done={step !== "input"}
        />
        <StepConnector
          done={["rewriting", "preview", "download"].includes(step)}
        />
        <StepIndicator
          num={2}
          label="Analyse"
          active={step === "parsing" || step === "rewriting"}
          done={["preview", "download"].includes(step)}
        />
        <StepConnector done={["preview", "download"].includes(step)} />
        <StepIndicator
          num={3}
          label="Preview"
          active={step === "preview"}
          done={step === "download"}
        />
        <StepConnector done={step === "download"} />
        <StepIndicator
          num={4}
          label="Download"
          active={step === "download"}
          done={false}
        />
      </div>

      {/* ── Step 1: Input ── */}
      {step === "input" && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Match Your CV</h1>
            <p className="mt-2 text-muted">
              Paste the job advert and upload your CV. We&apos;ll rewrite it to
              better match the role.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <JobInput onJobDataReady={setJobData} />
              {jobData && (
                <div className="mt-3 flex items-center gap-2 text-sm text-accent">
                  <CheckIcon />
                  {jobData.type === "url" ? "URL ready" : "Text pasted"}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <FileUpload onFileSelected={setCvFile} />
            </div>
          </div>

          {error && <ErrorBox message={error} />}

          <div className="text-center">
            <button
              onClick={handleAnalyse}
              disabled={!canProceed}
              className="rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Analyse &amp; Match
            </button>
            {!canProceed && (
              <p className="mt-3 text-xs text-muted">
                {!jobData && !cvFile
                  ? "Paste a job advert and upload your CV to continue"
                  : !jobData
                    ? "Add a job advert to continue"
                    : "Upload your CV to continue"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Step 2: Parsing / Rewriting ── */}
      {(step === "parsing" || step === "rewriting") && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-primary-light border-t-primary" />
          <h2 className="text-xl font-semibold">
            {step === "parsing"
              ? "Reading your CV and job advert..."
              : "AI is rewriting your CV..."}
          </h2>
          <p className="mt-2 text-muted">
            {step === "parsing"
              ? "Extracting content and requirements."
              : "Tailoring your experience to match the job. This may take 15-30 seconds."}
          </p>
        </div>
      )}

      {/* ── Step 3: Preview (payment gate) ── */}
      {step === "preview" && rewriteResult && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Your CV Has Been Improved</h1>
            <p className="mt-2 text-muted">
              Review the improvements below, then unlock your full rewritten CV.
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              value={rewriteResult.summary.totalChanges.toString()}
              label="Improvements made"
            />
            <StatCard
              value={`${rewriteResult.summary.sectionsImproved} / ${rewriteResult.sections.length}`}
              label="Sections enhanced"
            />
            <StatCard value="ATS" label="Screening optimised" />
          </div>

          {/* Key improvements */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Key Improvements</h2>
            <ul className="space-y-2">
              {rewriteResult.summary.keyImprovements.map((imp, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sample before/after — show first 2 sections with changes */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">
              Sample Changes{" "}
              <span className="text-sm font-normal text-muted">
                (showing {Math.min(2, rewriteResult.sections.filter((s) => s.changes.length > 0).length)} of{" "}
                {rewriteResult.summary.sectionsImproved} improved sections)
              </span>
            </h2>
            {rewriteResult.sections
              .filter((s) => s.changes.length > 0)
              .slice(0, 2)
              .map((section, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-background shadow-sm overflow-hidden"
                >
                  <div className="border-b border-border bg-primary-light/20 px-6 py-3">
                    <h3 className="font-semibold text-sm">{section.title}</h3>
                    <p className="text-xs text-muted mt-1">
                      {section.changes.length} change{section.changes.length !== 1 ? "s" : ""}:{" "}
                      {section.changes.join(", ")}
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                    <div className="p-4">
                      <p className="text-xs font-semibold text-red-500/70 uppercase tracking-wide mb-2">
                        Before
                      </p>
                      <p className="text-xs text-muted whitespace-pre-line line-clamp-6">
                        {section.originalContent}
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                        After
                      </p>
                      <p className="text-xs text-foreground whitespace-pre-line line-clamp-6">
                        {section.rewrittenContent}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Blurred remaining sections */}
          {rewriteResult.sections.filter((s) => s.changes.length > 0).length >
            2 && (
            <div className="relative rounded-xl border border-border bg-background p-6 shadow-sm overflow-hidden">
              <div className="blur-sm select-none pointer-events-none">
                {rewriteResult.sections
                  .filter((s) => s.changes.length > 0)
                  .slice(2, 4)
                  .map((section, i) => (
                    <div key={i} className="mb-4">
                      <h3 className="font-semibold text-sm">{section.title}</h3>
                      <p className="text-xs text-muted mt-1 line-clamp-3">
                        {section.rewrittenContent}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <p className="text-sm font-medium text-muted">
                  Unlock to see all changes
                </p>
              </div>
            </div>
          )}

          {/* Payment CTA */}
          <div className="rounded-2xl border-2 border-primary bg-primary-light/20 p-8 text-center">
            <p className="text-3xl font-bold">&euro;5</p>
            <p className="mt-1 text-muted">One-time payment for this CV rewrite</p>
            <button
              onClick={handlePay}
              className="mt-6 rounded-lg bg-primary px-10 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              Unlock &amp; Download
            </button>
            <p className="mt-3 text-xs text-muted">
              Download as PDF and Word. No subscription.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setStep("input");
                setRewriteResult(null);
                setParsedCV(null);
                setJobText(null);
                setError(null);
              }}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Start over with a different CV
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Download ── */}
      {step === "download" && rewriteResult && paid && (
        <div className="space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <svg
                className="h-8 w-8 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Your CV is Ready!</h1>
            <p className="mt-2 text-muted">
              Download your optimised CV in your preferred format.
            </p>
          </div>

          {/* Download buttons */}
          <div className="mx-auto grid max-w-md gap-4 sm:grid-cols-2">
            <button
              onClick={() => handleDownload("docx")}
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-border bg-background p-6 shadow-sm transition-colors hover:border-primary"
            >
              <svg
                className="h-10 w-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <span className="font-semibold">Word (.docx)</span>
              <span className="text-xs text-muted">
                Editable format
              </span>
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-border bg-background p-6 shadow-sm transition-colors hover:border-primary"
            >
              <svg
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <span className="font-semibold">PDF</span>
              <span className="text-xs text-muted">
                Print to PDF
              </span>
            </button>
          </div>

          {/* Full before/after view — unlocked */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">All Changes</h2>
            {rewriteResult.sections
              .filter((s) => s.changes.length > 0)
              .map((section, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-background shadow-sm overflow-hidden"
                >
                  <div className="border-b border-border bg-primary-light/20 px-6 py-3">
                    <h3 className="font-semibold text-sm">{section.title}</h3>
                    <p className="text-xs text-muted mt-1">
                      {section.changes.join(" · ")}
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                    <div className="p-4">
                      <p className="text-xs font-semibold text-red-500/70 uppercase tracking-wide mb-2">
                        Before
                      </p>
                      <p className="text-xs text-muted whitespace-pre-line">
                        {section.originalContent}
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                        After
                      </p>
                      <p className="text-xs text-foreground whitespace-pre-line">
                        {section.rewrittenContent}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Reuse */}
          <div className="text-center pt-4">
            <button
              onClick={() => {
                setStep("input");
                setRewriteResult(null);
                setParsedCV(null);
                setJobText(null);
                setPaid(false);
                setCvFile(null);
                setJobData(null);
                setError(null);
              }}
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-primary-light"
            >
              Match Another CV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── API call helpers ── */

async function parseCVFile(file: File): Promise<ParsedCV> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to parse CV");
  return data;
}

async function resolveJobText(job: {
  type: "url" | "text";
  value: string;
}): Promise<string> {
  if (job.type === "text") return job.value;
  const res = await fetch("/api/scrape-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: job.value }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch job advert");
  return data.text;
}

async function rewriteCVSections(
  sections: CVSection[],
  jobDescription: string
): Promise<RewriteResult> {
  const res = await fetch("/api/rewrite-cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sections, jobDescription }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to rewrite CV");
  return data;
}

/* ── Utility ── */

function extractName(cv: ParsedCV | null): string | undefined {
  if (!cv?.sections.length) return undefined;
  // The header section typically contains the candidate's name as the first line
  const header = cv.sections.find(
    (s) => s.title === "Header" || s.title.toLowerCase().includes("personal")
  );
  if (header) {
    const firstLine = header.content.split("\n")[0]?.trim();
    // Basic heuristic: name is usually short and doesn't contain @ or http
    if (firstLine && firstLine.length < 60 && !/@|http/.test(firstLine)) {
      return firstLine;
    }
  }
  return undefined;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Small UI components ── */

function StepIndicator({
  num,
  label,
  active,
  done,
}: {
  num: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
          done
            ? "bg-accent text-white"
            : active
              ? "bg-primary text-white"
              : "bg-border text-muted"
        }`}
      >
        {done ? (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          num
        )}
      </span>
      <span
        className={`hidden text-sm sm:inline ${active ? "font-medium" : "text-muted"}`}
      >
        {label}
      </span>
    </div>
  );
}

function StepConnector({ done }: { done: boolean }) {
  return (
    <div
      className={`h-px w-6 sm:w-12 transition-colors ${done ? "bg-accent" : "bg-border"}`}
    />
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 text-center shadow-sm">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
      {message}
    </div>
  );
}
