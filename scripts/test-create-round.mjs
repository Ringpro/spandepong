// Test the createRoundWithMatches function directly
import { createRoundWithMatches } from '../src/lib/database.js';

async function testCreateRound() {
  const tournamentId = '8e2fa964-3d5a-11f0-9621-679e91c9fe5a';
  
  try {
    console.log('Creating first round...');
    const result = await createRoundWithMatches(tournamentId, 1, []);
    console.log('Round created successfully:', result);
  } catch (error) {
    console.error('Error creating round:', error);
  }
}

testCreateRound();
