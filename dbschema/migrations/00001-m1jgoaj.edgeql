CREATE MIGRATION m1jgoaj7y3avtsfru6wmcp3f6jp4wp3wihum5jpfrtdjf3t6gke7kq
    ONTO initial
{
  CREATE TYPE default::Player {
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY email: std::str;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Tournament {
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY max_players: std::int16 {
          SET default := 8;
      };
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY status: std::str {
          SET default := 'created';
          CREATE CONSTRAINT std::one_of('created', 'active', 'finished');
      };
  };
  CREATE TYPE default::TournamentRegistration {
      CREATE REQUIRED LINK player: default::Player;
      CREATE REQUIRED LINK tournament: default::Tournament;
      CREATE CONSTRAINT std::exclusive ON ((.player, .tournament));
      CREATE PROPERTY registered_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
