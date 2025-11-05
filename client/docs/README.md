# 📚 Calento Client Documentation

> Comprehensive documentation for Calento Frontend (Next.js)

## 🎯 Overview

Calento Client là frontend application được xây dựng với:

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Authentication**: JWT + OAuth 2.0

---

## 📖 Documentation Index

### Core Documentation

1. **[SEO Implementation](./SEO-IMPLEMENTATION.md)** 🔍
   - Metadata configuration
   - Sitemap generation
   - Structured data (JSON-LD)
   - OpenGraph images
   - SEO best practices
   - Testing & monitoring

2. **[State Management Part 1](./CLIENT_STATE_MANAGEMENT.md)** 🔄
   - Zustand stores overview
   - Authentication store
   - Calendar store
   - Event store
   - Best practices

3. **[State Management Part 2](./CLIENT_STATE_MANAGEMENT_PART2.md)** 🔄
   - Booking store
   - UI store
   - Advanced patterns
   - Performance optimization

---

## 🏗️ Project Structure

```
client/
├── app/                      # Next.js App Router
│   ├── (dashboard)/         # Dashboard routes (protected)
│   ├── (admin)/             # Admin routes
│   ├── auth/                # Authentication pages
│   ├── blog/                # Blog pages
│   ├── features/            # Feature pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── sitemap.ts           # Dynamic sitemap
│   ├── robots.ts            # Robots.txt
│   └── opengraph-image.tsx  # OG image
│
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   ├── calendar/            # Calendar components
│   ├── events/              # Event components
│   ├── booking/             # Booking components
│   └── seo/                 # SEO components
│
├── config/                  # Configuration files
│   └── metadata.config.ts   # SEO metadata
│
├── constants/               # Constants & configs
│   ├── routes.ts           # Route definitions
│   └── api.ts              # API endpoints
│
├── hook/                    # Custom React hooks
│   ├── useAuth.ts          # Authentication
│   ├── useCalendar.ts      # Calendar operations
│   └── useEvent.ts         # Event operations
│
├── interface/               # TypeScript interfaces
│   ├── calendar.ts
│   ├── event.ts
│   └── user.ts
│
├── service/                 # API services
│   ├── auth.service.ts
│   ├── calendar.service.ts
│   └── event.service.ts
│
├── store/                   # Zustand stores
│   ├── authStore.ts
│   ├── calendarStore.ts
│   └── eventStore.ts
│
├── utils/                   # Utility functions
│   ├── seo.ts              # SEO helpers
│   ├── date.ts             # Date formatting
│   └── api.ts              # API helpers
│
└── middleware.ts            # Auth middleware
```

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.x
npm or pnpm
```

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/calento.git
cd calento/client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### Development

```bash
# Start development server
npm run dev

# Client runs on http://localhost:3000

# Build for production
npm run build

# Start production server
npm start
```

---

## 🔑 Key Features

### User Interface

- ✅ Modern, responsive design
- ✅ Dark mode support
- ✅ Accessibility (WCAG 2.1)
- ✅ Mobile-first approach
- ✅ Progressive Web App (PWA)

### Calendar & Events

- ✅ Interactive calendar view
- ✅ Drag & drop events
- ✅ Recurring events
- ✅ Google Calendar sync
- ✅ Multiple calendar views

### Booking System

- ✅ Public booking pages
- ✅ Real-time availability
- ✅ Time zone conversion
- ✅ Email confirmations
- ✅ Calendar integration

### AI Assistant

- ✅ Natural language commands
- ✅ Smart scheduling
- ✅ Event suggestions
- ✅ Availability queries

### SEO & Performance

- ✅ Server-side rendering (SSR)
- ✅ Static generation (SSG)
- ✅ Optimized images
- ✅ Code splitting
- ✅ Dynamic sitemap

---

## ⚙️ Configuration

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.calento.space
NEXT_PUBLIC_APP_URL=https://calento.space

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# SEO
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxxxx
```

---

## 🎨 UI Components

### shadcn/ui Components

Built on Radix UI với TailwindCSS:

```bash
# Add new component
npx shadcn-ui@latest add button

# Available components
button, card, dialog, dropdown-menu, input,
select, calendar, popover, toast, etc.
```

### Custom Components

```typescript
// Calendar Component
import { Calendar } from '@/components/calendar';

<Calendar 
  events={events}
  onEventClick={handleEventClick}
  onDateChange={handleDateChange}
/>

// Event Form
import { EventForm } from '@/components/events';

<EventForm 
  onSubmit={handleSubmit}
  initialData={event}
/>
```

---

## 🔄 State Management

### Zustand Stores

**Auth Store:**
```typescript
import { useAuthStore } from '@/store/authStore';

const { user, login, logout, isAuthenticated } = useAuthStore();
```

**Calendar Store:**
```typescript
import { useCalendarStore } from '@/store/calendarStore';

const { calendars, fetchCalendars, selectedCalendar } = useCalendarStore();
```

**Event Store:**
```typescript
import { useEventStore } from '@/store/eventStore';

const { events, createEvent, updateEvent, deleteEvent } = useEventStore();
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage
```

### E2E Tests

```bash
# Playwright tests
npm run test:e2e

# With UI
npm run test:e2e:ui
```

---

## 🚀 Deployment

### Production Build

```bash
# Build application
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t calento-client .

# Run container
docker run -p 3000:3000 calento-client
```

Xem [Deployment Guide](../../server/docs/DEPLOYMENT-DOCKER-VPS.md) để biết thêm chi tiết.

---

## 📈 Performance

### Core Web Vitals

Target metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Optimization Techniques

✅ **Image Optimization:**
- Next.js Image component
- WebP format
- Lazy loading
- Responsive images

✅ **Code Splitting:**
- Dynamic imports
- Route-based splitting
- Component lazy loading

✅ **Caching:**
- React Query caching
- API response cache
- Static generation

---

## 🔐 Security

### Best Practices

✅ **Authentication:**
- JWT tokens (HTTP-only cookies)
- Refresh token rotation
- CSRF protection

✅ **API Security:**
- Request validation
- Rate limiting
- CORS configuration

✅ **Data Protection:**
- Input sanitization
- XSS prevention
- SQL injection prevention

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Make changes
3. Run linter: `npm run lint`
4. Run tests: `npm test`
5. Build: `npm run build`
6. Commit with conventional commits
7. Create Pull Request

### Code Style

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## 📞 Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)

### Related Documentation

- [Server Documentation](../../server/docs/README.md)
- [API Reference](../../server/docs/API-REFERENCE.md)
- [Deployment Guide](../../server/docs/DEPLOYMENT-DOCKER-VPS.md)

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

---

**Happy Coding! 🚀**

For questions or support, please open an issue or contact the team.
