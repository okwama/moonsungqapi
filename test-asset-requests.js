const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// Test data
const testAssetRequest = {
  salesRepId: 2, // Replace with actual user ID
  notes: 'Test asset request for display materials',
  items: [
    {
      assetName: 'Display Stand',
      assetType: 'Display Stand',
      quantity: 2,
      notes: 'For product showcase'
    },
    {
      assetName: 'Product Banner',
      assetType: 'Banner',
      quantity: 1,
      notes: 'For store entrance'
    }
  ]
};

async function login() {
  try {
    console.log('🔐 Logging in...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      phoneNumber: '0706166875', // Replace with actual test user
      password: 'password123' // Replace with actual password
    });
    
    authToken = response.data.access_token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

async function testAssetTypes() {
  try {
    console.log('\n📋 Testing Asset Types...');
    const response = await axios.get(`${BASE_URL}/asset-types`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Asset types retrieved:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Asset types test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testCreateAssetRequest() {
  try {
    console.log('\n📝 Testing Create Asset Request...');
    const response = await axios.post(`${BASE_URL}/asset-requests`, testAssetRequest, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Asset request created:', response.data);
    return response.data.id;
  } catch (error) {
    console.error('❌ Create asset request failed:', error.response?.data || error.message);
    return null;
  }
}

async function testGetAssetRequests() {
  try {
    console.log('\n📋 Testing Get Asset Requests...');
    const response = await axios.get(`${BASE_URL}/asset-requests`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Asset requests retrieved:', response.data.length, 'requests');
    return true;
  } catch (error) {
    console.error('❌ Get asset requests failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetMyRequests() {
  try {
    console.log('\n👤 Testing Get My Requests...');
    const response = await axios.get(`${BASE_URL}/asset-requests/my-requests`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ My requests retrieved:', response.data.length, 'requests');
    return true;
  } catch (error) {
    console.error('❌ Get my requests failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetAssetRequestById(requestId) {
  try {
    console.log('\n🔍 Testing Get Asset Request by ID...');
    const response = await axios.get(`${BASE_URL}/asset-requests/${requestId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Asset request retrieved:', response.data.requestNumber);
    return true;
  } catch (error) {
    console.error('❌ Get asset request by ID failed:', error.response?.data || error.message);
    return false;
  }
}

async function testUpdateStatus(requestId) {
  try {
    console.log('\n✅ Testing Update Status (Approve)...');
    const response = await axios.patch(`${BASE_URL}/asset-requests/${requestId}/status`, {
      status: 'approved',
      notes: 'Approved for assignment'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Status updated:', response.data.status);
    return true;
  } catch (error) {
    console.error('❌ Update status failed:', error.response?.data || error.message);
    return false;
  }
}

async function testAssignAssets(requestId) {
  try {
    console.log('\n📦 Testing Assign Assets...');
    const response = await axios.post(`${BASE_URL}/asset-requests/${requestId}/assign`, {
      assignments: [
        {
          itemId: 1, // This should be the actual item ID from the created request
          assignedQuantity: 2
        },
        {
          itemId: 2, // This should be the actual item ID from the created request
          assignedQuantity: 1
        }
      ]
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Assets assigned:', response.data.status);
    return true;
  } catch (error) {
    console.error('❌ Assign assets failed:', error.response?.data || error.message);
    return false;
  }
}

async function testDeleteAssetRequest(requestId) {
  try {
    console.log('\n🗑️ Testing Delete Asset Request...');
    await axios.delete(`${BASE_URL}/asset-requests/${requestId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Asset request deleted');
    return true;
  } catch (error) {
    console.error('❌ Delete asset request failed:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Asset Requests API Tests...\n');
  
  // Login first
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  // Test asset types
  await testAssetTypes();
  
  // Test create asset request
  const requestId = await testCreateAssetRequest();
  if (!requestId) {
    console.log('❌ Cannot proceed without a created request');
    return;
  }
  
  // Test get all requests
  await testGetAssetRequests();
  
  // Test get my requests
  await testGetMyRequests();
  
  // Test get by ID
  await testGetAssetRequestById(requestId);
  
  // Test update status (approve)
  await testUpdateStatus(requestId);
  
  // Note: Assignment and return tests would need actual item IDs
  // These are commented out as they require the actual item IDs from the created request
  /*
  // Test assign assets
  await testAssignAssets(requestId);
  
  // Test return assets
  await testReturnAssets(requestId);
  */
  
  // Test delete (only works for pending requests)
  // await testDeleteAssetRequest(requestId);
  
  console.log('\n🎉 Asset Requests API Tests Completed!');
}

// Run the tests
runTests().catch(console.error);
