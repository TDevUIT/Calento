'use client';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  return (
    <div>
      <h1>Auth Guard</h1>
      {children}
    </div>
  );
}
