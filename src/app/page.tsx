import Link from 'next/link';
import { getTournamentsAction } from '@/lib/actions';
import { formatDate } from '@/lib/utils';
import { Plus, Trophy, Users, Target } from 'lucide-react';
import type { Tournament } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let tournaments: Tournament[] = [];
  
  try {
    tournaments = await getTournamentsAction();
  } catch {
    // Handle case where database is not available (e.g., during build)
    console.log('Database not available during build, using empty tournaments list');
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🪣 Welcome to Spandepong
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tournament management for the ultimate bucket beer pong experience
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tournaments/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Tournament
          </Link>
          <Link
            href="/players"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Users className="w-5 h-5 mr-2" />
            Manage Players
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Solo Shuffle Format</h3>
          <p className="text-gray-600">
            Teams are randomly shuffled each round to find the best individual player
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <Target className="w-8 h-8 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Live Scoring</h3>
          <p className="text-gray-600">
            Track matches in real-time with mobile-friendly scoring interface
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <Users className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Player Stats</h3>
          <p className="text-gray-600">
            Comprehensive leaderboards and performance analytics
          </p>
        </div>
      </div>

      {/* Recent Tournaments */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Tournaments</h2>
          <Link
            href="/tournaments"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tournaments yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first Spandepong tournament to get started!
            </p>
            <Link
              href="/tournaments/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.slice(0, 6).map((tournament: Tournament) => (
              <Link
                key={tournament.id}
                href={`/tournaments/${tournament.id}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tournament.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tournament.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : tournament.status === 'finished'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tournament.status}
                  </span>
                </div>
                
                {tournament.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {tournament.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Players:</span>
                    <span>{tournament.player_count}/{tournament.max_players}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rounds:</span>
                    <span>{tournament.round_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Matches:</span>
                    <span>{tournament.match_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{formatDate(tournament.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
