'use client';

import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRegisterPage = pathname === '/auth/register';

  if (isRegisterPage) {
    return <>{children}</>;
  }

  return (
    <div className="max-h-screen overflow-hidden"> 
      <main className="flex items-center justify-center min-h-screen mb-20">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="relative p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
