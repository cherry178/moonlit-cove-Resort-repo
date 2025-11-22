# 🔍 How to Check Browser Console

## Quick Method (Easiest)

### Windows/Linux:
1. Press **`F12`** key
2. Click **"Console"** tab at the top

### Mac:
1. Press **`Cmd + Option + J`** (Chrome/Edge)
2. Or **`Cmd + Option + K`** (Firefox)
3. Click **"Console"** tab at the top

---

## Step-by-Step for Each Browser

### Google Chrome / Microsoft Edge

**Windows/Linux:**
- Press `F12`
- OR `Ctrl + Shift + J`
- OR Right-click page → "Inspect" → Click "Console" tab

**Mac:**
- Press `Cmd + Option + J`
- OR Right-click page → "Inspect" → Click "Console" tab

### Mozilla Firefox

**Windows/Linux:**
- Press `F12`
- OR `Ctrl + Shift + K`
- OR Right-click page → "Inspect" → Click "Console" tab

**Mac:**
- Press `Cmd + Option + K`
- OR Right-click page → "Inspect" → Click "Console" tab

### Safari (Mac Only)

**First Time Setup:**
1. Open Safari
2. Go to **Safari** → **Preferences** (or **Settings**)
3. Click **"Advanced"** tab
4. Check ✅ **"Show Develop menu in menu bar"**
5. Close preferences

**Then:**
- Press `Cmd + Option + C`
- OR Go to **Develop** menu → **Show JavaScript Console**

---

## What You'll See

The console shows:
- ✅ **Green/Blue messages** = Information (working correctly)
- ⚠️ **Yellow messages** = Warnings (not critical)
- ❌ **Red messages** = Errors (need attention)

---

## What to Look For (For Bookings)

After logging in, you should see messages like:

```
🔄 Rendering bookings...
👤 Current user: phone_9000598883
🌐 API Base URL: https://sina-noninjurious-oda.ngrok-free.dev/api
🔍 Loading bookings for user: phone_9000598883
📡 API URL: https://...
✅ Bookings loaded successfully: 3 bookings
📋 Bookings to render: 3
✅ Rendering 3 bookings
✅ Rendered 3 out of 3 booking cards
```

---

## Common Issues

### If you see:
- **"Failed to fetch"** = Backend not connected
- **"CORS error"** = Opening from file:// instead of GitHub Pages
- **"Bookings loaded: 0"** = Wrong phone number or no bookings

### If console is empty:
- Make sure you're on the **Console** tab (not Network or Elements)
- Try refreshing the page (`F5` or `Ctrl+R`)
- Clear console: Click the 🚫 icon or press `Ctrl+L`

---

## Screenshot Guide

1. Open console (`F12`)
2. Click "Console" tab
3. Login to your account
4. Take a screenshot (Windows: `Win + Shift + S`, Mac: `Cmd + Shift + 4`)
5. Share the screenshot if you need help

---

## Quick Test

1. Open: https://cherry178.github.io/moonlit-cove-Resort-repo/
2. Press `F12`
3. Click "Console" tab
4. Login with phone: `9000598883`, OTP: `123456`
5. Look for the messages above

If you see errors, copy the red text and share it!

