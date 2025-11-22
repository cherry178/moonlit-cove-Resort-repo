# 🔧 Troubleshooting: Bookings Not Showing

## ✅ Quick Fix Steps

### Step 1: Open from GitHub Pages (NOT local file)
**CRITICAL:** Do NOT open `index.html` directly from your computer.

**Instead, open:**
```
https://cherry178.github.io/moonlit-cove-Resort-repo/
```

### Step 2: Clear Browser Cache
1. Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) to hard refresh
2. Or go to browser settings → Clear browsing data → Cached images and files

### Step 3: Login with Correct Phone Number
**Important:** Use the SAME phone number you used when booking!

**Test user with existing bookings:**
- Phone: `9000598883`
- OTP: `123456`
- This user has 3 bookings in the database

### Step 4: Check Browser Console
1. Press `F12` to open Developer Tools
2. Click "Console" tab
3. Look for these messages:
   - ✅ `"User logged in: phone_9000598883"`
   - ✅ `"Loading bookings for user: phone_9000598883"`
   - ✅ `"✅ Bookings loaded successfully: 3"`
   - ✅ `"✅ Rendering 3 bookings"`

### Step 5: Use Refresh Button
After logging in, you'll see a **"🔄 Refresh Bookings"** button above the bookings section. Click it to manually reload bookings.

## 🔍 Common Issues

### Issue 1: "You have no bookings yet"
**Possible causes:**
- You're logged in with a different phone number than when you booked
- The booking was created with a different user ID

**Solution:**
- Login with the EXACT phone number you used when booking
- Check console to see what user ID you're logged in as

### Issue 2: Console shows "Failed to fetch" or CORS error
**Possible causes:**
- Opening from `file://` protocol
- Backend not running
- ngrok tunnel expired

**Solution:**
- Open from GitHub Pages (not local file)
- Check if backend is running: `curl http://localhost:4000/api/health`
- If using ngrok, restart it: `ngrok http 4000`

### Issue 3: Bookings load but don't display
**Possible causes:**
- JavaScript error preventing rendering
- CSS hiding the bookings

**Solution:**
- Check console for red error messages
- Scroll down to "Your Bookings" section
- Check if bookings container exists: `document.getElementById('bookingsContainer')`

### Issue 4: "Loading bookings..." forever
**Possible causes:**
- API request hanging
- Network timeout

**Solution:**
- Check console for timeout errors
- Click "🔄 Refresh Bookings" button
- Check backend is running

## 🧪 Test with Known Good User

To verify everything works:

1. **Open:** https://cherry178.github.io/moonlit-cove-Resort-repo/
2. **Login:**
   - Phone: `9000598883`
   - OTP: `123456`
3. **Expected result:**
   - Should see 3 bookings:
     - Garden Moon Villa (Dec 24-26)
     - Garden Moon Villa (Dec 1-3)
     - Lagoon Premium Room (Nov 25-27)

## 📊 Debug Information

If bookings still don't show, share these from browser console:

1. **User ID:** Look for `"👤 Current user: ..."`
2. **API URL:** Look for `"🌐 API Base URL: ..."`
3. **Bookings count:** Look for `"✅ Bookings loaded successfully: X"`
4. **Any red errors:** Copy all red error messages

## 🔗 Verify Backend

Test if backend is working:

```bash
# Check backend health
curl http://localhost:4000/api/health

# Check bookings for test user
curl 'http://localhost:4000/api/bookings?userAuthId=phone_9000598883'
```

Expected: Should return 3 bookings in JSON format.

