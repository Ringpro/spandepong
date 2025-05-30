const { createClient } = require('edgedb');

async function checkTournamentState() {
  const client = createClient();
  
  try {
    const tournamentId = '8e2fa964-3d5a-11f0-9621-679e91c9fe5a';
    
    const tournament = await client.query(`
      SELECT Tournament {
        id,
        name,
        status,
        max_players,
        players := .<tournament[is TournamentRegistration].player {
          id,
          name
        },
        rounds := .<tournament[is Round] {
          id,
          round_number,
          status,
          matches := .<round[is GameMatch] {
            id,
            status,
            team1_score,
            team2_score,
            team1: { 
              id, 
              name,
              members: { id, name }
            },
            team2: { 
              id, 
              name,
              members: { id, name }
            },
            winner: { id, name }
          }
        }
      } FILTER .id = <uuid>$tournamentId
    `, { tournamentId });

    console.log('Tournament State:', JSON.stringify(tournament[0], null, 2));

    // Check leaderboard
    const leaderboard = await client.query(`
      WITH 
        tournament_players := (SELECT TournamentRegistration FILTER .tournament.id = <uuid>$tournamentId).player
      SELECT tournament_players {
        id,
        name,
        tournament_matches := count(.<player[is TeamMembership] FILTER .game_match.tournament.id = <uuid>$tournamentId),
        tournament_wins := count(.<player[is TeamMembership] FILTER .game_match.tournament.id = <uuid>$tournamentId AND .game_match.winner = .team)
      } ORDER BY .tournament_wins DESC THEN .name
    `, { tournamentId });

    console.log('\nLeaderboard:', JSON.stringify(leaderboard, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  } finally {
    await client.close();
  }
}

checkTournamentState();
