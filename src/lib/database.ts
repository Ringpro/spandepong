import { client } from './edgedb';
import type { Tournament, Player } from './types';

// Helper function to handle database operations safely
async function safeQuery<T>(queryFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    console.warn('Database query failed:', error);
    return fallback;
  }
}

// Player operations
export async function createPlayer(name: string, email?: string) {
  const result = await safeQuery(async () => {
    return await client.query(`
      insert Player {
        name := <str>$name,
        email := <optional str>$email
      }
    `, { name, email });
  }, []);
  
  return result[0] || null;
}

export async function getPlayers(): Promise<Player[]> {
  return await safeQuery(
    () => client.query(`
      select Player {
        id,
        name,
        email,
        created_at
      } order by .name
    `),
    [] // Return empty array if database is not available
  );
}

export async function getPlayer(id: string) {
  return await client.queryRequiredSingle(`
    select Player {
      id,
      name,
      email,
      created_at
    } filter .id = <uuid>$id
  `, { id });
}

// Tournament operations
export async function createTournament(
  name: string, 
  description?: string, 
  maxPlayers: number = 8
) {
  const result = await safeQuery(async () => {
    return await client.query(`
      insert Tournament {
        name := <str>$name,
        description := <optional str>$description,
        max_players := <int16>$maxPlayers
      }
    `, { name, description, maxPlayers });
  }, []);
  
  return result[0] || null;
}

export async function getTournaments(): Promise<Tournament[]> {
  return await safeQuery(
    () => client.query(`
      select Tournament {
        id,
        name,
        description,
        status,
        created_at,
        max_players,
        player_count := count(.<tournament[is TournamentRegistration]),
        round_count := count(.<tournament[is Round]),
        match_count := count(.<tournament[is GameMatch])
      } order by .created_at desc
    `),
    [] // Return empty array if database is not available
  );
}

export async function getTournament(id: string) {
  const result = await client.query(`
    select Tournament {
      id,
      name,
      description,
      status,
      created_at,
      max_players,
      players := .<tournament[is TournamentRegistration].player {
        id,
        name,
        email,
        created_at
      },
      rounds := .<tournament[is Round] {
        id,
        round_number,
        status,
        created_at,
        matches := .<round[is GameMatch] {
          id,
          team1: { 
            id, 
            name,
            members: {
              id,
              name
            }
          },
          team2: { 
            id, 
            name,
            members: {
              id,
              name
            }
          },
          team1_score,
          team2_score,
          status,
          winner: { id, name },
          created_at,
          finished_at
        }
      }
    } filter .id = <uuid>$id
  `, { id });
  
  return result[0] || null;
}

// Tournament registration
export async function registerPlayerForTournament(playerId: string, tournamentId: string) {
  return await safeQuery(async () => {
    return await client.query(`
      insert TournamentRegistration {
        player := (select Player filter .id = <uuid>$playerId),
        tournament := (select Tournament filter .id = <uuid>$tournamentId)
      }
    `, { playerId, tournamentId });
  }, []);
}

export async function startTournament(tournamentId: string) {
  return await safeQuery(async () => {
    return await client.query(`
      update Tournament 
      filter .id = <uuid>$tournamentId
      set {
        status := 'active'
      }
    `, { tournamentId });
  }, []);
}

export async function finishTournament(tournamentId: string) {
  return await safeQuery(async () => {
    return await client.query(`
      update Tournament 
      filter .id = <uuid>$tournamentId
      set {
        status := 'finished'
      }
    `, { tournamentId });
  }, []);
}

// Round and match operations
export async function createRoundWithMatches(
  tournamentId: string, 
  roundNumber: number, 
  teams: Array<{ team1: [string, string], team2: [string, string] }>
) {
  return await safeQuery(async () => {
    return await client.transaction(async (tx) => {
      // Get tournament players if no teams provided (generate solo shuffle)
      let teamPairs = teams;
      if (teams.length === 0) {
        const tournament = await tx.queryRequiredSingle(`
          select Tournament {
            players := .<tournament[is TournamentRegistration].player {
              id
            }
          } filter .id = <uuid>$tournamentId
        `, { tournamentId });
        
        const playerIds = (tournament as { players: { id: string }[] }).players.map((p: { id: string }) => p.id);
        teamPairs = generateSoloShuffleTeams(playerIds);
      }

      // Create the round
      const round = await tx.queryRequiredSingle(`
        insert Round {
          tournament := (select Tournament filter .id = <uuid>$tournamentId),
          round_number := <int16>$roundNumber
        }
      `, { tournamentId, roundNumber });

      // Create teams and matches for this round
      const matches = [];
      for (const teamPair of teamPairs) {
        // Create team 1
        const team1 = await tx.queryRequiredSingle(`
          insert Team {
            name := 'Team ' ++ (select Player filter .id = <uuid>$player1Id).name ++ ' & ' ++ (select Player filter .id = <uuid>$player2Id).name,
            members := (select Player filter .id in {<uuid>$player1Id, <uuid>$player2Id})
          }
        `, {
          player1Id: teamPair.team1[0],
          player2Id: teamPair.team1[1]
        });

        // Create team 2
        const team2 = await tx.queryRequiredSingle(`
          insert Team {
            name := 'Team ' ++ (select Player filter .id = <uuid>$player1Id).name ++ ' & ' ++ (select Player filter .id = <uuid>$player2Id).name,
            members := (select Player filter .id in {<uuid>$player1Id, <uuid>$player2Id})
          }
        `, {
          player1Id: teamPair.team2[0],
          player2Id: teamPair.team2[1]
        });

        // Create the match
        const match = await tx.queryRequiredSingle(`
          insert GameMatch {
            tournament := (select Tournament filter .id = <uuid>$tournamentId),
            round := (select Round filter .id = <uuid>$roundId),
            team1 := (select Team filter .id = <uuid>$team1Id),
            team2 := (select Team filter .id = <uuid>$team2Id)
          }        `, {
          tournamentId,
          roundId: (round as { id: string }).id,
          team1Id: (team1 as { id: string }).id,
          team2Id: (team2 as { id: string }).id
        });

        // Create team memberships for statistics
        await tx.query(`
          for player_id in {<uuid>$p1, <uuid>$p2} union (
            insert TeamMembership {
              player := (select Player filter .id = player_id),
              team := (select Team filter .id = <uuid>$team1Id),
              game_match := (select GameMatch filter .id = <uuid>$matchId)
            }
          )        `, {
          p1: teamPair.team1[0],
          p2: teamPair.team1[1],
          team1Id: (team1 as { id: string }).id,
          matchId: (match as { id: string }).id
        });

        await tx.query(`
          for player_id in {<uuid>$p1, <uuid>$p2} union (
            insert TeamMembership {
              player := (select Player filter .id = player_id),
              team := (select Team filter .id = <uuid>$team2Id),
              game_match := (select GameMatch filter .id = <uuid>$matchId)
            }
          )        `, {
          p1: teamPair.team2[0],
          p2: teamPair.team2[1],
          team2Id: (team2 as { id: string }).id,
          matchId: (match as { id: string }).id
        });

        matches.push(match);
      }      return { round, matches };
    });
  }, { round: null, matches: [] });
}

export async function updateMatchScore(
  matchId: string, 
  team1Score: number, 
  team2Score: number, 
  winnerId?: string
) {
  return await safeQuery(async () => {
    return await client.query(`
      update GameMatch 
      filter .id = <uuid>$matchId
      set {
        team1_score := <int16>$team1Score,
        team2_score := <int16>$team2Score,
        winner := (select Team filter .id = <optional uuid>$winnerId) if exists <optional uuid>$winnerId else {},
        status := 'completed' if exists <optional uuid>$winnerId else .status,
        finished_at := datetime_current() if exists <optional uuid>$winnerId else .finished_at
      }
    `, { matchId, team1Score, team2Score, winnerId });
  }, []);
}

// Leaderboard and statistics
export async function getTournamentLeaderboard(tournamentId: string) {
  return await safeQuery(async () => {
    return await client.query(`
      with 
        tournament_players := (select TournamentRegistration filter .tournament.id = <uuid>$tournamentId).player
      select tournament_players {
        id,
        name,
        tournament_matches := count(.<player[is TeamMembership] filter .game_match.tournament.id = <uuid>$tournamentId),
        tournament_wins := count(.<player[is TeamMembership] filter .game_match.tournament.id = <uuid>$tournamentId and .game_match.winner = .team),
        tournament_win_rate := count(.<player[is TeamMembership] filter .game_match.tournament.id = <uuid>$tournamentId and .game_match.winner = .team) / math::max(count(.<player[is TeamMembership] filter .game_match.tournament.id = <uuid>$tournamentId), 1)
      } order by .tournament_wins desc then .name
    `, { tournamentId });
  }, []);
}

// Solo shuffle algorithm
export function generateSoloShuffleTeams(playerIds: string[]): Array<{ team1: [string, string], team2: [string, string] }> {
  if (playerIds.length < 4 || playerIds.length % 4 !== 0) {
    throw new Error('Solo shuffle requires a multiple of 4 players (minimum 4)');
  }

  // Shuffle the players randomly
  const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
  const teams = [];

  // Create pairs (teams of 2) and then match them up
  for (let i = 0; i < shuffled.length; i += 4) {
    teams.push({
      team1: [shuffled[i], shuffled[i + 1]] as [string, string],
      team2: [shuffled[i + 2], shuffled[i + 3]] as [string, string]
    });
  }

  return teams;
}
