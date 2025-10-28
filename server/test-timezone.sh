#!/bin/bash

# Test Timezone Implementation for Booking Slots
# Usage: ./test-timezone.sh

echo "🧪 Testing Timezone Implementation..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8000"
SLUG="30-min-meeting"
TODAY=$(date +%Y-%m-%d)

echo "${BLUE}📅 Test Date: ${TODAY}${NC}"
echo ""

# Test 1: Bangkok Timezone (UTC+7)
echo "${YELLOW}Test 1: Asia/Bangkok (UTC+7)${NC}"
curl -s "${BASE_URL}/api/bookings/public/${SLUG}/slots?start_date=${TODAY}&end_date=${TODAY}&timezone=Asia/Bangkok" \
  | jq -r '.data[0:3] | .[] | "\(.start_time) - \(.end_time) | Available: \(.available)"' \
  || echo "❌ Failed"
echo ""

# Test 2: New York Timezone (UTC-5)
echo "${YELLOW}Test 2: America/New_York (UTC-5)${NC}"
curl -s "${BASE_URL}/api/bookings/public/${SLUG}/slots?start_date=${TODAY}&end_date=${TODAY}&timezone=America/New_York" \
  | jq -r '.data[0:3] | .[] | "\(.start_time) - \(.end_time) | Available: \(.available)"' \
  || echo "❌ Failed"
echo ""

# Test 3: London Timezone (UTC+0)
echo "${YELLOW}Test 3: Europe/London (UTC+0)${NC}"
curl -s "${BASE_URL}/api/bookings/public/${SLUG}/slots?start_date=${TODAY}&end_date=${TODAY}&timezone=Europe/London" \
  | jq -r '.data[0:3] | .[] | "\(.start_time) - \(.end_time) | Available: \(.available)"' \
  || echo "❌ Failed"
echo ""

# Test 4: Tokyo Timezone (UTC+9)
echo "${YELLOW}Test 4: Asia/Tokyo (UTC+9)${NC}"
curl -s "${BASE_URL}/api/bookings/public/${SLUG}/slots?start_date=${TODAY}&end_date=${TODAY}&timezone=Asia/Tokyo" \
  | jq -r '.data[0:3] | .[] | "\(.start_time) - \(.end_time) | Available: \(.available)"' \
  || echo "❌ Failed"
echo ""

# Test 5: No timezone (should default to UTC)
echo "${YELLOW}Test 5: No timezone parameter (default UTC)${NC}"
curl -s "${BASE_URL}/api/bookings/public/${SLUG}/slots?start_date=${TODAY}&end_date=${TODAY}" \
  | jq -r '.data[0:3] | .[] | "\(.start_time) - \(.end_time) | Available: \(.available)"' \
  || echo "❌ Failed"
echo ""

echo "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "💡 Check server logs for timezone conversion details"
echo "   Look for lines: 'Generating slots for user ... in timezone: ...'"
