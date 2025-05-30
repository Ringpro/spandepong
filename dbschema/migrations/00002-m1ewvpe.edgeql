CREATE MIGRATION m1ewvpep3ytwyyizqygzkhwem7sp4moohp5myzdwkgjtkrlhmasdva
    ONTO m1jgoaj7y3avtsfru6wmcp3f6jp4wp3wihum5jpfrtdjf3t6gke7kq
{
  CREATE TYPE default::Round {
      CREATE REQUIRED LINK tournament: default::Tournament;
      CREATE REQUIRED PROPERTY round_number: std::int16;
      CREATE CONSTRAINT std::exclusive ON ((.tournament, .round_number));
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY status: std::str {
          SET default := 'pending';
          CREATE CONSTRAINT std::one_of('pending', 'active', 'completed');
      };
  };
  CREATE TYPE default::Team {
      CREATE MULTI LINK members: default::Player;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE TYPE default::GameMatch {
      CREATE REQUIRED LINK round: default::Round;
      CREATE REQUIRED LINK team1: default::Team;
      CREATE REQUIRED LINK team2: default::Team;
      CREATE REQUIRED LINK tournament: default::Tournament;
      CREATE CONSTRAINT std::exclusive ON ((.tournament, .round, .team1, .team2));
      CREATE LINK winner: default::Team;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY finished_at: std::datetime;
      CREATE PROPERTY started_at: std::datetime;
      CREATE PROPERTY status: std::str {
          SET default := 'pending';
          CREATE CONSTRAINT std::one_of('pending', 'active', 'completed');
      };
      CREATE PROPERTY team1_score: std::int16 {
          SET default := 0;
      };
      CREATE PROPERTY team2_score: std::int16 {
          SET default := 0;
      };
  };
  CREATE TYPE default::TeamMembership {
      CREATE REQUIRED LINK game_match: default::GameMatch;
      CREATE REQUIRED LINK player: default::Player;
      CREATE CONSTRAINT std::exclusive ON ((.player, .game_match));
      CREATE REQUIRED LINK team: default::Team;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
