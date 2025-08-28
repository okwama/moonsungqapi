const fetch = require('node-fetch');

const BASE_URL = 'http://192.168.100.2:3000/api'; // Updated to match server IP with /api prefix

async function testAutoClockout() {
  console.log('🧪 Testing Auto Clockout Functionality');
  console.log('=====================================');

  try {
    // Test 1: Get auto clockout configuration
    console.log('\n1️⃣ Testing auto clockout configuration...');
    const configResponse = await fetch(`${BASE_URL}/auto-clockout/config`);
    const configData = await configResponse.json();
    
    if (configData.success) {
      console.log('✅ Configuration retrieved successfully');
      console.log('📋 Config:', JSON.stringify(configData.config, null, 2));
    } else {
      console.log('❌ Failed to get configuration');
    }

    // Test 2: Get auto clockout statistics
    console.log('\n2️⃣ Testing auto clockout statistics...');
    const statsResponse = await fetch(`${BASE_URL}/auto-clockout/stats`);
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      console.log('✅ Statistics retrieved successfully');
      console.log('📊 Stats:', JSON.stringify(statsData.data, null, 2));
    } else {
      console.log('❌ Failed to get statistics');
    }

    // Test 3: Manual trigger (for testing)
    console.log('\n3️⃣ Testing manual auto clockout trigger...');
    const triggerResponse = await fetch(`${BASE_URL}/auto-clockout/trigger`, {
      method: 'POST',
    });
    const triggerData = await triggerResponse.json();
    
    if (triggerData.success) {
      console.log('✅ Manual trigger executed successfully');
      console.log('🕙 Trigger result:', triggerData.message);
    } else {
      console.log('❌ Failed to trigger auto clockout');
      console.log('Error:', triggerData.error);
    }

    console.log('\n🎯 All tests completed!');
    console.log('\n📝 Summary:');
    console.log('- Auto clockout runs daily at 10 PM (22:00)');
    console.log('- Records clock-out time as 8 PM (20:00)');
    console.log('- Timezone: Africa/Nairobi');
    console.log('- Manual trigger available for testing');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running on port 3000');
    console.log('2. Check if the auto-clockout module is properly loaded');
    console.log('3. Verify the database connection');
  }
}

// Run the test
testAutoClockout();
