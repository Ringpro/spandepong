import Link from 'next/link';
import { getTournamentsAction } from '@/lib/actions';
import { formatDate } from '@/lib/utils';
import { Plus, Trophy, Users, Target } from 'lucide-react';
import type { Tournament } from '@/lib/types';

// Allow static generation once database is configured
// During build without database, this will gracefully fallback to empty data
export default async function HomePage() {
  let tournaments: Tournament[] = [];
  
  try {
    tournaments = await getTournamentsAction();
  } catch {
    // Handle case where database is not available (e.g., during build)
    console.log('Database not available, using empty tournaments list');
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          🪣 Welcome to Spandepong
        </h1>
        <p className="text-xl text-muted mb-8">
          Tournament management for the ultimate bucket beer pong experience
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tournaments/new"
            className="inline-flex items-center px-6 py-3 btn-primary text-base font-medium rounded-md hover:opacity-90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Tournament
          </Link>
          <Link
            href="/players"
            className="inline-flex items-center px-6 py-3 btn-secondary text-base font-medium rounded-md hover:opacity-90"
          >
            <Users className="w-5 h-5 mr-2" />
            Manage Players
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="card p-6 rounded-lg shadow">
          <Trophy className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Solo Shuffle Format</h3>
          <p className="text-muted">
            Teams are randomly shuffled each round to find the best individual player
          </p>
        </div>
        <div className="card p-6 rounded-lg shadow">
          <Target className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Live Scoring</h3>
          <p className="text-muted">
            Track matches in real-time with mobile-friendly scoring interface
          </p>
        </div>
        <div className="card p-6 rounded-lg shadow">
          <Users className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Player Stats</h3>
          <p className="text-muted">
            Comprehensive leaderboards and performance analytics
          </p>
        </div>
      </div>

      {/* Recent Tournaments */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Tournaments</h2>
          <Link
            href="/tournaments"
            className="text-primary hover:opacity-80 font-medium"
          >
            View All
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <div className="card rounded-lg shadow p-8 text-center">
            <Trophy className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No tournaments yet
            </h3>
            <p className="text-muted mb-4">
              Create your first Spandepong tournament to get started!
            </p>
            <Link
              href="/tournaments/new"
              className="inline-flex items-center px-4 py-2 btn-primary text-sm font-medium rounded-md hover:opacity-90"
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
                className="card rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {tournament.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tournament.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : tournament.status === 'finished'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}
                  >
                    {tournament.status}
                  </span>
                </div>
                
                {tournament.description && (
                  <p className="text-muted text-sm mb-4 line-clamp-2">
                    {tournament.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-muted">
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
