#!/bin/bash
# start.sh — starts frontend and backend concurrently
# Usage: ./start.sh
# Stop both: Ctrl+C

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "Starting backend on http://127.0.0.1:4000 ..."
cd "$ROOT/backend" && npm run dev &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:3000 ..."
cd "$ROOT/frontend" && npm run dev &
FRONTEND_PID=$!

# When Ctrl+C is pressed, kill both processes
trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

echo ""
echo "Both servers running. Press Ctrl+C to stop."
wait
