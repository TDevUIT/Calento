#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Generating secrets for Calento...\n');

// Generate secrets
const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');
const sessionSecret = crypto.randomBytes(32).toString('hex');
const dbPassword = crypto.randomBytes(16).toString('base64').replace(/[/+=]/g, '');

console.log('Copy these values to your .env file:');
console.log('=====================================');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log(`DB_PASSWORD=${dbPassword}`);
console.log('=====================================\n');

console.log('⚠️  Still need to configure manually:');
console.log('- SMTP_USER and SMTP_PASSWORD (Gmail App Password)');
console.log('- GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (Google Cloud Console)');
console.log('- WEBHOOK_URL (your domain)');
console.log('- APP_URL and CORS_ORIGIN (your domain)');
