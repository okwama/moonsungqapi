const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
const PHONE_NUMBER = '07061668785';
const PASSWORD = 'password';

// Test user data
const testUser = {
  phoneNumber: PHONE_NUMBER,
  password: PASSWORD
};

// Helper function to make API calls
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...(data && { data })
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ Error in ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

// Test functions
async function testLogin() {
  console.log('🔐 Testing login...');
  const result = await makeRequest('POST', '/auth/login', testUser);
  console.log('✅ Login successful:', {
    userId: result.user.id,
    name: result.user.name,
    token: result.access_token ? 'Token received' : 'No token'
  });
  return result;
}

async function testClockIn(token, userId) {
  console.log('\n🟢 Testing clock-in...');
  const clockInData = {
    userId: userId,
    clientTime: new Date().toISOString()
  };
  const result = await makeRequest('POST', '/clock-in-out/clock-in', clockInData, token);
  console.log('✅ Clock-in result:', result);
  return result;
}

async function testClockOut(token, userId) {
  console.log('\n🔴 Testing clock-out...');
  const clockOutData = {
    userId: userId,
    clientTime: new Date().toISOString()
  };
  const result = await makeRequest('POST', '/clock-in-out/clock-out', clockOutData, token);
  console.log('✅ Clock-out result:', result);
  return result;
}

async function testGetStatus(token, userId) {
  console.log('\n📊 Testing get current status...');
  const result = await makeRequest('GET', `/clock-in-out/status/${userId}`, null, token);
  console.log('✅ Current status:', result);
  return result;
}

async function testGetTodaySessions(token, userId) {
  console.log('\n📅 Testing get today sessions...');
  const result = await makeRequest('GET', `/clock-in-out/today/${userId}`, null, token);
  console.log('✅ Today sessions:', result);
  return result;
}

async function testMultipleClockIns(token, userId) {
  console.log('\n🔄 Testing multiple clock-ins...');
  
  // First clock-in
  console.log('1️⃣ First clock-in...');
  await testClockIn(token, userId);
  
  // Wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Clock-out
  console.log('2️⃣ Clock-out...');
  await testClockOut(token, userId);
  
  // Wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Second clock-in (should resume session)
  console.log('3️⃣ Second clock-in (should resume)...');
  await testClockIn(token, userId);
  
  // Wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Final clock-out
  console.log('4️⃣ Final clock-out...');
  await testClockOut(token, userId);
  
  // Check final status
  console.log('5️⃣ Final status check...');
  await testGetStatus(token, userId);
  await testGetTodaySessions(token, userId);
}

// Main test function
async function runTests() {
  try {
    console.log('🚀 Starting Clock-In/Out Test Suite\n');
    
    // Step 1: Login
    const loginResult = await testLogin();
    const token = loginResult.access_token;
    const userId = loginResult.user.id;
    
    if (!token) {
      console.error('❌ No token received, cannot continue tests');
      return;
    }
    
    // Step 2: Test basic functionality
    await testGetStatus(token, userId);
    await testGetTodaySessions(token, userId);
    
    // Step 3: Test single clock-in/out
    await testClockIn(token, userId);
    await testGetStatus(token, userId);
    await testClockOut(token, userId);
    await testGetStatus(token, userId);
    
    // Step 4: Test multiple clock-ins (single daily record)
    await testMultipleClockIns(token, userId);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
  }
}

// Run the tests
runTests();

