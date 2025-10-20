'use client';

import { usePathname } from 'next/navigation';
import { isGuestOnlyRoute, isDashboardRoute, isBookingRoute, isInvitationRoute } from '@/constants/routes';
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
  const isBooking = isBookingRoute(pathname);
  const isInvitation = isInvitationRoute(pathname);
  const showHeaderFooter = !isAuthPage && !isDashboard && !isBooking && !isInvitation;

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
