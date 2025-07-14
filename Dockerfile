# Stage 1 — Builder
FROM node:18 AS builder

WORKDIR /app

COPY . .

# Install all deps for both client and server
RUN npm install

# Build Vite frontend
RUN npm run build

# Compile TypeScript backend (server)
RUN npx tsc -p tsconfig.server.json

# Stage 2 — Runtime image
FROM node:18-slim

WORKDIR /app

# Only bring in necessary files
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Use Railway's provided port
ENV PORT=8080

# Start compiled server
CMD ["node", "dist/server/index.js"]