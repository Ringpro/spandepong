@echo off
REM EdgeDB Setup Script for Spandepong (Windows)

echo 🪣 Setting up EdgeDB for Spandepong...

REM Check if EdgeDB is installed
where edgedb >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ EdgeDB is not installed. Please install EdgeDB first:
    echo    Visit: https://www.edgedb.com/install
    exit /b 1
)

REM Initialize EdgeDB project
echo 📁 Initializing EdgeDB project...
edgedb project init --non-interactive

REM Create migration
echo 📋 Creating initial migration...
edgedb migration create --non-interactive

REM Apply migration
echo ✅ Applying migration...
edgedb migrate

echo 🎉 EdgeDB setup complete!
echo.
echo Next steps:
echo 1. Run 'npm run dev' to start the development server
echo 2. Visit http://localhost:3000 to use the app
echo 3. Create some players and start your first tournament!
