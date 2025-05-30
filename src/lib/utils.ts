import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to shuffle an array (Fisher-Yates algorithm)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate random teams from a list of players
export function generateRandomTeams<T>(players: T[]): Array<[T, T]> {
  if (players.length % 2 !== 0) {
    throw new Error('Number of players must be even to form teams');
  }
  
  const shuffledPlayers = shuffleArray(players);
  const teams: Array<[T, T]> = [];
  
  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    teams.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
  }
  
  return teams;
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Calculate win rate percentage
export function formatWinRate(wins: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((wins / total) * 100)}%`;
}
