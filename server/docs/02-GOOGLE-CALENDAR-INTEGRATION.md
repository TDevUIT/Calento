# 📅 Google Calendar Integration Documentation

## Table of Contents
- [Overview](#overview)
- [Connection Flow](#connection-flow)
- [Token Management](#token-management)
- [Calendar Sync](#calendar-sync)
- [Event Synchronization](#event-synchronization)
- [Webhook Integration](#webhook-integration)

---

## Overview

Calento tích hợp với Google Calendar để đồng bộ events hai chiều:
- **Pull**: Lấy events từ Google Calendar về Calento
- **Push**: Tạo/cập nhật events từ Calento lên Google Calendar
- **Real-time Sync**: Webhook notifications từ Google
- **Token Refresh**: Tự động refresh expired tokens

### Core Components

```
modules/google/
├── google.controller.ts        # API endpoints
├── services/
│   ├── google-auth.service.ts  # OAuth & token management
│   └── google-calendar.service.ts  # Calendar operations
└── repositories/
    └── user-credentials.repository.ts  # Token storage

modules/event/
└── services/
    └── event-sync.service.ts   # Event synchronization
```

---

## Connection Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant GoogleController
    participant GoogleAuthService
    participant Google
    participant UserCredentialsRepo
    participant CalendarService
    participant Database

    Note over Client,Database: Step 1: Get Connection URL
    
    Client->>GoogleController: GET /google/connect
    Note over Client: User must be authenticated
    
    GoogleController->>GoogleAuthService: getAuthUrl(userId)
    GoogleAuthService->>GoogleAuthService: generateAuthUrl(scopes)
    Note over GoogleAuthService: Calendar scopes + email/profile
    GoogleAuthService-->>GoogleController: OAuth URL
    GoogleController-->>Client: { auth_url }
    
    Note over Client,Database: Step 2: User Authorization
    
    Client->>Google: Redirect to OAuth URL
    Note over Google: User grants calendar permissions
    Google->>GoogleController: GET /google/callback?code=xxx&state=userId
    
    Note over Client,Database: Step 3: Store Tokens
    
    GoogleController->>GoogleAuthService: handleCallback(code, userId)
    
    GoogleAuthService->>Google: exchangeCode(code)
    Google-->>GoogleAuthService: { access_token, refresh_token, expires_at }
    
    GoogleAuthService->>UserCredentialsRepo: upsert(userId, google, tokens)
    UserCredentialsRepo->>Database: INSERT/UPDATE user_credentials
    Note over UserCredentialsRepo: Store tokens securely
    
    GoogleAuthService-->>GoogleController: { success: true }
    
    Note over Client,Database: Step 4: Sync Calendars
    
    GoogleController->>CalendarService: syncGoogleCalendars(userId)
    CalendarService->>Google: listCalendars(access_token)
    Google-->>CalendarService: [calendars]
    
    loop For each calendar
        CalendarService->>Database: INSERT/UPDATE calendars
    end
    
    GoogleController-->>Client: 302 Redirect to frontend
    Note over Client: Connection successful!
```

### API Endpoints

**1. Get Connection URL:** `GET /api/google/connect`
- Returns: Google OAuth URL với calendar scopes

**2. OAuth Callback:** `GET /api/google/callback?code=xxx`
- Exchange code for tokens
- Store tokens trong user_credentials
- Redirect về frontend

**3. Check Status:** `GET /api/google/status`
- Returns: connected status, expires_at, scopes

**4. Disconnect:** `DELETE /api/google/disconnect`
- Xóa tokens khỏi database
- Revoke access trên Google

---

## Token Management

### Token Lifecycle

```mermaid
stateDiagram-v2
    [*] --> NoToken: User not connected
    NoToken --> ValidToken: OAuth connection
    ValidToken --> ExpiredToken: Token expires (1 hour)
    ExpiredToken --> ValidToken: Auto refresh
    ExpiredToken --> RefreshFailed: Refresh token invalid
    RefreshFailed --> NoToken: User must reconnect
    ValidToken --> Revoked: User disconnects
    Revoked --> NoToken: Delete tokens
    NoToken --> [*]
```

### Token Refresh Flow

```mermaid
sequenceDiagram
    participant EventService
    participant GoogleAuthService
    participant UserCredentialsRepo
    participant Google
    participant Database

    EventService->>GoogleAuthService: getValidAccessToken(userId)
    
    GoogleAuthService->>UserCredentialsRepo: findByUserAndProvider(userId, google)
    UserCredentialsRepo->>Database: SELECT * FROM user_credentials
    Database-->>UserCredentialsRepo: Credentials
    UserCredentialsRepo-->>GoogleAuthService: { access_token, refresh_token, expires_at }
    
    GoogleAuthService->>GoogleAuthService: isTokenExpired(expires_at)
    
    alt Token expired
        GoogleAuthService->>GoogleAuthService: refreshAccessToken(userId)
        
        GoogleAuthService->>Google: POST /token (refresh_token)
        Google-->>GoogleAuthService: { access_token, refresh_token, expires_at }
        
        GoogleAuthService->>UserCredentialsRepo: update(userId, google, newTokens)
        UserCredentialsRepo->>Database: UPDATE user_credentials
        
        GoogleAuthService-->>EventService: new_access_token
    else Token valid
        GoogleAuthService-->>EventService: existing_access_token
    end
```

### Token Management Logic

**getValidAccessToken:**
1. Tìm credentials từ database
2. Check token đã expired chưa
3. Nếu expired: Gọi refreshAccessToken()
4. Return valid access token

**refreshAccessToken:**
1. Lấy refresh_token từ database
2. Gọi Google API để refresh
3. Nhận new access_token và refresh_token
4. Update vào database
5. Return success/failure

---

## Calendar Sync

### Sync Calendars Flow

```mermaid
sequenceDiagram
    participant Client
    participant CalendarController
    participant CalendarService
    participant GoogleCalendarService
    participant GoogleAuthService
    participant Google
    participant Database

    Client->>CalendarController: POST /calendars/sync
    Note over Client: Sync all calendars from Google
    
    CalendarController->>CalendarService: syncGoogleCalendars(userId)
    
    CalendarService->>GoogleAuthService: getValidAccessToken(userId)
    GoogleAuthService-->>CalendarService: access_token
    
    CalendarService->>GoogleCalendarService: listCalendars(userId)
    
    GoogleCalendarService->>Google: GET /calendar/v3/users/me/calendarList
    Google-->>GoogleCalendarService: { items: [calendars] }
    
    loop For each Google Calendar
        GoogleCalendarService->>Database: Check if calendar exists
        
        alt Calendar exists
            GoogleCalendarService->>Database: UPDATE calendars
        else New calendar
            GoogleCalendarService->>Database: INSERT INTO calendars
        end
    end
    
    GoogleCalendarService-->>CalendarService: syncedCalendars[]
    CalendarService-->>CalendarController: { synced: count }
    CalendarController-->>Client: 200 OK
```

### Calendar Data Mapping

```typescript
// Google Calendar → Calento Calendar

{
  // Google Calendar API Response
  id: "primary",
  summary: "John Doe",
  description: "Personal calendar",
  timeZone: "Asia/Ho_Chi_Minh",
  backgroundColor: "#9fc6e7",
  primary: true
}

↓ Mapped to ↓

{
  // Calento Calendar Object
  google_calendar_id: "primary",
  name: "John Doe",
  description: "Personal calendar",
  timezone: "Asia/Ho_Chi_Minh",
  color: "#9fc6e7",
  is_primary: true,
  user_id: "uuid",
  is_active: true
}
```

---

## Event Synchronization

### Architecture Overview

```mermaid
graph TB
    subgraph "Calento Backend"
        A[EventService]
        B[EventSyncService]
        C[EventRepository]
        D[GoogleCalendarService]
        E[GoogleAuthService]
    end
    
    subgraph "External"
        F[Google Calendar API]
        G[Database]
    end
    
    A --> B
    B --> C
    B --> D
    D --> E
    E --> F
    C --> G
    D --> F
    
    style A fill:#4285f4
    style B fill:#34a853
    style D fill:#ea4335
```

### Create Event with Sync

```mermaid
sequenceDiagram
    participant Client
    participant EventController
    participant EventService
    participant EventSyncService
    participant EventRepository
    participant GoogleCalendarService
    participant Google
    participant Database

    Client->>EventController: POST /events
    Note over Client: CreateEventDto
    
    EventController->>EventService: createEvent(dto, userId)
    EventService->>EventSyncService: createEventWithSync(dto, userId)
    
    Note over EventSyncService: Step 1: Create in Database
    
    EventSyncService->>EventRepository: createEvent(dto, userId)
    EventRepository->>Database: INSERT INTO events
    Database-->>EventRepository: Event created
    EventRepository-->>EventSyncService: localEvent
    
    Note over EventSyncService: Step 2: Sync to Google (if connected)
    
    EventSyncService->>GoogleCalendarService: isConnected(userId)
    GoogleCalendarService-->>EventSyncService: true/false
    
    alt User connected to Google
        EventSyncService->>GoogleCalendarService: createEvent(userId, event)
        
        GoogleCalendarService->>Google: POST /calendar/v3/calendars/{calendarId}/events
        Google-->>GoogleCalendarService: { id: googleEventId }
        
        GoogleCalendarService-->>EventSyncService: { googleEventId, success: true }
        
        EventSyncService->>EventRepository: updateGoogleEventId(eventId, googleEventId)
        EventRepository->>Database: UPDATE events SET google_event_id = ?
        
        EventSyncService-->>EventService: { event, syncedToGoogle: true, googleEventId }
    else User not connected
        EventSyncService-->>EventService: { event, syncedToGoogle: false }
    end
    
    EventService-->>EventController: Event with sync status
    EventController-->>Client: 201 Created
```

### Update Event with Sync

```mermaid
sequenceDiagram
    participant Client
    participant EventController
    participant EventSyncService
    participant EventRepository
    participant GoogleCalendarService
    participant Google
    participant Database

    Client->>EventController: PATCH /events/:id
    EventController->>EventSyncService: updateEventWithSync(id, dto, userId)
    
    EventSyncService->>EventRepository: findById(id)
    EventRepository->>Database: SELECT * FROM events WHERE id = ?
    Database-->>EventRepository: Existing event
    EventRepository-->>EventSyncService: existingEvent
    
    Note over EventSyncService: Step 1: Update Database
    
    EventSyncService->>EventRepository: updateEvent(id, dto)
    EventRepository->>Database: UPDATE events
    Database-->>EventRepository: Updated event
    EventRepository-->>EventSyncService: updatedEvent
    
    Note over EventSyncService: Step 2: Sync to Google
    
    alt Event has google_event_id
        EventSyncService->>GoogleCalendarService: updateEvent(userId, googleEventId, event)
        GoogleCalendarService->>Google: PUT /calendar/v3/calendars/{cal}/events/{eventId}
        Google-->>GoogleCalendarService: Updated Google event
        GoogleCalendarService-->>EventSyncService: { success: true }
    end
    
    EventSyncService-->>EventController: { event, syncedToGoogle: true }
    EventController-->>Client: 200 OK
```

### Delete Event with Sync

```mermaid
sequenceDiagram
    participant Client
    participant EventController
    participant EventSyncService
    participant EventRepository
    participant GoogleCalendarService
    participant Google
    participant Database

    Client->>EventController: DELETE /events/:id
    EventController->>EventSyncService: deleteEventWithSync(id, userId)
    
    EventSyncService->>EventRepository: findById(id)
    EventRepository-->>EventSyncService: event { google_event_id }
    
    Note over EventSyncService: Step 1: Delete from Google
    
    alt Event has google_event_id
        EventSyncService->>GoogleCalendarService: deleteEvent(userId, googleEventId)
        GoogleCalendarService->>Google: DELETE /calendar/v3/calendars/{cal}/events/{eventId}
        Google-->>GoogleCalendarService: { success: true }
    end
    
    Note over EventSyncService: Step 2: Delete from Database
    
    EventSyncService->>EventRepository: deleteEvent(id, userId)
    EventRepository->>Database: DELETE FROM events WHERE id = ?
    Database-->>EventRepository: Deleted
    
    EventSyncService-->>EventController: { deleted: true, deletedFromGoogle: true }
    EventController-->>Client: 200 OK
```

### Pull Events from Google

```mermaid
sequenceDiagram
    participant Client
    participant EventController
    participant EventSyncService
    participant GoogleCalendarService
    participant EventRepository
    participant Google
    participant Database

    Client->>EventController: POST /events/sync/pull
    Note over Client: { timeMin, timeMax, calendarId }
    
    EventController->>EventSyncService: pullEventsFromGoogle(userId, params)
    
    EventSyncService->>GoogleCalendarService: listEvents(userId, params)
    
    GoogleCalendarService->>Google: GET /calendar/v3/calendars/{cal}/events
    Note over Google: timeMin, timeMax, singleEvents=true
    Google-->>GoogleCalendarService: { items: [googleEvents] }
    
    loop For each Google Event
        GoogleCalendarService->>EventSyncService: googleEvent
        
        EventSyncService->>EventRepository: findByGoogleEventId(googleEventId)
        EventRepository->>Database: SELECT * FROM events WHERE google_event_id = ?
        Database-->>EventRepository: Existing event or null
        
        alt Event exists in DB
            EventSyncService->>EventRepository: updateEvent(eventId, googleEventData)
            EventRepository->>Database: UPDATE events
        else New event from Google
            EventSyncService->>EventRepository: createEvent(googleEventData)
            EventRepository->>Database: INSERT INTO events
        end
    end
    
    EventSyncService-->>EventController: { synced: count }
    EventController-->>Client: 200 OK
```

---

## Webhook Integration

### Webhook Flow

```mermaid
sequenceDiagram
    participant Google
    participant WebhookController
    participant WebhookService
    participant GoogleCalendarService
    participant EventSyncService
    participant Database

    Note over Google,Database: Setup: Create Watch Channel
    
    WebhookController->>WebhookService: watchCalendar(userId, calendarId)
    WebhookService->>Google: POST /calendar/v3/calendars/{cal}/events/watch
    Note over Google: Create watch channel (max 7 days)
    Google-->>WebhookService: { id: channelId, resourceId }
    
    WebhookService->>Database: Save channel info
    Note over Database: webhook_channels table
    
    Note over Google,Database: Event Change Notification
    
    Google->>WebhookController: POST /webhook/google
    Note over Google: Headers: x-goog-channel-id, x-goog-resource-id
    
    WebhookController->>WebhookService: handleNotification(headers)
    
    WebhookService->>Database: Find channel by channelId
    Database-->>WebhookService: { user_id, calendar_id }
    
    WebhookService->>EventSyncService: pullEventsFromGoogle(userId)
    Note over EventSyncService: Sync changed events
    
    WebhookService-->>WebhookController: { success: true }
    WebhookController-->>Google: 200 OK
```

### Webhook Setup

```typescript
POST /api/webhook/google/watch
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "calendar_id": "primary",
  "expiration": "2024-12-31T23:59:59Z"  // Optional, max 7 days
}

Response (200 OK):
{
  "status": 200,
  "message": "Webhook channel created",
  "data": {
    "channel_id": "uuid",
    "resource_id": "google-resource-id",
    "expiration": "2024-12-31T23:59:59Z"
  }
}
```

### Stop Webhook

```typescript
DELETE /api/webhook/google/watch/:channelId
Authorization: Bearer {access_token}

Response (200 OK):
{
  "status": 200,
  "message": "Webhook channel stopped",
  "data": {
    "success": true
  }
}
```

---

## Event Data Mapping

### Google Event → Calento Event

```typescript
// Google Calendar Event
{
  id: "google-event-id",
  summary: "Team Meeting",
  description: "Weekly team sync",
  start: { dateTime: "2024-01-01T10:00:00Z", timeZone: "Asia/Ho_Chi_Minh" },
  end: { dateTime: "2024-01-01T11:00:00Z", timeZone: "Asia/Ho_Chi_Minh" },
  location: "Conference Room A",
  attendees: [
    { email: "user@example.com", responseStatus: "accepted" }
  ],
  recurrence: ["RRULE:FREQ=WEEKLY;BYDAY=MO"],
  conferenceData: {
    entryPoints: [
      { entryPointType: "video", uri: "https://meet.google.com/abc-defg-hij" }
    ]
  }
}

↓ Mapped to ↓

// Calento Event
{
  id: "uuid",
  google_event_id: "google-event-id",
  title: "Team Meeting",
  description: "Weekly team sync",
  start_time: "2024-01-01T10:00:00Z",
  end_time: "2024-01-01T11:00:00Z",
  timezone: "Asia/Ho_Chi_Minh",
  location: "Conference Room A",
  attendees: [
    { email: "user@example.com", response_status: "accepted" }
  ],
  recurrence_rule: "FREQ=WEEKLY;BYDAY=MO",
  conference_data: {
    type: "google_meet",
    url: "https://meet.google.com/abc-defg-hij"
  },
  user_id: "uuid",
  calendar_id: "uuid",
  is_all_day: false,
  color: "#4285f4"
}
```

---

## Error Handling

### Common Errors

```typescript
// 1. Token Expired
{
  "code": "TOKEN_EXPIRED",
  "message": "Access token has expired",
  "action": "REFRESH_TOKEN"
}

// 2. Insufficient Permissions
{
  "code": "INSUFFICIENT_PERMISSIONS",
  "message": "Missing calendar scope",
  "action": "RECONNECT"
}

// 3. Calendar Not Found
{
  "code": "CALENDAR_NOT_FOUND",
  "message": "Calendar does not exist",
  "action": "SYNC_CALENDARS"
}

// 4. Rate Limit
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests to Google API",
  "action": "RETRY_LATER"
}
```

### Retry Strategy

```typescript
// Exponential backoff for transient errors
const retryDelays = [1000, 2000, 4000, 8000];  // milliseconds

async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = retryDelays[i];
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

---

## Best Practices

1. **Token Management**
   - Always check token expiry before API calls
   - Auto-refresh expired tokens
   - Handle refresh token expiry gracefully
   - Store tokens securely (encrypted at rest)

2. **API Rate Limits**
   - Implement exponential backoff
   - Use batch requests when possible
   - Cache calendar lists
   - Monitor quota usage

3. **Data Consistency**
   - Always sync bidirectionally
   - Handle conflicts (last-write-wins)
   - Log all sync operations
   - Implement retry logic

4. **Security**
   - Request minimum required scopes
   - Validate webhook signatures
   - Use HTTPS for webhook endpoint
   - Sanitize event data

---

## Environment Variables

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/google/callback

# Webhook Configuration
WEBHOOK_URL=https://your-domain.com/api/webhook/google
```

---

## Database Schema

### user_credentials Table

```sql
CREATE TABLE user_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,  -- 'google'
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP NOT NULL,
  scope TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

CREATE INDEX idx_credentials_user_provider ON user_credentials(user_id, provider);
CREATE INDEX idx_credentials_expires ON user_credentials(expires_at);
```

### webhook_channels Table

```sql
CREATE TABLE webhook_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  calendar_id VARCHAR(255) NOT NULL,
  channel_id VARCHAR(255) NOT NULL UNIQUE,
  resource_id VARCHAR(255) NOT NULL,
  expiration TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_webhook_channels_user ON webhook_channels(user_id);
CREATE INDEX idx_webhook_channels_channel ON webhook_channels(channel_id);
```

---

## Testing

### Test Connection

```bash
# 1. Get connection URL
curl -X GET http://localhost:8000/api/google/connect \
  -H "Authorization: Bearer {token}"

# 2. Complete OAuth (manually open URL in browser)

# 3. Check connection status
curl -X GET http://localhost:8000/api/google/status \
  -H "Authorization: Bearer {token}"
```

### Test Event Sync

```bash
# Pull events from Google
curl -X POST http://localhost:8000/api/events/sync/pull \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "calendar_id": "primary",
    "time_min": "2024-01-01T00:00:00Z",
    "time_max": "2024-12-31T23:59:59Z"
  }'
```

---

## Troubleshooting

### Issue: Token refresh fails

**Cause**: Refresh token invalid or revoked

**Solution**: User must reconnect Google Calendar

```typescript
DELETE /api/google/disconnect
GET /api/google/connect
```

### Issue: Events not syncing

**Cause**: Calendar not synced or webhook expired

**Solution**: Resync calendars and setup new webhook

```typescript
POST /api/calendars/sync
POST /api/webhook/google/watch
```

### Issue: Webhook stopped working

**Cause**: Webhook channel expired (max 7 days)

**Solution**: Implement auto-renewal cron job

```typescript
// Run daily
async function renewWebhooks() {
  const expiringSoon = await getWebhooksExpiringIn24Hours();
  
  for (const channel of expiringSoon) {
    await stopWebhook(channel.id);
    await createWebhook(channel.user_id, channel.calendar_id);
  }
}
```

---

## Related Documentation

- [Authentication](./01-AUTHENTICATION-FLOWS.md)
- [Event Management](./03-EVENT-MANAGEMENT.md)
- [Webhook System](./04-WEBHOOK-SYSTEM.md)
