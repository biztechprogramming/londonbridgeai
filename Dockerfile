# Stage 1: Building the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY london-bridge/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY london-bridge/ .

# Build the application
RUN npm run build

# Stage 2: Running the application
FROM node:20-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable for the port
ENV PORT 3000

# Start the application
CMD ["node", "server.js"]
