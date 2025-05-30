#!/usr/bin/env node

/**
 * Script to verify EdgeDB Cloud connection and schema
 * Usage: node scripts/verify-cloud-connection.js
 */

import { createClient } from 'edgedb';

async function verifyConnection() {
  try {
    console.log('🔍 Verifying EdgeDB Cloud connection...');
    
    const client = createClient();
    
    // Test basic connection
    console.log('📡 Testing connection...');
    const result = await client.querySingle('SELECT 1');
    if (result !== 1) {
      throw new Error('Basic query failed');
    }
    console.log('✅ Connection successful!');
    
    // Check if tables exist
    console.log('🏗️  Checking schema...');
    const tables = await client.query(`
      SELECT schema::ObjectType {
        name
      }
      FILTER .name IN {'Player', 'Tournament', 'TournamentRegistration', 'Round', 'Team', 'TeamMember', 'GameMatch'}
    `);
    
    const expectedTables = ['Player', 'Tournament', 'TournamentRegistration', 'Round', 'Team', 'TeamMember', 'GameMatch'];
    const foundTables = tables.map(t => t.name);
    
    console.log('📋 Found tables:', foundTables.join(', '));
    
    const missingTables = expectedTables.filter(t => !foundTables.includes(t));
    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables:', missingTables.join(', '));
      console.log('💡 Run the deployment script to apply schema');
    } else {
      console.log('✅ All expected tables found!');
    }
    
    // Test a basic query
    console.log('🎯 Testing data operations...');
    const playerCount = await client.querySingle('SELECT count(Player)');
    const tournamentCount = await client.querySingle('SELECT count(Tournament)');
    
    console.log(`📊 Current data: ${playerCount} players, ${tournamentCount} tournaments`);
    
    console.log('🎉 EdgeDB Cloud is ready for production!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.error('🔧 Make sure:');
    console.error('  1. EDGEDB_DSN environment variable is set correctly');
    console.error('  2. EdgeDB Cloud instance is running');
    console.error('  3. Schema has been deployed to the cloud instance');
    process.exit(1);
  }
}

verifyConnection();
