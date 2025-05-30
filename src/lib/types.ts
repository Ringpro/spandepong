// Tournament types
export interface Tournament {
  id: string;
  name: string;
  description?: string;
  status: 'created' | 'active' | 'finished';
  created_at: string;
  max_players: number;
  player_count?: number;
  round_count?: number;
  match_count?: number;
  players?: Player[];
  rounds?: Round[];
}

// Player types
export interface Player {
  id: string;
  name: string;
  email?: string;
  created_at: string;
  total_matches?: number;
  wins?: number;
  win_rate?: number;
  tournament_matches?: number;
  tournament_wins?: number;
  tournament_win_rate?: number;
}

// Team types
export interface Team {
  id: string;
  name: string;
  created_at: string;
  members: Player[];
}

// Match types
export interface GameMatch {
  id: string;
  team1: Team;
  team2: Team;
  team1_score: number;
  team2_score: number;
  status: 'pending' | 'active' | 'completed';
  winner?: Team;
  started_at?: string;
  finished_at?: string;
  created_at: string;
}

// Round types
export interface Round {
  id: string;
  round_number: number;  status: 'pending' | 'active' | 'completed';
  created_at: string;
  matches: GameMatch[];
}

// Tournament registration
export interface TournamentRegistration {
  id: string;
  player: Player;
  tournament: Tournament;
  registered_at: string;
}

// Team membership for statistics
export interface TeamMembership {
  id: string;  player: Player;
  team: Team;
  match: GameMatch;
  created_at: string;
}
