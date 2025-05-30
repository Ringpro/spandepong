module default {
    type Player {
        required name: str {
            constraint exclusive;
        }
        email: str;
        created_at: datetime {
            default := datetime_current();
        }
    }

    type Tournament {
        required name: str;
        description: str;
        created_at: datetime {
            default := datetime_current();
        }
        status: str {
            default := 'created';
            constraint one_of('created', 'active', 'finished');
        }
        max_players: int16 {
            default := 8;
        }
    }

    type TournamentRegistration {
        required player: Player;
        required tournament: Tournament;
        registered_at: datetime {
            default := datetime_current();
        }
        constraint exclusive on ((.player, .tournament));
    }

    type Round {
        required tournament: Tournament;
        required round_number: int16;
        created_at: datetime {
            default := datetime_current();
        }
        status: str {
            default := 'pending';
            constraint one_of('pending', 'active', 'completed');
        }
        constraint exclusive on ((.tournament, .round_number));
    }    type Team {
        required name: str;
        created_at: datetime {
            default := datetime_current();
        }
        multi members: Player;
    }

    type GameMatch {
        required tournament: Tournament;
        required round: Round;
        required team1: Team;
        required team2: Team;
        
        team1_score: int16 {
            default := 0;
        }
        team2_score: int16 {
            default := 0;
        }
        
        status: str {
            default := 'pending';
            constraint one_of('pending', 'active', 'completed');
        }
        winner: Team;
        
        created_at: datetime {
            default := datetime_current();
        }
        started_at: datetime;
        finished_at: datetime;
        
        constraint exclusive on ((.tournament, .round, .team1, .team2));
    }

    type TeamMembership {
        required player: Player;
        required team: Team;
        required game_match: GameMatch;
        created_at: datetime {
            default := datetime_current();
        }
        constraint exclusive on ((.player, .game_match));
    }
}
