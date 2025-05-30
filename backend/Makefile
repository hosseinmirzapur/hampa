.PHONY: help install build format start start-dev start-debug start-prod lin deploy halt pm2-reload pm2-logs pm2-status pm2-delete

help:
	@echo "Available commands:"
	@echo "  make install      - Install backend dependencies"
	@echo "  make build        - Build the backend application"
	@echo "  make format       - Format backend code"
	@echo "  make start        - Start the backend application (direct, not with PM2)"
	@echo "  make start-dev    - Start the backend in development mode (with watch, not with PM2)"
	@echo "  make start-debug  - Start the backend in debug mode (with watch, not with PM2)"
	@echo "  make start-prod   - Start the backend in production mode (direct, not with PM2, but PM2 might use this script)"
	@echo "  make lint         - Lint backend code and fix issues"
	@echo ""
	@echo "PM2 Management Commands (for production deployment):"
	@echo "  make deploy       - Build and deploy/start the application with PM2 in production mode"
	@echo "  make halt         - Stop the application running under PM2"
	@echo "  make pm2-reload   - Build and gracefully reload the application with PM2"
	@echo "  make pm2-logs     - Show PM2 logs for the application"
	@echo "  make pm2-status   - Show current PM2 status"
	@echo "  make pm2-delete   - Remove the application from PM2 management"

install:
	@echo "Installing backend dependencies..."
	bun install

build:
	@echo "Building backend..."
	bun run build

format:
	@echo "Formatting backend code..."
	bun run format

start:
	@echo "Starting backend..."
	bun run start

start-dev:
	@echo "Starting backend in development mode..."
	bun run start:dev

start-debug:
	@echo "Starting backend in debug mode..."
	bun run start:debug

start-prod:
	@echo "Starting backend in production mode (this is what PM2 ecosystem will call)..."
	bun run start:prod # Ensure this script listens to PORT from env if set by PM2

lint:
	@echo "Linting backend code..."
	bun run lint

ECOSYSTEM_FILE := ecosystem.config.js
APP_NAME := hampa-backend

# --- PM2 Management Commands ---

deploy: build # Always build before deploying
	@echo "Deploying $(APP_NAME) with PM2 using $(ECOSYSTEM_FILE) in production mode..."
	pm2 startOrRestart $(ECOSYSTEM_FILE) --env production

halt:
	@echo "Halting $(APP_NAME) with PM2..."
	pm2 stop $(APP_NAME)

pm2-reload: build # Always build before reloading
	@echo "Gracefully reloading $(APP_NAME) with PM2 in production mode..."
	pm2 reload $(APP_NAME) --env production # Reload uses app name and respects --env

pm2-logs:
	@echo "Showing PM2 logs for $(APP_NAME)..."
	pm2 logs $(APP_NAME) --lines 100

pm2-status:
	@echo "Showing PM2 status..."
	pm2 list

pm2-delete:
	@echo "Deleting $(APP_NAME) from PM2 management..."
	pm2 delete $(APP_NAME)