# EdgeDB Cloud Deployment Guide

## Step-by-Step Instructions for Deploying Spandepong to Production

### 1. Create EdgeDB Cloud Instance

1. **Visit EdgeDB Cloud Console**: Go to https://cloud.edgedb.com/
2. **Login**: Use your existing account (you're already logged in via CLI)
3. **Create New Instance**:
   - Click "Create Instance"
   - Name: `spandepong-prod`
   - Region: Choose closest to your users (e.g., `us-east-1` for US East Coast)
   - Version: `5.4` (to match your local development)
   - Click "Create"

4. **Get Connection String**: After creation, copy the connection string. It will look like:
   ```
   edgedb://your-instance.your-org.edgedb.cloud/edgedb?tls_security=insecure
   ```

### 2. Deploy Schema to Cloud Instance

Once you have the connection string, run the deployment script:

**Option A - Using PowerShell (Recommended for Windows):**
```powershell
.\scripts\deploy-to-cloud.ps1 "edgedb://your-instance.your-org.edgedb.cloud/edgedb?tls_security=insecure"
```

**Option B - Using Node.js:**
```bash
node scripts/deploy-to-cloud.js "edgedb://your-instance.your-org.edgedb.cloud/edgedb?tls_security=insecure"
```

### 3. Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**: Visit https://vercel.com/dashboard
2. **Select Your Project**: Find your Spandepong project
3. **Navigate to Settings**: Click the "Settings" tab
4. **Environment Variables**: Click "Environment Variables" in the sidebar
5. **Add Variable**:
   - **Name**: `EDGEDB_DSN`
   - **Value**: Your EdgeDB Cloud connection string
   - **Environments**: Select "Production" (and "Preview" if desired)
   - Click "Save"

### 4. Redeploy Application

After adding the environment variable:

1. **Go to Deployments Tab** in your Vercel project
2. **Redeploy**: Click the "..." menu on your latest deployment and select "Redeploy"
3. **Or**: Push a new commit to trigger automatic deployment

### 5. Verify Deployment

1. **Visit your production URL** (provided by Vercel)
2. **Test basic functionality**:
   - Create a new tournament
   - Add players
   - Start a tournament
   - Verify data persists

### Troubleshooting

**Common Issues:**

1. **Connection Errors**: Ensure the EDGEDB_DSN environment variable is exactly as provided by EdgeDB Cloud
2. **Schema Errors**: Make sure all migrations were applied successfully to the cloud instance
3. **Vercel Build Errors**: Check the Vercel deployment logs for specific error messages

**Useful Commands:**

- Check EdgeDB connection: `edgedb -d "your-cloud-dsn" query "SELECT 1;"`
- List cloud instances: Visit https://cloud.edgedb.com/
- View Vercel logs: Check the "Deployments" tab in your Vercel dashboard

### Security Notes

- The EdgeDB Cloud connection string contains authentication credentials
- Never commit the production connection string to your git repository
- Only store it in Vercel's environment variables
- Consider enabling additional security features in EdgeDB Cloud console
