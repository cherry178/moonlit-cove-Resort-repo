#!/bin/bash
# Script to start backend and ngrok in background

cd /Users/charishmarasineni/Resort

# Kill any existing processes
lsof -ti:4000 | xargs kill -9 2>/dev/null
pkill -f "ngrok http 4000" 2>/dev/null

# Start backend in background
echo "Starting backend server..."
nohup npm start > server.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

# Start ngrok in background
echo "Starting ngrok..."
nohup ngrok http 4000 > ngrok.log 2>&1 &
NGROK_PID=$!
echo "ngrok started with PID: $NGROK_PID"

# Wait a moment for ngrok to start
sleep 5

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo "⚠️  Could not get ngrok URL. Check ngrok.log"
    echo "You can manually get it from: http://localhost:4040"
else
    echo ""
    echo "✅ Backend and ngrok are running in background!"
    echo ""
    echo "📱 Your ngrok URL: $NGROK_URL"
    echo ""
    echo "⚠️  IMPORTANT: Update app.js with this URL:"
    echo "   Replace 'YOUR_BACKEND_URL' with: $NGROK_URL"
    echo ""
    echo "📝 To check logs:"
    echo "   Backend: tail -f server.log"
    echo "   ngrok: tail -f ngrok.log"
    echo ""
    echo "🛑 To stop:"
    echo "   kill $BACKEND_PID $NGROK_PID"
fi

