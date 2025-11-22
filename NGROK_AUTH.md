# ngrok Authentication Setup

## Step 1: Sign Up (Free)
1. Go to: https://dashboard.ngrok.com/signup
2. Sign up with your email (it's free)

## Step 2: Get Your Authtoken
1. After signing up, go to: https://dashboard.ngrok.com/get-started/your-authtoken
2. Copy your authtoken (looks like: `2abc123def456ghi789jkl012mno345pq_6R7S8T9U0V1W2X3Y4Z5`)

## Step 3: Install Authtoken
Run this command in your terminal (replace YOUR_AUTHTOKEN with the actual token):
```bash
ngrok config add-authtoken YOUR_AUTHTOKEN
```

## Step 4: Start ngrok
```bash
ngrok http 4000
```

## Step 5: Copy the HTTPS URL
Copy the URL that looks like: `https://abc123xyz.ngrok-free.app`

## Step 6: Update app.js
Replace `YOUR_BACKEND_URL` in `app.js` line 8 with your ngrok URL.

## Step 7: Push to GitHub
```bash
git add app.js
git commit -m "Add ngrok URL"
git push
```

---

**Note:** ngrok free URLs change every time you restart. For a permanent solution, deploy to Render instead (see below).

