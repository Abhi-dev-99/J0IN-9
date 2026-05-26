# 3D Login Backend

Backend API for the 3D Login & Car Showcase frontend app.

**Architecture:** Supabase Auth (users) + MongoDB (cars data)

## Tech Stack

- **Node.js** + **Express**
- **Supabase Auth** for user authentication (register/login/JWT)
- **MongoDB** + **Mongoose ODM** for car data storage
- **CORS** enabled for frontend communication

## Local Development

```bash
npm install
npm run dev
```

Requires:
- MongoDB running locally (for cars data)
- Supabase project (for auth) — see setup below

## Supabase Auth Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Project Settings > API**
3. Copy:
   - `URL` → `SUPABASE_URL`
   - `service_role key` (NOT the anon key!) → `SUPABASE_SERVICE_ROLE_KEY`
4. Update your `.env`:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## MongoDB Setup (for cars data)

### Local
```env
MONGODB_URI=mongodb://127.0.0.1:27017/3d-login-db
```

### MongoDB Atlas (cloud)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster and database user
3. Whitelist IP `0.0.0.0/0` (required for Railway)
4. Copy connection string and update `.env`

## Railway Deployment

### Deploy from GitHub

1. Push your backend code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Add environment variables:
   | Variable | Value |
   |----------|-------|
   | `SUPABASE_URL` | Your Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Strong random string (fallback) |
   | `NODE_ENV` | `production` |
4. Railway auto-deploys on every push

### Using Railway CLI
```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway variables set SUPABASE_URL="https://..."
railway variables set SUPABASE_SERVICE_ROLE_KEY="..."
railway variables set MONGODB_URI="mongodb+srv://..."
```

## API Endpoints

### Auth (Supabase)
- `POST /api/auth/register` — Register via Supabase Auth
- `POST /api/auth/login` — Login via Supabase Auth
- `GET /api/auth/me` — Get current user from Supabase JWT

### Cars (MongoDB)
- `GET /api/cars` — Get all cars (supports `?category=`, `?search=`, `?sortBy=`)
- `GET /api/cars/categories` — Get all unique categories
- `GET /api/cars/:id` — Get a single car by ID

## How It Works

| Feature | Database |
|---------|----------|
| User registration | Supabase Auth |
| User login | Supabase Auth |
| JWT tokens | Supabase (validates via Supabase) |
| Car data | MongoDB |
| Car search/filter | MongoDB |

This gives you the best of both worlds: **enterprise-grade auth** from Supabase + **flexible document storage** from MongoDB for your car catalog.
