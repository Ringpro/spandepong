import { createClient, createHttpClient } from 'edgedb';

// Use createClient for server-side operations
export const client = typeof window === 'undefined' 
  ? createClient({
      // EdgeDB will automatically detect project configuration from edgedb.toml
      // and connect to the linked instance
    })
  : createHttpClient({
      // For browser usage (not typically needed for this app)
    });
