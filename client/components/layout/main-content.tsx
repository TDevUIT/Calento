import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContent: React.FC<MainContentProps> = ({ 
  children, 
  className 
}) => {
  return (
    <main 
      className={cn('min-h-screen', className)}
      id="main-content"
    >
      {children}
    </main>
  );
};
