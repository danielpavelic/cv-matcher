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

interface MatchedRequirement {
  requirement: string;
  status: "strong" | "partial" | "missing";
  evidence: string;
}

interface RelevanceResult {
  overallScore: number;
  matchedRequirements: MatchedRequirement[];
  summary: string;
  strongMatches: number;
  partialMatches: number;
  missingMatches: number;
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

type Step =
  | "input"
  | "analysing"
  | "relevance"
  | "rewriting"
  | "preview"
  | "download";

export default function MatchPage() {
  const [step, setStep] = useState<Step>("input");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [parsedCV, setParsedCV] = useState<ParsedCV | null>(null);
  const [jobData, setJobData] = useState<{
    type: "url" | "text";
    value: string;
  } | null>(null);
  const [jobText, setJobText] = useState<string | null>(null);
  const [relevance, setRelevance] = useState<RelevanceResult | null>(null);
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(
    null
  );
  const [afterRelevance, setAfterRelevance] =
    useState<RelevanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [progress, setProgress] = useState<number>(0); // 0-3 for analyse, 0-3 for rewrite

  const canProceed = cvFile && jobData;

  async function handleAnalyse() {
    if (!cvFile || !jobData) return;
    setError(null);
    setProgress(0);
    setStep("analysing");

    try {
      // Step 1: Analyse job advert
      setProgress(1);
      const resolvedJobText = await resolveJobText(jobData);

      // Step 2: Analyse resume
      setProgress(2);
      const cvResult = await parseCVFile(cvFile);

      const cvTextLength = cvResult.rawText.length;
      const MAX_CV_CHARS = 30000;
      if (cvTextLength > MAX_CV_CHARS) {
        throw new Error(
          `Your resume is too long (${Math.round(cvTextLength / 1000)}k characters). The maximum supported size is ${MAX_CV_CHARS / 1000}k characters. Please try with a shorter resume.`
        );
      }

      setParsedCV(cvResult);
      setJobText(resolvedJobText);

      // Step 3: Generate relevance report
      setProgress(3);
      const meta = {
        fileType: cvResult.fileType,
        jobInputMethod: jobData.type,
      };
      const relevanceResult = await analyseRelevanceAPI(
        cvResult.sections,
        resolvedJobText,
        meta
      );
      setRelevance(relevanceResult);
      setStep("relevance");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    }
  }

  async function handleImprove() {
    if (!parsedCV || !jobText) return;
    setProgress(0);
    setStep("rewriting");

    try {
      // Step 1: Rewriting resume
      setProgress(1);
      const meta = {
        fileType: parsedCV.fileType,
        jobInputMethod: jobData?.type,
      };
      const result = await rewriteCVSections(parsedCV.sections, jobText, meta);
      setRewriteResult(result);

      // Step 2: Measuring improvement
      setProgress(2);
      const rewrittenSections = result.sections.map((s) => ({
        title: s.title,
        content: s.rewrittenContent,
      }));
      const afterResult = await analyseRelevanceAPI(
        rewrittenSections,
        jobText
      );
      setAfterRelevance(afterResult);

      // Step 3: Done
      setProgress(3);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("relevance");
    }
  }

  function handlePay() {
    setPaid(true);
    setStep("download");
    trackClientEvent("paid", {
      fileType: parsedCV?.fileType,
      sectionsCount: parsedCV?.sections.length,
      jobInputMethod: jobData?.type,
    });
  }

  async function handleDownload(format: "docx" | "pdf") {
    if (!rewriteResult) return;

    trackClientEvent("downloaded", {
      fileType: format,
      sectionsCount: parsedCV?.sections.length,
      jobInputMethod: jobData?.type,
    });

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
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => win.print(), 500);
      }
    }
  }

  function handleStartOver() {
    setStep("input");
    setCvFile(null);
    setJobData(null);
    setParsedCV(null);
    setJobText(null);
    setRelevance(null);
    setRewriteResult(null);
    setAfterRelevance(null);
    setPaid(false);
    setError(null);
  }

  return (
    <div className="min-h-[70vh] bg-surface -mt-px">
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Progress steps */}
      <div className="mb-12 flex items-center justify-center gap-1 sm:gap-2 text-sm">
        <StepIndicator
          num={1}
          label="Start"
          active={step === "input"}
          done={step !== "input"}
        />
        <StepConnector done={!["input", "analysing"].includes(step)} />
        <StepIndicator
          num={2}
          label="Analyse relevance"
          active={step === "analysing" || step === "relevance"}
          done={["rewriting", "preview", "download"].includes(step)}
        />
        <StepConnector done={["preview", "download"].includes(step)} />
        <StepIndicator
          num={3}
          label="Boost resume"
          active={step === "rewriting" || step === "preview"}
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
        <div className="space-y-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Match Your Resume
            </h1>
            <p className="mt-3 text-base text-muted max-w-xl mx-auto">
              Paste the job advert and upload your resume. We&apos;ll analyse how
              relevant your experience is and help you improve the match.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-background p-7 shadow-md ring-1 ring-border/60 transition-all hover:shadow-lg hover:ring-primary/30">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold shadow-sm">
                  1
                </span>
                <span className="text-base font-semibold">
                  Job advert
                </span>
              </div>
              <JobInput onJobDataReady={setJobData} />
              {jobData && (
                <div className="mt-3 flex items-center gap-2 text-sm text-accent">
                  <CheckIcon />
                  {jobData.type === "url" ? "URL ready" : "Text pasted"}
                </div>
              )}
            </div>
            <div className="rounded-2xl bg-background p-7 shadow-md ring-1 ring-border/60 transition-all hover:shadow-lg hover:ring-primary/30">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold shadow-sm">
                  2
                </span>
                <span className="text-base font-semibold">Your resume</span>
              </div>
              <FileUpload onFileSelected={setCvFile} />
            </div>
          </div>

          {error && <ErrorBox message={error} />}

          <div className="text-center">
            <button
              onClick={handleAnalyse}
              disabled={!canProceed}
              className="rounded-xl bg-primary px-10 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start My Resume Analysis
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your resume is never stored. It&apos;s processed in real-time and deleted immediately.
            </p>
          </div>
        </div>
      )}

      {/* ── Step 2a: Analysing spinner ── */}
      {step === "analysing" && (
        <LoadingState
          title="Analysing your resume against the job advert..."
          steps={[
            "Analysing job advert requirements",
            "Analysing your resume",
            "Generating your relevance report",
          ]}
          progress={progress}
        />
      )}

      {/* ── Step 2b: Relevance Report ── */}
      {step === "relevance" && relevance && (
        <div className="space-y-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your Relevance Report
            </h1>
            <p className="mt-3 text-base text-muted max-w-xl mx-auto">
              Here&apos;s how your current resume matches the job requirements.
            </p>
          </div>

          {/* Score ring + summary */}
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-14">
              <ScoreRing
                score={relevance.overallScore}
                label="Current Match"
              />
              <div className="max-w-md text-center sm:text-left">
                <p className="text-sm leading-relaxed text-muted">
                  {relevance.summary}
                </p>
                <div className="mt-5 flex gap-6 justify-center sm:justify-start">
                  <MiniStat
                    value={relevance.strongMatches}
                    label="Strong"
                    color="text-accent"
                  />
                  <MiniStat
                    value={relevance.partialMatches}
                    label="Partial"
                    color="text-yellow-500"
                  />
                  <MiniStat
                    value={relevance.missingMatches}
                    label="Missing"
                    color="text-red-400"
                  />
                </div>
              </div>
            </div>

            {/* Inline CTA */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <button
                onClick={handleImprove}
                className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
              >
                Boost My Resume Now
              </button>
              <p className="mt-2 text-xs text-muted">
                AI will rephrase your experience using the job advert&apos;s language
              </p>
            </div>
          </div>

          {/* Requirements breakdown */}
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-semibold">Requirements Breakdown</h2>
              <p className="mt-1 text-xs text-muted">
                {relevance.matchedRequirements.length} requirements extracted
                from the job advert
              </p>
            </div>
            <div className="divide-y divide-border">
              {relevance.matchedRequirements.map((req, i) => (
                <div key={i} className="flex gap-4 px-6 py-4">
                  <StatusBadge status={req.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{req.requirement}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                      {req.evidence}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <ErrorBox message={error} />}

          {/* CTA to improve */}
          <div className="rounded-2xl border-2 border-primary bg-background p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold tracking-tight">
              Want to improve your match?
            </h2>
            <p className="mt-3 text-muted max-w-lg mx-auto">
              Our AI will rephrase your experience using the job advert&apos;s
              terminology — without changing any facts.
            </p>
            <button
              onClick={handleImprove}
              className="mt-8 rounded-xl bg-primary px-10 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
            >
              Boost My Resume Now
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartOver}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Start over with a different resume
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3a: Rewriting spinner ── */}
      {step === "rewriting" && (
        <LoadingState
          title="AI is boosting your resume..."
          steps={[
            "Rewriting your resume using job advert terminology",
            "Measuring your new match score",
            "Preparing your results",
          ]}
          progress={progress}
        />
      )}

      {/* ── Step 3b: Preview (payment gate) ── */}
      {step === "preview" && rewriteResult && relevance && (
        <div className="space-y-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your Resume Has Been Improved
            </h1>
            <p className="mt-3 text-base text-muted max-w-xl mx-auto">
              Review the improvements below, then unlock your full rewritten resume.
            </p>
          </div>

          {/* Before / After score comparison */}
          {afterRelevance && (
            <div className="rounded-2xl border border-border bg-surface p-8">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16">
                <ScoreRing
                  score={relevance.overallScore}
                  label="Before"
                  size="sm"
                  muted
                />
                <div className="flex flex-col items-center gap-1">
                  <svg
                    className="h-8 w-8 text-primary rotate-90 sm:rotate-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    +{afterRelevance.overallScore - relevance.overallScore}{" "}
                    points
                  </span>
                </div>
                <ScoreRing
                  score={afterRelevance.overallScore}
                  label="After"
                  size="sm"
                />
              </div>
            </div>
          )}

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
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Key Improvements</h2>
            <ul className="space-y-3">
              {rewriteResult.summary.keyImprovements.map((imp, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span className="leading-relaxed">{imp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sample before/after */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">
              Sample Changes{" "}
              <span className="text-sm font-normal text-muted">
                (showing{" "}
                {Math.min(
                  2,
                  rewriteResult.sections.filter((s) => s.changes.length > 0)
                    .length
                )}{" "}
                of {rewriteResult.summary.sectionsImproved} improved sections)
              </span>
            </h2>
            {rewriteResult.sections
              .filter((s) => s.changes.length > 0)
              .slice(0, 2)
              .map((section, i) => (
                <BeforeAfterCard key={i} section={section} />
              ))}
          </div>

          {/* Blurred remaining */}
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
          <div className="relative rounded-2xl border-2 border-primary bg-primary-light/20 p-10 text-center">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                Limited time — 50% off
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-center gap-3">
              <span className="text-lg text-muted line-through">
                &euro;9.99
              </span>
              <span className="text-4xl font-bold tracking-tight text-primary">
                &euro;4.99
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              One-time payment for this resume rewrite
            </p>
            <button
              onClick={handlePay}
              className="mt-6 rounded-xl bg-primary px-12 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
            >
              Unlock &amp; Download — &euro;4.99
            </button>
            <p className="mt-4 text-xs text-muted">
              Download as PDF and Word. No subscription.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartOver}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Start over with a different resume
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Download ── */}
      {step === "download" && rewriteResult && paid && (
        <div className="space-y-10">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your Resume is Ready!
            </h1>
            <p className="mt-3 text-base text-muted">
              Download your optimised resume in your preferred format.
            </p>
          </div>

          {/* Before/After score */}
          {relevance && afterRelevance && (
            <div className="flex items-center justify-center gap-8 rounded-2xl border border-border bg-surface p-6">
              <ScoreRing
                score={relevance.overallScore}
                label="Before"
                size="sm"
                muted
              />
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <ScoreRing
                score={afterRelevance.overallScore}
                label="After"
                size="sm"
              />
            </div>
          )}

          {/* Download buttons */}
          <div className="mx-auto grid max-w-lg gap-4 sm:grid-cols-2">
            <button
              onClick={() => handleDownload("docx")}
              className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-background p-8 shadow-sm transition-all hover:border-primary hover:shadow-md"
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
                Editable — best for further tweaks
              </span>
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-background p-8 shadow-sm transition-all hover:border-primary hover:shadow-md"
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
                Ready to submit — print to PDF
              </span>
            </button>
          </div>

          {/* Full before/after — unlocked */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">All Changes</h2>
            {rewriteResult.sections
              .filter((s) => s.changes.length > 0)
              .map((section, i) => (
                <BeforeAfterCard key={i} section={section} full />
              ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleStartOver}
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-primary-light"
            >
              Match Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
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

async function analyseRelevanceAPI(
  sections: CVSection[],
  jobDescription: string,
  meta?: { fileType?: string; jobInputMethod?: string }
): Promise<RelevanceResult> {
  const res = await fetch("/api/analyse-relevance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sections, jobDescription, ...meta }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to analyse relevance");
  return data;
}

async function rewriteCVSections(
  sections: CVSection[],
  jobDescription: string,
  meta?: { fileType?: string; jobInputMethod?: string }
): Promise<RewriteResult> {
  const res = await fetch("/api/rewrite-cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sections, jobDescription, ...meta }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to rewrite CV");
  return data;
}

function trackClientEvent(funnelStep: string, meta?: Record<string, unknown>) {
  void fetch("/api/track-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ funnelStep, ...meta }),
  }).catch(() => {});
}

/* ── Utility ── */

function extractName(cv: ParsedCV | null): string | undefined {
  if (!cv?.sections.length) return undefined;
  const header = cv.sections.find(
    (s) => s.title === "Header" || s.title.toLowerCase().includes("personal")
  );
  if (header) {
    const firstLine = header.content.split("\n")[0]?.trim();
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

/* ── UI components ── */

function ScoreRing({
  score,
  label,
  size = "lg",
  muted = false,
}: {
  score: number;
  label: string;
  size?: "sm" | "lg";
  muted?: boolean;
}) {
  const radius = size === "lg" ? 54 : 40;
  const stroke = size === "lg" ? 8 : 6;
  const svgSize = (radius + stroke) * 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const fontSize = size === "lg" ? "text-3xl" : "text-xl";

  const color =
    score >= 70
      ? "text-accent stroke-accent"
      : score >= 45
        ? "text-yellow-500 stroke-yellow-500"
        : "text-red-400 stroke-red-400";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className={muted ? "stroke-border" : "stroke-border"}
          />
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className={muted ? "stroke-muted/40" : color.split(" ")[1]}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-bold ${fontSize} ${muted ? "text-muted" : color.split(" ")[0]}`}
          >
            {score}
          </span>
        </div>
      </div>
      <span className={`text-sm ${muted ? "text-muted" : "font-medium"}`}>
        {label}
      </span>
    </div>
  );
}

function MiniStat({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "strong" | "partial" | "missing" }) {
  const config = {
    strong: {
      bg: "bg-accent/10",
      text: "text-accent",
      label: "Strong",
    },
    partial: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-600 dark:text-yellow-400",
      label: "Partial",
    },
    missing: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      label: "Missing",
    },
  }[status];

  return (
    <span
      className={`mt-0.5 inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

function BeforeAfterCard({
  section,
  full = false,
}: {
  section: RewrittenSection;
  full?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
      <div className="border-b border-border bg-surface px-6 py-4">
        <h3 className="font-semibold">{section.title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {section.changes.map((change, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {change}
            </span>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
        <div className="p-5">
          <p className="text-xs font-semibold text-red-500/70 uppercase tracking-wide mb-3">
            Before
          </p>
          <FormattedContent
            content={section.originalContent}
            clamp={!full}
            muted
          />
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-3">
            After
          </p>
          <FormattedContent content={section.rewrittenContent} clamp={!full} />
        </div>
      </div>
    </div>
  );
}

/**
 * Renders CV content with proper paragraph spacing.
 * Splits by double newlines into paragraphs and single newlines into line breaks.
 * Bullets get their own styling.
 */
function FormattedContent({
  content,
  clamp = false,
  muted = false,
}: {
  content: string;
  clamp?: boolean;
  muted?: boolean;
}) {
  const textColor = muted ? "text-muted" : "text-foreground";

  // Split into paragraphs by double newlines or section breaks
  const paragraphs = content.split(/\n{2,}/);

  return (
    <div className={clamp ? "max-h-56 overflow-hidden relative" : ""}>
      <div className="space-y-3">
        {paragraphs.map((para, i) => {
          const lines = para.split("\n").filter((l) => l.trim());

          return (
            <div key={i} className="space-y-1">
              {lines.map((line, j) => {
                const trimmed = line.trim();
                const isBullet = /^[-•*]\s/.test(trimmed);
                const text = isBullet
                  ? trimmed.replace(/^[-•*]\s*/, "")
                  : trimmed;

                if (isBullet) {
                  return (
                    <div key={j} className="flex gap-2 pl-1">
                      <span className={`text-xs ${textColor} shrink-0 mt-0.5`}>
                        •
                      </span>
                      <span className={`text-xs leading-relaxed ${textColor}`}>
                        {text}
                      </span>
                    </div>
                  );
                }

                return (
                  <p
                    key={j}
                    className={`text-xs leading-relaxed ${textColor}`}
                  >
                    {text}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
      {clamp && (
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent" />
      )}
    </div>
  );
}

function LoadingState({
  title,
  steps,
  progress,
}: {
  title: string;
  steps: string[];
  progress: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-10">
        <div className="h-24 w-24 animate-spin rounded-full border-[5px] border-primary-light border-t-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-primary/5" />
        </div>
      </div>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>

      <div className="mt-10 w-full max-w-md text-left space-y-5">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isDone = progress > stepNum;
          const isActive = progress === stepNum;

          return (
            <div key={i} className="flex items-center gap-3">
              {isDone ? (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              ) : isActive ? (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
                </span>
              ) : (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-border" />
              )}
              <span
                className={`text-base ${
                  isDone
                    ? "text-accent font-medium"
                    : isActive
                      ? "text-foreground font-medium"
                      : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
    <div className="rounded-xl border border-border bg-surface p-5 text-center">
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
