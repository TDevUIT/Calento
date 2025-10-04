import Link from 'next/link';
import Image from 'next/image';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { RegisterForm } from '@/components/auth/register-form';
import { AuthDivider } from '@/components/auth/auth-divider/auth-divider';
import AuthShell from '@/components/auth/auth-shell';
import AuthLogo from '@/components/auth/auth-logo';
import { LegalNotice } from '@/components/auth/legal-notice/legal-notice';

// Using shared header Logo for brand consistency

export default function RegisterPage() {
  return (
    <AuthShell>
      <header className="p-6 lg:px-10 flex items-center">
        <Link href="/" className="flex items-center"><AuthLogo /></Link>
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

              <div className="space-y-6">
                <OAuthButtons mode="register" />
                <AuthDivider label="Or sign up with email" />
                <RegisterForm />
                <LegalNotice variant="register" />
              </div>
            </div>
          </div>
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
            <div className="relative w-full flex items-center justify-center">
              <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-300/35 via-white/40 to-transparent blur-3xl dark:from-emerald-500/15 dark:via-transparent" />
              <div className="w-full max-w-2xl xl:max-w-[52rem] overflow-hidden rounded-2xl border border-emerald-100/70 bg-white/95 backdrop-blur-sm shadow-[0_8px_40px_-8px_rgba(16,185,129,0.25)] dark:border-emerald-500/20 dark:bg-slate-900/90 dark:shadow-[0_8px_40px_-8px_rgba(16,185,129,0.15)] transition-all">
                <div className="flex items-center gap-2 border-b border-emerald-100/60 bg-emerald-50/70 px-5 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-emerald-300" />
                    <div className="h-3 w-3 rounded-full bg-emerald-300/70" />
                    <div className="h-3 w-3 rounded-full bg-emerald-300/50" />
                  </div>
                  <div className="ml-4 flex-1 rounded-md bg-white/70 px-3 py-1.5 text-xs text-slate-500 backdrop-blur-sm dark:bg-slate-800/60 dark:text-slate-400">
                    app.calento.ai/dashboard
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Preview</span>
                </div>
                <div className="relative h-[520px] xl:h-[600px] bg-slate-100 dark:bg-slate-950">
                  <Image
                    src="https://cdn.dribbble.com/userupload/9926004/file/original-f57c1c7ecad5712b6cb18eaeb17e574b.png?resize=1600x900&vertical=center"
                    alt="Calento calendar dashboard showing AI-powered scheduling interface"
                    className="absolute inset-0 h-full w-full object-cover"
                    width={2400}
                    height={1350}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthShell>
  );
}
