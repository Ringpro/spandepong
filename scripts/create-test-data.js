const { createClient } = require('edgedb');

async function createTestData() {
  const client = createClient();

  try {
    console.log('Creating test players...');
    
    // Create some test players
    const players = [
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
      { name: 'Charlie Brown', email: 'charlie@example.com' },
      { name: 'Diana Prince', email: 'diana@example.com' },
      { name: 'Eva Martinez', email: 'eva@example.com' },
      { name: 'Frank Wilson', email: 'frank@example.com' },
      { name: 'Grace Lee', email: 'grace@example.com' },
      { name: 'Henry Davis', email: 'henry@example.com' }
    ];

    for (const player of players) {
      await client.query(`
        INSERT Player {
          name := <str>$name,
          email := <optional str>$email
        }
      `, player);
      console.log(`Created player: ${player.name}`);
    }    // Create a test tournament
    console.log('Creating test tournament...');
    const tournament = await client.query(`
      INSERT Tournament {
        name := "Friday Night Spandepong",
        description := "Weekly spandepong tournament with beer buckets!",
        max_players := 8,
        status := 'created'
      }
    `);

    console.log('Test data created successfully!');
    console.log('Players and tournament are ready for testing.');

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await client.close();
  }
}

createTestData();
