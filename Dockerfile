# Base image
FROM node:18-alpine AS base
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# ==============================
# Development Stage
# ==============================
FROM base AS development
ENV NODE_ENV development

# Copy all source files
COPY . .

# Expose port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]

# ==============================
# Production Build Stage
# ==============================
FROM base AS builder
ENV NODE_ENV production

COPY . .
RUN npm run build

# ==============================
# Production Runtime Stage
# ==============================
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy built files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]
