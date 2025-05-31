#!/usr/bin/env node

/**
 * Test script to verify EdgeDB connection works in Vercel-like environment
 */

const { createClient } = require('edgedb');

async function testConnection() {
  console.log('🧪 Testing EdgeDB connection for Vercel deployment...\n');
    // Test environment variables
  const dsn = process.env.EDGEDB_DSN || 
              process.env.EDGEDB_URL || 
              process.env.DATABASE_URL ||
              process.env.EDGEDB_CONNECTION_STRING;
  
  const secretKey = process.env.EDGEDB_SECRET_KEY;
  
  if (!dsn) {
    console.error('❌ No EdgeDB DSN found in environment variables');
    console.log('   Expected one of: EDGEDB_DSN, EDGEDB_URL, DATABASE_URL, EDGEDB_CONNECTION_STRING');
    process.exit(1);
  }
  
  console.log('✅ Found EdgeDB DSN:', dsn.replace(/\/\/.*@/, '//***@'));
  
  if (secretKey) {
    console.log('✅ Found EdgeDB Secret Key:', secretKey.substring(0, 10) + '...');
  } else {
    console.log('⚠️  No EdgeDB Secret Key found (might be needed for production)');
  }
  
  try {    // Create client similar to Vercel environment
    let clientConfig;
    
    if (secretKey) {
      // When using secret key, don't use DSN
      console.log('🔑 Using secret key authentication...');
      clientConfig = {
        secretKey: secretKey,
        concurrency: 1,
        tlsSecurity: 'strict'
      };
    } else {
      // Fallback to DSN authentication
      console.log('🔗 Using DSN authentication...');
      clientConfig = {
        dsn: dsn,
        concurrency: 1,
        tlsSecurity: 'strict'
      };
    }
    
    const client = createClient(clientConfig);
    
    console.log('📡 Testing database connection...');
    
    // Test basic query
    const result = await client.query('SELECT 1 + 1 as test');
    console.log('✅ Database connection successful!');
    console.log('   Test query result:', result[0]);
    
    // Test application schema
    console.log('📋 Testing application schema...');
    const players = await client.query(`
      SELECT Player { id, name } LIMIT 1
    `);
    console.log('✅ Player schema accessible');
    
    const tournaments = await client.query(`
      SELECT Tournament { id, name } LIMIT 1
    `);
    console.log('✅ Tournament schema accessible');
    
    await client.close();
    console.log('\n🎉 All tests passed! EdgeDB is ready for Vercel deployment.');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Tip: Check if your EdgeDB DSN includes the correct credentials');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Tip: This might be a network connectivity issue');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Tip: Make sure your EdgeDB instance is running and migrations are applied');
    }
    
    process.exit(1);
  }
}

testConnection().catch(console.error);
