const { createClient } = require('edgedb');

// Solo shuffle algorithm
function generateSoloShuffleTeams(playerIds) {
  if (playerIds.length < 4 || playerIds.length % 4 !== 0) {
    throw new Error('Solo shuffle requires a multiple of 4 players (minimum 4)');
  }

  // Shuffle the players randomly
  const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
  const teams = [];

  // Create pairs (teams of 2) and then match them up
  for (let i = 0; i < shuffled.length; i += 4) {
    teams.push({
      team1: [shuffled[i], shuffled[i + 1]],
      team2: [shuffled[i + 2], shuffled[i + 3]]
    });
  }

  return teams;
}

async function createRound2() {
  const client = createClient();
  
  try {
    const tournamentId = '8e2fa964-3d5a-11f0-9621-679e91c9fe5a';
    
    // Get tournament players
    const tournament = await client.query(`
      SELECT Tournament {
        players := .<tournament[is TournamentRegistration].player {
          id,
          name
        }
      } FILTER .id = <uuid>$tournamentId
    `, { tournamentId });
    
    const playerIds = tournament[0].players.map(p => p.id);
    const playerNames = tournament[0].players.reduce((acc, p) => { acc[p.id] = p.name; return acc; }, {});
    
    console.log('Players:', tournament[0].players.map(p => p.name));
    
    // Generate new team combinations
    const teamPairs = generateSoloShuffleTeams(playerIds);
    console.log('New team combinations for Round 2:');
    teamPairs.forEach((pair, i) => {
      console.log(`  Match ${i + 1}: [${playerNames[pair.team1[0]]}, ${playerNames[pair.team1[1]]}] vs [${playerNames[pair.team2[0]]}, ${playerNames[pair.team2[1]]}]`);
    });

    // Create Round 2
    const round = await client.query(`
      INSERT Round {
        tournament := (SELECT Tournament FILTER .id = <uuid>$tournamentId),
        round_number := <int16>2
      }
    `, { tournamentId });

    console.log('Round 2 created:', round[0].id);

    // Create teams and match for Round 2
    for (const teamPair of teamPairs) {
      // Create team 1
      const team1 = await client.query(`
        INSERT Team {
          name := 'Team ' ++ (SELECT Player FILTER .id = <uuid>$player1Id).name ++ ' & ' ++ (SELECT Player FILTER .id = <uuid>$player2Id).name,
          members := (SELECT Player FILTER .id IN {<uuid>$player1Id, <uuid>$player2Id})
        }
      `, {
        player1Id: teamPair.team1[0],
        player2Id: teamPair.team1[1]
      });

      // Create team 2
      const team2 = await client.query(`
        INSERT Team {
          name := 'Team ' ++ (SELECT Player FILTER .id = <uuid>$player1Id).name ++ ' & ' ++ (SELECT Player FILTER .id = <uuid>$player2Id).name,
          members := (SELECT Player FILTER .id IN {<uuid>$player1Id, <uuid>$player2Id})
        }
      `, {
        player1Id: teamPair.team2[0],
        player2Id: teamPair.team2[1]
      });

      // Create the match
      const match = await client.query(`
        INSERT GameMatch {
          tournament := (SELECT Tournament FILTER .id = <uuid>$tournamentId),
          round := (SELECT Round FILTER .id = <uuid>$roundId),
          team1 := (SELECT Team FILTER .id = <uuid>$team1Id),
          team2 := (SELECT Team FILTER .id = <uuid>$team2Id)
        }
      `, {
        tournamentId,
        roundId: round[0].id,
        team1Id: team1[0].id,
        team2Id: team2[0].id
      });

      console.log(`Match created: ${team1[0].name} vs ${team2[0].name}`);

      // Create team memberships for statistics
      await client.query(`
        FOR player_id IN {<uuid>$p1, <uuid>$p2} UNION (
          INSERT TeamMembership {
            player := (SELECT Player FILTER .id = player_id),
            team := (SELECT Team FILTER .id = <uuid>$team1Id),
            game_match := (SELECT GameMatch FILTER .id = <uuid>$matchId)
          }
        )
      `, {
        p1: teamPair.team1[0],
        p2: teamPair.team1[1],
        team1Id: team1[0].id,
        matchId: match[0].id
      });

      await client.query(`
        FOR player_id IN {<uuid>$p1, <uuid>$p2} UNION (
          INSERT TeamMembership {
            player := (SELECT Player FILTER .id = player_id),
            team := (SELECT Team FILTER .id = <uuid>$team2Id),
            game_match := (SELECT GameMatch FILTER .id = <uuid>$matchId)
          }
        )
      `, {
        p1: teamPair.team2[0],
        p2: teamPair.team2[1],
        team2Id: team2[0].id,
        matchId: match[0].id
      });
    }

    console.log('Round 2 created successfully with new team combinations!');

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  } finally {
    await client.close();
  }
}

createRound2();
