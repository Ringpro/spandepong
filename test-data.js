// Test script to create sample data
import { createPlayer, createTournament, registerPlayerForTournament } from './src/lib/database.js';

async function createSampleData() {
  try {
    console.log('Creating sample players...');
    
    // Create some test players
    const players = [
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
      { name: 'Charlie Brown', email: 'charlie@example.com' },
      { name: 'Diana Prince', email: 'diana@example.com' },
      { name: 'Eve Wilson', email: 'eve@example.com' },
      { name: 'Frank Miller', email: 'frank@example.com' },
      { name: 'Grace Lee', email: 'grace@example.com' },
      { name: 'Henry Davis', email: 'henry@example.com' }
    ];

    const createdPlayers = [];
    for (const player of players) {
      const result = await createPlayer(player.name, player.email);
      createdPlayers.push(result);
      console.log(`Created player: ${player.name}`);
    }

    console.log('Creating sample tournament...');
    
    // Create a test tournament
    const tournament = await createTournament(
      'Spring Spandepong Championship 2025',
      'The ultimate beer pong tournament with buckets!',
      8
    );
    
    console.log('Tournament created:', tournament);    // Register players for the tournament
    console.log('Registering players for tournament...');
    for (const player of createdPlayers) {
      await registerPlayerForTournament(player.id, tournament.id);
      console.log(`Registered player for tournament`);
    }

    console.log('Sample data created successfully!');
    
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
}

createSampleData();
