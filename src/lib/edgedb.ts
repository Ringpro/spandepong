import { createClient, createHttpClient, type Client } from 'edgedb';
import { edgeDBConfig } from './config';

// Type definitions for EdgeDB client configuration
interface EdgeDBClientConfig {
  secretKey?: string;
  instance?: string;
  dsn?: string;
  concurrency?: number;
  tlsSecurity?: 'strict' | 'insecure' | 'default';
  waitUntilAvailable?: number;
  connectTimeout?: number;
}

// Create client with fallback handling for build environments and Vercel
function createEdgeDBClient(): Client {
  if (typeof window !== 'undefined') {
    // Browser environment - use HTTP client
    if (edgeDBConfig.dsn) {
      return createHttpClient({ dsn: edgeDBConfig.dsn });
    }
    return createHttpClient();
  }
    // Server environment
  if (!edgeDBConfig.shouldConnect) {
    console.log('EdgeDB connection skipped during build phase');
    return createMockClient();
  }

  if (!edgeDBConfig.secretKey && !edgeDBConfig.dsn) {
    console.warn('No EdgeDB connection configuration found (no secret key or DSN), using mock client');
    return createMockClient();
  }
    try {
    // Priority: Secret key authentication over DSN to avoid conflicts
    if (edgeDBConfig.secretKey) {
      console.log('🔑 Using EdgeDB Cloud secret key authentication');
      console.log('Secret key prefix:', edgeDBConfig.secretKey.substring(0, 10) + '...');
      console.log('Instance:', edgeDBConfig.instance);
        // Create configuration with ONLY secret key auth (avoids env var conflicts)
      const config: EdgeDBClientConfig = {
        secretKey: edgeDBConfig.secretKey,
        instance: edgeDBConfig.instance || 'Ringpro/spandepong-prod'
      };
      
      // Add production-specific settings for Vercel and EdgeDB Cloud
      if (edgeDBConfig.isProduction || process.env.VERCEL) {
        Object.assign(config, {
          concurrency: 1,
          tlsSecurity: 'strict' as const,
          // Additional Vercel-specific optimizations
          waitUntilAvailable: 30000, // 30 second timeout
          connectTimeout: 10000,     // 10 second connect timeout
        });
        console.log('🔧 Added production/Vercel config: concurrency=1, tlsSecurity=strict, timeouts configured');
      }
      
      console.log('🚀 Creating EdgeDB client with secret key');
      const client = createClient(config);
      
      // Test the connection immediately to verify it works
      if (edgeDBConfig.isProduction || process.env.VERCEL) {
        console.log('🧪 Testing EdgeDB connection...');
        // Don't await this in production to avoid blocking, but log results
        client.query('SELECT 1')
          .then(() => console.log('✅ EdgeDB connection test successful'))
          .catch((err) => console.error('❌ EdgeDB connection test failed:', err.message));
      }
      
      return client;
      
    } else if (edgeDBConfig.dsn) {
      console.log('🔗 Using DSN-based authentication');
      console.log('DSN prefix:', edgeDBConfig.dsn.substring(0, 20) + '...');
        // Create configuration with ONLY DSN auth
      const config: EdgeDBClientConfig = {
        dsn: edgeDBConfig.dsn
      };
      
      // Add production-specific settings  
      if (edgeDBConfig.isProduction || process.env.VERCEL) {
        Object.assign(config, {
          concurrency: 1,
          tlsSecurity: 'strict' as const,
          waitUntilAvailable: 30000,
          connectTimeout: 10000,
        });
        console.log('🔧 Added production/Vercel config: concurrency=1, tlsSecurity=strict, timeouts configured');
      }
      
      console.log('🚀 Creating EdgeDB client with DSN');
      return createClient(config);
      
    } else {
      console.warn('No valid EdgeDB configuration found');
      return createMockClient();
    }
    
  } catch (error) {
    console.warn('❌ EdgeDB client creation failed:', error);
    console.warn('Falling back to mock client');
    return createMockClient();
  }
}

// Mock client for build time and error scenarios
function createMockClient(): Client {
  const mockError = new Error('Database not available');
  return {
    query: async () => { throw mockError; },
    querySingle: async () => { throw mockError; },
    queryRequiredSingle: async () => { throw mockError; },
    transaction: async () => { throw mockError; },
    close: async () => {},
  } as unknown as Client;
}

export const client = createEdgeDBClient();