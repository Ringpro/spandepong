import { createClient, createHttpClient, type Client } from 'edgedb';

// Create client with fallback handling for build environments
function createEdgeDBClient(): Client {
  if (typeof window !== 'undefined') {
    // Browser environment
    return createHttpClient();
  }
  
  // Server environment
  try {
    return createClient({
      dsn: process.env.EDGEDB_DSN,
    });
  } catch (error) {
    console.warn('EdgeDB client creation failed, using mock client for build:', error);
    // Return a mock client that will fail gracefully
    return {
      query: async () => { throw new Error('Database not available during build'); },
      querySingle: async () => { throw new Error('Database not available during build'); },
      queryRequiredSingle: async () => { throw new Error('Database not available during build'); },
    } as unknown as Client;
  }
}

export const client = createEdgeDBClient();
