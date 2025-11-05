# 🚀 Tempra Server

> AI-powered Calendar & Scheduling Backend API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

## 📖 Description

Tempra Backend là một REST API server được xây dựng với NestJS, cung cấp:
- 🔐 **Authentication**: JWT + OAuth 2.0 (Google)
- 📅 **Calendar Management**: Event CRUD + Google Calendar sync
- 🗓️ **Booking System**: Customizable scheduling links
- 🤖 **AI Integration**: Gemini-powered chatbot
- 📧 **Email Service**: Multi-provider support
- 🔄 **Background Jobs**: BullMQ queue system

## 📚 Documentation

Comprehensive documentation available:

- **[Main Documentation](./docs/README.md)** - Overview và navigation
- **[Authentication Flows](./docs/01-AUTHENTICATION-FLOWS.md)** - Auth với flow diagrams
- **[Google Calendar Integration](./docs/02-GOOGLE-CALENDAR-INTEGRATION.md)** - Google sync
- **[Event Management](./docs/03-EVENT-MANAGEMENT.md)** - Event CRUD & recurring
- **[Booking System](./docs/04-BOOKING-SYSTEM.md)** - Scheduling links
- **[Database Schema](./docs/DATABASE-SCHEMA.md)** - Complete DB structure
- **[API Reference](./docs/API-REFERENCE.md)** - All endpoints

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 14+
- **Cache/Queue**: Redis 6+ & BullMQ
- **APIs**: Google Calendar, Gemini AI
- **Email**: SMTP, SendGrid, AWS SES
- **Validation**: class-validator
- **ORM**: Raw SQL with pg driver

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.x
PostgreSQL >= 14
Redis >= 6
```

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

### Database Setup

```bash
# Create database
createdb tempra_dev

# Run migrations
npm run migration:run
```

### Environment Variables

```env
# Server
NODE_ENV=development
PORT=8000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=tempra_dev
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# AI (Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Email (Optional)
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 🔧 Development

```bash
# Development mode (watch)
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

Server runs on: `http://localhost:8000`

API Documentation (Swagger): `http://localhost:8000/api-docs`

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📦 Building

```bash
# Build for production
npm run build

# Start production build
npm run start:prod
```

## 🐳 Docker

```bash
# Build image
docker build -t tempra-server .

# Run container
docker run -d -p 8000:8000 --env-file .env tempra-server

# Or use docker-compose
docker-compose up -d
```

## 🗄️ Database

### Migrations

```bash
# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate new migration
npm run migration:generate -- -n MigrationName

# Create empty migration
npm run migration:create -- -n MigrationName
```

### Schema

See [Database Schema Documentation](./docs/DATABASE-SCHEMA.md) for complete schema.

## 📡 API

### Base URL

```
http://localhost:8000/api
```

### Authentication

```bash
# Header-based
Authorization: Bearer {access_token}

# Cookie-based
Cookie: access_token={token}
```

### Example Requests

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test123!","username":"user"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test123!"}'

# Get events
curl -X GET http://localhost:8000/api/events \
  -H "Authorization: Bearer {token}"
```

## 📊 Key Features

### Authentication & Authorization
- JWT-based authentication
- Google OAuth 2.0 integration
- Role-based access control (RBAC)
- Password reset flow
- HTTP-only cookies

### Calendar & Events
- Full CRUD operations
- Recurring events (RRULE)
- Google Calendar sync (bidirectional)
- Event invitations & RSVP
- Multiple calendars per user

### Booking System
- Customizable booking links
- Availability calculation
- Multi-timezone support
- Buffer time between meetings
- Automatic confirmations

### AI Integration
- Natural language processing
- Smart scheduling
- Event creation via chat
- Context-aware responses

### Background Jobs
- BullMQ queue system
- Event synchronization
- Email sending
- Webhook processing

## 🏗️ Architecture

```
server/src/
├── common/              # Shared utilities
├── config/              # Configuration
├── database/            # Database setup
└── modules/             # Feature modules
    ├── auth/           # Authentication
    ├── users/          # User management
    ├── event/          # Events & calendar
    ├── booking/        # Booking system
    ├── google/         # Google integration
    ├── email/          # Email service
    └── ai/             # AI chatbot
```

## 🔍 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m "feat: add new feature"`
4. Push to branch: `git push origin feature/new-feature`
5. Create Pull Request

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Verify credentials
psql -U postgres -d tempra_dev
```

### Redis Connection Failed

```bash
# Check Redis is running
redis-cli ping

# Start Redis
redis-server
```

### Port Already in Use

```bash
# Change PORT in .env
PORT=8001
```

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 🤝 Support

- Documentation: [./docs/README.md](./docs/README.md)
- API Reference: [./docs/API-REFERENCE.md](./docs/API-REFERENCE.md)
- Issues: [GitHub Issues](https://github.com/your-org/tempra/issues)

---

**Built with NestJS** - A progressive Node.js framework

For more information, visit [NestJS Documentation](https://docs.nestjs.com/)
