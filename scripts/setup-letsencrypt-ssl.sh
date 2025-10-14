#!/bin/bash

# Production SSL setup with Let's Encrypt for Calento domains
# Run this ON YOUR VPS after DNS is pointing correctly

echo "🔒 Setting up Let's Encrypt SSL for production domains..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo ./setup-letsencrypt-ssl.sh)"
  exit 1
fi

# Install certbot if not exists
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Stop nginx temporarily for certificate generation
echo "🔄 Stopping nginx temporarily..."
docker compose -f provision/docker-compose.yml down nginx || systemctl stop nginx 2>/dev/null

# Generate certificates for both domains
echo "🔐 Generating SSL certificates..."
echo "⚠️  Make sure to replace 'your-email@example.com' with your real email!"
read -p "Enter your email address: " USER_EMAIL

certbot certonly --standalone \
  --email "$USER_EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d api.calento.space \
  -d qa.calento.space

# Check if certificates were generated successfully
if [ -f "/etc/letsencrypt/live/api.calento.space/fullchain.pem" ]; then
    echo "✅ Certificates generated successfully!"
    
    # Copy certificates to project ssl directory
    mkdir -p client/ssl
    cp /etc/letsencrypt/live/api.calento.space/fullchain.pem client/ssl/calento.crt
    cp /etc/letsencrypt/live/api.calento.space/privkey.pem client/ssl/calento.key
    
    # Set proper permissions
    chmod 644 client/ssl/calento.crt
    chmod 600 client/ssl/calento.key
    chown root:root client/ssl/calento.*
    
    echo "📁 Certificates copied to client/ssl/"
    echo "🔑 calento.crt: $(du -h client/ssl/calento.crt | cut -f1)"
    echo "🔐 calento.key: $(du -h client/ssl/calento.key | cut -f1)"
    
    # Setup auto-renewal
    echo "⏰ Setting up auto-renewal..."
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'cd /path/to/calento && docker compose -f provision/docker-compose.yml restart nginx'") | crontab -
    
    echo ""
    echo "🎉 Production SSL setup complete!"
    echo "🌐 Your domains are now secured:"
    echo "   - https://api.calento.space ✅"
    echo "   - https://qa.calento.space ✅"
    echo ""
    echo "🚀 Ready to deploy with:"
    echo "   docker compose -f provision/docker-compose.yml up --build -d"
    
else
    echo "❌ Certificate generation failed!"
    echo "💡 Make sure:"
    echo "   1. DNS A records point to this VPS IP"
    echo "   2. Ports 80 and 443 are open"
    echo "   3. No other web server is running"
    exit 1
fi
