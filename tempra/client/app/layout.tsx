import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/provider/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { OrganizationSchema, WebSiteSchema, SoftwareApplicationSchema } from "@/components/seo/structured-data";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { WebVitals } from "@/components/analytics/web-vitals";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { FaviconSwitcherSafe } from "@/components/theme/favicon-switcher-safe";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Calento BETA - AI Calendar Assistant',
    default: 'Calento BETA - AI Calendar Assistant',
  },
  description: 'Get your time back with AI. The #1 AI calendar app for individuals, teams, and organizations. Currently in BETA testing.',
  keywords: ['AI calendar', 'scheduling', 'productivity', 'time management', 'Google Calendar', 'Outlook'],
  authors: [{ name: 'Calento Team' }],
  creator: 'Calento',
  publisher: 'Calento',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon-light.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Calento BETA',
    title: 'Calento BETA - AI Calendar Assistant',
    description: 'Get your time back with AI - Currently in BETA testing',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Calento - AI Calendar Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calento BETA - AI Calendar Assistant',
    description: 'Get your time back with AI - Currently in BETA testing',
    images: ['/og-image.png'],
    creator: '@calento',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="google-site-verification" content="3ej64bq8XA8NjspO3ZZUpi6lOSzCtXC8sj0niFTLHV0" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        <OrganizationSchema />
        <WebSiteSchema />
        <SoftwareApplicationSchema />
        <Analytics />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#121212] text-[#3d3d3d] dark:text-[#e7e7e7] transition-colors duration-300`} suppressHydrationWarning>
        <ServiceWorkerRegister />
        <WebVitals />
        <QueryProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <FaviconSwitcherSafe />
            {children}
          </ThemeProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}