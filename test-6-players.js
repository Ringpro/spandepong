// Test the new solo shuffle algorithm with 6 players
function generateSoloShuffleTeams(playerIds) {
  if (playerIds.length < 4) {
    throw new Error('Solo shuffle requires at least 4 players');
  }

  if (playerIds.length % 2 !== 0) {
    throw new Error('Solo shuffle requires an even number of players');
  }

  // Shuffle the players randomly
  const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
  const teams = [];

  if (playerIds.length % 4 === 0) {
    // For multiples of 4: create simultaneous matches (4, 8, 12 players)
    for (let i = 0; i < shuffled.length; i += 4) {
      teams.push({
        team1: [shuffled[i], shuffled[i + 1]],
        team2: [shuffled[i + 2], shuffled[i + 3]]
      });
    }
  } else {
    // For 6, 10, 14 players etc: create one match per round, rotate players
    // Take first 4 players for this round
    teams.push({
      team1: [shuffled[0], shuffled[1]],
      team2: [shuffled[2], shuffled[3]]
    });
    
    // Note: In a 6-player tournament, the remaining 2 players will rotate in future rounds
    // This ensures everyone gets to play with different partners across multiple rounds
  }

  return teams;
}

// Test with different player counts
const players4 = ['Alice', 'Bob', 'Charlie', 'Diana'];
const players6 = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
const players8 = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];

console.log('=== 4 PLAYERS ===');
console.log('Players:', players4);
const teams4 = generateSoloShuffleTeams(players4);
console.log('Matches:', teams4);
console.log('All players in matches:', teams4.flatMap(t => [...t.team1, ...t.team2]));

console.log('\n=== 6 PLAYERS ===');
console.log('Players:', players6);
const teams6 = generateSoloShuffleTeams(players6);
console.log('Matches:', teams6);
console.log('Players in this round:', teams6.flatMap(t => [...t.team1, ...t.team2]));
console.log('Players sitting out:', players6.filter(p => !teams6.flatMap(t => [...t.team1, ...t.team2]).includes(p)));

console.log('\n=== 8 PLAYERS ===');
console.log('Players:', players8);
const teams8 = generateSoloShuffleTeams(players8);
console.log('Matches:', teams8);
console.log('All players in matches:', teams8.flatMap(t => [...t.team1, ...t.team2]));

// Test error cases
console.log('\n=== ERROR TESTS ===');
try {
  generateSoloShuffleTeams(['Alice', 'Bob', 'Charlie']); // 3 players
} catch (e) {
  console.log('✓ 3 players error:', e.message);
}

try {
  generateSoloShuffleTeams(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']); // 5 players
} catch (e) {
  console.log('✓ 5 players error:', e.message);
}
