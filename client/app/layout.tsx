import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { MainLayoutProvider } from "@/components/Layout-provider";
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MainLayoutProvider>
            {children}
          </MainLayoutProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}