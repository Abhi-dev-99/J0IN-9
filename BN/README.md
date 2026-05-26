# 3D Login Backend

Backend API for the 3D Login & Car Showcase frontend app. Built with Node.js, Express, Prisma, and PostgreSQL (Supabase).

## Tech Stack

- **Node.js** + **Express**
- **Prisma ORM** for database access
- **PostgreSQL** via Supabase
- **bcryptjs** for password hashing
- **jsonwebtoken** for JWT authentication
- **CORS** enabled for frontend communication

## Local Development

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

## Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Project Settings > Database > Connection String**
3. Copy the **URI** connection string
4. Replace `[YOUR-PASSWORD]` with your database password
5. Update your `.env` file:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key
```

## Railway Deployment

### Option 1: Deploy from GitHub

1. Push your backend code to GitHub
2. Go to [railway.app](https://railway.app) and create a new project
3. Select **Deploy from GitHub repo**
4. Choose your repository
5. Add environment variables in Railway Dashboard:
   - `DATABASE_URL` - Your Supabase connection string
   - `JWT_SECRET` - A strong random secret
   - `NODE_ENV` - `production`
6. Railway will auto-deploy on every push

### Option 2: Deploy with Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | `development` or `production` | No |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT token
- `GET /api/auth/me` — Get current user (requires Bearer token)

### Cars
- `GET /api/cars` — Get all cars (supports `?category=`, `?search=`, `?sortBy=`)
- `GET /api/cars/categories` — Get all unique categories
- `GET /api/cars/:id` — Get a single car by ID

## Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a migration
npx prisma migrate dev --name your_migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```
