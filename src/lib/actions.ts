'use server';

import { revalidatePath } from 'next/cache';
import * as db from '@/lib/database';

export async function createPlayerAction(name: string, email?: string) {
  const result = await db.createPlayer(name, email);
  revalidatePath('/players');
  return result;
}

export async function createTournamentAction(
  name: string,
  description?: string,
  maxPlayers: number = 8
) {
  const result = await db.createTournament(name, description, maxPlayers);
  revalidatePath('/');
  revalidatePath('/tournaments');
  return result;
}

export async function registerPlayerAction(playerId: string, tournamentId: string) {
  const result = await db.registerPlayerForTournament(playerId, tournamentId);
  revalidatePath(`/tournaments/${tournamentId}`);
  return result;
}

export async function startTournamentAction(tournamentId: string) {
  const result = await db.startTournament(tournamentId);
  revalidatePath(`/tournaments/${tournamentId}`);
  revalidatePath('/tournaments');
  return result;
}

export async function createRoundWithMatchesAction(
  tournamentId: string, 
  roundNumber: number, 
  teamPairs?: { team1: [string, string]; team2: [string, string]; }[]
) {
  // If no team pairs provided, generate them using solo shuffle algorithm
  if (!teamPairs || teamPairs.length === 0) {
    const tournament = await db.getTournament(tournamentId) as any;
    if (tournament && tournament.players) {
      const playerIds = tournament.players.map((p: any) => p.id);
      teamPairs = db.generateSoloShuffleTeams(playerIds);
    }
  }
  
  const result = await db.createRoundWithMatches(tournamentId, roundNumber, teamPairs || []);
  revalidatePath(`/tournaments/${tournamentId}`);
  return result;
}

export async function updateMatchScoreAction(
  matchId: string,
  team1Score: number,
  team2Score: number,
  winnerId?: string
) {
  const result = await db.updateMatchScore(matchId, team1Score, team2Score, winnerId);
  // We don't know the tournament ID here, so we'll revalidate a broader path
  revalidatePath('/tournaments');
  return result;
}

export async function getPlayersAction() {
  return await db.getPlayers();
}

export async function getTournamentsAction() {
  return await db.getTournaments();
}

export async function getTournamentAction(id: string) {
  return await db.getTournament(id);
}

export async function getTournamentLeaderboardAction(tournamentId: string) {
  return await db.getTournamentLeaderboard(tournamentId);
}
