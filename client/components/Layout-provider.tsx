'use client';

import { usePathname } from 'next/navigation';
import { isGuestOnlyRoute } from '@/constants/routes';
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

  return (
    <main 
      className={cn('min-h-screen', className)}
      id="main-content"
    >
      {!isAuthPage && <Header />}
      {children}
      {!isAuthPage && <Footer />}
    </main>
  );
};
