const { Client } = require('edgedb');

async function testTournamentStart() {
  const client = new Client({
    host: 'localhost',
    port: 10701,
    user: 'edgedb',
    password: 'password',
    database: 'main',
    tlsSecurity: 'insecure'
  });

  const tournamentId = '8e2fa964-3d5a-11f0-9621-679e91c9fe5a';

  try {
    console.log('Starting tournament...');
    
    // Start the tournament
    await client.query(`
      update Tournament 
      filter .id = <uuid>$tournamentId
      set {
        status := 'active'
      }
    `, { tournamentId });

    console.log('Tournament started successfully!');

    // Get tournament players
    const tournament = await client.query(`
      select Tournament {
        players := .<tournament[is TournamentRegistration].player {
          id
        }
      } filter .id = <uuid>$tournamentId
    `, { tournamentId });

    const playerIds = tournament[0].players.map(p => p.id);
    console.log('Player IDs:', playerIds);

    // Generate solo shuffle teams
    const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
    console.log('Shuffled players:', shuffled);
    
    const teamPair = {
      team1: [shuffled[0], shuffled[1]],
      team2: [shuffled[2], shuffled[3]]
    };
    console.log('Team pairs:', teamPair);

    // Create the round
    console.log('Creating round...');
    const round = await client.query(`
      insert Round {
        tournament := (select Tournament filter .id = <uuid>$tournamentId),
        round_number := <int16>1
      }
    `, { tournamentId });

    console.log('Round created:', round);

    // Create team 1
    console.log('Creating team 1...');
    const team1 = await client.query(`
      insert Team {
        name := 'Team ' ++ (select Player filter .id = <uuid>$player1Id).name ++ ' & ' ++ (select Player filter .id = <uuid>$player2Id).name,
        members := (select Player filter .id in {<uuid>$player1Id, <uuid>$player2Id})
      }
    `, {
      player1Id: teamPair.team1[0],
      player2Id: teamPair.team1[1]
    });

    console.log('Team 1 created:', team1);

    // Create team 2
    console.log('Creating team 2...');
    const team2 = await client.query(`
      insert Team {
        name := 'Team ' ++ (select Player filter .id = <uuid>$player1Id).name ++ ' & ' ++ (select Player filter .id = <uuid>$player2Id).name,
        members := (select Player filter .id in {<uuid>$player1Id, <uuid>$player2Id})
      }
    `, {
      player1Id: teamPair.team2[0],
      player2Id: teamPair.team2[1]
    });

    console.log('Team 2 created:', team2);

    // Create the match
    console.log('Creating match...');
    const match = await client.query(`
      insert GameMatch {
        tournament := (select Tournament filter .id = <uuid>$tournamentId),
        round := (select Round filter .id = <uuid>$roundId),
        team1 := (select Team filter .id = <uuid>$team1Id),
        team2 := (select Team filter .id = <uuid>$team2Id)
      }
    `, {
      tournamentId,
      roundId: round[0].id,
      team1Id: team1[0].id,
      team2Id: team2[0].id
    });

    console.log('Match created:', match);

    // Create team memberships
    console.log('Creating team memberships...');
    await client.query(`
      for player_id in {<uuid>$p1, <uuid>$p2} union (
        insert TeamMembership {
          player := (select Player filter .id = player_id),
          team := (select Team filter .id = <uuid>$team1Id),
          game_match := (select GameMatch filter .id = <uuid>$matchId)
        }
      )
    `, {
      p1: teamPair.team1[0],
      p2: teamPair.team1[1],
      team1Id: team1[0].id,
      matchId: match[0].id
    });

    await client.query(`
      for player_id in {<uuid>$p1, <uuid>$p2} union (
        insert TeamMembership {
          player := (select Player filter .id = player_id),
          team := (select Team filter .id = <uuid>$team2Id),
          game_match := (select GameMatch filter .id = <uuid>$matchId)
        }
      )
    `, {
      p1: teamPair.team2[0],
      p2: teamPair.team2[1],
      team2Id: team2[0].id,
      matchId: match[0].id
    });

    console.log('Team memberships created successfully!');
    console.log('Tournament round 1 is ready!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testTournamentStart();
