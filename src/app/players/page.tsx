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
        <div className="text-gray-500">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Players</h1>
            <p className="text-gray-600 mt-2">
              Manage players and view their statistics
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Player
          </button>
        </div>
      </div>

      {/* Add Player Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Player</h3>
          <form onSubmit={handleAddPlayer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Player Name *
                </label>
                <input
                  type="text"
                  id="playerName"
                  required
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter player name"
                />
              </div>
              <div>
                <label htmlFor="playerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  id="playerEmail"
                  value={newPlayer.email}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isAddingPlayer || !newPlayer.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingPlayer ? 'Adding...' : 'Add Player'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewPlayer({ name: '', email: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Players List */}
      {players.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No players yet
          </h3>
          <p className="text-gray-600 mb-4">
            Add your first player to get started with tournaments!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Player
          </button>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Players</p>
                  <p className="text-2xl font-bold text-gray-900">{players.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                <div>                  <p className="text-sm font-medium text-gray-600">Active Players</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {players.filter(p => (p.total_matches || 0) > 0).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-green-500 mr-3" />
                <div>                  <p className="text-sm font-medium text-gray-600">Total Matches</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {players.reduce((sum, p) => sum + (p.total_matches || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Players Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Players</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matches Played
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wins
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Win Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>                <tbody className="bg-white divide-y divide-gray-200">
                  {players
                    .sort((a, b) => (b.win_rate || 0) - (a.win_rate || 0))
                    .map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {player.name}
                            </div>
                            {player.email && (
                              <div className="text-sm text-gray-500">
                                {player.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {player.total_matches}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {player.wins}
                      </td>                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (player.win_rate || 0) >= 0.7 
                            ? 'bg-green-100 text-green-800'
                            : (player.win_rate || 0) >= 0.5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {formatWinRate(player.wins || 0, player.total_matches || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
