import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden bg-primary text-white"
        style={{ backgroundImage: "url(/assets/airesumematcher-logo.png)", backgroundSize: "80px 80px", backgroundRepeat: "repeat" }}
      >
        {/* Overlay to tint the repeating logo */}
        <div className="absolute inset-0 bg-primary/[0.97] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 inline-block rounded-full bg-primary-dark px-4 py-1.5 text-xs font-semibold tracking-wide text-[#7db8e8] uppercase">
              Land More Interviews
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-[1.15] text-white" style={{ textShadow: "0 2px 8px rgba(0, 30, 80, 0.5)" }}>
              Your experience is relevant.
              <br />
              <span className="text-white/90">Make your resume prove it.</span>
            </h1>
            <p className="mt-4 text-base leading-7 text-white/75 max-w-lg mx-auto">
              Paste a job advert, upload your resume, and get an optimised version
              that highlights the experience you already have — tailored to pass
              AI screening and impress hiring managers.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                href="/match"
                className="inline-flex items-center gap-3 rounded-xl bg-amber-50 px-10 py-5 text-lg font-bold text-primary shadow-md transition-all hover:bg-amber-100 hover:shadow-lg border-4 border-amber-400"
              >
                <span>Boost My Resume Now</span>
                <svg className="h-6 w-6 shrink-0 animate-sparkle text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z" />
                  <path d="M20 14L20.9 17.1L24 18L20.9 18.9L20 22L19.1 18.9L16 18L19.1 17.1L20 14Z" opacity="0.6" />
                </svg>
              </Link>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <LockIcon />
                No sign-up required
              </span>
            </div>
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

          <div className="mt-10 flex flex-col divide-y sm:flex-row sm:divide-y-0 sm:divide-x divide-border">
            <StepCard
              step="1"
              title="Paste the Job Advert"
              description="Drop in a URL or paste the job description. We extract the key requirements and keywords."
              icon={
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.466.73-3.555" />
                </svg>
              }
            />
            <StepCard
              step="2"
              title="Upload Your Resume"
              description="Upload your resume as PDF or Word. We identify your sections, experience, and skills."
              icon={
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6" />
                </svg>
              }
            />
            <StepCard
              step="3"
              title="Download Your Match"
              description="Preview improvements, pay a small fee, and download your optimised resume ready to submit."
              icon={
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ── Before / After Preview ── */}
      <section className="bg-surface border-y border-border py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl inline-flex items-center justify-center gap-2">
              See the difference
              <svg className="h-7 w-7 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z" />
                <path d="M20 14L20.9 17.1L24 18L20.9 18.9L20 22L19.1 18.9L16 18L19.1 17.1L20 14Z" opacity="0.6" />
              </svg>
            </h2>
            <p className="mt-3 text-base text-muted">
              Same experience. Stronger presentation. Here&apos;s what our AI does.
            </p>
          </div>

          <div className="mt-10 mx-auto max-w-3xl rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              <div className="p-6">
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-4">
                  Before
                </p>
                <div className="space-y-3 text-sm text-muted">
                  <p className="font-medium text-foreground">Professional Summary</p>
                  <p>
                    Experienced manager with background in leading teams and delivering projects
                    in fast-paced environments. Good at working with different departments.
                  </p>
                  <p className="font-medium text-foreground mt-4">Experience</p>
                  <p>
                    - Managed a team of developers and worked on multiple projects
                    <br />
                    - Helped improve internal processes
                    <br />
                    - Worked with business teams to deliver requirements
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-4">
                  After
                </p>
                <div className="space-y-3 text-sm text-foreground">
                  <p className="font-medium">Professional Summary</p>
                  <p>
                    Results-driven engineering leader with a track record of cross-functional
                    delivery in fast-paced environments. Proven stakeholder management
                    across technical and business teams.
                  </p>
                  <p className="font-medium mt-4">Experience</p>
                  <p>
                    - Led a cross-functional team of developers, driving agile delivery
                    across multiple concurrent projects
                    <br />
                    - Optimised internal processes, improving team velocity and delivery
                    predictability
                    <br />
                    - Managed stakeholder relationships across business units to align
                    technical delivery with strategic objectives
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-border bg-surface px-6 py-3 text-center">
              <p className="text-xs text-muted">
                Same facts. Same person. Just rephrased to match the job advert&apos;s language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl inline-flex items-center justify-center gap-2">
              What do others say
              <svg className="h-7 w-7 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-6.233 0c-1.045 1.045-1.465 3.025-1.413 4.206.052 1.181 1.313 2.36 2.503 2.412 1.181.052 3.161-.368 4.206-1.413a4.493 4.493 0 000-6.234" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5a1 1 0 11-2 0 1 1 0 012 0z" fill="currentColor" />
              </svg>
            </h2>
            <p className="mt-3 text-base text-muted">
              Real results from job seekers who used AI Resume Matcher.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="Super easy. Pasted the job link, uploaded my resume, and the improved version was ready in under a minute. Applied to 6 jobs, got 4 callbacks. Never had that hit rate before."
              name="Sarah M."
              role="Marketing Manager"
              result="4 out of 6 callbacks"
            />
            <TestimonialCard
              quote="I was sceptical but the before/after comparison convinced me. It didn't add anything fake — just rephrased what I'd actually done using the job ad's language. Got an interview that same week."
              name="James K."
              role="Software Engineer"
              result="Landed the interview"
            />
            <TestimonialCard
              quote="Switching from hospitality to project management felt impossible with my old CV. This tool rephrased my transferable skills so well I landed a PM role within a month. Worth every cent."
              name="Priya R."
              role="Career Changer"
              result="New career in 4 weeks"
            />
            <TestimonialCard
              quote="10 years in nursing and my CV still read flat. The AI matched clinical leadership language from the job ad perfectly. Got shortlisted for a senior role I almost didn't apply for."
              name="Emma L."
              role="Senior Staff Nurse"
              result="Shortlisted first try"
            />
            <TestimonialCard
              quote="Did in 30 seconds what took me hours of manual tweaking. No subscription, no hidden fees — just pay once and download. Three interviews in two weeks. Simple as that."
              name="Tom B."
              role="Financial Analyst"
              result="3 interviews in 2 weeks"
            />
            <TestimonialCard
              quote="Needed my CV tailored for a very specific teaching role abroad. Every bullet point read like it was written for that exact job. Straightforward, fast, and it actually works."
              name="Maria S."
              role="Secondary School Teacher"
              result="Hired abroad"
            />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-surface border-y border-border py-14 sm:py-20">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border-t border-border">
            <FeatureCard
              title="Privacy Friendly"
              description="Your resume is processed in real-time and never stored on our servers. Once you download, all data is gone."
            />
            <FeatureCard
              title="No Sign-Up Required"
              description="Start immediately — no account, no email, no password. Just paste a job ad, upload your resume, and go."
            />
            <FeatureCard
              title="AI Resume Keyword Matcher"
              description="Our AI extracts keywords from the job advert and weaves them naturally into your resume for maximum ATS match rate."
            />
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Simple pricing
            </h2>
            <p className="mt-3 text-base text-muted">
              Pay per resume. No subscriptions. No hidden fees.
            </p>

            <div className="relative mt-8 rounded-2xl border border-border bg-background p-8 shadow-sm">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                  <ClockIcon />
                  Limited time — 50% off
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-center gap-3">
                <span className="text-xl text-muted line-through">
                  &euro;9.99
                </span>
                <span className="text-4xl font-extrabold tracking-tight text-primary">
                  &euro;4.99
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">only, per resume downloaded</p>

              <ul className="mt-6 space-y-3 text-left text-sm">
                <PricingItem text="AI-powered resume optimisation" />
                <PricingItem text="Tailored to a specific job advert" />
                <PricingItem text="Relevance analysis with detailed report" />
                <PricingItem text="Preview improvements before paying" />
                <PricingItem text="Download as PDF and Word" />
                <PricingItem text="ATS & AI screening optimised" />
              </ul>

              <Link
                href="/match"
                className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-amber-50 px-10 py-5 text-lg font-bold text-primary shadow-md transition-all hover:bg-amber-100 hover:shadow-lg border-4 border-amber-400"
              >
                <span>Get Started — &euro;4.99</span>
                <svg className="h-6 w-6 shrink-0 animate-sparkle text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z" />
                  <path d="M20 14L20.9 17.1L24 18L20.9 18.9L20 22L19.1 18.9L16 18L19.1 17.1L20 14Z" opacity="0.6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-surface border-y border-border py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-10 divide-y divide-border">
            <FaqItem
              question="How does AI Resume Matcher work?"
              answer="You paste a job advert (URL or text) and upload your existing resume. Our AI analyses the job requirements, compares them to your experience, and rephrases your resume using the employer's language — so your real experience reads as a stronger match."
            />
            <FaqItem
              question="Will the AI make things up or add fake experience?"
              answer="Never. This is our core principle. The AI only rephrases and reorders what's already in your resume. It doesn't add skills you don't have, fabricate achievements, or change your job titles. You should always review the output — but it will only contain your real experience, better presented."
            />
            <FaqItem
              question="Will this work for my industry?"
              answer="Yes. AI Resume Matcher works across all industries — software engineering, marketing, finance, healthcare, education, sales, operations, and more. The AI understands role-specific language and adapts your resume to match the terminology used in your target job advert."
            />
            <FaqItem
              question="What file formats do you support?"
              answer="Upload your resume as a PDF or Word document (.docx). After optimisation, you can download the result in both PDF and Word format — ready for any application portal."
            />
            <FaqItem
              question="Do you store my resume?"
              answer="No. Your resume is processed in real-time and never stored on our servers. Once you download your result, all data is gone. We take your privacy seriously — read our privacy policy for full details."
            />
            <FaqItem
              question="When do I pay?"
              answer="The analysis and relevance report are free. You only pay (€4.99) when you're happy with the preview and want to download the full optimised resume. No surprises, no hidden fees."
            />
            <FaqItem
              question="What if I'm not satisfied with the result?"
              answer="You can preview a summary of all improvements and sample before/after changes before paying. We show you exactly what changed so you can decide if it's worth it. The preview is free — you're never paying blind."
            />
            <FaqItem
              question="What is the 'relevance score'?"
              answer="Before and after optimisation, we score how well your resume matches the job advert's requirements. You'll see which requirements you match strongly, partially, or are missing — and how much the score improves after optimisation."
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
            className="mt-6 inline-flex items-center gap-3 rounded-xl bg-amber-50 px-10 py-5 text-lg font-bold text-primary shadow-md transition-all hover:bg-amber-100 hover:shadow-lg border-4 border-amber-400"
          >
            <span>Boost My Resume Now</span>
            <svg className="h-6 w-6 shrink-0 animate-sparkle" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z" />
              <path d="M20 14L20.9 17.1L24 18L20.9 18.9L20 22L19.1 18.9L16 18L19.1 17.1L20 14Z" opacity="0.6" />
            </svg>
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
  icon,
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col items-center text-center px-8 py-6 sm:py-0">
      {icon}
      <span className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-white shadow-sm">
        {step}
      </span>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-base leading-relaxed text-muted">
        {description}
      </p>
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
    <div className="px-6 py-6 flex gap-3">
      <svg className="h-6 w-6 shrink-0 mt-0.5 text-accent" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.15" />
        <path d="M7 12.5l3 3 7-7" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
      </div>
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
      <p className="flex-1 text-sm leading-relaxed text-foreground">
        &ldquo;{quote}&rdquo;
      </p>
      <span className="mt-4 inline-flex self-start items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
        {result}
      </span>
      <div className="mt-3 border-t border-border pt-3">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted">{role}</p>
      </div>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group py-5">
      <summary className="flex cursor-pointer items-center justify-between text-base font-semibold">
        {question}
        <svg
          className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-45"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted pr-8">
        {answer}
      </p>
    </details>
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

function LockIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
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
