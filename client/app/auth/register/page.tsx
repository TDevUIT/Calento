import Link from 'next/link';
import { OAuthButtons } from '@/components/auth/oauth-buttons';

const Logo = () => (
  <svg
    className="w-8 h-8"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 3.5L29.5 10.25V23.75L16 30.5L2.5 23.75V10.25L16 3.5Z"
      className="theme-fill-primary"
    />
    <path
      d="M16 14.5L29.5 21V23.75L16 30.5L2.5 23.75V21L16 14.5Z"
      className="theme-fill-secondary"
    />
  </svg>
);

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col theme-bg-subtle">
      <header className="p-4 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
          <span className="font-semibold text-lg theme-text-primary">Tempra</span>
        </Link>
      </header>
      <main className="flex-grow flex">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold theme-text-primary tracking-tight">
                  AI scheduling for your calendar (it&apos;s free)
                </h1>
                <ul className="list-disc list-inside theme-text-secondary space-y-2 text-base">
                  <li>Automate focus time, meetings, work, & breaks</li>
                  <li>Flexibly reschedule around conflicts</li>
                  <li>Analyze where you spend your time every week</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="text-xs theme-text-muted space-y-1">
                  <p>
                    By selecting “Agree & sign up” below I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Tempra Terms
                    </Link>
                    .
                  </p>
                  <p>
                    Learn about how we use & protect your data in our{' '}
                    <Link
                      href="/privacy"
                      className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
                <OAuthButtons />
              </div>
            </div>
          </div>
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
              {/* Placeholder for the image/graphic on the right side */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
