#!/bin/bash

echo "🚀 Starting NestJS Server with Auto Clockout Feature"
echo "=================================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Start the server
echo "🌐 Starting server..."
echo "📋 Auto Clockout Configuration:"
echo "   - Schedule: Daily at 10 PM (22:00)"
echo "   - Recorded Time: 8 PM (20:00)"
echo "   - Timezone: Africa/Nairobi"
echo ""
echo "🔗 API Endpoints:"
echo "   - GET  /auto-clockout/config"
echo "   - GET  /auto-clockout/stats"
echo "   - POST /auto-clockout/trigger"
echo ""
echo "📝 Logs will show auto clockout activities"
echo ""

npm run start:dev
