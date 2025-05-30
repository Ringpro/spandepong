'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTournamentAction } from '@/lib/actions';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NewTournamentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxPlayers: 8,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);    try {
      const tournament = await createTournamentAction(
        formData.name,
        formData.description || undefined,
        formData.maxPlayers
      ) as { id: string };
      
      router.push(`/tournaments/${tournament.id}`);
    } catch (error) {
      console.error('Failed to create tournament:', error);
      alert('Failed to create tournament. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  return (    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:opacity-80 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold">Create New Tournament</h1>
        <p className="text-muted mt-2">
          Set up a new Spandepong tournament with solo shuffle format
        </p>
      </div>

      <div className="card shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Tournament Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="input w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
              placeholder="Enter tournament name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="input w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
              placeholder="Optional tournament description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <label htmlFor="maxPlayers" className="block text-sm font-medium mb-2">
                Maximum Players
              </label>
              <input
                type="number"
                id="maxPlayers"
                name="maxPlayers"
                min={4}
                max={32}
                step={2}
                value={formData.maxPlayers}
                onChange={handleInputChange}
                className="input w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
              />
              <p className="text-sm text-muted mt-1">Must be an even number (4-32)</p>
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-md">
            <h3 className="text-sm font-medium text-primary mb-2">Solo Shuffle Format</h3>
            <p className="text-sm text-muted">
              In this format, teams are randomly shuffled each round to ensure fair competition 
              and find the best individual player. Each player will play with different teammates 
              throughout the tournament.
            </p>
          </div>

          <div className="flex gap-4 pt-6">            <button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Creating...'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tournament
                </>
              )}
            </button>
            <Link
              href="/"
              className="px-6 py-2 btn-secondary rounded-md hover:opacity-90 flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
