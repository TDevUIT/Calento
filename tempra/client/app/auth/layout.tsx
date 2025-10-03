export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <h1>Auth Layout</h1>
        {children}
      </div>
    </div>
  );
}
