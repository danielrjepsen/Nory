# ============================================================================
# Multi-stage Dockerfile for Next.js Frontend
# ============================================================================

# ----------------------------------------------------------------------------
# Dependencies stage
# ----------------------------------------------------------------------------
FROM node:18-alpine AS deps
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ----------------------------------------------------------------------------
# Builder stage
# ----------------------------------------------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ----------------------------------------------------------------------------
# Development stage (with hot reload)
# ----------------------------------------------------------------------------
FROM node:18-alpine AS development
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code (will be overridden by volume mount)
COPY . .

# Environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3002
ENV HOSTNAME=0.0.0.0

# Expose port
EXPOSE 3002

# Start development server with hot reload
CMD ["yarn", "dev"]

# ----------------------------------------------------------------------------
# Production runtime stage
# ----------------------------------------------------------------------------
FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Note: public folder is optional in Next.js
# It will be included in standalone if needed

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3002
ENV HOSTNAME=0.0.0.0

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3002

# Start the application
CMD ["node", "server.js"]
