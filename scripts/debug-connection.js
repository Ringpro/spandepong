// Debug EdgeDB connection with better error handling and timeouts
const { createClient } = require('edgedb');

async function debugConnection() {
  console.log('🔍 Debug EdgeDB Connection with Timeouts');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Current time:', new Date().toISOString());
  
  // Check environment variables
  const secretKey = process.env.EDGEDB_SECRET_KEY;
  const instance = process.env.EDGEDB_INSTANCE || 'Ringpro/spandepong-prod';
  
  console.log('Secret key found:', !!secretKey);
  console.log('Secret key length:', secretKey ? secretKey.length : 0);
  console.log('Instance:', instance);
  
  if (!secretKey) {
    console.error('❌ No EDGEDB_SECRET_KEY found in environment');
    return;
  }
  
  let client;
  
  try {
    console.log('🔑 Creating EdgeDB client...');
    console.log('Configuration:');
    console.log('- secretKey: [REDACTED]');
    console.log('- instance:', instance);
    console.log('- concurrency: 1');
    console.log('- tlsSecurity: strict');
    console.log('- waitUntilAvailable: 5000ms');
    console.log('- connectTimeout: 5000ms');
    
    client = createClient({
      secretKey: secretKey,
      instance: instance,
      concurrency: 1,
      tlsSecurity: 'strict',
      waitUntilAvailable: 5000,
      connectTimeout: 5000,
    });
    
    console.log('✅ Client created successfully');
    
    // Wrap the query in a timeout
    console.log('🔍 Testing connection with timeout...');
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000);
    });
    
    const queryPromise = client.query('SELECT 1 + 1');
    
    const result = await Promise.race([queryPromise, timeoutPromise]);
    console.log('✅ Query successful, result:', result);
    
    console.log('🎉 Connection test passed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('timeout')) {
      console.error('The connection is timing out. This suggests:');
      console.error('1. Network connectivity issues');
      console.error('2. Invalid credentials');
      console.error('3. Instance name incorrect');
      console.error('4. EdgeDB Cloud instance not accessible');
    }
    
    console.error('Full error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    });
    
  } finally {
    if (client) {
      try {
        console.log('🔒 Closing client...');
        await client.close();
        console.log('✅ Client closed successfully');
      } catch (closeError) {
        console.error('❌ Error closing client:', closeError.message);
      }
    }
    console.log('🏁 Debug session completed at:', new Date().toISOString());
  }
}

// Set a global timeout for the entire script
const globalTimeout = setTimeout(() => {
  console.error('❌ Global timeout reached - script took too long');
  process.exit(1);
}, 20000);

debugConnection()
  .then(() => {
    clearTimeout(globalTimeout);
    process.exit(0);
  })
  .catch((error) => {
    clearTimeout(globalTimeout);
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
