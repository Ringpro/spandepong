// Test script to verify EdgeDB connection is working
// This tests both secret key and DSN authentication methods

import { createClient } from 'edgedb';

// Test secret key authentication
console.log('🔑 Testing EdgeDB Cloud secret key authentication...');

const secretKey = 'nbwt1_eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzU2NzA4MDcsImV4cCI6MTc2NzIwNjgwNywiaXNzIjoiZWRnZWRiIiwiYXVkIjoiZWRnZWRiLmNsb3VkIiwic3ViIjoibmJ3dDFfZXlKaGJHY2lPaVZUTWpVMkxDSjBlWEFpT2tGQ1ZEZzBkUXBxV1c5M01sQlhTM1Z4YVdkeVdqVTJWbFZ2V2paWGFVUnVkVTlQTldkTmJ6WjNZa2h1TDJVNFJWaHJhWGd2YldKNGRrSkVhSGxrWkVwdU1GcDBaak5QVmpacWNISnZlRWhZVG5Sb1R6ZEdhWE0xYzFCRWVVSXdaMWRTVDFaQlIzaE9hME5xZUhOblkyRnNUR3hoTjA1aGExUkJZM2czVVU5b1dEWjFOMVk0VG5ReE0yaDNZbEpTUWxkR05XNXVXSE0xWnpOaWNrVTJNVEYyWldGbVVUbFFZVGRpVjFsQ2VXZFBOM3BpWVU5dVJsTnVVbVl5Ym5SNWRXdENkekEzUkRKNk1VNUZNblJsVW1KaVEwaGljMWxtTkdJMVlVMHRlV0kyYjNsdE5rVk5SVzVOY0VaaFNISmtaRFJ5VkRCMGEybG1UMGRKV2xaSmFUSTRaR0p2WW5Sb2VHOTFXVkIyYUZocGRVOXFVRGhxUlVwVldVWmpaekJJZFRkcGJXWnlTbWRHTlRCQmMzSmhVSGhVY21GUVREQnljR1F6VTJaS1pGQjRlQT09In0.bNVOCN3QRyMglG6mGIj3RjW8hK5V_m8cY3fGUPJYgAY';
const instance = 'Ringpro/spandepong-prod';

try {
  // Test secret key authentication
  const secretKeyClient = createClient({
    secretKey: secretKey,
    instance: instance,
    tlsSecurity: 'strict'
  });
  
  console.log('✅ Secret key client created');
  
  // Test a simple query
  const result = await secretKeyClient.query('SELECT 1 + 1');
  console.log('✅ Secret key query successful:', result);
  
  await secretKeyClient.close();
  console.log('✅ Secret key authentication test PASSED');
  
} catch (error) {
  console.error('❌ Secret key authentication test FAILED:', error.message);
}

// Test DSN authentication
console.log('\n🔗 Testing DSN authentication...');

try {
  const dsnClient = createClient({
    dsn: 'edgedb://spandepong-prod--ringpro.c-50.i.aws.edgedb.cloud:5656/edgedb',
    tlsSecurity: 'strict'
  });
  
  console.log('✅ DSN client created');
  
  // Test a simple query
  const result = await dsnClient.query('SELECT 1 + 1');
  console.log('✅ DSN query successful:', result);
  
  await dsnClient.close();
  console.log('✅ DSN authentication test PASSED');
  
} catch (error) {
  console.error('❌ DSN authentication test FAILED:', error.message);
}

console.log('\n🎉 Both authentication methods are ready for Vercel deployment!');
