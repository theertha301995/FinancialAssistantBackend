# ======================
# Builder stage
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install ALL deps for build
RUN npm ci

# Copy source
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

# Copy only runtime files
COPY package.json package-lock.json ./

# Install ONLY production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy compiled output only
COPY --from=builder /app/dist ./dist

# Use non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "dist/server.js"]
