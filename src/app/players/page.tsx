'use client';

import { useState, useEffect } from 'react';
import { getPlayersAction, createPlayerAction } from '@/lib/actions';
import { formatWinRate } from '@/lib/utils';
import { Plus, User, Trophy, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Player } from '@/lib/types';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', email: '' });

  useEffect(() => {
    loadPlayers();
  }, []);
  const loadPlayers = async () => {
    try {
      const playersData = await getPlayersAction();
      setPlayers(playersData);
    } catch (error) {
      console.error('Failed to load players:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name.trim()) return;

    setIsAddingPlayer(true);
    try {
      await createPlayerAction(newPlayer.name.trim(), newPlayer.email.trim() || undefined);
      setNewPlayer({ name: '', email: '' });
      setShowAddForm(false);
      await loadPlayers();
    } catch (error) {
      console.error('Failed to create player:', error);
      alert('Failed to create player. Please try again.');
    } finally {
      setIsAddingPlayer(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-muted">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:opacity-80 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Players</h1>
            <p className="text-muted mt-2">
              Manage players and view their statistics
            </p>
          </div>          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Player
          </button>
        </div>
      </div>

      {/* Add Player Form */}
      {showAddForm && (
        <div className="card rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Player</h3>
          <form onSubmit={handleAddPlayer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium mb-2">
                  Player Name *
                </label>
                <input
                  type="text"
                  id="playerName"
                  required
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                  className="input w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                  placeholder="Enter player name"
                />
              </div>
              <div>
                <label htmlFor="playerEmail" className="block text-sm font-medium mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  id="playerEmail"
                  value={newPlayer.email}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, email: e.target.value }))}
                  className="input w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="flex gap-2">              <button
                type="submit"
                disabled={isAddingPlayer || !newPlayer.name.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingPlayer ? 'Adding...' : 'Add Player'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewPlayer({ name: '', email: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Players List */}
      {players.length === 0 ? (
        <div className="card rounded-lg shadow p-8 text-center">
          <User className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No players yet
          </h3>
          <p className="text-muted mb-4">
            Add your first player to get started with tournaments!
          </p>          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Player
          </button>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6 rounded-lg shadow">
              <div className="flex items-center">
                <User className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted">Total Players</p>
                  <p className="text-2xl font-bold">{players.length}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted">Active Players</p>
                  <p className="text-2xl font-bold">
                    {players.filter(p => (p.total_matches || 0) > 0).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted">Total Matches</p>
                  <p className="text-2xl font-bold">
                    {players.reduce((sum, p) => sum + (p.total_matches || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Players Table */}
          <div className="card rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-default">
              <h3 className="text-lg font-medium">All Players</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y border-default">
                <thead className="bg-card">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Matches Played
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Wins
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Win Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y border-default">
                  {players
                    .sort((a, b) => (b.win_rate || 0) - (a.win_rate || 0))
                    .map((player) => (
                    <tr key={player.id} className="hover:bg-card">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-card-foreground">
                              {player.name}
                            </div>
                            {player.email && (
                              <div className="text-sm text-muted">
                                {player.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                        {player.total_matches}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                        {player.wins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (player.win_rate || 0) >= 0.7 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : (player.win_rate || 0) >= 0.5
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {formatWinRate(player.wins || 0, player.total_matches || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {new Date(player.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
