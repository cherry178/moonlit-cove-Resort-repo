# 🔍 Debug: Bookings Not Showing

## Quick Check

1. **Open Browser Console** (`F12` → Console tab)
2. **After booking, look for these messages:**
   - `"Reloading bookings after successful booking..."`
   - `"Loading bookings for user: phone_XXXXX"`
   - `"✅ Bookings loaded: X"` (X = number of bookings)
   - `"Rendering bookings: X"`
   - `"✅ Rendering X bookings"`

## Common Issues

### Issue 1: Wrong User ID
**Symptom:** Bookings saved but not showing

**Check:**
- In console, look for: `"Loading bookings for user: phone_XXXXX"`
- Make sure this matches the phone number you used to login
- Each phone number has its own bookings

**Fix:** Login with the SAME phone number you used when booking

### Issue 2: Bookings Section Not Visible
**Symptom:** Bookings exist but you can't see them

**Check:**
- Scroll down on the page
- Look for "Your Bookings" section
- It's below the "About" section

**Fix:** The page should auto-scroll after booking, but if not, scroll manually

### Issue 3: Backend Not Connected
**Symptom:** Console shows errors

**Check:**
- Look for errors in console (red text)
- Check if backend is running: `curl http://localhost:4000/api/health`

**Fix:** Make sure backend is running

### Issue 4: Bookings Loading But Not Displaying
**Symptom:** Console shows bookings loaded but page is empty

**Check:**
- Look for: `"✅ Bookings loaded: X"`
- Look for: `"✅ Rendering X bookings"`
- Check if `bookingsContainer` element exists

**Fix:** Check browser console for any JavaScript errors

## Test Steps

1. **Login:**
   - Use phone number: `9000598883`
   - OTP: `123456`
   - This user has 3 bookings in database

2. **Check Console:**
   - Should see: `"Loading bookings for user: phone_9000598883"`
   - Should see: `"✅ Bookings loaded: 3"`

3. **Scroll to Bookings:**
   - Scroll down to "Your Bookings" section
   - Should see 3 booking cards

4. **Make New Booking:**
   - After booking, console should show:
     - `"Reloading bookings after successful booking..."`
     - `"Bookings after reload: X"`
   - Page should auto-scroll to bookings section

## Still Not Working?

Share these from browser console:
1. `"Loading bookings for user: ..."` message
2. `"✅ Bookings loaded: X"` message  
3. Any red error messages
4. Screenshot of the "Your Bookings" section

