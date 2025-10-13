"use client";

import { AuthProvider } from "@/components/providers";
import { QueryProvider } from "@/provider";

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
