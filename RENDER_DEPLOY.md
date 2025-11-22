# 🚀 Deploy Backend to Render (FREE & PERMANENT)

This is the **best solution** for your portfolio project - it's free, permanent, and easier than ngrok!

## Step 1: Prepare Your Code

Your code is already ready! ✅

## Step 2: Push to GitHub (if not already)

```bash
git add .
git commit -m "Prepare for deployment"
git push
```

## Step 3: Sign Up for Render

1. Go to: https://render.com
2. Click **"Get Started for Free"**
3. Sign up with GitHub (easiest way)

## Step 4: Create a Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account if not already connected
3. Select your repository: `moonlit-cove-Resort-repo` (or whatever it's named)
4. Configure:
   - **Name:** `moonlit-cove-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (select this)

## Step 5: Add Environment Variables

Click **"Environment"** tab and add:

```
NODE_ENV=production
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Root@123
DB_NAME=moonlit_cove_resort
```

**⚠️ Important:** For production, you'll need a cloud MySQL database. Render offers PostgreSQL for free, or you can use:
- **PlanetScale** (free MySQL)
- **Railway** (free MySQL with $5 credit)
- **Aiven** (free tier)

For now, we'll set up a simple version first.

## Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy your service URL (e.g., `https://moonlit-cove-backend.onrender.com`)

## Step 7: Update Frontend

1. Open `app.js`
2. Find line 8:
   ```javascript
   : "YOUR_BACKEND_URL/api";
   ```
3. Replace with your Render URL:
   ```javascript
   : "https://moonlit-cove-backend.onrender.com/api";
   ```

## Step 8: Push to GitHub

```bash
git add app.js
git commit -m "Update API URL for Render deployment"
git push
```

## Step 9: Test on Mobile! 🎉

1. Wait 1-2 minutes for GitHub Pages to update
2. Open: https://cherry178.github.io/moonlit-cove-Resort-repo/
3. The toast should disappear and bookings will work!

---

## ⚠️ Database Setup (Important!)

Render's free tier doesn't include MySQL. You have options:

### Option A: Use PlanetScale (Free MySQL)

1. Sign up: https://planetscale.com
2. Create a database
3. Get connection details
4. Update environment variables in Render:
   ```
   DB_HOST=your-planetscale-host
   DB_USER=your-planetscale-user
   DB_PASSWORD=your-planetscale-password
   DB_NAME=your-database-name
   ```

### Option B: Use Railway (Free MySQL)

1. Sign up: https://railway.app
2. Create MySQL database
3. Copy connection string
4. Update environment variables in Render

### Option C: Use Render PostgreSQL (Free)

You'd need to modify `backend/db.js` to use PostgreSQL instead of MySQL, but it's free!

---

## Quick Start (Simplest)

If you want to test quickly without database setup:

1. Deploy to Render (follow steps above)
2. For now, use the fallback demo data (rooms will show)
3. Bookings won't save, but the site will work on mobile
4. Later, add a cloud database for full functionality

---

**Render is FREE and your backend URL never changes!** 🎉

