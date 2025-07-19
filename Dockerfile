# Stage 1: Builder
FROM node:18 AS builder
WORKDIR /app

# Install root dependencies (if any)
COPY package*.json ./
RUN npm install

# Build frontend
COPY client ./client
RUN cd client && npm install && npm run build

# Build backend
COPY server ./server
RUN cd server && npm install && npm run build

# Stage 2: Runtime image
FROM node:18-slim
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/dist ./server/dist

# Copy built frontend into correct location for static serving
COPY --from=builder /app/client/dist ./server/dist/client/dist

# Set environment variables
ENV PORT=8080

EXPOSE 8080

# Start server
CMD ["node", "server/dist/index.js"]