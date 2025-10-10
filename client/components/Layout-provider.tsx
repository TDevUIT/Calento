'use client'
import { usePathname } from "next/navigation";
import { Footer, Header } from "./organisms";

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayoutProvider: React.FC<MainContentProps> = ({ 
  children, 
  className = '' 
}) => {
  const isPathName = usePathname()
  const isAuthPage = isPathName === '/auth/login' || isPathName === '/auth/register' || isPathName === '/auth/forgot-password'
  return (
    <main 
      className={`
        min-h-screen 
        ${className}
      `}
      id="main-content"
    >
      {!isAuthPage && <Header />}
      {children}
      {!isAuthPage && <Footer />}
    </main>
  );
};
