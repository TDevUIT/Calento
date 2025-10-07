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

# Copy source code
COPY . . 

# Build the application
RUN npm run build

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

# Install CSS inline for email templates
RUN npm install @css-inline/css-inline-linux-x64-gnu@latest --no-save

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/dist ./dist

# Copy SQL migrations (needed for runtime)
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/migrations ./migrations

# Copy email templates (needed for runtime)
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/src/modules/email/templates ./src/modules/email/templates

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]