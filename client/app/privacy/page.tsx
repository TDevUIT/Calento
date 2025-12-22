import { MainContent } from '@/components/layout/main-content';

export default function PrivacyPage() {
  return (
    <MainContent className="bg-gradient-to-b from-[#f6f6f6] via-white/30 to-white dark:from-[#121212] dark:via-[#3d3d3d]/30 dark:to-[#121212] transition-colors duration-300">
      <section className="mx-auto max-w-4xl px-6 py-20 md:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-slate-700 dark:prose-invert dark:text-slate-200">
          <p>
            This Privacy Policy explains how Calento ("we", "us") collects, uses, and protects your information when you
            use our Service.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li><strong>Account information</strong> (such as name, email address).</li>
            <li><strong>Calendar data</strong> when you connect a calendar provider (subject to your authorization).</li>
            <li><strong>Usage data</strong> (such as pages visited, interactions, and device information).</li>
          </ul>

          <h2>2. How We Use Information</h2>
          <p>We may use your information to:</p>
          <ul>
            <li>Provide and improve the Service.</li>
            <li>Authenticate users and secure accounts.</li>
            <li>Communicate updates, security notices, and support messages.</li>
            <li>Analyze usage to improve product experience.</li>
          </ul>

          <h2>3. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share information with trusted service providers who help us
            operate the Service, subject to appropriate confidentiality and security obligations.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement reasonable technical and organizational measures to protect your information. No method of
            transmission or storage is 100% secure.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain personal information only as long as necessary to provide the Service and comply with legal
            obligations.
          </p>

          <h2>6. Your Choices</h2>
          <p>
            You may update your account information and manage connected integrations within your account settings.
          </p>

          <h2>7. Changes</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use of the Service after changes become
            effective constitutes acceptance of the updated policy.
          </p>

          <h2>8. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us via the Contact page.
          </p>
        </div>
      </section>
    </MainContent>
  );
}
