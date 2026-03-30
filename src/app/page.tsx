import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 inline-block rounded-full bg-primary-light px-4 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
              Land More Interviews
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your experience is relevant.
              <br />
              <span className="text-primary">Make your CV prove it.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              Paste a job advert, upload your CV, and get an optimised version
              that highlights the experience you already have — tailored to pass
              AI screening and impress hiring managers.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/match"
                className="w-full rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark sm:w-auto"
              >
                Match My CV Now
              </Link>
              <a
                href="#how-it-works"
                className="w-full rounded-lg border border-border px-8 py-3.5 text-base font-semibold transition-colors hover:bg-primary-light sm:w-auto text-center"
              >
                See How It Works
              </a>
            </div>
            <p className="mt-4 text-sm text-muted">
              No sign-up required. Pay only when you&apos;re happy with the result.
            </p>
          </div>
        </div>
        {/* Subtle gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-light/40 to-transparent" />
      </section>

      {/* ── Trust bar ── */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-6 text-sm text-muted">
          <span className="flex items-center gap-2">
            <CheckIcon /> Your experience — just better presented
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon /> ATS &amp; AI screening optimised
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon /> Download as PDF or Word
          </span>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to a better CV
            </h2>
            <p className="mt-4 text-lg text-muted">
              No templates. No starting from scratch. Just your CV, made more
              relevant.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <StepCard
              step="1"
              title="Paste the Job Advert"
              description="Drop in a URL or paste the job description. We extract the key requirements, skills, and keywords the employer is looking for."
            />
            <StepCard
              step="2"
              title="Upload Your CV"
              description="Upload your existing CV as a PDF or Word document. We identify your sections, experience, and skills — nothing is fabricated."
            />
            <StepCard
              step="3"
              title="Download Your Match"
              description="Preview the improvements, pay a small fee, and download your optimised CV ready to submit. Same experience, stronger presentation."
            />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-border bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built to get you interviews
            </h2>
            <p className="mt-4 text-lg text-muted">
              Not another CV builder. A smart layer on top of what you already
              have.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Truthful, Always"
              description="We never fabricate experience or skills. Every change is a better way to present what you've actually done."
            />
            <FeatureCard
              title="ATS Optimised"
              description="Tailored for the AI screening tools companies use. Right keywords, right format, right structure."
            />
            <FeatureCard
              title="Section-Aware"
              description="Your CV structure is preserved. We work within your sections — summary, experience, skills, education — not around them."
            />
            <FeatureCard
              title="Preview Before You Pay"
              description="See a summary of improvements and sample changes before committing. No surprises."
            />
            <FeatureCard
              title="PDF & Word Export"
              description="Download your optimised CV in both PDF and Word format. Ready for any application portal."
            />
            <FeatureCard
              title="Any Industry"
              description="From software engineering to marketing to healthcare — the AI understands role-specific language across industries."
            />
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple pricing
            </h2>
            <p className="mt-4 text-lg text-muted">
              Pay per CV. No subscriptions. No hidden fees.
            </p>

            <div className="mt-10 rounded-2xl border border-border bg-background p-8 shadow-sm">
              <p className="text-5xl font-bold">
                &euro;5
              </p>
              <p className="mt-2 text-muted">per CV rewrite</p>
              <ul className="mt-8 space-y-3 text-left text-sm">
                <PricingItem text="AI-powered CV optimisation" />
                <PricingItem text="Tailored to a specific job advert" />
                <PricingItem text="Preview improvements before paying" />
                <PricingItem text="Download as PDF and Word" />
                <PricingItem text="ATS & AI screening optimised" />
              </ul>
              <Link
                href="/match"
                className="mt-8 block w-full rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-primary-light/30 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to land your next interview?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Your experience is already good enough. Let&apos;s make sure your CV
            shows it.
          </p>
          <Link
            href="/match"
            className="mt-8 inline-block rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Match My CV Now
          </Link>
        </div>
      </section>
    </>
  );
}

/* ── Small helper components ── */

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-xl border border-border bg-background p-8 shadow-sm">
      <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
        {step}
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function PricingItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckIcon />
      <span>{text}</span>
    </li>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
