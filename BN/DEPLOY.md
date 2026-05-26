# Deploy to Railway + Supabase

## Step 1: Set up Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **New Project**
3. Choose organization, name your project, set a strong database password
4. Wait for project to be created
5. Go to **Project Settings > Database**
6. Under **Connection String**, copy the **URI** format:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
7. Save this for later

## Step 2: Prepare Backend for Deployment

Make sure your backend code is pushed to a GitHub repository:

```bash
cd /Users/kiran/Desktop/#2P/J0IN-9/BN
git init
git add .
git commit -m "Initial backend with Prisma + Supabase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Step 3: Deploy to Railway

### Using Railway Dashboard (Recommended)

1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your backend repository
5. Railway will automatically detect it's a Node.js app
6. Go to **Variables** tab and add:
   - `DATABASE_URL` = your Supabase connection string
   - `JWT_SECRET` = a strong random string (generate at https://jwtsecret.com/generate)
   - `NODE_ENV` = `production`
7. Railway will auto-deploy!

### Using Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway variables set DATABASE_URL="your-supabase-url"
railway variables set JWT_SECRET="your-secret"
railway variables set NODE_ENV="production"
```

## Step 4: Run Migrations & Seed

After first deploy, you need to run Prisma migrations:

**Option A: Using Railway Dashboard**
1. Go to your project in Railway
2. Click on your service
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Click **Shell** tab
6. Run:
   ```bash
   npx prisma migrate deploy
   node prisma/seed.js
   ```

**Option B: Using Railway CLI**
```bash
railway run npx prisma migrate deploy
railway run node prisma/seed.js
```

## Step 5: Update Frontend API URL

Once Railway gives you a domain (e.g., `https://3d-login-backend.up.railway.app`):

1. Open `/Users/kiran/Desktop/#2P/J0IN-9/FN/react-3d-login/.env`
2. Update:
   ```env
   VITE_API_URL=https://your-railway-app.up.railway.app/api
   ```
3. Restart your frontend dev server or rebuild for production

## Step 6: Allow CORS on Railway

Your Railway backend should already have CORS enabled. If you get CORS errors:

1. Make sure your Railway domain is correct
2. Check that the backend `cors()` middleware is active (it is by default in server.js)
3. For production, you may want to restrict CORS origins in `server.js`:
   ```js
   app.use(cors({
     origin: ['https://your-frontend-domain.com', 'http://localhost:5173']
   }));
   ```

## Verify Everything Works

Test your deployed backend:

```bash
curl https://your-railway-app.up.railway.app/
curl https://your-railway-app.up.railway.app/api/cars
curl -X POST https://your-railway-app.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## Troubleshooting

### "Can't reach database server"
- Check your `DATABASE_URL` is correct
- Make sure you're using the **URI** connection string from Supabase
- Verify your Supabase project is active (not paused)

### "Migration failed"
- Make sure migrations are applied: `npx prisma migrate deploy`
- Check Railway logs for detailed error messages

### "CORS error"
- Verify your frontend URL is allowed by the backend CORS config
- Check browser Network tab for preflight errors
