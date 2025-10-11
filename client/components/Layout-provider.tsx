'use client';

import { usePathname } from 'next/navigation';
import { isGuestOnlyRoute, isDashboardRoute } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { Footer, Header } from './organisms';

interface MainLayoutProviderProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayoutProvider: React.FC<MainLayoutProviderProps> = ({ 
  children, 
  className 
}) => {
  const pathname = usePathname();
  const isAuthPage = isGuestOnlyRoute(pathname);
  const isDashboard = isDashboardRoute(pathname);
  const showHeaderFooter = !isAuthPage && !isDashboard;

  return (
    <main 
      className={cn('min-h-screen', className)}
      id="main-content"
    >
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </main>
  );
};
