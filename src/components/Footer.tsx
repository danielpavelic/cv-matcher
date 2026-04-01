import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Security badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/70 mb-8">
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            SSL Encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            GDPR Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            No Data Stored
          </span>
        </div>

        {/* Main footer */}
        <div className="flex flex-col items-center gap-4 text-xs sm:flex-row sm:justify-between">
          <div className="flex items-center gap-0">
            <Image
              src="/assets/airesumematcher-logo.png"
              alt="AI Resume Matcher"
              width={64}
              height={64}
              className="brightness-0 invert opacity-60"
            />
            <div>
              <span className="font-semibold text-xl tracking-tight text-[#7db8e8] block leading-none">AI Resume Matcher</span>
              <span className="text-xs text-[#7db8e8]/70 tracking-wide leading-none">More relevant resumes. More interviews.</span>
            </div>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="text-[#7db8e8] opacity-70 hover:opacity-100 transition-opacity">
              Privacy Policy
            </a>
            <a href="/terms" className="text-[#7db8e8] opacity-70 hover:opacity-100 transition-opacity">
              Terms of Service
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-[#7db8e8]/20 text-center text-xs text-[#7db8e8]/70">
          <p>&copy; {new Date().getFullYear()} AI Resume Matcher. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
