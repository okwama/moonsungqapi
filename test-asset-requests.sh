#!/bin/bash

echo "🚀 Starting Asset Requests API Tests..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if the test file exists
if [ ! -f "test-asset-requests.js" ]; then
    echo "❌ test-asset-requests.js file not found."
    exit 1
fi

# Check if axios is installed
if ! node -e "require('axios')" &> /dev/null; then
    echo "📦 Installing axios..."
    npm install axios
fi

# Run the test
echo "🧪 Running Asset Requests API Tests..."
node test-asset-requests.js

echo ""
echo "✅ Test script completed!"
