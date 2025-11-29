
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function verifyDatabaseEncoding() {
    console.log('🔍 Verifying Database Encoding...');

    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'tempra',
        client_encoding: 'UTF8',
    });

    try {
        const client = await pool.connect();
        console.log('✅ Connected to database');

        const encodingRes = await client.query('SHOW client_encoding');
        console.log(`ℹ️  Client Encoding: ${encodingRes.rows[0].client_encoding}`);

        const serverEncodingRes = await client.query('SHOW server_encoding');
        console.log(`ℹ️  Server Encoding: ${serverEncodingRes.rows[0].server_encoding}`);

        const testEmoji = '📋';
        const testQuery = 'SELECT $1::text as emoji';
        const result = await client.query(testQuery, [testEmoji]);

        const returnedEmoji = result.rows[0].emoji;

        if (returnedEmoji === testEmoji) {
            console.log(`✅ Emoji Round-trip Successful: Sent "${testEmoji}" -> Received "${returnedEmoji}"`);
        } else {
            console.error(`❌ Emoji Round-trip FAILED: Sent "${testEmoji}" -> Received "${returnedEmoji}"`);
            console.log('   Possible issue: Database encoding or client connection encoding mismatch.');
        }

        client.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    } finally {
        await pool.end();
    }
}

verifyDatabaseEncoding();
