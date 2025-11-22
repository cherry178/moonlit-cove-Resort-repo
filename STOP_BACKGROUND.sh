#!/bin/bash
# Script to stop backend and ngrok

echo "Stopping backend and ngrok..."

# Stop backend
lsof -ti:4000 | xargs kill -9 2>/dev/null
echo "✅ Backend stopped"

# Stop ngrok
pkill -f "ngrok http 4000" 2>/dev/null
echo "✅ ngrok stopped"

echo ""
echo "All services stopped!"

