# PowerShell script to deploy EdgeDB schema to cloud instance
# Usage: .\scripts\deploy-to-cloud.ps1 "<CLOUD_DSN>"

param(
    [Parameter(Mandatory=$true)]
    [string]$CloudDsn
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying EdgeDB schema to cloud instance..." -ForegroundColor Green

try {
    # Set the environment variable for this session
    $env:EDGEDB_DSN = $CloudDsn
    
    Write-Host "📦 Creating migration..." -ForegroundColor Yellow
    & edgedb migration create
    if ($LASTEXITCODE -ne 0) { throw "Migration creation failed" }
    
    Write-Host "🔄 Applying migration to cloud instance..." -ForegroundColor Yellow
    & edgedb migrate
    if ($LASTEXITCODE -ne 0) { throw "Migration application failed" }
    
    Write-Host "✅ Successfully deployed schema to EdgeDB Cloud!" -ForegroundColor Green
    Write-Host "🔧 Don't forget to:" -ForegroundColor Cyan
    Write-Host "  1. Add EDGEDB_DSN to Vercel environment variables" -ForegroundColor White
    Write-Host "  2. Redeploy your Vercel application" -ForegroundColor White
    
} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
