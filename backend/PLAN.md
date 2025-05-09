# Hampa Backend Implementation Plan

## 1. Overall Goal

Implement the backend for the Hampa application using NestJS (with TypeScript), PostgreSQL for the database, Prisma as the ORM, JWT for the authentication system, a custom OTP configuration (backend-generated OTPs, SMS gateway integration TBD), Docker for containerization, Redis for caching, GitHub Actions for CI/CD, and Sentry for logging and monitoring.

The backend will be located in a `backend/` directory at the root of the project.

## 2. Key Phases & Steps

### Phase 1: Foundation & Authentication

1.  **Project Setup:**
    *   Create the `backend/` directory.
    *   Initialize a new NestJS project within `backend/`.
    *   Install necessary dependencies: `@nestjs/config`, `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`, `class-validator`, `class-transformer`, `prisma`, `@prisma/client`, `@nestjs/swagger`, `swagger-ui-express`.
2.  **Database & ORM Setup:**
    *   Initialize Prisma and configure it for PostgreSQL.
    *   Define the initial `User` schema in `prisma/schema.prisma` (id, phone, password, name, createdAt, updatedAt).
    *   Generate Prisma client.
    *   Create a `PrismaService` to be used across modules.
3.  **OTP & Registration:**
    *   Create an `AuthModule`.
    *   Implement OTP generation logic (e.g., 6-digit numeric code).
    *   Store OTPs temporarily (initially in-memory or simple DB table, later Redis) with an expiry.
    *   Create an endpoint to request OTP for a phone number.
        *   This endpoint will eventually integrate with an SMS gateway (details to be provided by the user). For now, it can log the OTP to the console or return it in the response for testing.
    *   Create an endpoint to verify OTP and register a new user.
        *   Hash user passwords using `bcrypt` before saving.
4.  **JWT Authentication:**
    *   Configure JWT module (`JwtModule`) with a secret and expiration time.
    *   Implement `JwtStrategy` for validating JWTs.
    *   Create an endpoint for login:
        *   Request OTP for a phone number.
        *   Verify OTP.
        *   If valid, generate and return a JWT.
    *   Protect a sample route using `@UseGuards(AuthGuard('jwt'))` to test JWT authentication.

### Phase 2: Core Features & Services

1.  **User Profile Module (`UsersModule`):**
    *   Define `UserProfile` related fields in the `User` model or a separate `Profile` model in Prisma.
    *   Implement CRUD operations for user profiles (e.g., get profile, update profile).
    *   Ensure endpoints are protected and operate on the authenticated user's profile.
2.  **Runner Cards Module (`RunnerCardsModule`):**
    *   Define `RunnerCard` schema in Prisma (id, userId, title, description, stats, etc., linked to `User`).
    *   Implement CRUD operations for runner cards.
    *   Endpoints should be protected, and users should only be able to manage their own cards.
    *   Implement listing/browsing functionality (e.g., get all cards, get user's cards).
3.  **Joint Runs Module (`JointRunsModule`):**
    *   Define `JointRun` schema in Prisma (id, title, description, dateTime, location, createdById (User), etc.).
    *   Define `JointRunParticipant` schema (linking `User` and `JointRun`, status - e.g., 'interested', 'going').
    *   Implement CRUD for joint runs (organizers can create/update/delete).
    *   Implement functionality for users to express interest or join runs.
    *   Implement listing/browsing of joint runs.
4.  **Redis Integration for Caching & OTP:**
    *   Install Redis and `cache-manager`, `cache-manager-redis-store`.
    *   Configure NestJS caching module to use Redis.
    *   Apply caching to frequently accessed GET endpoints (e.g., list of joint runs, card details if public).
    *   Migrate OTP storage from in-memory/DB to Redis with appropriate TTL.

### Phase 3: Advanced Features & DevOps

1.  **Notifications Module (`NotificationsModule`):**
    *   Define `Notification` schema in Prisma (id, userId, message, readStatus, type, createdAt).
    *   Implement basic service to create notifications (e.g., when a user joins a run created by another user).
    *   Implement endpoints to fetch and mark notifications as read for the authenticated user.
    *   (Future enhancement: Real-time notifications via WebSockets).
2.  **Subscriptions Module (`SubscriptionsModule`):**
    *   Define `Subscription` schema in Prisma (id, userId, planType, startDate, endDate, status).
    *   Implement basic structure for managing user subscriptions (placeholder for actual payment gateway integration).
    *   Endpoints to view current subscription status.
3.  **Sentry Integration for Logging & Monitoring:**
    *   Sign up for Sentry and get a DSN.
    *   Install Sentry SDK for NestJS (`@sentry/node`, `@sentry/tracing`).
    *   Configure Sentry in `main.ts` to capture errors and performance data.
    *   Add custom error handling/filters if needed to send more context to Sentry.
4.  **Dockerization:**
    *   Create a `Dockerfile` for the NestJS application (multi-stage build for smaller production image).
    *   Create `docker-compose.yml` to orchestrate:
        *   The NestJS backend service.
        *   PostgreSQL database service (with volume for data persistence).
        *   Redis service (with volume for data persistence).
    *   Include `.dockerignore` file.
5.  **GitHub Actions for CI/CD:**
    *   Create a workflow file in `.github/workflows/`.
    *   **CI Pipeline:**
        *   Trigger on push/pull_request to `main` or `develop` branches.
        *   Set up Node.js environment.
        *   Install dependencies (`npm ci` or `yarn install`).
        *   Run linters (`eslint`).
        *   Run tests (`npm test` or `yarn test`).
        *   Build the application (`npm run build` or `yarn build`).
    *   **CD Pipeline (Placeholder/Basic):**
        *   (Optional, if a registry like Docker Hub or GHCR is used) Build and push Docker image.
        *   (Placeholder for deployment steps, e.g., to a cloud provider or self-hosted server).
6.  **API Documentation (Swagger/OpenAPI):**
    *   Configure `@nestjs/swagger` in `main.ts`.
    *   Use decorators (`@ApiProperty`, `@ApiOperation`, `@ApiResponse`, etc.) in DTOs and controllers to generate comprehensive API documentation.
    *   Expose Swagger UI at an endpoint (e.g., `/api-docs`).

## 3. High-Level Architecture Diagram

```mermaid
graph TD
    A[Client App (React/TS)] -->|HTTPS/API Calls| B(NestJS Backend on Docker);
    B -->|TCP/IP| C[PostgreSQL DB (Prisma ORM)];
    B -->|TCP/IP| D[Redis Cache];
    B -->|API Call| E[SMS Gateway (Details TBD)];
    B -->|Error/Perf Data| F[Sentry];

    subgraph NestJS Backend
        direction LR
        G[Controllers/Resolvers] --> H[Services];
        H --> I[PrismaService];
        H --> J[AuthModule (JWT/OTP)];
        H --> K[UsersModule];
        H --> L[RunnerCardsModule];
        H --> M[JointRunsModule];
        H --> N[NotificationsModule];
        H --> O[SubscriptionsModule];
        I --> C;
        H --> D;
        J --> E;
    end

    P[GitHub Actions CI/CD] -->|Build & Deploy| B;
    Q[Developer] -->|Code Push| P;
```

## 4. Prisma Schema (Initial Draft)

This is a starting point and will evolve as development progresses.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  phone         String    @unique
  password      String?   // Password might be optional if only OTP login is used long-term, but good for initial setup
  name          String?
  email         String?   @unique // Optional, for recovery or other notifications
  avatarUrl     String?
  bio           String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  runnerCards   RunnerCard[]
  jointRunsOwned JointRun[] @relation("OwnedRuns")
  jointRunParticipations JointRunParticipant[]
  notifications Notification[]
  subscriptions Subscription[]
  sentMessages  Message[] @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
  otp           Otp[]
}

model Otp {
  id        String   @id @default(cuid())
  code      String
  expiresAt DateTime
  verified  Boolean  @default(false)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([userId, createdAt])
}

model RunnerCard {
  id          String   @id @default(cuid())
  title       String
  description String?
  imageUrl    String?
  // Add specific stats or attributes for a runner card
  // e.g., distanceRecord Float?, paceAvg String?
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  jointRunParticipants JointRunParticipant[] // If a card can be directly linked to participation
}

model JointRun {
  id          String   @id @default(cuid())
  title       String
  description String?
  dateTime    DateTime
  location    String?
  latitude    Float?
  longitude   Float?
  createdById String
  createdBy   User     @relation("OwnedRuns", fields: [createdById], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  participants JointRunParticipant[]
}

model JointRunParticipant {
  id           String     @id @default(cuid())
  userId       String
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  jointRunId   String
  jointRun     JointRun   @relation(fields: [jointRunId], references: [id], onDelete: Cascade)
  runnerCardId String?    // Optional: which card they are "using" for this run
  runnerCard   RunnerCard? @relation(fields: [runnerCardId], references: [id], onDelete: SetNull)
  joinedAt     DateTime   @default(now())
  status       String     // e.g., "INTERESTED", "GOING", "COMPLETED"

  @@unique([userId, jointRunId]) // A user can only participate once in a run
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // e.g., "NEW_JOINER", "RUN_REMINDER", "FRIEND_REQUEST"
  message   String
  relatedEntityId String? // e.g., JointRunId, UserId
  relatedEntityType String? // e.g., "JointRun", "User"
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Subscription {
  id        String   @id @default(cuid())
  userId    String   @unique // A user typically has one active subscription
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  planId    String   // Identifier for the subscription plan (e.g., "basic", "premium")
  status    String   // e.g., "ACTIVE", "CANCELED", "PAST_DUE"
  startDate DateTime
  endDate   DateTime? // Nullable for ongoing subscriptions
  // Stripe Customer ID, Subscription ID, etc. can be stored here
  paymentGatewaySubscriptionId String? @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Optional: For direct messaging or comments if needed later
model Message {
  id          String   @id @default(cuid())
  content     String
  senderId    String
  sender      User     @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId  String
  receiver    User     @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
  // Could also be linked to a JointRun for a group chat
  // jointRunId String?
  // jointRun   JointRun? @relation(fields: [jointRunId], references: [id])
  createdAt   DateTime @default(now())
  isRead      Boolean  @default(false)
}

```

