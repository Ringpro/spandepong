#!/usr/bin/env node

/**
 * Test EdgeDB Cloud secret key authentication formats
 */

const { createClient } = require('edgedb');

async function testSecretKeyAuth() {
  console.log('🧪 Testing EdgeDB Cloud secret key authentication formats...\n');
  
  const secretKey = process.env.EDGEDB_SECRET_KEY;
  
  if (!secretKey) {
    console.error('❌ No EDGEDB_SECRET_KEY found');
    process.exit(1);
  }
  
  console.log('✅ Found secret key:', secretKey.substring(0, 10) + '...');
  
  // Test different connection formats
  const testConfigs = [
    {
      name: 'Secret key only',
      config: { secretKey }
    },
    {
      name: 'Secret key with instance',
      config: { 
        secretKey,
        instance: 'Ringpro/spandepong-prod'
      }
    },
    {
      name: 'Secret key with cloud instance format',
      config: { 
        secretKey,
        instance: 'spandepong-prod--ringpro'
      }
    }
  ];
  
  for (const test of testConfigs) {
    console.log(`\n📋 Testing: ${test.name}`);
    console.log('Config:', JSON.stringify(test.config, null, 2));
    
    try {
      const client = createClient(test.config);
      console.log('✅ Client created successfully');
      
      const result = await client.query('SELECT 1 + 1 as test');
      console.log('✅ Query successful:', result[0]);
      
      await client.close();
      console.log('🎉 Test passed!');
      return; // Stop on first success
      
    } catch (error) {
      console.log('❌ Test failed:', error.message);
    }
  }
  
  console.log('\n❌ All authentication formats failed');
  process.exit(1);
}

testSecretKeyAuth().catch(console.error);
