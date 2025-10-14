# BullMQ Queue System - Quick Start

## 🚀 5-Minute Setup

### 1. Install & Start Redis

```bash
# Option A: Docker (Recommended)
docker run -d --name calento-redis -p 6379:6379 redis:alpine

# Option B: Windows (Chocolatey)
choco install redis-64
redis-server

# Verify
redis-cli ping
# Expected: PONG
```

### 2. Configure Environment

Add to your `.env`:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
QUEUE_CONCURRENCY=10
```

### 3. Start Application

```bash
cd server
npm run dev
```

**Look for these log messages:**
```
[EventSyncProcessor] Event sync worker started with concurrency: 5
[EmailProcessor] Email worker started with concurrency: 5
[WebhookProcessor] Webhook worker started with concurrency: 10
[QueueModule] Queue "event-sync" initialized
```

### 4. Test Queue System

**Health Check:**
```bash
curl http://localhost:8000/api/queues/health
```

**Queue a Job:**
```bash
curl -X POST http://localhost:8000/api/events/queue/pull \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-123",
    "timeMin": "2024-01-01T00:00:00Z",
    "timeMax": "2024-12-31T23:59:59Z",
    "priority": "high"
  }'
```

**Check Job Status:**
```bash
# Use jobId from previous response
curl http://localhost:8000/api/events/queue/jobs/1
```

---

## 🎯 Common Use Cases

### Queue Event Sync

```typescript
// In your controller/service
import { EventSyncQueueService } from '@/common/queue/services/event-sync-queue.service';

async syncUserCalendar(userId: string) {
  const job = await this.eventSyncQueue.queueEventPull(
    userId,
    {
      timeMin: new Date(),
      timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  );
  
  return { jobId: job.id, status: 'queued' };
}
```

### Queue Email

```typescript
import { EmailQueueService } from '@/common/queue/services/email-queue.service';

async sendWelcomeEmail(user: User) {
  await this.emailQueue.queueWelcomeEmail(
    user.id,
    user.email,
    user.name
  );
}
```

### Queue Webhook

```typescript
import { WebhookQueueService } from '@/common/queue/services/webhook-queue.service';

async notifyWebhook(userId: string, event: Event) {
  const webhookUrl = await this.getWebhookUrl(userId);
  
  await this.webhookQueue.queueEventUpdateWebhook(
    userId,
    webhookUrl,
    event,
    'created'
  );
}
```

---

## 📊 Monitoring

**Queue Dashboard:**
```bash
# Get all queues health
GET http://localhost:8000/api/queues/health

# Get specific queue metrics
GET http://localhost:8000/api/queues/event-sync/metrics

# Get failed jobs
GET http://localhost:8000/api/queues/event-sync/failed?limit=10
```

**Job Management:**
```bash
# Retry failed job
POST http://localhost:8000/api/queues/event-sync/jobs/{jobId}/retry

# Remove job
DELETE http://localhost:8000/api/queues/event-sync/jobs/{jobId}

# Pause queue
POST http://localhost:8000/api/queues/event-sync/pause

# Resume queue
POST http://localhost:8000/api/queues/event-sync/resume
```

---

## 🔧 Troubleshooting

### Redis Not Running
```bash
# Check status
redis-cli ping

# Start Redis (Docker)
docker start calento-redis

# Start Redis (Windows)
redis-server
```

### Workers Not Starting
1. Check Redis connection in logs
2. Verify `REDIS_HOST` and `REDIS_PORT` in `.env`
3. Ensure QueueModule is imported in AppModule

### Jobs Not Processing
1. Check workers started (see logs)
2. Check queue not paused: `GET /api/queues/event-sync/metrics`
3. Resume if needed: `POST /api/queues/event-sync/resume`

---

## 📚 Documentation

- **Full Guide**: [docs/BULLMQ_QUEUE_SYSTEM.md](../docs/BULLMQ_QUEUE_SYSTEM.md)
- **Installation**: [docs/QUEUE_INSTALLATION_GUIDE.md](../docs/QUEUE_INSTALLATION_GUIDE.md)
- **Implementation**: [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)

---

## ✅ Quick Checklist

- [ ] Redis running (`redis-cli ping`)
- [ ] Environment configured (`.env`)
- [ ] Application started (`npm run dev`)
- [ ] Workers started (check logs)
- [ ] Health check passed (`/api/queues/health`)
- [ ] Test job queued and processed

**Ready to use!** 🎉
