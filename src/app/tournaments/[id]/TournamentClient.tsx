'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  registerPlayerAction,
  startTournamentAction,
  createRoundWithMatchesAction,
  updateMatchScoreAction
} from '@/lib/actions';
import { formatDate, formatWinRate } from '@/lib/utils';
import { ArrowLeft, Users, Play, Trophy, Target, Plus, Shuffle } from 'lucide-react';
import type { Tournament, Player } from '@/lib/types';

interface TournamentClientProps {
  tournament: Tournament;
  allPlayers: Player[];
  leaderboard: Player[];
  tournamentId: string;
}

export default function TournamentClient({ 
  tournament: initialTournament, 
  allPlayers, 
  leaderboard: initialLeaderboard,
  tournamentId 
}: TournamentClientProps) {  const [tournament] = useState<Tournament>(initialTournament);
  const [leaderboard] = useState<Player[]>(initialLeaderboard);
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'leaderboard'>('overview');
  const [showAddPlayers, setShowAddPlayers] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handleAddPlayers = async () => {
    try {
      for (const playerId of selectedPlayers) {
        await registerPlayerAction(playerId, tournamentId);
      }
      setSelectedPlayers([]);
      setShowAddPlayers(false);
      // In a real app, you'd refresh the data here
      window.location.reload();
    } catch (error) {
      console.error('Failed to add players:', error);
      alert('Failed to add players. Please try again.');
    }
  };

  const handleStartTournament = async () => {
    if (!tournament || !tournament.players || tournament.players.length < 4) {
      alert('You need at least 4 players to start a tournament.');
      return;
    }

    if (tournament.players.length % 2 !== 0) {
      alert('You need an even number of players to form teams.');
      return;
    }

    try {
      await startTournamentAction(tournamentId);
      await createFirstRound();
      window.location.reload();
    } catch (error) {
      console.error('Failed to start tournament:', error);
      alert('Failed to start tournament. Please try again.');
    }
  };
  const createFirstRound = async () => {
    if (!tournament || !tournament.players) return;

    // The generateSoloShuffleTeams logic will be handled in the Server Action
    await createRoundWithMatchesAction(tournamentId, 1, []);
  };
  const handleCreateNextRound = async () => {
    if (!tournament || !tournament.rounds || !tournament.players) return;

    const nextRoundNumber = tournament.rounds.length + 1;
    // The generateSoloShuffleTeams logic will be handled in the Server Action

    try {
      await createRoundWithMatchesAction(tournamentId, nextRoundNumber, []);
      window.location.reload();
    } catch (error) {
      console.error('Failed to create next round:', error);
      alert('Failed to create next round. Please try again.');
    }
  };

  const handleScoreUpdate = async (matchId: string, team1Score: number, team2Score: number, winnerId?: string) => {
    try {
      await updateMatchScoreAction(matchId, team1Score, team2Score, winnerId);
      window.location.reload();
    } catch (error) {
      console.error('Failed to update score:', error);
      alert('Failed to update score. Please try again.');
    }
  };

  const availablePlayers = allPlayers.filter(
    player => !tournament?.players?.some(tp => tp.id === player.id)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
          <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">{tournament.name}</h1>
            {tournament.description && (
              <p className="text-muted mt-2">{tournament.description}</p>
            )}
            <div className="flex items-center gap-4 mt-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                tournament.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : tournament.status === 'finished'
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              }`}>
                {tournament.status}
              </span>
              <span className="text-sm text-muted">
                Created {formatDate(tournament.created_at)}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {tournament.status === 'created' && (
              <>                <button
                  onClick={() => setShowAddPlayers(true)}
                  className="btn-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Players
                </button>                <button
                  onClick={handleStartTournament}
                  disabled={!tournament.players || tournament.players.length < 4}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Tournament
                </button>
              </>
            )}
            
            {tournament.status === 'active' && (              <button
                onClick={handleCreateNextRound}
                className="btn-primary"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Create Next Round
              </button>
            )}
          </div>
        </div>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-muted">Players</p>
              <p className="text-xl font-bold text-card-foreground">{tournament.players?.length || 0}/{tournament.max_players}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <Target className="w-6 h-6 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-muted">Rounds</p>
              <p className="text-xl font-bold text-card-foreground">{tournament.rounds?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            <div>
              <p className="text-sm text-muted">Matches</p>
              <p className="text-xl font-bold text-card-foreground">{tournament.rounds?.reduce((sum, round) => sum + round.matches.length, 0) || 0}</p>
            </div>
          </div>
        </div>
          <div className="card p-4">
          <div className="flex items-center">
            <Target className="w-6 h-6 text-purple-500 mr-2" />
            <div>
              <p className="text-sm text-muted">Completed</p>
              <p className="text-xl font-bold text-card-foreground">
                {tournament.rounds?.reduce((sum, round) => sum + round.matches.filter(m => m.status === 'completed').length, 0) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>      {/* Tabs */}
      <div className="border-b border-default mb-6">
        <nav className="-mb-px flex space-x-8">
          {(['overview', 'matches', 'leaderboard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-muted hover:text-card-foreground hover:border-default'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Players */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Players ({tournament.players?.length || 0})</h3>
            {!tournament.players || tournament.players.length === 0 ? (
              <p className="text-muted">No players registered yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tournament.players.map((player) => (
                  <div key={player.id} className="flex items-center p-3 border-default border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{player.name}</p>
                      <p className="text-sm text-muted">
                        {player.total_matches || 0} matches, {formatWinRate(player.wins || 0, player.total_matches || 0)} win rate
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}      {activeTab === 'matches' && (
        <div className="space-y-6">
          {!tournament.rounds || tournament.rounds.length === 0 ? (
            <div className="card p-8 text-center">
              <Target className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No rounds yet</h3>
              <p className="text-muted">Start the tournament to create the first round!</p>
            </div>
          ) : (
            tournament.rounds.map((round) => (
              <div key={round.id} className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                  Round {round.round_number}
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                    round.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {round.status}
                  </span>
                </h3>
                <div className="space-y-4">
                  {round.matches.map((match) => (
                    <MatchCard 
                      key={match.id} 
                      match={match} 
                      onScoreUpdate={handleScoreUpdate}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}      {activeTab === 'leaderboard' && (
        <div className="card">
          <div className="p-6 border-b border-default">
            <h3 className="text-lg font-semibold text-card-foreground">Tournament Leaderboard</h3>
          </div>
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <Trophy className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted">No matches completed yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Matches</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Wins</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Win Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboard.map((player, index) => (
                    <tr key={player.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                          index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                          index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-card-foreground">{player.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-card-foreground">{player.tournament_matches}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-card-foreground">{player.tournament_wins}</td>                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          (player.tournament_win_rate || 0) >= 0.7 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          (player.tournament_win_rate || 0) >= 0.5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {formatWinRate(player.tournament_wins || 0, player.tournament_matches || 0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}      {/* Add Players Modal */}
      {showAddPlayers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Add Players to Tournament</h3>
            
            {availablePlayers.length === 0 ? (
              <p className="text-muted mb-4">No available players. Create players first.</p>
            ) : (
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {availablePlayers.map((player) => (
                  <label key={player.id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                    <input
                      type="checkbox"
                      checked={selectedPlayers.includes(player.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPlayers(prev => [...prev, player.id]);
                        } else {
                          setSelectedPlayers(prev => prev.filter(id => id !== player.id));
                        }
                      }}
                      className="mr-3"
                    />
                    <span className="text-card-foreground">{player.name}</span>
                  </label>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={handleAddPlayers}
                disabled={selectedPlayers.length === 0}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Add Selected Players
              </button>
              <button
                onClick={() => {
                  setShowAddPlayers(false);
                  setSelectedPlayers([]);
                }}
                className="btn-secondary px-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Match Card Component
interface MatchCardProps {
  match: {
    id: string;
    team1: { 
      id: string; 
      name: string; 
      members: { id: string; name: string }[]
    };
    team2: { 
      id: string; 
      name: string; 
      members: { id: string; name: string }[]
    };
    team1_score: number;
    team2_score: number;
    status: string;
    winner?: { id: string; name: string };
  };
  onScoreUpdate: (matchId: string, team1Score: number, team2Score: number, winnerId?: string) => void;
}

function MatchCard({ match, onScoreUpdate }: MatchCardProps) {
  const [team1Score, setTeam1Score] = useState(match.team1_score);
  const [team2Score, setTeam2Score] = useState(match.team2_score);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleScoreSubmit = async () => {
    setIsUpdating(true);
    try {
      let winnerId;
      if (team1Score > team2Score) {
        winnerId = match.team1.id;
      } else if (team2Score > team1Score) {
        winnerId = match.team2.id;
      }
      
      await onScoreUpdate(match.id, team1Score, team2Score, winnerId);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="border-default border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <h4 className="font-medium text-card-foreground">{match.team1.name}</h4>
          <p className="text-sm text-muted">
            {match.team1.members.map((m: { id: string; name: string }) => m.name).join(' & ')}
          </p>
        </div>
        
        <div className="flex items-center gap-4 mx-8">
          <div className="text-center">
            <input
              type="number"
              min="0"
              value={team1Score}
              onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
              disabled={match.status === 'completed'}
              className="input w-16 text-center"
            />
          </div>
          <span className="text-muted">vs</span>
          <div className="text-center">
            <input
              type="number"
              min="0"
              value={team2Score}
              onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
              disabled={match.status === 'completed'}
              className="input w-16 text-center"
            />
          </div>
        </div>
        
        <div className="flex-1 text-right">
          <h4 className="font-medium text-card-foreground">{match.team2.name}</h4>
          <p className="text-sm text-muted">
            {match.team2.members.map((m: { id: string; name: string }) => m.name).join(' & ')}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          match.status === 'completed' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        }`}>
          {match.status}
        </span>
        
        {match.status !== 'completed' && (
          <button
            onClick={handleScoreSubmit}
            disabled={isUpdating || (team1Score === 0 && team2Score === 0)}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update Score'}
          </button>
        )}
        
        {match.winner && (
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Winner: {match.winner.name}
          </span>
        )}
      </div>
    </div>
  );
}
