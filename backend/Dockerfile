# Install dependencies
FROM node:21-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build (if needed)
FROM node:21-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# If you have a build step (e.g., TypeScript), add: RUN npm run build


# Production image
FROM node:21-alpine AS runner
WORKDIR /app

# Use a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
# Copy application files
COPY --from=builder /app ./
# Expose the port and set environment variables
EXPOSE 8000
ENV NODE_ENV=production 

CMD ["npm", "start"]