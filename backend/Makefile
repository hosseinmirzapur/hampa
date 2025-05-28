.PHONY: help install build format start start-dev start-debug start-prod lint test test-watch test-cov test-debug test-e2e

help:
	@echo "Available commands:"
	@echo "  make install      - Install backend dependencies"
	@echo "  make build        - Build the backend application"
	@echo "  make format       - Format backend code"
	@echo "  make start        - Start the backend application"
	@echo "  make start-dev    - Start the backend in development mode (with watch)"
	@echo "  make start-debug  - Start the backend in debug mode (with watch)"
	@echo "  make start-prod   - Start the backend in production mode"
	@echo "  make lint         - Lint backend code and fix issues"
	@echo "  make test         - Run backend unit tests"
	@echo "  make test-watch   - Run backend unit tests in watch mode"
	@echo "  make test-cov     - Run backend unit tests with coverage"
	@echo "  make test-debug   - Run backend unit tests in debug mode"
	@echo "  make test-e2e     - Run backend E2E tests"

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
	@echo "Starting backend in production mode..."
	bun run start:prod

lint:
	@echo "Linting backend code..."
	bun run lint

test:
	@echo "Running backend tests..."
	bun run test

test-watch:
	@echo "Running backend tests in watch mode..."
	bun run test:watch

test-cov:
	@echo "Running backend tests with coverage..."
	bun run test:cov

test-debug:
	@echo "Running backend tests in debug mode..."
	bun run test:debug

test-e2e:
	@echo "Running backend E2E tests..."
	bun run test:e2e
