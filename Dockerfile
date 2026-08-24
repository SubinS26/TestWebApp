# ========================================================
# Stage 1: Build Frontend Assets
# ========================================================
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install dependencies for compilation
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code and build client bundle
COPY . .
RUN npm run build

# ========================================================
# Stage 2: Production Container Runtime
# ========================================================
FROM node:20-alpine AS runner

# Install FFmpeg for video processing pipeline & curl for healthcheck
RUN apk add --no-cache ffmpeg curl bash libc6-compat

WORKDIR /app

# Set Production Environment
ENV NODE_ENV=production \
    PORT=4300 \
    HOST=0.0.0.0

# Copy package manifests and install production-only dependencies
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Copy pre-built application assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views
COPY --from=builder /app/config ./config
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/app.js ./app.js
COPY --from=builder /app/app-routes.js ./app-routes.js

# Create writable media directories with appropriate ownership
RUN mkdir -p /app/dist/posts /app/dist/comments /app/dist/users /app/dist/temp && \
    addgroup -g 1001 -S nodeapp && \
    adduser -u 1001 -S nodeapp -G nodeapp && \
    chown -R nodeapp:nodeapp /app

# Switch to non-root user for security best practices
USER nodeapp

# Expose internal API & Streaming port
EXPOSE 4300

# Container Healthcheck Probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:4300/health || exit 1

# Start the PaaS/Cloud-Native Node.js Server
CMD ["node", "app.js"]
