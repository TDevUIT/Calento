#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Test CORS configuration
async function testCors() {
  console.log('🧪 Testing CORS Configuration...\n');

  // Test 1: Check debug endpoint
  console.log('1️⃣ Checking server CORS configuration...');
  try {
    const response = await fetch('https://api.calento.space/api/v1/debug/cors');
    const config = await response.json();
    console.log('✅ Server CORS Config:', JSON.stringify(config, null, 2));
  } catch (error) {
    console.log('❌ Failed to get CORS config:', error.message);
  }

  console.log('\n2️⃣ Testing preflight request from localhost:3000...');
  
  // Test 2: Preflight request
  const options = {
    hostname: 'api.calento.space',
    port: 443,
    path: '/api/v1/auth/me',
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:3000',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type',
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Response Headers:');
    Object.keys(res.headers).forEach(key => {
      if (key.toLowerCase().includes('access-control')) {
        console.log(`  ${key}: ${res.headers[key]}`);
      }
    });

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 204 || res.statusCode === 200) {
        console.log('✅ CORS preflight successful!');
      } else {
        console.log('❌ CORS preflight failed!');
        console.log('Response body:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request failed:', error.message);
  });

  req.end();
}

// Run if this is the main module
if (require.main === module) {
  testCors();
}

module.exports = { testCors };
