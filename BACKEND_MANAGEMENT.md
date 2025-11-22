# Backend Server Management Guide

## ✅ Backend is Running with `nohup`

The backend server is now running in the background and will continue running even if you close your terminal.

---

## 📊 Check if Backend is Running

```bash
curl http://localhost:4000/api/health
```

Or check the process:
```bash
ps aux | grep "node.*server.js" | grep -v grep
```

---

## 📝 View Server Logs

View the last 50 lines of logs:
```bash
tail -50 server.log
```

Watch logs in real-time (live updates):
```bash
tail -f server.log
```

View all logs:
```bash
cat server.log
```

---

## 🛑 Stop the Backend Server

### Method 1: Kill by port (Recommended)
```bash
lsof -ti:4000 | xargs kill
```

### Method 2: Kill by process ID
First, find the process ID:
```bash
ps aux | grep "node.*server.js" | grep -v grep
```

Then kill it (replace `PID` with the actual process number):
```bash
kill PID
```

If it doesn't stop, force kill:
```bash
kill -9 PID
```

---

## 🚀 Start the Backend Server Again

If you stopped the server and want to start it again:

```bash
cd /Users/charishmarasineni/Resort
nohup npm start > server.log 2>&1 &
```

This will:
- Start the server in the background
- Save all output to `server.log`
- Keep running even after closing the terminal

---

## 🔄 Restart the Backend Server

To restart (stop and start again):

```bash
# Stop the server
lsof -ti:4000 | xargs kill

# Wait a moment
sleep 2

# Start again
cd /Users/charishmarasineni/Resort
nohup npm start > server.log 2>&1 &
```

---

## 📁 Log File Location

All server logs are saved in:
```
/Users/charishmarasineni/Resort/server.log
```

---

## 🐛 Troubleshooting

### Port 4000 already in use
If you get an error that port 4000 is already in use:
```bash
lsof -ti:4000 | xargs kill -9
```

### Server not responding
Check if it's running:
```bash
curl http://localhost:4000/api/health
```

Check the logs for errors:
```bash
tail -50 server.log
```

### Server won't start
Make sure you're in the project directory:
```bash
cd /Users/charishmarasineni/Resort
```

Make sure MySQL is running and database credentials are correct in `backend/db.js`.

---

## 📌 Quick Reference

| Task | Command |
|------|---------|
| Check if running | `curl http://localhost:4000/api/health` |
| View logs | `tail -f server.log` |
| Stop server | `lsof -ti:4000 \| xargs kill` |
| Start server | `cd /Users/charishmarasineni/Resort && nohup npm start > server.log 2>&1 &` |

---

**Note:** The backend server must be running for the frontend website to work properly!



