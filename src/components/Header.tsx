"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
            CV
          </span>
          <span>CV Matcher</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          <a href="#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-sm text-muted hover:text-foreground transition-colors">
            Pricing
          </a>
          <Link
            href="/match"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center sm:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:hidden">
          <a
            href="#how-it-works"
            className="text-sm text-muted hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-sm text-muted hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </a>
          <Link
            href="/match"
            className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-dark"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </nav>
      )}
    </header>
  );
}
