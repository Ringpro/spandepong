#!/usr/bin/env node

/**
 * Script to deploy EdgeDB schema to cloud instance
 * Usage: node scripts/deploy-to-cloud.js <CLOUD_DSN>
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: projectRoot,
      ...options
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function deployToCloud() {
  const cloudDsn = process.argv[2];
  
  if (!cloudDsn) {
    console.error('❌ Please provide the EdgeDB Cloud connection string');
    console.error('Usage: node scripts/deploy-to-cloud.js <CLOUD_DSN>');
    console.error('Example: node scripts/deploy-to-cloud.js "edgedb://your-instance.your-org.edgedb.cloud/edgedb?tls_security=insecure"');
    process.exit(1);
  }

  console.log('🚀 Deploying EdgeDB schema to cloud instance...');
  
  try {
    // Set the environment variable for this session
    process.env.EDGEDB_DSN = cloudDsn;
    
    console.log('📦 Creating migration...');
    await runCommand('edgedb', ['migration', 'create']);
    
    console.log('🔄 Applying migration to cloud instance...');
    await runCommand('edgedb', ['migrate']);
    
    console.log('✅ Successfully deployed schema to EdgeDB Cloud!');
    console.log('🔧 Don\'t forget to:');
    console.log('  1. Add EDGEDB_DSN to Vercel environment variables');
    console.log('  2. Redeploy your Vercel application');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deployToCloud();
