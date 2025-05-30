import Link from 'next/link';
import { getTournamentsAction } from '@/lib/actions';
import { formatDate } from '@/lib/utils';
import { Plus, Trophy, Users, Target, ArrowLeft } from 'lucide-react';
import type { Tournament } from '@/lib/types';

// Allow static generation once database is configured
// During build without database, this will gracefully fallback to empty data

export default async function TournamentsPage() {
  let tournaments: Tournament[] = [];
  
  try {
    tournaments = await getTournamentsAction() as Tournament[];
  } catch {
    // Handle case where database is not available (e.g., during build)
    console.log('Database not available during build, using empty tournaments list');
  }
  return (
    <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-bold">All Tournaments</h1>
            <p className="text-muted mt-2">
              Manage and view all Spandepong tournaments
            </p>
          </div>
          <Link
            href="/tournaments/new"
            className="inline-flex items-center px-4 py-2 btn-primary rounded-md hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Tournament
          </Link>
        </div>
      </div>

      {/* Tournament Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-muted">Total Tournaments</p>
              <p className="text-2xl font-bold">{tournaments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-muted">Active</p>
              <p className="text-2xl font-bold">
                {tournaments.filter((t: Tournament) => t.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-muted">Completed</p>
              <p className="text-2xl font-bold">
                {tournaments.filter((t: Tournament) => t.status === 'finished').length}
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
                {tournaments.reduce((sum: number, t: Tournament) => sum + (t.match_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tournaments List */}
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
            className="inline-flex items-center px-4 py-2 btn-primary rounded-md hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Tournament
          </Link>
        </div>
      ) : (
        <div className="card rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-default">
            <h3 className="text-lg font-medium">All Tournaments</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y border-default">
              <thead className="bg-card">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Tournament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Players
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y border-default">
                {tournaments.map((tournament) => (
                  <tr key={tournament.id} className="hover:bg-accent">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-card-foreground">
                          {tournament.name}
                        </div>
                        {tournament.description && (
                          <div className="text-sm text-muted truncate max-w-xs">
                            {tournament.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tournament.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : tournament.status === 'finished'
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {tournament.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-muted mr-1" />
                        {tournament.player_count}/{tournament.max_players}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-muted">
                          <span>Rounds: {tournament.round_count}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted">
                          <span>Matches: {tournament.match_count}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      {formatDate(tournament.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/tournaments/${tournament.id}`}
                        className="text-primary hover:opacity-80"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
