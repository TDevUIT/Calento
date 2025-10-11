import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { MainLayoutProvider } from "@/components/Layout-provider";
import { AuthProvider } from "@/components/providers";
import { QueryProvider } from "@/provider/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: 'Tempra - AI Calendar Assistant',
  description: 'Smart calendar management with AI-powered scheduling'
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
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