.PHONY: help up down logs restart clean install build test lint format

# Default target
help:
	@echo "Available commands:"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make logs        - View logs"
	@echo "  make restart     - Restart all services"
	@echo "  make clean       - Clean up containers and volumes"
	@echo "  make install     - Install dependencies"
	@echo "  make build       - Build the application"
	@echo "  make test        - Run tests"
	@echo "  make lint        - Run linting"
	@echo "  make format      - Format code"
	@echo "  make reset-db    - Reset database"
	@echo "  make backup-db   - Backup database"

# Docker commands
docker-build:
	cd provision && docker-compose up --build

up:
	cd provision && docker-compose up -d

down:
	cd provision && docker-compose down

logs:
	cd provision && docker-compose logs -f

restart:
	cd provision && docker-compose restart

clean:
	cd provision && docker-compose down -v --remove-orphans
	docker system prune -f

# Development commands
install:
	cd server && npm install
	cd client && npm install

build:
	cd server && npm run build
	cd client && npm run build

test:
	cd server && npm test
	cd client && npm test

lint:
	cd server && npm run lint
	cd client && npm run lint

format:
	cd server && npm run format
	cd client && npm run format

# Database commands
reset-db:
	cd provision && docker-compose down postgres
	docker volume rm provision_postgres_data || true
	cd provision && docker-compose up -d postgres

backup-db:
	cd provision && docker-compose exec postgres pg_dump -U $(DB_USER) $(DB_NAME) > ../backups/backup_$(shell date +%Y%m%d_%H%M%S).sql

# Development server
dev-server:
	cd server && npm run dev

dev-client:
	cd client && npm start

dev: up dev-server

# Production commands
prod-build:
	cd server && npm run build
	cd client && npm run build

prod-up:
	cd provision && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Utility commands
check-env:
	@if [ ! -f server/.env ]; then echo "❌ server/.env file not found. Copy from .env.example"; exit 1; fi
	@echo "✅ Environment file exists"

setup: check-env install up
	@echo "🚀 Setup complete! Run 'make dev' to start development"
