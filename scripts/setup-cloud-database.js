// Quick Cloud Database Setup Script
// Run this after getting your cloud connection string

import { createClient } from 'edgedb';

async function setupCloudDatabase() {
  console.log('🚀 Setting up EdgeDB Cloud database...');
  
  try {
    const cloudConnectionString = process.env.EDGEDB_DSN;
    if (!cloudConnectionString) {
      console.error('❌ EDGEDB_DSN environment variable not set');
      console.log('Set it like this:');
      console.log('$env:EDGEDB_DSN = "your-cloud-connection-string"');
      process.exit(1);
    }

    console.log('📡 Testing cloud connection...');
    const client = createClient();
    
    // Test connection
    const result = await client.querySingle('SELECT 1');
    if (result !== 1) {
      throw new Error('Connection test failed');
    }
    console.log('✅ Cloud connection successful!');
    
    // Check if schema exists
    console.log('🔍 Checking schema...');
    const tables = await client.query(`
      SELECT schema::ObjectType {
        name
      }
      FILTER .name IN {'Player', 'Tournament', 'TournamentRegistration', 'Round', 'Team', 'GameMatch'}
    `);
    
    if (tables.length === 0) {
      console.log('📋 Schema not found. You need to run migrations:');
      console.log('Run: edgedb migrate');
      process.exit(1);
    }
    
    console.log(`✅ Found ${tables.length} schema objects`);
    
    // Check if data exists
    const tournamentCount = await client.querySingle('SELECT count(Tournament)');
    const playerCount = await client.querySingle('SELECT count(Player)');
    
    console.log(`📊 Current data: ${tournamentCount} tournaments, ${playerCount} players`);
    
    if (tournamentCount === 0 && playerCount === 0) {
      console.log('🎯 Creating sample data...');
      
      // Create sample players
      const players = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const createdPlayers = [];
      
      for (const name of players) {
        const player = await client.query(`
          INSERT Player {
            name := <str>$name,
            email := <str>$email
          }
        `, { 
          name, 
          email: `${name.toLowerCase()}@example.com` 
        });
        createdPlayers.push(player[0]);
        console.log(`  ✓ Created player: ${name}`);
      }
      
      // Create sample tournament
      const tournament = await client.query(`
        INSERT Tournament {
          name := "Sample Spandepong Tournament",
          description := "A demo tournament to test the app",
          max_players := 8,
          status := 'created'
        }
      `);
      console.log(`  ✓ Created tournament: ${tournament[0].name}`);
      
      // Register players
      for (const player of createdPlayers) {
        await client.query(`
          INSERT TournamentRegistration {
            player := (SELECT Player FILTER .id = <uuid>$playerId),
            tournament := (SELECT Tournament FILTER .id = <uuid>$tournamentId)
          }
        `, { playerId: player.id, tournamentId: tournament[0].id });
      }
      console.log(`  ✓ Registered ${createdPlayers.length} players for tournament`);
      
      console.log('🎉 Sample data created successfully!');
    }
    
    console.log('✅ Cloud database is ready!');
    console.log('🔗 Your app should now work in production');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('Full error:', error);
  }
}

setupCloudDatabase();
