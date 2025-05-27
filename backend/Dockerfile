# Use a Node.js LTS (Long Term Support) image as the base
FROM node:lts-alpine as development

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock (or package-lock.json) to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the NestJS application
RUN yarn build

# Use a smaller, production-ready image for the final stage
FROM node:lts-alpine as production

WORKDIR /usr/src/app

# Copy production dependencies from development stage
COPY --from=development /usr/src/app/node_modules ./node_modules

# Copy the built application from the development stage
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/package.json ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
