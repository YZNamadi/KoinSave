# Koinsave Backend


## Overview
- Framework: Express
- Auth: JWT (Bearer)
- ORM: Prisma + SQLite (local dev)
- Validation: Zod
- Security: Helmet, CORS, rate limiting
- Logging: Pino with pretty transport
- Docs: Swagger at `/docs`
- Tests: Jest + ts-jest

## Quick Start
1. Clone and install:
   - `npm install`
2. Configure environment:
   - Copy `.env.example` to `.env` and set `JWT_SECRET`.
3. Generate and migrate DB:
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`
4. Run:
   - `npm start` (build + run)
   - `npm run dev` (watch mode)

## Environment Variables
- `PORT` (default `3000`)
- `JWT_SECRET` (required in non-dev)
- `DATABASE_URL` (default `file:./dev.db`)

## Scripts
- `npm start` – build and run
- `npm run dev` – run in watch mode
- `npm run build` – compile TS to `dist`
- `npm test` – run Jest tests
- `npx prisma generate` – generate Prisma client
- `npx prisma migrate dev --name <name>` – create/apply migration

## Database Schema
- `User`: `id`, `email` (unique), `passwordHash`, `balance` (cents), `createdAt`
- `Transaction`: `id`, `amount` (cents), `fromUserId`, `toUserId`, `createdAt`
Notes: Monetary values stored in integer cents to avoid floating point issues.

# API Endpoints
Base URL: `http://localhost:3000`

### Auth
- `POST /api/auth/register`
  - Body: `{ "email": string, "password": string(min 8) }`
  - 201: `{ success: true, data: { id, email, balance } }`
  - 400: `EMAIL_TAKEN` if email exists; validation errors use standard format.
- `POST /api/auth/login`
  - Body: `{ "email": string, "password": string }`
  - 200: `{ success: true, data: { token } }`
  - 401: `INVALID_CREDENTIALS` if mismatch.

### Users
- `GET /api/users/me` (auth required)
  - Header: `Authorization: Bearer <token>`
  - 200: `{ success: true, data: { id, email, balance } }`

### Transactions
- `POST /api/transactions/transfer` (auth required)
  - Body: `{ "toUserId": number, "amount": number(>0) }` – amount in currency units.
  - 201: `{ success: true, data: { id, amount(cents), fromUserId, toUserId, createdAt } }`
  - 400: `INSUFFICIENT_FUNDS`, `SELF_TRANSFER`, or `VALIDATION_ERROR`.
- `GET /api/transactions` (auth required)
  - 200: `{ success: true, data: Transaction[] }`

## Error Format
Standardized JSON errors:
```
{ "success": false, "error": { "code": string, "message": string, "details"?: any[] } }
```
- Validation (Zod):
  - `code`: `VALIDATION_ERROR`
  - `message`: `Validation failed`
  - `details`: `[ { path: string, message: string, code: string } ]`
- Auth/JWT:
  - Invalid token → `code`: `INVALID_TOKEN`, 401
  - Expired token → `code`: `TOKEN_EXPIRED`, 401
- Domain errors:
  - `EMAIL_TAKEN`, `INVALID_CREDENTIALS`, `INSUFFICIENT_FUNDS`, `SELF_TRANSFER`, `USER_NOT_FOUND`

## Security & Rate Limiting
- Helmet and CORS enabled globally.
- Rate limiting: 100 requests per 15 minutes per IP.
- Authorization header redacted in logs.

## Logging
- Pino with pretty transport.
- Structured logs; avoid sensitive data.

## Swagger Docs
- `GET /docs` – interactive docs for all endpoints.

## Testing
- `npm test` – runs unit tests for validators and core transaction logic.
  - Example assertions: validation accepts/rejects payloads, overdraft prevents transfers, money utils convert correctly.




