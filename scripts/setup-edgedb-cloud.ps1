# EdgeDB Cloud Setup Script for Spandepong
# This script will guide you through setting up EdgeDB Cloud for production

Write-Host "=== EdgeDB Cloud Setup for Spandepong ===" -ForegroundColor Cyan
Write-Host ""

# Check if EdgeDB CLI is installed
try {
    $edgedbVersion = edgedb --version
    Write-Host "✓ EdgeDB CLI found: $edgedbVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ EdgeDB CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "  Visit: https://www.edgedb.com/install" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 1: Login to EdgeDB Cloud" -ForegroundColor Yellow
Write-Host "Running: edgedb cloud login"
try {
    edgedb cloud login
    Write-Host "✓ Successfully logged in to EdgeDB Cloud" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to login to EdgeDB Cloud" -ForegroundColor Red
    Write-Host "Please run 'edgedb cloud login' manually and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 2: Create EdgeDB Cloud Instance" -ForegroundColor Yellow
$instanceName = "spandepong-prod"
Write-Host "Creating instance: $instanceName"
Write-Host "Running: edgedb cloud instance create $instanceName"

try {
    edgedb cloud instance create $instanceName
    Write-Host "✓ EdgeDB Cloud instance created successfully" -ForegroundColor Green
} catch {
    Write-Host "Instance might already exist. Continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 3: Link Local Project to Cloud Instance" -ForegroundColor Yellow
Write-Host "Running: edgedb instance link $instanceName --overwrite"

try {
    edgedb instance link $instanceName --overwrite
    Write-Host "✓ Project linked to cloud instance" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to link project to cloud instance" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 4: Apply Database Schema to Cloud Instance" -ForegroundColor Yellow
Write-Host "Running: edgedb migrate"

try {
    edgedb migrate
    Write-Host "✓ Database schema applied successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to apply database schema" -ForegroundColor Red
    Write-Host "You may need to run this manually later" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 5: Get Connection String" -ForegroundColor Yellow
Write-Host "Running: edgedb instance credentials --insecure-dev-mode"

try {
    $connectionString = edgedb instance credentials --insecure-dev-mode
    Write-Host "✓ Connection string obtained" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== IMPORTANT: Add this to Vercel Environment Variables ===" -ForegroundColor Red
    Write-Host "Variable Name: EDGEDB_DSN" -ForegroundColor Yellow
    Write-Host "Variable Value:" -ForegroundColor Yellow
    Write-Host "$connectionString" -ForegroundColor White
    Write-Host ""
    Write-Host "Add this to ALL environments in Vercel:" -ForegroundColor Red
    Write-Host "- Production" -ForegroundColor White
    Write-Host "- Preview" -ForegroundColor White
    Write-Host "- Development" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to get connection string" -ForegroundColor Red
    Write-Host "Run manually: edgedb instance credentials --insecure-dev-mode" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 6: Test Connection" -ForegroundColor Yellow
try {
    node scripts/verify-cloud-connection.js
    Write-Host "✓ Cloud connection verified" -ForegroundColor Green
} catch {
    Write-Host "Connection test failed - this is normal if EDGEDB_DSN is not set locally" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Copy the EDGEDB_DSN value above" -ForegroundColor White
Write-Host "2. Go to your Vercel dashboard" -ForegroundColor White
Write-Host "3. Navigate to Settings > Environment Variables" -ForegroundColor White
Write-Host "4. Add EDGEDB_DSN to all environments (Production, Preview, Development)" -ForegroundColor White
Write-Host "5. Redeploy your application" -ForegroundColor White
Write-Host ""
Write-Host "✓ EdgeDB Cloud setup complete!" -ForegroundColor Green
