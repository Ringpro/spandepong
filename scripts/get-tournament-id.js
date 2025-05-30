const { createClient } = require('edgedb');

async function getTournamentId() {
  const client = createClient();
  
  try {
    const tournaments = await client.query(`
      SELECT Tournament {
        id,
        name,
        status
      }
    `);
    
    console.log('All tournaments:', tournaments);
    
    if (tournaments.length > 0) {
      const tournamentId = tournaments[0].id;
      console.log('Tournament ID:', tournamentId);
      return tournamentId;
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

getTournamentId();
