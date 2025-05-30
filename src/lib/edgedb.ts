import { createClient, createHttpClient, type Client } from 'edgedb';
import { edgeDBConfig } from './config';

// Create client with fallback handling for build environments
function createEdgeDBClient(): Client {
  if (typeof window !== 'undefined') {
    // Browser environment
    return createHttpClient();
  }
  
  // Server environment
  if (!edgeDBConfig.shouldConnect) {
    console.log('EdgeDB connection skipped during build phase');
    // Return a mock client that will fail gracefully
    return {
      query: async () => { throw new Error('Database not available during build'); },
      querySingle: async () => { throw new Error('Database not available during build'); },
      queryRequiredSingle: async () => { throw new Error('Database not available during build'); },
      transaction: async () => { throw new Error('Database not available during build'); },
    } as unknown as Client;
  }
  
  try {
    return createClient({
      dsn: edgeDBConfig.dsn,
    });
  } catch (error) {
    console.warn('EdgeDB client creation failed, using mock client for build:', error);
    // Return a mock client that will fail gracefully
    return {
      query: async () => { throw new Error('Database not available during build'); },
      querySingle: async () => { throw new Error('Database not available during build'); },
      queryRequiredSingle: async () => { throw new Error('Database not available during build'); },
      transaction: async () => { throw new Error('Database not available during build'); },
    } as unknown as Client;
  }
}

export const client = createEdgeDBClient();
