import { Footer, Header } from "./organisms";

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayoutProvider: React.FC<MainContentProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <main 
      className={`
        pt-16 lg:pt-20 
        min-h-screen 
        ${className}
      `}
      id="main-content"
    >
      <Header />
      {children}
      <Footer />
    </main>
  );
};
