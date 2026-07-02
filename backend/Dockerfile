# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma client and build project if applicable
RUN npx prisma generate || true
RUN npm run build || true

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nodejs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
# Assuming compiled code might be in dist/ or src/
COPY --from=builder /app/ ./

USER nodejs

EXPOSE 3000
CMD ["npm", "start"]
