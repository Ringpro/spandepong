import Link from 'next/link';
import { getTournamentsAction } from '@/lib/actions';
import { formatDate } from '@/lib/utils';
import { Plus, Trophy, Users, Target, ArrowLeft } from 'lucide-react';
import type { Tournament } from '@/lib/types';

export default async function TournamentsPage() {
  const tournaments = await getTournamentsAction();

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
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Tournaments</h1>
            <p className="text-gray-600 mt-2">
              Manage and view all Spandepong tournaments
            </p>
          </div>
          <Link
            href="/tournaments/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Tournament
          </Link>
        </div>
      </div>

      {/* Tournament Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tournaments</p>
              <p className="text-2xl font-bold text-gray-900">{tournaments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-green-500 mr-3" />
            <div>              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {tournaments.filter((t: any) => t.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            <div>              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {tournaments.filter((t: any) => t.status === 'finished').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-purple-500 mr-3" />
            <div>              <p className="text-sm font-medium text-gray-600">Total Matches</p>
              <p className="text-2xl font-bold text-gray-900">
                {tournaments.reduce((sum: number, t: any) => sum + (t.match_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tournaments List */}
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
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Tournament
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Tournaments</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tournament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Players
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tournaments.map((tournament) => (
                  <tr key={tournament.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {tournament.name}
                        </div>
                        {tournament.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {tournament.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tournament.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : tournament.status === 'finished'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tournament.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        {tournament.player_count}/{tournament.max_players}
                      </div>
                    </td>                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Rounds: {tournament.round_count}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Matches: {tournament.match_count}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(tournament.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/tournaments/${tournament.id}`}
                        className="text-blue-600 hover:text-blue-900"
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
