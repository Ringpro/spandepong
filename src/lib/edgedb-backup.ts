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
    interface ClientConfig {
      dsn?: string;
      secretKey?: string;
      instance?: string;
      concurrency?: number;
      tlsSecurity?: 'strict' | 'insecure' | 'no_host_verification' | 'default';
    }
    
    const clientConfig: ClientConfig = {};
    
    if (edgeDBConfig.secretKey) {
      // For EdgeDB Cloud with secret key authentication
      console.log('🔑 Using EdgeDB Cloud secret key authentication');
      console.log('Secret key prefix:', edgeDBConfig.secretKey.substring(0, 10) + '...');
      console.log('Secret key length:', edgeDBConfig.secretKey.length);
      console.log('Instance:', edgeDBConfig.instance);
      
      // Use secret key authentication (no environment variable conflicts)
      clientConfig.secretKey = edgeDBConfig.secretKey;
      
      // Instance is required for secret key authentication
      if (edgeDBConfig.instance) {
        clientConfig.instance = edgeDBConfig.instance;
      } else {
        console.warn('⚠️ No instance specified for secret key auth, using default');
        clientConfig.instance = 'Ringpro/spandepong-prod';
      }
      
      console.log('Final client config:', {
        hasSecretKey: !!clientConfig.secretKey,
        instance: clientConfig.instance,
        isProduction: edgeDBConfig.isProduction
      });
      
      console.log('✅ Secret key client config prepared successfully');
      
    } else if (edgeDBConfig.dsn) {
      // For DSN-based authentication (local or cloud with credentials in DSN)
      console.log('🔗 Using DSN-based authentication');
      console.log('DSN:', edgeDBConfig.dsn.replace(/\/\/.*@/, '//***@'));
      
      clientConfig.dsn = edgeDBConfig.dsn;
      
    } else {
      console.warn('No valid EdgeDB configuration found');
      return createMockClient();
    }
    
    // Add production-specific configuration
    if (edgeDBConfig.isProduction) {
      clientConfig.concurrency = 1; // Limit connections in serverless
      clientConfig.tlsSecurity = 'strict'; // Ensure secure connections
      console.log('🔧 Added production config: concurrency=1, tlsSecurity=strict');
    }    console.log('🚀 Creating EdgeDB client with config:', Object.keys(clientConfig));
    
    // Create client with only the specified configuration
    // This avoids conflicts between DSN and secret key authentication
    return createClient(clientConfig);
    
  } catch (error) {
    console.warn('❌ EdgeDB client creation failed, using mock client:', error);
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
