"use client";

import { useState } from "react";

interface JobInputProps {
  onJobDataReady: (data: { type: "url" | "text"; value: string }) => void;
}

export default function JobInput({ onJobDataReady }: JobInputProps) {
  const [mode, setMode] = useState<"url" | "text">("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  const isValid = mode === "url" ? url.trim().length > 0 : text.trim().length > 50;

  const handleSubmit = () => {
    if (!isValid) return;
    onJobDataReady({
      type: mode,
      value: mode === "url" ? url.trim() : text.trim(),
    });
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">Job Advert</label>

      {/* Mode toggle */}
      <div className="mb-3 flex gap-1 rounded-lg bg-primary-light/30 p-1">
        <button
          onClick={() => setMode("url")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "url"
              ? "bg-background shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Paste URL
        </button>
        <button
          onClick={() => setMode("text")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "text"
              ? "bg-background shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Paste Text
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.example.com/jobs/software-engineer"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
          />
          {text.length > 0 && text.length < 50 && (
            <p className="mt-1 text-xs text-muted">
              Please paste more of the job description (at least 50 characters)
            </p>
          )}
        </>
      )}

      <p className="mt-2 text-xs text-muted">
        {mode === "url"
          ? "We'll extract the job requirements automatically. If it doesn't work, switch to paste text."
          : "Paste the full job description including requirements and responsibilities."}
      </p>
    </div>
  );
}
