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

  if (!edgeDBConfig.dsn) {
    console.warn('No EdgeDB DSN found, using mock client');
    return createMockClient();
  }
  try {    interface ClientConfig {
      dsn?: string;
      secretKey?: string;
      concurrency?: number;
      tlsSecurity?: 'strict' | 'insecure' | 'no_host_verification' | 'default';
    }
    
    const clientConfig: ClientConfig = {};
    
    if (edgeDBConfig.secretKey) {
      // For EdgeDB Cloud with secret key authentication
      console.log('Using EdgeDB Cloud secret key authentication');
      clientConfig.secretKey = edgeDBConfig.secretKey;
    } else if (edgeDBConfig.dsn) {
      // For DSN-based authentication (local or cloud with credentials in DSN)
      console.log('Using DSN-based authentication');
      clientConfig.dsn = edgeDBConfig.dsn;
    } else {
      console.warn('No valid EdgeDB configuration found');
      return createMockClient();
    }
    
    // Add production-specific configuration
    if (edgeDBConfig.isProduction) {
      clientConfig.concurrency = 1; // Limit connections in serverless
      clientConfig.tlsSecurity = 'strict'; // Ensure secure connections
    }
    
    return createClient(clientConfig);
  } catch (error) {
    console.warn('EdgeDB client creation failed, using mock client:', error);
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
