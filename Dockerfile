# Stage 1 - Builder
FROM node:18 AS builder
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Compile TypeScript server
RUN npm run build:server

# Stage 2 - Runtime image
FROM node:18-slim
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

# Use Railway's provided port
ENV PORT=8080

# Start compiled server
CMD ["node", "dist/server/index.js"]