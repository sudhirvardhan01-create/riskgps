# Install dependencies only when needed
FROM node:21-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci


# Build the app
FROM node:21-alpine AS builder
WORKDIR /app  
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build


# Production image, copy built assets and run Next.js
FROM node:21-alpine AS runner
WORKDIR /app

# Use a non-root user for security
RUN addgroup -g 1001 -S nextjs && adduser -S nextjs -u 1001
USER nextjs
# Copy built application files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Expose the port and set environment variables
EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start"]