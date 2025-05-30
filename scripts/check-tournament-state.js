const { createClient } = require('edgedb');

async function checkTournament() {
  const client = createClient();
  
  try {
    const tournament = await client.querySingle(`
      SELECT Tournament {
        id,
        name,
        status,
        players: {
          id,
          name
        },
        rounds: {
          id,
          roundNumber,
          matches: {
            id,
            homeScore,
            awayScore,
            isCompleted,
            winnerTeam,
            homeTeam: {
              id,
              members: { name }
            },
            awayTeam: {
              id,
              members: { name }
            }
          }
        }
      }
      FILTER .name = 'Test Tournament'
    `);
    
    console.log('Tournament State:');
    console.log(JSON.stringify(tournament, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkTournament();
