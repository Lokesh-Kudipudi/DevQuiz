import { Link } from 'react-router-dom';

const LegalPrivacyPage = () => {
  return (
    <div className="min-h-screen px-4 py-8 md:py-12" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="relative z-10 mx-auto max-w-4xl animate-[fadeUp_0.3s_ease_forwards]">
        <div className="mb-6 md:mb-8 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-xs md:text-sm font-mono uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            {'\u2190'} Back to Login
          </Link>
          <div className="text-right">
            <h1 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text-base)]">
              Privacy Policy
            </h1>
            <p className="mt-1 text-[11px] md:text-xs font-mono uppercase tracking-widest text-[var(--color-muted)]">
              Last updated: May 24, 2026
            </p>
          </div>
        </div>

        <article className="rounded-[12px] border border-[var(--color-text-base)]/[0.07] bg-[var(--color-surface)] p-5 md:p-8 prose prose-invert max-w-none">
          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">1. Information We Collect</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              DevQuiz collects account details (name, email, authentication provider), activity records related to quizzes/assessments/coding rounds,
              and basic usage telemetry required for core platform functionality.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">2. How We Use Information</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              We use collected data to authenticate users, provide assessment workflows, maintain leaderboards, generate analytics such as practice streaks,
              improve reliability, and protect the platform from abuse.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">3. AI-Generated Content</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              DevQuiz can generate questions using third-party AI APIs. Prompt inputs and generated outputs may be processed by those providers under their
              applicable policies. Review generated content before using it in high-stakes scenarios.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">4. Cookies and Sessions</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              We use HTTP-only authentication cookies to keep users signed in securely. You can clear cookies in your browser, but some features may stop
              working until you sign in again.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">5. Data Retention</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              We retain account and assessment data as long as needed to provide the service, enforce platform safety, and satisfy legal obligations.
              You can request deletion of your account and associated content, subject to legal or operational requirements.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">6. Security</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              We apply technical and organizational safeguards to protect data. No online service can guarantee absolute security, but we continuously
              improve controls and incident response practices.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">7. Your Rights</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              Depending on your location, you may have rights to access, correct, or delete personal information. Contact us to submit a privacy request.
            </p>
          </section>

          <section>
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">8. Contact</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              For privacy questions, contact the DevQuiz team through the support channel configured for your deployment.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default LegalPrivacyPage;
