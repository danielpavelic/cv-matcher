import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AI Resume Matcher",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: March 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground">
        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using AI Resume Matcher (&quot;the Service&quot;),
            you agree to be bound by these Terms of Service. If you do not agree
            to these terms, please do not use the Service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            AI Resume Matcher is an online tool that analyses your resume against
            a specific job advert and generates an optimised version of your
            resume using AI technology. The Service rephrases your existing
            experience to better match job requirements — it does not fabricate
            or invent experience, skills, or qualifications.
          </p>
        </Section>

        <Section title="3. User Responsibilities">
          <p>By using the Service, you agree that:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              You are the owner of the resume you upload, or have permission to
              use and modify it.
            </li>
            <li>
              The information in your resume is accurate and truthful. We
              optimise presentation, not facts.
            </li>
            <li>
              You will review the generated resume before submitting it to
              employers and take responsibility for its accuracy.
            </li>
            <li>
              You will not use the Service for any unlawful or fraudulent
              purpose.
            </li>
            <li>You are at least 16 years of age.</li>
          </ul>
        </Section>

        <Section title="4. AI-Generated Content">
          <p>
            The optimised resume is generated using artificial intelligence. While
            we design our system to only rephrase and reorder your existing
            experience:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>You are responsible</strong> for reviewing the output and
              ensuring all statements are accurate before using it.
            </li>
            <li>
              AI systems may occasionally produce unexpected results. Always
              verify the final resume reflects your true experience.
            </li>
            <li>
              We do not guarantee that the optimised resume will result in job
              interviews or employment.
            </li>
          </ul>
        </Section>

        <Section title="5. Payments and Refunds">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              The Service charges a one-time fee per resume optimisation, as
              displayed at the time of purchase.
            </li>
            <li>
              Payment is processed securely through Stripe. We do not store your
              payment card details.
            </li>
            <li>
              You can preview a summary of improvements and sample changes before
              paying. Payment is required to access the full optimised resume and
              download it.
            </li>
            <li>
              Refunds may be issued at our discretion if the Service fails to
              deliver a result (e.g. a technical error prevents generation). We
              do not offer refunds based on subjective dissatisfaction with the
              AI output, as a preview is provided before payment.
            </li>
          </ul>
        </Section>

        <Section title="6. Intellectual Property">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Your content:</strong> You retain full ownership of your
              resume and all content you upload. We do not claim any rights to
              your data.
            </li>
            <li>
              <strong>Our service:</strong> The website, AI models, design, and
              code are the intellectual property of AI Resume Matcher. You may
              not copy, reproduce, or reverse-engineer the Service.
            </li>
          </ul>
        </Section>

        <Section title="7. Data and Privacy">
          <p>
            Your use of the Service is also governed by our{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            . Key points:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              We do not store your resume data after processing is complete.
            </li>
            <li>
              Resume content is sent to our AI provider (Anthropic) for
              processing.
            </li>
            <li>We do not sell or share your data with third parties.</li>
          </ul>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, AI Resume Matcher shall not
            be liable for:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              Any indirect, incidental, or consequential damages arising from
              your use of the Service.
            </li>
            <li>
              Any loss of employment opportunities or other professional
              consequences.
            </li>
            <li>
              Any inaccuracies in AI-generated content that you did not review
              before use.
            </li>
          </ul>
          <p className="mt-2">
            Our total liability is limited to the amount you paid for the
            specific transaction in question.
          </p>
        </Section>

        <Section title="9. Service Availability">
          <p>
            We strive to keep the Service available at all times but do not
            guarantee uninterrupted access. We may temporarily suspend the
            Service for maintenance, updates, or circumstances beyond our
            control.
          </p>
        </Section>

        <Section title="10. Modifications to Terms">
          <p>
            We reserve the right to update these Terms of Service at any time.
            Changes will be posted on this page with an updated date. Your
            continued use of the Service after changes constitutes acceptance of
            the new terms.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the laws
            of Ireland. Any disputes shall be subject to the exclusive
            jurisdiction of the courts of Ireland.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>
            If you have any questions about these Terms of Service, please
            contact us at{" "}
            <a
              href="mailto:support@airesumematcher.com"
              className="text-primary hover:underline"
            >
              support@airesumematcher.com
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-2 text-muted">{children}</div>
    </div>
  );
}
