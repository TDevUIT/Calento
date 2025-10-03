# Frontend Architecture Guide - Modern Next.js with Axios & TanStack Query

Cập nhật: 2025-09-26  
Phạm vi: Next.js 15 (App Router), Axios, TanStack Query, shadcn/ui, SEO optimization

## 1. Tổng quan kiến trúc

### 1.1 Tech Stack
- **Framework**: Next.js 15 với App Router
- **HTTP Client**: Axios với interceptors
- **State Management**: TanStack Query (React Query) v5
- **UI Components**: shadcn/ui + Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **SEO**: Next.js built-in SEO + structured data

### 1.2 Cấu trúc thư mục
```
client/
├── app/                          # App Router pages
│   ├── (auth)/                   # Auth group routes
│   │   ├── login/page.tsx
│   │   └── callback/
│   │       ├── google/page.tsx
│   │       └── slack/page.tsx
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── create/page.tsx
│   │   └── settings/page.tsx
│   ├── (marketing)/              # Public marketing pages
│   │   ├── page.tsx              # Homepage
│   │   ├── features/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── about/page.tsx
│   ├── api/                      # API routes (if needed)
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   └── not-found.tsx
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── forms/                    # Form components
│   ├── calendar/                 # Calendar-specific components
│   ├── marketing/                # Marketing page components
│   └── layout/                   # Layout components
├── lib/                          # Utilities and configurations
│   ├── api/                      # API layer
│   │   ├── client.ts             # Axios configuration
│   │   ├── services/             # API service functions
│   │   └── types.ts              # API type definitions
│   ├── hooks/                    # Custom hooks
│   ├── utils/                    # Utility functions
│   ├── validations/              # Zod schemas
│   └── constants/                # App constants
├── providers/                    # Context providers
└── types/                        # TypeScript type definitions
```

## 2. API Layer với Axios

### 2.1 Axios Client Setup (`lib/api/client.ts`)
```typescript
import axios, { AxiosResponse, AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';

// Response envelope type
export interface ApiResponse<T = any> {
  time: string;
  requestID: string;
  status: 'success' | 'error';
  message?: string;
  data: T;
}

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request ID for tracing
    config.headers['X-Request-ID'] = crypto.randomUUID();
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    
    if (data.status === 'error') {
      throw new Error(data.message || 'Request failed');
    }
    
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    const message = error.response?.data?.message || error.message;
    
    // Handle different error types
    switch (error.response?.status) {
      case 401:
        // Redirect to login
        window.location.href = '/login';
        break;
      case 403:
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to perform this action.',
          variant: 'destructive',
        });
        break;
      case 429:
        toast({
          title: 'Rate Limited',
          description: 'Too many requests. Please try again later.',
          variant: 'destructive',
        });
        break;
      case 500:
        toast({
          title: 'Server Error',
          description: 'Something went wrong on our end. Please try again.',
          variant: 'destructive',
        });
        break;
      default:
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
    }
    
    return Promise.reject(error);
  }
);
```

### 2.2 API Service Layer (`lib/api/services/`)

#### Auth Service (`lib/api/services/auth.service.ts`)
```typescript
import { apiClient, ApiResponse } from '../client';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  googleConnected: boolean;
  slackConnected: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  // Get current user
  me: () => 
    apiClient.get<ApiResponse<User>>('/auth/me'),
  
  // Logout
  logout: () => 
    apiClient.post<ApiResponse<null>>('/auth/logout'),
  
  // Google OAuth URLs
  getGoogleAuthUrl: () => 
    apiClient.get<ApiResponse<{ url: string }>>('/auth/google/url'),
  
  // Slack OAuth URLs  
  getSlackAuthUrl: () => 
    apiClient.get<ApiResponse<{ url: string }>>('/auth/slack/url'),
};
```

#### Calendar Service (`lib/api/services/calendar.service.ts`)
```typescript
import { apiClient, ApiResponse } from '../client';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
  }>;
}

export interface CreateEventRequest {
  calendarId?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: string[];
}

export const calendarService = {
  // Get calendars
  getCalendars: () =>
    apiClient.get<ApiResponse<{ items: any[] }>>('/calendar/calendars'),
  
  // Get events
  getEvents: (params: {
    timeMin: string;
    timeMax: string;
    calendarId?: string;
  }) =>
    apiClient.get<ApiResponse<{ items: CalendarEvent[] }>>('/calendar/events', {
      params,
    }),
  
  // Create event
  createEvent: (data: CreateEventRequest) =>
    apiClient.post<ApiResponse<CalendarEvent>>('/calendar/events', data),
  
  // Update event
  updateEvent: (id: string, data: Partial<CreateEventRequest>) =>
    apiClient.patch<ApiResponse<CalendarEvent>>(`/calendar/events/${id}`, data),
  
  // Delete event
  deleteEvent: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/calendar/events/${id}`),
  
  // Get availability
  getAvailability: (data: {
    timeMin: string;
    timeMax: string;
    duration: number;
    attendees?: string[];
  }) =>
    apiClient.post<ApiResponse<{ slots: any[] }>>('/calendar/availability', data),
};
```

## 3. TanStack Query Setup

### 3.1 Query Client Configuration (`lib/query-client.ts`)
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
```

### 3.2 Query Provider (`providers/query-provider.tsx`)
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 4. Custom Hooks for API Calls

### 4.1 Auth Hooks (`lib/hooks/use-auth.ts`)
```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, User } from '@/lib/api/services/auth.service';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get current user
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authService.me();
      return response.data.data;
    },
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem('auth_token');
      router.push('/login');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};

export const useGoogleAuth = () => {
  return useQuery({
    queryKey: ['auth', 'google-url'],
    queryFn: async () => {
      const response = await authService.getGoogleAuthUrl();
      return response.data.data.url;
    },
    enabled: false, // Only fetch when needed
  });
};
```

### 4.2 Calendar Hooks (`lib/hooks/use-calendar.ts`)
```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { calendarService, CalendarEvent, CreateEventRequest } from '@/lib/api/services/calendar.service';
import { toast } from '@/components/ui/use-toast';

export const useCalendars = () => {
  return useQuery({
    queryKey: ['calendars'],
    queryFn: async () => {
      const response = await calendarService.getCalendars();
      return response.data.data.items;
    },
  });
};

export const useEvents = (timeMin: string, timeMax: string) => {
  return useQuery({
    queryKey: ['events', timeMin, timeMax],
    queryFn: async () => {
      const response = await calendarService.getEvents({ timeMin, timeMax });
      return response.data.data.items;
    },
    enabled: !!timeMin && !!timeMax,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => calendarService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create event',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventRequest> }) =>
      calendarService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => calendarService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
    },
  });
};
```

## 5. SEO Optimization

### 5.1 Root Layout với SEO (`app/layout.tsx`)
```typescript
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Tempra - AI Calendar Assistant',
    default: 'Tempra - AI Calendar Assistant for Work & Life',
  },
  description: 'Intelligent calendar management with AI-powered scheduling, availability optimization, and seamless integrations.',
  keywords: ['calendar', 'AI', 'scheduling', 'productivity', 'time management'],
  authors: [{ name: 'Tempra Team' }],
  creator: 'Tempra',
  publisher: 'Tempra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tempra.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Tempra',
    title: 'Tempra - AI Calendar Assistant',
    description: 'Intelligent calendar management with AI-powered scheduling',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tempra - AI Calendar Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tempra - AI Calendar Assistant',
    description: 'Intelligent calendar management with AI-powered scheduling',
    images: ['/og-image.png'],
    creator: '@tempra',
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
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
```

### 5.2 Dynamic SEO for Pages
```typescript
// app/(marketing)/features/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Discover powerful features of Tempra AI Calendar Assistant including smart scheduling, availability optimization, and seamless integrations.',
  openGraph: {
    title: 'Features - Tempra AI Calendar Assistant',
    description: 'Discover powerful features of Tempra AI Calendar Assistant',
    url: '/features',
  },
};

export default function FeaturesPage() {
  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

### 5.3 Structured Data (`lib/structured-data.ts`)
```typescript
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tempra',
  url: 'https://tempra.app',
  logo: 'https://tempra.app/logo.png',
  description: 'AI-powered calendar assistant for intelligent scheduling and time management',
  sameAs: [
    'https://twitter.com/tempra',
    'https://linkedin.com/company/tempra',
  ],
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Tempra',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'AI calendar assistant that helps optimize your schedule and manage time effectively',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
};
```

## 6. Routing Structure (Reclaim-inspired)

### 6.1 Marketing Routes
```
/ (homepage)
/features
/pricing
/about
/blog
/blog/[slug]
/help
/privacy
/terms
/contact
```

### 6.2 Authentication Routes
```
/login
/signup
/forgot-password
/reset-password/[token]
/callback/google
/callback/slack
```

### 6.3 Dashboard Routes
```
/dashboard (overview)
/calendar (calendar view)
/events (events list)
/events/[id] (event details)
/events/create (create event)
/availability (availability settings)
/integrations (connected apps)
/settings (user settings)
/settings/profile
/settings/notifications
/settings/billing
```

This documentation provides a solid foundation for building a modern Next.js application with proper API layer separation, state management, and SEO optimization similar to Reclaim's architecture.
