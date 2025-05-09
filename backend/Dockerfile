# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package.json bun.lockb ./

# ---- Dependencies ----
FROM base AS dependencies
RUN bun install --frozen-lockfile

# ---- Build ----
FROM dependencies AS build
COPY . .
RUN bun run build

# ---- Production ----
FROM base AS production
ENV NODE_ENV production
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY package.json .
# COPY .env . # Optionally copy .env if not using external config

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["bun", "run", "start:prod"]