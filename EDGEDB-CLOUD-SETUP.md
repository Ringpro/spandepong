# Manual EdgeDB Cloud Setup Guide

Since the EdgeDB CLI doesn't have cloud instance management commands yet, you'll need to create the cloud instance through the web interface.

## Step 1: Create Cloud Instance via Web Dashboard

1. Go to https://cloud.edgedb.com/
2. Log in with your EdgeDB Cloud account (jacob@ringbo.dk)
3. Click "Create Instance"
4. Choose these settings:
   - Name: `spandepong-prod`
   - Region: Choose closest to your users (probably US East or Europe)
   - Plan: Start with the free tier
5. Click "Create Instance"

## Step 2: Get Connection String

After the instance is created:
1. Click on your instance name
2. Go to "Connection" tab
3. Copy the DSN (connection string)
   - It will look like: `edgedb://username:password@hostname:port/database`

## Step 3: Apply Schema to Cloud Instance

Once you have the connection string:

1. Set environment variable temporarily:
   ```powershell
   $env:EDGEDB_DSN = "your-cloud-connection-string-here"
   ```

2. Apply migrations:
   ```powershell
   edgedb migrate
   ```

## Step 4: Add to Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your Spandepong project
3. Go to Settings > Environment Variables
4. Add a new variable:
   - Name: `EDGEDB_DSN`
   - Value: `your-cloud-connection-string`
   - Apply to: Production, Preview, and Development

## Step 5: Redeploy

1. Go to Deployments tab in Vercel
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger deployment

## Test Script

After setup, run this to verify the connection:
```powershell
node scripts/verify-cloud-connection.js
```

## Alternative: Use EdgeDB Cloud UI

You can also manage your database through the web interface at:
https://cloud.edgedb.com/

The UI allows you to:
- Browse your schema
- Run queries
- View data
- Monitor performance
