# Deploy to Railway (Supabase Auth + MongoDB)

## Step 1: Set up Supabase Auth

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **New Project**
3. Choose organization, name your project, set a password
4. Wait for project to be created
5. Go to **Project Settings > API**
6. Copy these values:
   - **URL** (e.g., `https://abcdefgh12345678.supabase.co`)
   - **service_role key** (starts with `eyJ...` — the secret one, NOT the anon key!)
7. Save these for Railway env vars

## Step 2: Set up MongoDB Atlas (for cars data)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Click **Build a Database** → Choose **FREE (M0)**
3. Select cloud provider & region
4. Create cluster
5. **Database Access** → Add New Database User → save username/password
6. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
7. **Database** → **Connect** → **Drivers** → **Node.js**
8. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/3d-login-db?retryWrites=true&w=majority
   ```

## Step 3: Prepare Backend

```bash
cd /Users/kiran/Desktop/#2P/J0IN-9/BN
git init
git add .
git commit -m "Backend with Supabase Auth + MongoDB"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Step 4: Deploy to Railway

### Using Dashboard

1. Go to [railway.app](https://railway.app) → **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your repository
4. Go to **Variables** tab, add:
   | Variable | Description |
   |----------|-------------|
   | `SUPABASE_URL` | `https://your-project-ref.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key from Supabase |
   | `MONGODB_URI` | MongoDB Atlas connection string |
   | `JWT_SECRET` | Strong random string (generate [here](https://jwtsecret.com/generate)) |
   | `NODE_ENV` | `production` |
5. Railway auto-deploys!

### Using CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway variables set SUPABASE_URL="https://..."
railway variables set SUPABASE_SERVICE_ROLE_KEY="..."
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set JWT_SECRET="..."
railway variables set NODE_ENV="production"
```

## Step 5: Seed Cars (First Deploy)

Cars auto-seed when the server starts if the collection is empty. To verify:

```bash
curl https://your-railway-app.up.railway.app/api/cars
```

If empty, run via Railway Shell:
```bash
node -e "require('./seed/cars')()"
```

## Step 6: Update Frontend

In `/Users/kiran/Desktop/#2P/J0IN-9/FN/react-3d-login/.env`:
```env
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

## Verify Everything

```bash
# Test health
curl https://your-railway-app.up.railway.app/

# Test cars (MongoDB)
curl https://your-railway-app.up.railway.app/api/cars

# Test auth (Supabase)
curl -X POST https://your-railway-app.up-railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## Troubleshooting

### "Invalid API key" or "JWT verification failed"
- Check you're using the **service_role key** (not anon key)
- Verify `SUPABASE_URL` matches your project exactly

### "MongoServerSelectionError"
- Check `MONGODB_URI` is correct
- Ensure `0.0.0.0/0` is whitelisted in Atlas Network Access

### "User already registered" but login fails
- The user exists in Supabase but password might be wrong
- Check Supabase Dashboard > Authentication > Users
