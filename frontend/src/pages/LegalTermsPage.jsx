import { Link } from 'react-router-dom';

const LegalTermsPage = () => {
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
              Terms & Conditions
            </h1>
            <p className="mt-1 text-[11px] md:text-xs font-mono uppercase tracking-widest text-[var(--color-muted)]">
              Last updated: May 24, 2026
            </p>
          </div>
        </div>

        <article className="rounded-[12px] border border-[var(--color-text-base)]/[0.07] bg-[var(--color-surface)] p-5 md:p-8 prose prose-invert max-w-none">
          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">1. Acceptance of Terms</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              By using DevQuiz, you agree to these terms. If you do not agree, do not use the service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">2. Account Responsibilities</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              You are responsible for maintaining account security and for all activity under your account. Provide accurate registration information
              and notify administrators of unauthorized access.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">3. Acceptable Use</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              You may not misuse the platform, attempt to disrupt services, scrape private data, or upload harmful or unlawful content.
              Violations may result in suspension or termination.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">4. Assessments and Content</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              Users are responsible for content they create or share in quizzes, coding rounds, and assessments. AI-generated content is provided
              as-is and should be reviewed for correctness.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">5. Intellectual Property</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              DevQuiz platform code, design, and branding remain the property of the project owners unless explicitly stated otherwise.
              You retain rights to your original submitted content.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">6. Service Availability</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              We may modify, pause, or discontinue parts of the service at any time for maintenance, security, or product updates.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">7. Limitation of Liability</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              DevQuiz is provided on an as-is basis. To the maximum extent permitted by law, we are not liable for indirect, incidental,
              or consequential damages arising from use of the platform.
            </p>
          </section>

          <section>
            <h2 className="font-['Syne',sans-serif] text-xl text-[var(--color-text-base)]">8. Changes to Terms</h2>
            <p className="text-sm text-[var(--color-muted)] font-mono">
              We may update these terms periodically. Continued use after changes means you accept the updated version.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default LegalTermsPage;
