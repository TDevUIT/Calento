'use client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return (
    <div>
      <h1>Protected Route</h1>
      {children}
    </div>
  );
}
