import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function applyMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Applying missing migration modules...\n');

    // Module 11: Context
    const module11Path = path.join(__dirname, '../migrations/modules/11_context.sql');
    const module11Sql = fs.readFileSync(module11Path, 'utf-8');
    
    console.log('📝 Applying Module 11: Context (user_context_summary table)...');
    await client.query(module11Sql);
    console.log('✅ Module 11 applied successfully\n');

    // Module 12: Hybrid Search
    const module12Path = path.join(__dirname, '../migrations/modules/12_hybrid_search.sql');
    const module12Sql = fs.readFileSync(module12Path, 'utf-8');
    
    console.log('📝 Applying Module 12: Hybrid Search (tsvector for text search)...');
    await client.query(module12Sql);
    console.log('✅ Module 12 applied successfully\n');

    console.log('🎉 All missing modules applied successfully!');
    
  } catch (error) {
    console.error('❌ Error applying migrations:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

applyMigrations().catch(console.error);
