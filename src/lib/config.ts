// Environment configuration for EdgeDB connection
// This file handles the different environments: development, build, and production

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Check for EdgeDB connection string - support multiple environment variable names
// Vercel might use different variable names
export const edgeDBDSN = process.env.EDGEDB_DSN || 
                        process.env.EDGEDB_URL || 
                        process.env.DATABASE_URL ||
                        process.env.EDGEDB_CONNECTION_STRING;

// EdgeDB Cloud secret key for production authentication
export const edgeDBSecretKey = process.env.EDGEDB_SECRET_KEY;

export const hasEdgeDBConnection = Boolean(edgeDBDSN);
export const hasEdgeDBSecretKey = Boolean(edgeDBSecretKey);

// During build time, we might not have a database connection
// This is normal and expected behavior
export const shouldConnectToDatabase = hasEdgeDBConnection && !isBuild;

export const edgeDBConfig = {
  dsn: edgeDBDSN,
  secretKey: edgeDBSecretKey,
  shouldConnect: shouldConnectToDatabase,
  isDevelopment,
  isProduction,
  isBuild,
  hasConnection: hasEdgeDBConnection,
  hasSecretKey: hasEdgeDBSecretKey
};

// Log configuration for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('EdgeDB Config:', {
    hasConnection: hasEdgeDBConnection,
    hasSecretKey: hasEdgeDBSecretKey,
    shouldConnect: shouldConnectToDatabase,
    environment: process.env.NODE_ENV,
    phase: process.env.NEXT_PHASE,
    dsnSource: edgeDBDSN ? 'found' : 'missing'
  });
}
