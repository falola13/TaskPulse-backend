# TaskPulse Backend

TaskPulse is a productivity backend built with NestJS and PostgreSQL.
It powers authentication, tasks, focus sessions, goals, streak tracking, subscriptions, and plans.

## Why This Project

TaskPulse helps users stay consistent by combining:

- task management
- focus/pomodoro-style sessions
- goals and weekly summaries
- streak and activity tracking
- secure auth (JWT cookies + OAuth + 2FA)

## Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL + TypeORM
- **Auth:** JWT (cookie-based), Google OAuth, GitHub OAuth, 2FA (TOTP)
- **Validation/Docs:** class-validator, Swagger (`/docs`)
- **Container Support:** Docker Compose for local Postgres

## API Overview

- **Base URL:** `http://localhost:3001`
- **Global Prefix:** `/api/v1`
- **Swagger Docs:** `http://localhost:3001/docs`

Main route groups:

- `auth` - register/login/logout, profile, OAuth, 2FA
- `tasks` - create/read/update/delete tasks
- `focus-session` - start/end sessions, current session, history
- `goals` - get/upsert goals, weekly summary
- `streaks` - streak details and activity chart data
- `subscriptions` - create and fetch user subscription
- `plans` - fetch available plans
- `users` - admin-only user listing

## Local Setup

### 1) Install dependencies

```bash
yarn install
```

### 2) Start PostgreSQL (Docker)

```bash
docker-compose up -d
```

Default local DB from `docker-compose.yml`:

- host: `localhost`
- port: `5433`
- user: `postgres`
- password: `postgres`
- database: `taskpulse_dev`

### 3) Configure environment variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=taskpulse_dev
DB_SSL=false

JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRATION=1d

PORT=3001
CORS_ORIGIN=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3001/api/v1/auth/github/callback
```

### 4) Start the API

```bash
yarn dev
```

## Scripts

```bash
# Build
yarn build

# Start modes
yarn start
yarn dev
yarn start:debug
yarn start:prod

# Quality
yarn lint
yarn format

# Tests
yarn test
yarn test:watch
yarn test:cov
yarn test:e2e
```

## Authentication Notes

- JWT is set as an HTTP-only cookie (`access_token`).
- Protected endpoints use the JWT auth guard.
- OAuth providers supported: Google and GitHub.
- 2FA is available with TOTP secret generation + verification flow.

## Database Notes

- TypeORM uses `autoLoadEntities: true`.
- `synchronize: true` is currently enabled for development.
- In production, set `synchronize: false` and manage schema with migrations.
- SSL is enabled automatically when `NODE_ENV=production` or when `DB_SSL=true`.

## Development Tips

- Keep secrets out of git.
- Prefer `.env.example` for sharing config shape in team workflows.
- Use Swagger docs to quickly validate request/response contracts.

## License

This project is currently marked as `UNLICENSED` in `package.json`.
