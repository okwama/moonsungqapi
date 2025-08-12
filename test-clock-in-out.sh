#!/bin/bash

# Configuration
BASE_URL="http://localhost:3000/api"
PHONE_NUMBER="07061668785"
PASSWORD="password"

echo "🚀 Starting Clock-In/Out Test Suite"
echo "=================================="

# Step 1: Login
echo -e "\n🔐 Step 1: Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"phoneNumber\": \"$PHONE_NUMBER\",
    \"password\": \"$PASSWORD\"
  }")

echo "Login Response: $LOGIN_RESPONSE"

# Extract token and user ID from login response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get token from login response"
    exit 1
fi

if [ -z "$USER_ID" ]; then
    echo "❌ Failed to get user ID from login response"
    exit 1
fi

echo "✅ Login successful - Token: ${TOKEN:0:20}..., User ID: $USER_ID"

# Step 2: Get current status
echo -e "\n📊 Step 2: Getting current status..."
STATUS_RESPONSE=$(curl -s -X GET "$BASE_URL/clock-in-out/status/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Current Status: $STATUS_RESPONSE"

# Step 3: Get today's sessions
echo -e "\n📅 Step 3: Getting today's sessions..."
TODAY_RESPONSE=$(curl -s -X GET "$BASE_URL/clock-in-out/today/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Today's Sessions: $TODAY_RESPONSE"

# Step 4: Clock In
echo -e "\n🟢 Step 4: Testing clock-in..."
CLOCK_IN_RESPONSE=$(curl -s -X POST "$BASE_URL/clock-in-out/clock-in" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"userId\": $USER_ID,
    \"clientTime\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\"
  }")

echo "Clock-in Response: $CLOCK_IN_RESPONSE"

# Step 5: Get status after clock-in
echo -e "\n📊 Step 5: Getting status after clock-in..."
STATUS_AFTER_IN=$(curl -s -X GET "$BASE_URL/clock-in-out/status/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Status after clock-in: $STATUS_AFTER_IN"

# Wait 3 seconds
echo -e "\n⏳ Waiting 3 seconds..."
sleep 3

# Step 6: Clock Out
echo -e "\n🔴 Step 6: Testing clock-out..."
CLOCK_OUT_RESPONSE=$(curl -s -X POST "$BASE_URL/clock-in-out/clock-out" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"userId\": $USER_ID,
    \"clientTime\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\"
  }")

echo "Clock-out Response: $CLOCK_OUT_RESPONSE"

# Step 7: Get status after clock-out
echo -e "\n📊 Step 7: Getting status after clock-out..."
STATUS_AFTER_OUT=$(curl -s -X GET "$BASE_URL/clock-in-out/status/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Status after clock-out: $STATUS_AFTER_OUT"

# Step 8: Clock In Again (should resume session)
echo -e "\n🔄 Step 8: Testing second clock-in (should resume)..."
CLOCK_IN_AGAIN_RESPONSE=$(curl -s -X POST "$BASE_URL/clock-in-out/clock-in" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"userId\": $USER_ID,
    \"clientTime\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\"
  }")

echo "Second clock-in Response: $CLOCK_IN_AGAIN_RESPONSE"

# Wait 3 seconds
echo -e "\n⏳ Waiting 3 seconds..."
sleep 3

# Step 9: Final Clock Out
echo -e "\n🔴 Step 9: Final clock-out..."
FINAL_CLOCK_OUT_RESPONSE=$(curl -s -X POST "$BASE_URL/clock-in-out/clock-out" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"userId\": $USER_ID,
    \"clientTime\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\"
  }")

echo "Final clock-out Response: $FINAL_CLOCK_OUT_RESPONSE"

# Step 10: Get final status and today's sessions
echo -e "\n📊 Step 10: Final status check..."
FINAL_STATUS=$(curl -s -X GET "$BASE_URL/clock-in-out/status/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Final Status: $FINAL_STATUS"

echo -e "\n📅 Step 11: Final today's sessions check..."
FINAL_TODAY=$(curl -s -X GET "$BASE_URL/clock-in-out/today/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Final Today's Sessions: $FINAL_TODAY"

echo -e "\n🎉 Test suite completed!"
echo "=================================="
echo "Summary:"
echo "- Single daily record approach tested"
echo "- Multiple clock-ins should update the same record"
echo "- Total duration should be calculated correctly"
echo "- Session resumption should work properly"

