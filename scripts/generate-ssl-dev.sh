#!/bin/bash

# Script to generate SSL certificates for development
# Run this script instead of committing certificates to git

echo "🔒 Generating SSL certificates for development..."

# Create ssl directory if it doesn't exist
mkdir -p ../client/ssl

# Generate self-signed certificate for localhost with SAN extension
docker run --rm -v "$(pwd)/../client/ssl:/certs" alpine/openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout /certs/tempra.key \
  -out /certs/tempra.crt \
  -subj "/C=VN/ST=HCM/L=HoChiMinh/O=Tempra/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificates location: ../client/ssl/"
echo "🔑 Private key: tempra.key ($(du -h ../client/ssl/tempra.key | cut -f1))"
echo "📜 Certificate: tempra.crt ($(du -h ../client/ssl/tempra.crt | cut -f1))"
echo ""
echo "🔧 Certificate includes Subject Alternative Names:"
echo "   - DNS: localhost, *.localhost"
echo "   - IP: 127.0.0.1"
echo ""
echo "⚠️  These are self-signed certificates for development only."
echo "🌐 Access your app at: https://localhost (Accept browser warning)"
echo ""
echo "🐳 Ready for Docker deployment!"
