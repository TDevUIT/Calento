# Calento.space

A smart Calendar Assistant built with Node.js, PostgreSQL, and Redis. Manage your schedules, sync with Google Calendar, and automate your time management effortlessly.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js (v16 or higher)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd calento.space
```

2. Copy environment variables:
```bash
cp .env.example server/.env
```

3. Update the environment variables in `server/.env` with your configuration.

4. Start the services using Docker Compose:
```bash
cd provision
docker-compose up -d
```

5. Install dependencies and start the development server:
```bash
# Install server dependencies
cd server
npm install
npm run dev

# Install client dependencies (in another terminal)
cd client
npm install
npm start
```

## 📁 Project Structure

```
calento.space/
├── client/          # Frontend application
├── server/          # Backend API
├── provision/       # Docker configuration
├── data/           # Database data (gitignored)
│   └── redis/      # Redis data
├── docs/           # Documentation
└── README.md
```

## 🛠️ Development

### Environment Variables

Copy `.env.example` to `server/.env` and configure:

- `DB_USER` - PostgreSQL username
- `DB_PASSWORD` - PostgreSQL password
- `DB_NAME` - Database name
- `REDIS_PASSWORD` - Redis password
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `REDIS_DB` - Redis database number

### Available Scripts

```bash
# Start all services
make up

# Stop all services
make down

# View logs
make logs

# Reset database
make reset-db

# Install dependencies
make install
```

### Database

The application uses PostgreSQL as the primary database and Redis for caching and sessions.

- PostgreSQL runs on port `5432`
- Redis runs on port `6379`
- Data is persisted in the `data/` directory

## 🐳 Docker Services

- **postgres**: PostgreSQL 15 Alpine
- **redis**: Redis Alpine

## 📝 API Documentation

API documentation is available at `/docs` when the server is running.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy using Docker:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please open an issue or contact the development team.
