# =========================
# Builder stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files
COPY package*.json ./

# Install dependencies (clean)
RUN npm ci && npm cache clean --force

# Copy source code (node_modules excluded via .dockerignore)
COPY . .

# Build (uncomment if needed)
# RUN npm run build


# =========================
# Production stage
# =========================
FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy ONLY what is needed
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./server.js
# OR if built output exists:
# COPY --from=builder /app/dist ./dist

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]
