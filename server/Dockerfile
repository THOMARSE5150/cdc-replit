# Stage 1: Builder
# This stage builds both the client and server.
FROM node:18 AS builder
WORKDIR /app

# Copy package files and install ALL dependencies (including dev)
# This is done first to leverage Docker's layer caching.
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# Build the Vite frontend (React)
# This creates the 'client/dist' folder.
RUN npm run build

# Compile the TypeScript server
# This is the command that was failing. We now run it directly with the correct path.
RUN npx tsc -p server/tsconfig.json

# Stage 2: Runtime
# This is the final, lightweight image that will be deployed.
FROM node:18-slim
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

# Use the port provided by Railway
ENV PORT=8080

# The command to start your server
CMD ["node", "dist/server/index.js"]