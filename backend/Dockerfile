# Use a Node.js LTS (Long Term Support) image as the base
# Use a Bun LTS image as the base for development
FROM oven/bun:1.1.18-alpine as development

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and bun.lock to leverage Docker cache
COPY package.json bun.lock ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the NestJS application using Bun
RUN bun run build

# Use a smaller, production-ready image for the final stage
FROM oven/bun:1.1.18-alpine as production

# Set the working directory in the container
WORKDIR /usr/src/app

# Create a non-root user and switch to it for security
# Bun images typically run as root by default, so creating a dedicated user is good practice.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy production dependencies from development stage
# Use --chown to ensure files are owned by the non-root user
COPY --from=development --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules

# Copy the built application from the development stage
COPY --from=development --chown=nodejs:nodejs /usr/src/app/dist ./dist
COPY --from=development --chown=nodejs:nodejs /usr/src/app/package.json ./

# Switch to the non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["bun", "run", "start:prod"]
