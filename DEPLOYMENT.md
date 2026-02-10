# Deployment Guide - Office Chore Manager

## Prerequisites
- GitHub account
- Railway account (for backend)
- Vercel account (for frontend)
- Your Supabase database is already set up ✅

## Step 1: Push to GitHub

```bash
# Create a new repository on GitHub (github.com/new)
# Name it: office-chore-manager
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/office-chore-manager.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Select your `office-chore-manager` repository
5. Railway will detect Node.js automatically

### 2.2 Configure Railway
1. Click on your service
2. Go to "Settings" tab
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `npm start`
5. Set **Build Command**: `npm install`

### 2.3 Add Environment Variables
Go to "Variables" tab and add these:

```
DATABASE_URL=<your-supabase-connection-string>
JWT_SECRET=<generate-a-random-32-char-string>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<generate-another-random-32-char-string>
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
```

**Get your Supabase connection string:**
- Go to Supabase Dashboard
- Project Settings → Database → Connection String
- Use the **connection pooler** URL
- Replace `[YOUR-PASSWORD]` with your actual password

### 2.4 Generate Secrets
Use this command to generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Deploy
Railway will automatically deploy! Get your URL from the "Settings" tab (e.g., `https://office-chore-backend-production.up.railway.app`)

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your `office-chore-manager` repository
4. Configure as follows:

**Framework Preset:** Vite
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### 3.2 Add Environment Variable
In "Environment Variables" section, add:

```
VITE_API_BASE_URL=<your-railway-backend-url>/api
```

Example: `VITE_API_BASE_URL=https://office-chore-backend-production.up.railway.app/api`

### 3.3 Deploy
Click "Deploy"! Vercel will give you a URL like `https://office-chore-manager.vercel.app`

## Step 4: Update Backend CORS

1. Go back to Railway
2. Update the `FRONTEND_URL` variable to your Vercel URL:
   ```
   FRONTEND_URL=https://office-chore-manager.vercel.app
   ```
3. Railway will automatically redeploy

## Step 5: Test Your App

1. Visit your Vercel URL
2. Register a new account
3. Create a team
4. Add chores
5. Invite team members!

## Troubleshooting

### Backend won't start
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure DATABASE_URL is the connection pooler URL

### Frontend can't connect to backend
- Check that `VITE_API_BASE_URL` is correct
- Verify CORS is set correctly in Railway (`FRONTEND_URL`)
- Check browser console for CORS errors

### Database connection fails
- Use Supabase connection pooler URL (not direct URL)
- Make sure password is URL-encoded (% instead of special chars)
- Test connection in Railway logs

## Your URLs

After deployment, save these URLs:
- **Frontend:** https://your-app-name.vercel.app
- **Backend:** https://your-app-name.up.railway.app
- **Database:** Supabase (already set up)

## Automatic Deployments

Both Railway and Vercel will automatically redeploy when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

Railway and Vercel will deploy automatically! 🚀
