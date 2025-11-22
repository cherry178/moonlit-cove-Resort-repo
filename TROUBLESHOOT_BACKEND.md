# 🔧 Troubleshoot: "Backend Not Connected" on Laptop

## Quick Fixes

### 1. Clear Browser Cache (Most Common Issue)

**Chrome/Edge:**
- Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Select "Cached images and files"
- Click "Clear data"
- Refresh page (`Ctrl+F5` or `Cmd+Shift+R`)

**Or Hard Refresh:**
- `Ctrl+Shift+R` (Windows/Linux)
- `Cmd+Shift+R` (Mac)

### 2. Check Browser Console

1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Look for errors (red text)
4. Look for API requests

**What to look for:**
- `Failed to fetch` = Connection issue
- `CORS error` = CORS blocking
- `404` = Wrong URL
- `NetworkError` = Backend not reachable

### 3. Check Network Tab

1. Press `F12` → **Network** tab
2. Refresh page
3. Look for requests to `/api/rooms` or `/api/health`
4. Check if they're:
   - ✅ Green (200) = Working
   - ❌ Red (failed) = Problem

### 4. Verify Backend is Running

Open terminal and run:
```bash
curl http://localhost:4000/api/health
```

Should return: `{"ok":true,"message":"Moonlit Cove backend is running"}`

### 5. Check Which URL You're Using

**If opening `index.html` directly:**
- Should use: `http://localhost:4000/api`
- Backend must be running locally

**If opening from GitHub Pages:**
- Uses: `https://sina-noninjurious-oda.ngrok-free.dev/api`
- ngrok must be running

### 6. Test Backend Directly

**Local:**
```bash
curl http://localhost:4000/api/rooms
```

**Via ngrok:**
```bash
curl https://sina-noninjurious-oda.ngrok-free.dev/api/rooms
```

Both should return room data.

---

## Common Issues

### Issue 1: Browser Cache
**Symptom:** Shows old version with errors
**Fix:** Clear cache (see #1 above)

### Issue 2: CORS Error
**Symptom:** Console shows "CORS policy" error
**Fix:** Backend already has CORS enabled, but check if browser is blocking

### Issue 3: Backend Stopped
**Symptom:** `curl` fails
**Fix:** Restart backend:
```bash
npm start
```

### Issue 4: Wrong URL
**Symptom:** 404 errors in console
**Fix:** Check `app.js` line 8 has correct URL

### Issue 5: ngrok Not Running
**Symptom:** GitHub Pages can't connect
**Fix:** Start ngrok:
```bash
ngrok http 4000
```

---

## Step-by-Step Debug

1. **Open Browser Console** (`F12`)
2. **Check for errors** (red text)
3. **Check Network tab** → Look for `/api/rooms` request
4. **Check if request is:**
   - Going to correct URL
   - Getting response
   - Any errors

5. **Test backend directly:**
   ```bash
   curl http://localhost:4000/api/health
   ```

6. **If backend works but browser doesn't:**
   - Clear cache
   - Hard refresh
   - Check CORS errors

---

## Quick Test

Open browser console and run:
```javascript
fetch('http://localhost:4000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

If this works → Backend is fine, issue is in frontend
If this fails → Backend connection issue

---

## Still Not Working?

1. Share the **browser console errors**
2. Share the **Network tab** screenshot
3. Check if backend is actually running:
   ```bash
   lsof -ti:4000
   ```

