"use client";

import { useCallback, useState } from "react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  acceptedTypes?: string;
  label?: string;
  description?: string;
}

export default function FileUpload({
  onFileSelected,
  acceptedTypes = ".pdf,.doc,.docx",
  label = "Upload your CV",
  description = "PDF or Word document (max 10 MB)",
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maxSize = 10 * 1024 * 1024; // 10 MB

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        setError("Please upload a PDF or Word document.");
        return;
      }

      if (file.size > maxSize) {
        setError("File is too large. Maximum size is 10 MB.");
        return;
      }

      setFileName(file.name);
      onFileSelected(file);
    },
    [onFileSelected, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
          dragActive
            ? "border-primary bg-primary-light/30"
            : fileName
              ? "border-accent bg-accent/5"
              : "border-border hover:border-primary/50 hover:bg-primary-light/10"
        }`}
      >
        <input
          type="file"
          accept={acceptedTypes}
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        {fileName ? (
          <>
            <svg className="mb-2 h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium">{fileName}</p>
            <p className="mt-1 text-xs text-muted">Click or drag to replace</p>
          </>
        ) : (
          <>
            <svg className="mb-2 h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm font-medium">
              Drag &amp; drop or <span className="text-primary">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted">{description}</p>
          </>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
