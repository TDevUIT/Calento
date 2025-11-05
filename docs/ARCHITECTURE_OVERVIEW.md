# Tempra Architecture Documentation

## 📚 Tổng Quan Tài Liệu

Repository này chứa tài liệu kỹ thuật chi tiết về kiến trúc hệ thống Tempra - AI Calendar Assistant.

## 🏗️ Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│  - TanStack Query v5 (Server State)                         │
│  - Zustand (Client State)                                   │
│  - React Components                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ WebSocket (planned)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (NestJS)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              AI Module (Gemini)                     │   │
│  │  - Conversation Management                          │   │
│  │  - Function Calling                                 │   │
│  │  - Context Building                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Business Modules                          │   │
│  │  - Event Management                                  │   │
│  │  - Task Management                                   │   │
│  │  - Calendar Sync                                     │   │
│  │  - Team Collaboration                                │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Infrastructure                               │   │
│  │  - Authentication (JWT + Cookies)                    │   │
│  │  - Database (PostgreSQL)                             │   │
│  │  - Queue System (BullMQ + Redis)                     │   │
│  │  - Email Service                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
│  - Google Gemini AI                                         │
│  - Google Calendar API                                      │
│  - Email Providers (SMTP, SendGrid, etc.)                   │
└─────────────────────────────────────────────────────────────┘
```

## 📖 Tài Liệu Chi Tiết

### Backend Documentation

#### 1. [AI Flow Architecture](../server/docs/AI_FLOW_ARCHITECTURE.md)
Tài liệu chi tiết về luồng xử lý AI trong hệ thống:

**Nội dung:**
- Kiến trúc AI Module (Controller → Service → Repository)
- Luồng xử lý conversation với Gemini AI
- Function Calling mechanism
- Context building và management
- Action tracking và persistence
- 8 available functions (createEvent, checkAvailability, createTask, etc.)
- Database schema cho AI conversations và actions
- Error handling và logging
- Best practices

**Use Cases:**
- Hiểu cách AI xử lý user requests
- Tích hợp functions mới vào AI system
- Debug AI conversation issues
- Optimize AI performance

**Key Files:**
```
server/src/modules/ai/
├── ai.controller.ts           # API endpoints
├── services/
│   ├── gemini.service.ts     # Gemini integration
│   ├── ai-conversation.service.ts
│   └── ai-function-calling.service.ts
├── prompts/
│   ├── system-prompts.ts     # AI system prompts
│   └── function-prompts.ts   # Function definitions
```

---

### Frontend Documentation

#### 2. [Client State Management - Part 1](../client/docs/CLIENT_STATE_MANAGEMENT.md)
Tài liệu về TanStack Query và data fetching:

**Nội dung:**
- Setup QueryClient với optimal configuration
- Query Keys pattern (hierarchical structure)
- Query Hooks (useEvents, useEventsByDateRange)
- Mutation Hooks (useCreateEvent, useUpdateEvent, useDeleteEvent)
- Cache invalidation strategies
- Loading và error states

**Use Cases:**
- Implement data fetching cho features mới
- Optimize query performance
- Handle real-time updates
- Debug cache issues

**Key Patterns:**
```typescript
// Query Keys Factory
EVENT_QUERY_KEYS = {
  all: ['events'],
  list: (params) => [...QUERY_KEYS.all, 'list', params],
  detail: (id) => [...QUERY_KEYS.all, 'detail', id],
}

// Mutation with Cache Invalidation
useMutation({
  mutationFn: createEvent,
  onSuccess: () => {
    queryClient.invalidateQueries({ 
      queryKey: EVENT_QUERY_KEYS.all 
    });
  }
})
```

#### 3. [Client State Management - Part 2](../client/docs/CLIENT_STATE_MANAGEMENT_PART2.md)
Tài liệu về Service Layer và Zustand:

**Nội dung:**
- Axios configuration với interceptors
- Service layer pattern (event.service, ai.service)
- Zustand stores (auth, calendar settings)
- Persist middleware với localStorage
- Immer middleware cho immutable updates
- Complete component integration examples

**Use Cases:**
- Setup API services cho modules mới
- Implement client state management
- Handle authentication state
- Persist user preferences

**Key Patterns:**
```typescript
// Zustand Store with Persist
const useAuthStore = create()(
  persist(
    immer((set) => ({
      user: null,
      login: async (creds) => {
        const user = await login(creds);
        set((state) => { state.user = user; });
      }
    })),
    { name: 'auth-storage' }
  )
);
```

---

## 🔄 Data Flow Examples

### 1. AI Chat Flow

```
User: "Create meeting tomorrow 2pm"
    ↓
Frontend (useAIChat mutation)
    ↓
POST /api/ai/chat
    ↓
AIController.chat()
    ↓
AIConversationService.chat()
    ├─→ Load/Create conversation
    ├─→ Build calendar context
    └─→ GeminiService.chat()
        ├─→ Send to Gemini API
        └─→ Receive function calls
    ↓
AIFunctionCallingService.executeFunctionCall()
    └─→ handleCreateEvent()
        └─→ EventService.createEvent()
            └─→ Database INSERT
    ↓
Return response with actions
    ↓
Frontend invalidates queries
    ↓
UI updates automatically
```

### 2. Event CRUD Flow

```
User: Click "Create Event"
    ↓
Component calls useCreateEvent()
    ↓
useMutation.mutate(eventData)
    ↓
eventService.createEvent()
    ↓
axios.post('/api/events', data)
    ↓
Backend EventController
    ↓
EventService.createEvent()
    ↓
EventRepository.create()
    ↓
Database INSERT
    ↓
Response with new event
    ↓
onSuccess callback:
    ├─→ setQueryData (update cache)
    ├─→ removeQueries (clear stale)
    └─→ invalidateQueries (refetch)
    ↓
UI re-renders with new data
```

## 🎯 Quick Reference

### Backend Technologies
- **Framework:** NestJS 10.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL 15
- **ORM:** TypeORM / Knex
- **Queue:** BullMQ + Redis
- **AI:** Google Gemini 1.5 Flash
- **Auth:** JWT + HTTP-only Cookies

### Frontend Technologies
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5.x
- **State Management:** 
  - TanStack Query v5 (Server State)
  - Zustand (Client State)
- **UI:** React 18 + Tailwind CSS
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

### Key Design Patterns

#### Backend
- **Repository Pattern:** Data access abstraction
- **Service Layer:** Business logic separation
- **DTO Pattern:** Request/Response validation
- **Function Calling:** AI integration pattern
- **Queue Pattern:** Background job processing

#### Frontend
- **Query Keys Factory:** Centralized cache management
- **Custom Hooks:** Reusable data fetching logic
- **Service Layer:** API call abstraction
- **Store Pattern:** Global state management
- **Component Composition:** Reusable UI components

## 📊 Module Dependencies

### AI Module Dependencies
```
AIModule
  ├── GeminiService (Google AI SDK)
  ├── EventModule (Create/Search events)
  ├── TaskModule (Create tasks)
  ├── CalendarModule (Check availability)
  └── CommonModule (Database, Logging)
```

### Frontend Hook Dependencies
```
useEvents (Query)
  └── eventService
      └── axios instance
          └── interceptors (auth)

useCreateEvent (Mutation)
  ├── eventService.createEvent
  └── queryClient (cache invalidation)
```

## 🔐 Security Considerations

### Backend
- JWT token validation on all protected routes
- HTTP-only cookies for token storage
- CORS configuration for frontend domain
- Rate limiting on AI endpoints
- Input validation with class-validator
- SQL injection prevention via parameterized queries

### Frontend
- Secure token storage (HTTP-only cookies)
- CSRF protection
- XSS prevention (React auto-escaping)
- API error handling
- Sensitive data exclusion from cache

## 📈 Performance Optimization

### Backend
- Database query optimization (indexes, joins)
- Redis caching for frequently accessed data
- Background job processing (BullMQ)
- Connection pooling (PostgreSQL)
- Response compression

### Frontend
- Query caching (TanStack Query)
- Code splitting (Next.js dynamic imports)
- Image optimization (Next.js Image)
- Debouncing search inputs
- Virtual scrolling for large lists
- Optimistic updates for mutations

## 🧪 Testing Strategy

### Backend
- Unit tests: Services and repositories
- Integration tests: API endpoints
- E2E tests: Critical user flows
- AI function calling tests

### Frontend
- Unit tests: Utility functions
- Component tests: React Testing Library
- Hook tests: Custom hooks
- E2E tests: Playwright

## 🚀 Deployment

### Backend
- **Environment:** Node.js 20+
- **Process Manager:** PM2
- **Database:** PostgreSQL (managed service)
- **Redis:** Redis Cloud / ElastiCache
- **Platform:** Railway / Render / AWS

### Frontend
- **Platform:** Vercel (recommended)
- **Build:** Next.js SSR/SSG
- **CDN:** Vercel Edge Network
- **Analytics:** Vercel Analytics

## 📝 Additional Documentation

- [Backend API Documentation](../server/README.md)
- [Frontend Development Guide](../client/README.md)
- [Database Schema](../server/docs/DATABASE_SCHEMA.md)
- [API Routes](../server/docs/API_ROUTES.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contributing

Khi contribute vào project:

1. **Backend:**
   - Follow NestJS conventions
   - Write tests for new features
   - Update API documentation
   - Follow repository pattern

2. **Frontend:**
   - Use custom hooks cho data fetching
   - Follow query keys pattern
   - Update component documentation
   - Ensure accessibility

3. **Documentation:**
   - Update relevant docs khi thay đổi architecture
   - Include code examples
   - Add diagrams khi cần thiết
   - Keep docs in sync với code

## 🔗 External Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Google Gemini AI](https://ai.google.dev/docs)
- [Zustand](https://docs.pmnd.rs/zustand)

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintainers:** Tempra Development Team
