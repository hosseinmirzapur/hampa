.PHONY: help install dev gql-codegen gql-watch build preview

help:
	@echo "Available commands:"
	@echo "  make install      - Install frontend dependencies"
	@echo "  make dev          - Start the development server"
	@echo "  make gql-codegen  - Generate GraphQL types"
	@echo "  make gql-watch    - Watch for GraphQL schema changes and generate types"
	@echo "  make build        - Build the frontend for production"
	@echo "  make preview      - Preview the production build"

install:
	@echo "Installing frontend dependencies..."
	bun install

dev:
	@echo "Starting frontend development server..."
	npm run dev

gql-codegen:
	@echo "Generating GraphQL types..."
	npm run gql:codegen

gql-watch:
	@echo "Watching for GraphQL schema changes and generating types..."
	npm run gql:watch

build:
	@echo "Building frontend for production..."
	npm run build

preview:
	@echo "Previewing production build..."
	npm run preview
