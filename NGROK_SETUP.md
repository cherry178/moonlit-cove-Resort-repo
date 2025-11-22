# Quick Setup: Make Backend Work on Mobile with ngrok

## Step 1: Start ngrok

Open a **new terminal** and run:
```bash
ngrok http 4000
```

You'll see output like:
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123xyz.ngrok-free.app -> http://localhost:4000
```

## Step 2: Copy the HTTPS URL

Copy the **HTTPS URL** (the one that looks like `https://abc123xyz.ngrok-free.app`)

## Step 3: Update app.js

1. Open `app.js`
2. Find line 8 that says:
   ```javascript
   : "YOUR_BACKEND_URL/api"; // TODO: Replace with your deployed backend URL
   ```

3. Replace `YOUR_BACKEND_URL` with your ngrok URL (without `/api`):
   ```javascript
   : "https://abc123xyz.ngrok-free.app/api";
   ```

## Step 4: Push to GitHub

```bash
git add app.js
git commit -m "Update API URL with ngrok"
git push
```

## Step 5: Test on Mobile

1. Wait 1-2 minutes for GitHub Pages to update
2. Open your site on mobile: https://cherry178.github.io/moonlit-cove-Resort-repo/
3. The toast message should disappear
4. Try booking a room - it should work!

## Important Notes:

⚠️ **ngrok URLs change every time you restart ngrok** (unless you have a paid plan)

- If you restart ngrok, you'll get a new URL
- You'll need to update `app.js` again and push to GitHub
- For a permanent solution, deploy to Render/Railway instead

## To Stop ngrok:

Press `Ctrl+C` in the terminal where ngrok is running.

## Alternative: Deploy to Render (Permanent Solution)

For a permanent solution that doesn't change URLs, see deployment options in the main README.

