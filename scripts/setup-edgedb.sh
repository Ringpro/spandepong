#!/bin/bash

# EdgeDB Setup Script for Spandepong

echo "🪣 Setting up EdgeDB for Spandepong..."

# Check if EdgeDB is installed
if ! command -v edgedb &> /dev/null; then
    echo "❌ EdgeDB is not installed. Please install EdgeDB first:"
    echo "   Visit: https://www.edgedb.com/install"
    exit 1
fi

# Initialize EdgeDB project
echo "📁 Initializing EdgeDB project..."
edgedb project init --non-interactive

# Create migration
echo "📋 Creating initial migration..."
edgedb migration create --non-interactive

# Apply migration
echo "✅ Applying migration..."
edgedb migrate

echo "🎉 EdgeDB setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Visit http://localhost:3000 to use the app"
echo "3. Create some players and start your first tournament!"
