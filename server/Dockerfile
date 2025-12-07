FROM node:22-slim AS builder

WORKDIR /usr/src/app

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy TypeScript configuration files
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copy source code
COPY . . 

# Verify source files are copied
RUN echo "=== Checking source files ===" && \
    ls -la src/ && \
    test -d src || (echo "ERROR: src directory not found!" && exit 1)

# Build the application with error checking
RUN echo "=== Building application ===" && \
    npm run build && \
    echo "=== Build completed, checking output ===" && \
    ls -la dist/ && \
    echo "=== Checking for main.js ===" && \
    test -f dist/main.js || (echo "ERROR: dist/main.js not found! Build output:" && ls -la dist/ && exit 1) && \
    echo "=== Build successful! main.js found at dist/main.js ==="

# Production stage
FROM node:22-slim AS runner

WORKDIR /usr/src/app

# Install system dependencies for runtime
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -g 1001 -r nodejs && \
    useradd -r -g nodejs -u 1001 nodejs

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Install CSS inline for email templates and required dependencies
RUN npm install @css-inline/css-inline-linux-x64-gnu@latest ioredis@latest --no-save

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/dist ./dist

# Copy standalone migration script (not built by TypeScript)
COPY --chown=nodejs:nodejs src/cli/migrate-standalone.js ./dist/cli/

# Copy SQL migrations (needed for runtime)
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/migrations ./migrations

# Copy email templates (needed for runtime)
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/src/modules/email/templates ./src/modules/email/templates

# Copy entrypoint script
COPY --chown=nodejs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Start the application with entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD []