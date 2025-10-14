# PowerShell script to generate SSL certificates for development
# Run this script instead of committing certificates to git

Write-Host "🔒 Generating SSL certificates for development..." -ForegroundColor Green

# Create ssl directory if it doesn't exist
$sslDir = "..\client\ssl"
if (!(Test-Path $sslDir)) {
    New-Item -ItemType Directory -Path $sslDir -Force | Out-Null
}

Write-Host "📁 Creating SSL certificates directory: $sslDir" -ForegroundColor Yellow

# Generate self-signed certificate for localhost with SAN extension
Write-Host "🔧 Generating certificate using Docker..." -ForegroundColor Yellow

$dockerCommand = @"
docker run --rm -v "${PWD}/../client/ssl:/certs" alpine/openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout /certs/calento.key \
  -out /certs/calento.crt \
  -subj "/C=VN/ST=HCM/L=HoChiMinh/O=Calento/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"
"@

try {
    Invoke-Expression $dockerCommand
    
    Write-Host "✅ SSL certificates generated successfully!" -ForegroundColor Green
    Write-Host "📁 Certificates location: ../client/ssl/" -ForegroundColor Cyan
    
    $keySize = (Get-Item "../client/ssl/calento.key").Length / 1KB
    $crtSize = (Get-Item "../client/ssl/calento.crt").Length / 1KB
    
    Write-Host "🔑 Private key: calento.key ($([math]::Round($keySize, 1)) KB)" -ForegroundColor Cyan
    Write-Host "📜 Certificate: calento.crt ($([math]::Round($crtSize, 1)) KB)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔧 Certificate includes Subject Alternative Names:" -ForegroundColor Yellow
    Write-Host "   - DNS: localhost, *.localhost"
    Write-Host "   - IP: 127.0.0.1"
    Write-Host ""
    Write-Host "⚠️  These are self-signed certificates for development only." -ForegroundColor Yellow
    Write-Host "🌐 Access your app at: https://localhost (Accept browser warning)" -ForegroundColor Green
    Write-Host ""
    Write-Host "🐳 Ready for Docker deployment!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error generating certificates: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure Docker is running and try again." -ForegroundColor Yellow
}
