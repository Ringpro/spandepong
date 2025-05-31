// filepath: c:\Code\Spandepong\src\lib\edgedb.ts
import { createClient, createHttpClient, type Client } from 'edgedb';
import { edgeDBConfig } from './config';

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

  if (!edgeDBConfig.dsn && !edgeDBConfig.secretKey) {
    console.warn('No EdgeDB connection configuration found, using mock client');
    return createMockClient();
  }
  
  try {
    // Priority: Secret key authentication over DSN to avoid conflicts
    if (edgeDBConfig.secretKey) {
      console.log('🔑 Using EdgeDB Cloud secret key authentication');
      console.log('Secret key prefix:', edgeDBConfig.secretKey.substring(0, 10) + '...');
      console.log('Instance:', edgeDBConfig.instance);
      
      // Create configuration with ONLY secret key auth (avoids env var conflicts)
      const config = {
        secretKey: edgeDBConfig.secretKey,
        instance: edgeDBConfig.instance || 'Ringpro/spandepong-prod'
      };
      
      // Add production-specific settings
      if (edgeDBConfig.isProduction) {
        Object.assign(config, {
          concurrency: 1,
          tlsSecurity: 'strict' as const
        });
        console.log('🔧 Added production config: concurrency=1, tlsSecurity=strict');
      }
      
      console.log('🚀 Creating EdgeDB client with secret key');
      return createClient(config);
      
    } else if (edgeDBConfig.dsn) {
      console.log('🔗 Using DSN-based authentication');
      console.log('DSN prefix:', edgeDBConfig.dsn.substring(0, 20) + '...');
      
      // Create configuration with ONLY DSN auth
      const config = {
        dsn: edgeDBConfig.dsn
      };
      
      // Add production-specific settings  
      if (edgeDBConfig.isProduction) {
        Object.assign(config, {
          concurrency: 1,
          tlsSecurity: 'strict' as const
        });
        console.log('🔧 Added production config: concurrency=1, tlsSecurity=strict');
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
