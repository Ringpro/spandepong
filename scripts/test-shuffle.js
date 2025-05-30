// Test solo shuffle algorithm
const playerIds = [
  '66e0f78c-3d5a-11f0-9621-cb923fe24d7b', // Alice
  '66e26360-3d5a-11f0-aaf2-83a444ce0ef4', // Bob  
  '66e2dbc4-3d5a-11f0-aaf2-f779538767ed', // Charlie
  '66e34fc8-3d5a-11f0-aaf2-b39482d26450'  // Diana
];

function generateSoloShuffleTeams(playerIds) {
  if (playerIds.length < 4 || playerIds.length % 4 !== 0) {
    throw new Error('Solo shuffle requires a multiple of 4 players (minimum 4)');
  }

  // Shuffle the players randomly
  const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
  const teams = [];

  // Create pairs (teams of 2) and then match them up
  for (let i = 0; i < shuffled.length; i += 4) {
    teams.push({
      team1: [shuffled[i], shuffled[i + 1]],
      team2: [shuffled[i + 2], shuffled[i + 3]]
    });
  }

  return teams;
}

console.log('Original players:', playerIds);
const teams = generateSoloShuffleTeams(playerIds);
console.log('Generated teams:', teams);
console.log('Number of matches:', teams.length);
