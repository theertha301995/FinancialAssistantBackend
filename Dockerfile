# ======================
# Builder stage
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ======================
# Production stage
# ======================
FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Copy package files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built code
COPY --from=builder /app/dist ./dist

# Switch user
USER nodejs

EXPOSE 5000

CMD ["node", "dist/server.js"]