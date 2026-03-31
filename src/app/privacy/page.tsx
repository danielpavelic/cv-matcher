import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AI Resume Matcher",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: March 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground">
        <Section title="1. Introduction">
          <p>
            AI Resume Matcher (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;)
            is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, and safeguard your information when you use our
            website and services.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following information when you use our service:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>Resume content</strong> — the text extracted from the
              resume you upload. This is processed in real-time and is{" "}
              <strong>not stored</strong> on our servers after processing is
              complete.
            </li>
            <li>
              <strong>Job advert content</strong> — the job description you
              paste or the URL you provide. This is processed in real-time and is
              not stored.
            </li>
            <li>
              <strong>Payment information</strong> — processed securely by our
              payment provider (Stripe). We do not store your credit card
              details.
            </li>
            <li>
              <strong>Usage data</strong> — anonymous analytics such as page
              views, browser type, and device information to improve our service.
            </li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              Analyse your resume against a job advert and generate an optimised
              version.
            </li>
            <li>Process payments for our services.</li>
            <li>Improve and maintain our website and services.</li>
            <li>
              Communicate with you about your use of the service, if necessary.
            </li>
          </ul>
        </Section>

        <Section title="4. Resume Data — We Do Not Store It">
          <p>
            Your resume content and job advert text are processed in real-time to
            generate your optimised resume. Once processing is complete and you
            have downloaded your result,{" "}
            <strong>
              we do not retain any of your resume data on our servers
            </strong>
            . We do not build profiles from your data, and we do not sell or
            share your resume content with any third parties.
          </p>
        </Section>

        <Section title="5. Third-Party Services">
          <p>We use the following third-party services:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>Anthropic (Claude API)</strong> — to power the AI analysis
              and rewriting of your resume. Your resume text is sent to
              Anthropic&apos;s API for processing. Anthropic&apos;s privacy
              policy applies to this processing.
            </li>
            <li>
              <strong>Stripe</strong> — to process payments securely.
              Stripe&apos;s privacy policy applies to payment data.
            </li>
            <li>
              <strong>Vercel</strong> — to host our website. Vercel&apos;s
              privacy policy applies to hosting and infrastructure.
            </li>
          </ul>
        </Section>

        <Section title="6. Cookies">
          <p>
            We use essential cookies required for the website to function. We do
            not use advertising or tracking cookies. If we use analytics, the
            data collected is anonymous and aggregated.
          </p>
        </Section>

        <Section title="7. Data Security">
          <p>
            We use industry-standard security measures including HTTPS encryption
            for all data in transit. Since we do not store your resume data,
            there is no risk of your resume being exposed in a data breach on our
            servers.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p>
            Under GDPR and applicable data protection laws, you have the right
            to:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              Request information about what data we hold about you (which is
              minimal, as we do not store resume data).
            </li>
            <li>Request deletion of any data we may hold.</li>
            <li>Withdraw consent for data processing at any time.</li>
            <li>Lodge a complaint with a data protection authority.</li>
          </ul>
        </Section>

        <Section title="9. Children">
          <p>
            Our service is not intended for use by anyone under the age of 16. We
            do not knowingly collect information from children.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify
            users of significant changes by posting a notice on our website. Your
            continued use of the service after changes constitutes acceptance of
            the updated policy.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href="mailto:privacy@airesumematcher.com"
              className="text-primary hover:underline"
            >
              privacy@airesumematcher.com
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
