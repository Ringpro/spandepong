// Environment configuration for EdgeDB connection
// This file handles the different environments: development, build, and production

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Check if we have a valid EdgeDB connection string
export const hasEdgeDBConnection = Boolean(process.env.EDGEDB_DSN);

// During build time, we might not have a database connection
// This is normal and expected behavior
export const shouldConnectToDatabase = hasEdgeDBConnection && !isBuild;

export const edgeDBConfig = {
  dsn: process.env.EDGEDB_DSN,
  shouldConnect: shouldConnectToDatabase,
  isDevelopment,
  isProduction,
  isBuild
};

// Log configuration for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('EdgeDB Config:', {
    hasConnection: hasEdgeDBConnection,
    shouldConnect: shouldConnectToDatabase,
    environment: process.env.NODE_ENV,
    phase: process.env.NEXT_PHASE
  });
}
