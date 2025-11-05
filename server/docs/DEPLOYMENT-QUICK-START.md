# ⚡ Quick Start - Docker Deployment

> Hướng dẫn deploy nhanh Calento lên VPS với Docker

## 🚀 Deploy trong 10 phút

### 1. Setup VPS

```bash
# Update & install Docker
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose-plugin -y

# Firewall
sudo ufw allow 22,80,443/tcp
sudo ufw enable
```

### 2. Clone & Configure

```bash
# Clone project
git clone https://github.com/yourusername/tempra.git
cd tempra

# Setup environment
cd server && cp .env.example .env
nano .env  # Edit production values

cd ../client && cp .env.example .env
nano .env  # Edit production values

cd ..
```

### 3. SSL Certificate

**Option A: Self-signed (Dev)**
```bash
mkdir -p client/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout client/ssl/calento.key \
  -out client/ssl/calento.crt \
  -subj "/C=VN/ST=HCM/L=HCMC/O=Calento/CN=calento.space"
```

**Option B: Let's Encrypt (Prod)**
```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d calento.space -d api.calento.space
sudo cp /etc/letsencrypt/live/calento.space/fullchain.pem client/ssl/calento.crt
sudo cp /etc/letsencrypt/live/calento.space/privkey.pem client/ssl/calento.key
```

### 4. Deploy

```bash
cd provision

# Build & start
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### 5. Verify

```bash
# Check health
curl https://calento.space
curl https://api.calento.space/api/v1/health

# Check all containers
docker compose ps
```

## 📋 Essential Commands

```bash
# View logs
docker compose logs -f [service]

# Restart service
docker compose restart [service]

# Update application
git pull && docker compose up -d --build

# Backup database
docker compose exec postgres pg_dump -U postgres calento_db > backup.sql

# Stop all
docker compose down

# Stop & remove volumes
docker compose down -v
```

## 🔧 Environment Variables (Required)

### Server `.env`
```env
NODE_ENV=production
DB_PASSWORD=strong_password
REDIS_PASSWORD=redis_password
JWT_SECRET=min_32_characters_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
GEMINI_API_KEY=your_gemini_key
```

### Client `.env`
```env
NEXT_PUBLIC_API_URL=https://api.calento.space
NEXT_PUBLIC_APP_URL=https://calento.space
```

## 🐛 Quick Troubleshooting

**Container không start:**
```bash
docker compose logs [service]
docker compose restart [service]
```

**502 Bad Gateway:**
```bash
docker compose ps  # Check all healthy
docker compose restart nginx
```

**Database connection failed:**
```bash
docker compose logs postgres
docker compose restart server
```

**Port conflict:**
```bash
sudo lsof -i :80  # Check what's using port
sudo kill -9 [PID]
```

## 📊 Services Overview

| Service | Port | URL |
|---------|------|-----|
| Nginx | 80, 443 | https://calento.space |
| Client | 3000 | Internal |
| Server | 8000 | https://api.calento.space |
| PostgreSQL | 5432 | Internal |
| Redis | 6379 | Internal |

## 🔐 Security Checklist

- [ ] SSL certificates configured
- [ ] Firewall enabled (UFW)
- [ ] Strong passwords for DB & Redis
- [ ] JWT secrets (min 32 chars)
- [ ] Environment files không commit to Git
- [ ] Non-root Docker user
- [ ] Regular backups scheduled

## 📝 DNS Configuration

```
A Record: calento.space → VPS_IP
A Record: api.calento.space → VPS_IP
```

Verify: `dig calento.space`

---

**Xem chi tiết:** [DEPLOYMENT-DOCKER-VPS.md](./DEPLOYMENT-DOCKER-VPS.md)
