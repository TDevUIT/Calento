interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContent: React.FC<MainContentProps> = ({ 
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
      {children}
    </main>
  );
};
