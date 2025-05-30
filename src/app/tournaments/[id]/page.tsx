import { Suspense } from 'react';
import Link from 'next/link';
import { getTournament, getPlayers, getTournamentLeaderboard } from '@/lib/database';
import type { Tournament, Player } from '@/lib/types';
import TournamentClient from './TournamentClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TournamentDetailPage({ params }: PageProps) {
  const { id: tournamentId } = await params;
  
  try {
    const [tournament, allPlayers, leaderboard] = await Promise.all([
      getTournament(tournamentId),
      getPlayers(),
      getTournamentLeaderboard(tournamentId)
    ]);

    if (!tournament) {
      return (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tournament Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      );
    }

    return (
      <TournamentClient 
        tournament={tournament as Tournament}
        allPlayers={allPlayers}
        leaderboard={leaderboard}
        tournamentId={tournamentId}
      />
    );
  } catch (error) {
    console.error('Failed to load tournament data:', error);
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tournament</h1>
        <p className="text-gray-600 mb-4">Failed to load tournament data.</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Return to Home
        </Link>
      </div>
    );
  }
}
