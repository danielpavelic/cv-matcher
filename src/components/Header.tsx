"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
            RM
          </span>
          <span>AI Resume Matcher</span>
        </Link>

        <nav>
          <a href="/#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">
            How It Works
          </a>
        </nav>
      </div>
    </header>
  );
}
