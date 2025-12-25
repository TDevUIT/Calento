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

async function checkAndInstallExtensions() {
    const client = await pool.connect();

    try {
        console.log('🔍 Checking installed extensions...\n');

        const result = await client.query(`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname IN ('vector', 'uuid-ossp');
    `);

        console.log('Installed extensions:');
        result.rows.forEach(row => {
            console.log(`  ✅ ${row.extname} (version ${row.extversion})`);
        });

        // Check if vector extension is missing
        const hasVector = result.rows.some(row => row.extname === 'vector');

        if (!hasVector) {
            console.log('\n❌ pgvector extension not found');
            console.log('📦 Attempting to install pgvector extension...\n');

            try {
                await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
                console.log('✅ pgvector extension installed successfully!\n');
            } catch (error) {
                console.error('❌ Failed to install pgvector extension');
                console.error('Error:', error.message);
                console.error('\n⚠️  Please install pgvector manually:');
                console.error('   1. Install pgvector: https://github.com/pgvector/pgvector#installation');
                console.error('   2. Or use a cloud database that supports pgvector (e.g., Supabase, Neon)');
                throw error;
            }
        } else {
            console.log('\n✅ All required extensions are installed\n');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

checkAndInstallExtensions().catch(console.error);
