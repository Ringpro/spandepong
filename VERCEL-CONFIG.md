# Vercel Environment Configuration Guide

## Overview

This guide explains how to configure your Vercel deployment to have access to EdgeDB during both build time and runtime, allowing for static page generation with real data.

## Environment Variable Configuration

### 1. Add EdgeDB Connection to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select Your Project**: Find your Spandepong project
3. **Navigate to Settings**: Click the "Settings" tab
4. **Environment Variables**: Click "Environment Variables" in the sidebar
5. **Add Variable**:
   - **Name**: `EDGEDB_DSN`
   - **Value**: Your EdgeDB Cloud connection string
   - **Environments**: Select ALL environments:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development (for build-time access)

### 2. EdgeDB Cloud Connection String Format

Your connection string should look like:
```
edgedb://your-instance.your-org.edgedb.cloud/edgedb?tls_security=insecure
```

## Build-Time vs Runtime Behavior

### With Database Connection (Recommended)
- **Build Time**: Pages are statically generated with real data from EdgeDB
- **Runtime**: Fast static pages with pre-rendered tournament data
- **Performance**: Optimal - static generation with CDN distribution

### Without Database Connection (Fallback)
- **Build Time**: Pages are statically generated with empty data
- **Runtime**: Pages dynamically fetch data on each request
- **Performance**: Good - dynamic rendering with server-side data fetching

## Vercel Configuration Steps

### Option 1: Build with Database Access (Recommended)

This is the optimal approach mentioned in your message. It allows Vercel to connect to EdgeDB during build time for static generation.

1. **Create EdgeDB Cloud Instance First**:
   ```bash
   # Visit https://cloud.edgedb.com/
   # Create instance: spandepong-prod
   # Copy connection string
   ```

2. **Deploy Schema to Cloud**:
   ```powershell
   .\scripts\deploy-to-cloud.ps1 "YOUR_CONNECTION_STRING"
   ```

3. **Add Environment Variable to Vercel**:
   ```
   Name: EDGEDB_DSN
   Value: edgedb://your-instance.your-org.edgedb.cloud/edgedb?tls_security=insecure
   Environments: Production, Preview, Development
   ```

4. **Redeploy Application**:
   - The build will now have database access
   - Pages will be statically generated with real data
   - Optimal performance with pre-rendered content

### Option 2: Build without Database (Current Fallback)

This is what we've implemented as a fallback when no database is available during build.

1. **Deploy Application**:
   - Build succeeds without database connection
   - Pages are generated with empty data

2. **Add Database Later**:
   - Add `EDGEDB_DSN` environment variable
   - Application works dynamically at runtime

## Middleware Alternative (Advanced)

As you mentioned, we could also use Vercel Edge Config or middleware to handle database access:

```javascript
// middleware.js
import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { matcher: '/api/tournaments' };

export async function middleware() {
  const edgedbDsn = await get('edgedb_dsn');
  // Handle database connection through middleware
  return NextResponse.next();
}
```

But for our use case, setting the environment variable is simpler and more straightforward.

## Verification

After configuration, verify your setup:

```powershell
# Test connection
npm run edgedb:verify

# Check build locally
npm run build

# Deploy and test
vercel --prod
```

## Troubleshooting

### Build Fails with Database Errors
- Ensure `EDGEDB_DSN` is set in ALL environments (including Development)
- Verify EdgeDB Cloud instance is running and accessible
- Check connection string format

### Pages Show Empty Data
- Verify environment variable is correctly set
- Check Vercel deployment logs for database connection errors
- Ensure EdgeDB schema is deployed to cloud instance

### Performance Issues
- With database access during build: Pages should be static (`○` in build output)
- Without database access: Pages will be dynamic (`ƒ` in build output)

## Next Steps

1. **Set up EdgeDB Cloud instance**
2. **Add environment variable to ALL Vercel environments**
3. **Redeploy and verify static generation**
4. **Monitor performance and data freshness**
