// Test the fixed EdgeDB configuration
const { createClient } = require('edgedb');

async function testFixedConfiguration() {
  console.log('🧪 Testing Fixed EdgeDB Configuration');
  console.log('Environment:', process.env.NODE_ENV);
  
  // Check environment variables
  const secretKey = process.env.EDGEDB_SECRET_KEY;
  const instance = process.env.EDGEDB_INSTANCE || 'Ringpro/spandepong-prod';
  
  console.log('Secret key found:', !!secretKey);
  console.log('Instance:', instance);
  
  if (!secretKey) {
    console.error('❌ No EDGEDB_SECRET_KEY found in environment');
    process.exit(1);
  }
  
  try {
    console.log('🔑 Creating EdgeDB client with secret key authentication...');
    const client = createClient({
      secretKey: secretKey,
      instance: instance,
      concurrency: 1,
      tlsSecurity: 'strict',
      waitUntilAvailable: 30000,
      connectTimeout: 10000,
    });
    
    console.log('✅ Client created successfully');
    
    console.log('🔍 Testing connection with simple query...');
    const result = await client.query('SELECT 1 + 1');
    console.log('✅ Query successful, result:', result);
    
    await client.close();
    console.log('✅ Connection closed successfully');
    
    console.log('🎉 All tests passed! EdgeDB configuration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testFixedConfiguration();
