import { MainContent } from '@/components/layout/main-content';

export default function TermsPage() {
  return (
    <MainContent className="bg-gradient-to-b from-[#f6f6f6] via-white/30 to-white dark:from-[#121212] dark:via-[#3d3d3d]/30 dark:to-[#121212] transition-colors duration-300">
      <section className="mx-auto max-w-4xl px-6 py-20 md:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Terms of Service
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-slate-700 dark:prose-invert dark:text-slate-200">
          <p>
            These Terms of Service ("Terms") govern your access to and use of Calento (the "Service"). By
            accessing or using the Service, you agree to be bound by these Terms.
          </p>

          <h2>1. Eligibility</h2>
          <p>
            You must be at least 13 years old (or the minimum legal age in your jurisdiction) to use the Service.
          </p>

          <h2>2. Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and for all activities that occur
            under your account.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose.</li>
            <li>Attempt to gain unauthorized access to any systems or networks.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service.</li>
          </ul>

          <h2>4. Subscriptions and Billing</h2>
          <p>
            If you purchase a paid plan, you agree to pay the fees displayed at checkout and any applicable taxes.
            Subscription terms, renewals, and cancellations may vary by plan.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>
            The Service may integrate with third-party services (e.g., calendar providers). Your use of third-party
            services is subject to their terms and policies.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its content are owned by Calento or its licensors and are protected by applicable laws.
          </p>

          <h2>7. Disclaimer</h2>
          <p>
            The Service is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, we
            disclaim all warranties, express or implied.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Calento shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages.
          </p>

          <h2>9. Changes</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Service after changes become effective
            constitutes acceptance of the updated Terms.
          </p>

          <h2>10. Contact</h2>
          <p>
            If you have questions about these Terms, please contact us via the Contact page.
          </p>
        </div>
      </section>
    </MainContent>
  );
}
