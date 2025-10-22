import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { MainLayoutProvider } from "@/components/Layout-provider";
import { AuthProvider } from "@/components/providers";
import { QueryProvider } from "@/provider/query-provider";
import { DEFAULT_METADATA } from "@/config/metadata.config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ['system-ui', 'arial'],
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = DEFAULT_METADATA;


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-[#F7F8FC]`} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <MainLayoutProvider>
              {children}
            </MainLayoutProvider>
          </AuthProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
