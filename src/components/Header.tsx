"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-lg shadow-primary-dark/30">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-0 text-white">
          <Image
            src="/assets/airesumematcher-logo.png"
            alt="AI Resume Matcher"
            width={64}
            height={64}
            className="brightness-0 invert"
          />
          <div>
            <span className="font-semibold text-xl tracking-tight block leading-none">AI Resume Matcher</span>
            <span className="text-xs text-white/60 tracking-wide leading-none">More relevant resumes. More interviews.</span>
          </div>
        </Link>

        <nav>
          <a href="/#how-it-works" className="text-xs font-bold text-white/80 hover:text-white transition-colors">
            How It Works
          </a>
        </nav>
      </div>
    </header>
  );
}
