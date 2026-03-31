import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#eaeff5]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
              Land More Interviews
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-[1.15]">
              Your experience is relevant.
              <br />
              <span className="text-primary">Make your resume prove it.</span>
            </h1>
            <p className="mt-4 text-base leading-7 text-muted max-w-lg mx-auto">
              Paste a job advert, upload your resume, and get an optimised version
              that highlights the experience you already have — tailored to pass
              AI screening and impress hiring managers.
            </p>
            <div className="mt-8">
              <Link
                href="/match"
                className="inline-block rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
              >
                Boost My Resume Now
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted">
              No sign-up required.
            </p>
          </div>
        </div>
      </section>

      {/* ── Social proof bar ── */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-xs sm:text-sm text-muted">
          <span className="flex items-center gap-2">
            <CheckIcon /> Your experience better presented
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon /> ATS &amp; AI screening optimised
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon /> Download as PDF or Word
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon /> We never store your resume
          </span>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="scroll-mt-20 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Three steps to a better resume
            </h2>
            <p className="mt-3 text-base text-muted">
              No templates. No starting from scratch. Just your resume, made more
              relevant.
            </p>
          </div>

          {/* Steps */}
          <div className="mt-10 flex flex-col divide-y sm:flex-row sm:divide-y-0 sm:divide-x divide-border">
            <StepCard
              step="1"
              title="Paste the Job Advert"
              description="Drop in a URL or paste the job description. We extract the key requirements and keywords."
            />
            <StepCard
              step="2"
              title="Upload Your Resume"
              description="Upload your resume as PDF or Word. We identify your sections, experience, and skills."
            />
            <StepCard
              step="3"
              title="Download Your Match"
              description="Preview improvements, pay a small fee, and download your optimised resume ready to submit."
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-surface border-y border-border py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              People are landing interviews
            </h2>
            <p className="mt-3 text-base text-muted">
              Real results from job seekers who used AI Resume Matcher.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="I applied to 15 jobs with my old resume and got 1 response. After using AI Resume Matcher, I got callbacks from 4 out of 6 applications. The difference was night and day."
              name="Sarah M."
              role="Marketing Manager"
              result="4x more callbacks"
            />
            <TestimonialCard
              quote="I was sceptical, but the side-by-side comparison sold me. My experience was all there — it just finally read like it matched the job description. Got an interview within a week."
              name="James K."
              role="Software Engineer"
              result="Interview in 7 days"
            />
            <TestimonialCard
              quote="As a career changer, my resume never felt right for new roles. AI Resume Matcher rephrased my transferable skills perfectly. I landed a role in a completely new industry."
              name="Priya R."
              role="Project Manager"
              result="New industry, new role"
            />
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <StarCluster /> 4.8/5 average rating
            </span>
            <span>|</span>
            <span>1,000+ resumes optimised</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Built to get you interviews
            </h2>
            <p className="mt-3 text-base text-muted">
              Not another resume builder. A smart layer on top of what you already
              have.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
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
              description="Your resume structure is preserved. We work within your sections — summary, experience, skills, education — not around them."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border-t border-border">
            <FeatureCard
              title="Preview Before You Pay"
              description="See a summary of improvements and sample changes before committing. No surprises."
            />
            <FeatureCard
              title="PDF & Word Export"
              description="Download your optimised resume in both PDF and Word format. Ready for any application portal."
            />
            <FeatureCard
              title="Any Industry"
              description="From software engineering to marketing to healthcare — the AI understands role-specific language across industries."
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to land your next interview?
          </h2>
          <p className="mt-3 text-base text-white/80">
            Your experience is already good enough. Let&apos;s make sure your resume
            shows it.
          </p>
          <Link
            href="/match"
            className="mt-6 inline-block rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-primary-light hover:shadow-md"
          >
            Boost My Resume Now
          </Link>
        </div>
      </section>
    </>
  );
}

/* ── Components ── */

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
    <div className="flex-1 flex flex-col items-center text-center px-6 py-5 sm:py-0">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
        {step}
      </span>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        {description}
      </p>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  result,
}: {
  quote: string;
  name: string;
  role: string;
  result: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm">
      {/* Result badge */}
      <span className="mb-4 inline-flex self-start items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
        {result}
      </span>
      {/* Stars */}
      <div className="mb-3 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="h-4 w-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {/* Quote */}
      <p className="flex-1 text-sm leading-relaxed text-foreground">
        &ldquo;{quote}&rdquo;
      </p>
      {/* Author */}
      <div className="mt-4 border-t border-border pt-4">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted">{role}</p>
      </div>
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
    <div className="px-6 py-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{description}</p>
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

function ClockIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
      />
    </svg>
  );
}

function StarCluster() {
  return (
    <span className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="h-3.5 w-3.5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}
