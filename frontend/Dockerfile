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

# Production image
FROM node:21-alpine AS runner
WORKDIR /app

# Security: create non-root user
RUN addgroup -g 1001 -S nextjs && adduser -S nextjs -u 1001

# Copy built application files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000
ENV NODE_ENV=production

# Inline script: replace NEXT_PUBLIC_* placeholders in built JS before starting Next.js
CMD sh -c '\
  for var in $(env | grep ^NEXT_PUBLIC_); do \
    key=$(echo "$var" | cut -d= -f1); \
    val=$(echo "$var" | cut -d= -f2-); \
    echo "Injecting $key=$val"; \
    find /app/.next -type f -name "*.js" -exec sed -i "s|${key}_PLACEHOLDER|$val|g" {} +; \
  done && \
  npm start'
