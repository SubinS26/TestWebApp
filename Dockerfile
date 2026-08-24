# ==============================================================================
# Multi-Stage Production Dockerfile for TestWebApp on Azure
# ==============================================================================

# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Runtime Stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/config ./config
COPY --from=builder /app/app-routes.js ./app-routes.js
COPY --from=builder /app/app.js ./app.js

EXPOSE 8080

CMD ["node", "app.js"]
