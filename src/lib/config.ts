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

// EdgeDB instance name for secret key authentication
export const edgeDBInstance = process.env.EDGEDB_INSTANCE || 'Ringpro/spandepong-prod';

export const hasEdgeDBConnection = Boolean(edgeDBDSN);
export const hasEdgeDBSecretKey = Boolean(edgeDBSecretKey);

// During build time, we might not have a database connection
// This is normal and expected behavior
export const shouldConnectToDatabase = hasEdgeDBConnection && !isBuild;

export const edgeDBConfig = {
  dsn: edgeDBDSN,
  secretKey: edgeDBSecretKey,
  instance: edgeDBInstance,
  shouldConnect: shouldConnectToDatabase,
  isDevelopment,
  isProduction,
  isBuild,
  hasConnection: hasEdgeDBConnection,
  hasSecretKey: hasEdgeDBSecretKey
};

// Log configuration for debugging (in development or when debugging)
if (process.env.NODE_ENV === 'development' || process.env.DEBUG_EDGEDB || process.env.VERCEL) {
  console.log('🔧 EdgeDB Config Debug:', {
    hasConnection: hasEdgeDBConnection,
    hasSecretKey: hasEdgeDBSecretKey,
    shouldConnect: shouldConnectToDatabase,
    environment: process.env.NODE_ENV,
    phase: process.env.NEXT_PHASE,
    isVercel: !!process.env.VERCEL,
    dsnSource: edgeDBDSN ? 'found' : 'missing',
    secretKeySource: edgeDBSecretKey ? 'found' : 'missing',
    // Show first few characters of credentials for debugging (never show full values)
    dsnPrefix: edgeDBDSN ? edgeDBDSN.substring(0, 20) + '...' : 'none',
    secretKeyPrefix: edgeDBSecretKey ? edgeDBSecretKey.substring(0, 10) + '...' : 'none',
    instance: edgeDBInstance
  });
  
  // List all environment variables that might be EdgeDB related
  const edgedbEnvVars = Object.keys(process.env).filter(key => 
    key.includes('EDGEDB') || key.includes('DATABASE')
  );
  console.log('🌍 EdgeDB-related environment variables:', edgedbEnvVars);
}
    secretKeyPrefix: edgeDBSecretKey ? edgeDBSecretKey.substring(0, 10) + '...' : 'none'
  });
}
