"use client";

import { AuthProvider } from "@/components/providers";
import { QueryProvider } from "@/provider";
import { Toaster } from "sonner";

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </QueryProvider>
  );
}
