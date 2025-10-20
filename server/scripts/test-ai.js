const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiAPI() {
  console.log('🔍 Testing Gemini API...\n');

  // Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    process.exit(1);
  }
  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test with gemini-pro (most stable)
    console.log('\n📝 Testing with gemini-pro model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent('Hello, respond with just "Hi"');
    const response = result.response;
    const text = response.text();
    
    console.log('✅ Gemini API Response:', text);
    console.log('✅ gemini-pro model works!\n');

    // Test with gemini-flash-latest
    console.log('📝 Testing with gemini-flash-latest model...');
    try {
      const flashModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
      const flashResult = await flashModel.generateContent('Hello');
      const flashText = flashResult.response.text();
      console.log('✅ gemini-flash-latest works!');
      console.log('Response:', flashText);
    } catch (flashError) {
      console.warn('⚠️  gemini-flash-latest failed:', flashError.message);
      console.log('💡 Recommendation: Use gemini-pro instead');
    }

    console.log('\n✅ All tests passed!');
    console.log('\n📋 Summary:');
    console.log('- Gemini API Key: Valid ✅');
    console.log('- gemini-pro: Working ✅');
    console.log('- Connection: OK ✅');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n📋 Error Details:');
    console.error('- Status:', error.status);
    console.error('- Message:', error.message);
    
    if (error.status === 404) {
      console.log('\n💡 Solution: Model not found. Update gemini.service.ts to use "gemini-pro"');
    } else if (error.status === 403) {
      console.log('\n💡 Solution: Invalid API key. Check GEMINI_API_KEY in .env file');
    }
    
    process.exit(1);
  }
}

testGeminiAPI();
