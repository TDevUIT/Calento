#!/bin/bash

# Cloudflare Origin SSL setup - EASIEST option
# Run this on your VPS after setting up Cloudflare

echo "☁️ Setting up Cloudflare Origin SSL certificates..."

# Create ssl directory
mkdir -p client/ssl

echo "📋 Steps to get Cloudflare Origin certificates:"
echo ""
echo "1. Go to Cloudflare Dashboard → SSL/TLS → Origin Server"
echo "2. Click 'Create Certificate'"
echo "3. Select 'Generate private key and CSR with Cloudflare'"
echo "4. Add hostnames:"
echo "   - api.calento.space"
echo "   - qa.calento.space"
echo "   - *.calento.space"
echo "5. Certificate validity: 15 years"
echo "6. Click 'Create'"
echo "7. Copy the certificate and private key"
echo ""
echo "🔐 Then save them as:"
echo "   - Certificate → client/ssl/calento.crt"
echo "   - Private key → client/ssl/calento.key"
echo ""
echo "⚡ Benefits of Cloudflare:"
echo "   - FREE SSL certificates"
echo "   - Auto-renewal (15 years validity)"
echo "   - DDoS protection"
echo "   - CDN acceleration"
echo "   - Easy DNS management"
echo ""
echo "🚀 After saving certificates, deploy with:"
echo "   docker compose -f provision/docker-compose.yml up --build -d"
