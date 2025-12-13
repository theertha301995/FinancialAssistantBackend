# ======================
# Builder stage
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better caching)
COPY package.json package-lock.json ./

# Install ALL dependencies (needed for TS build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript → dist/
RUN npm run build


# ======================
# Production stage
# ======================
FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Copy only what is needed
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Switch user
USER nodejs

# Expose app port
EXPOSE 5000

# Start the app
CMD ["node", "dist/server.js"]
