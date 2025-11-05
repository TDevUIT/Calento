# 📡 API Reference

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Auth Endpoints](#auth-endpoints)
- [User Endpoints](#user-endpoints)
- [Event Endpoints](#event-endpoints)
- [Calendar Endpoints](#calendar-endpoints)
- [Booking Endpoints](#booking-endpoints)
- [Google Integration](#google-integration)
- [Error Codes](#error-codes)

---

## Base URL

```
Development: http://localhost:8000/api
Production:  https://api.calento.space/api
```

---

## Authentication

### Header-based (Recommended)

```bash
Authorization: Bearer {access_token}
```

### Cookie-based

```bash
Cookie: access_token={token}; refresh_token={refresh_token}
```

### Public Endpoints

No authentication required:
- `/auth/register`
- `/auth/login`
- `/auth/google/url`
- `/auth/google/callback`
- `/auth/google/login`
- `/book/:username/:slug/*`

---

## Response Format

### Success Response

```json
{
  "status": 200,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Paginated Response

```json
{
  "status": 200,
  "message": "Data retrieved successfully",
  "data": [
    // Array of items
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request",
  "details": {
    // Optional error details
  }
}
```

---

## Auth Endpoints

### Register

```http
POST /auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response: 201 Created**

```json
{
  "status": 201,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe"
    },
    "tokens": {
      "access_token": "eyJhbGc...",
      "refresh_token": "eyJhbGc...",
      "token_type": "Bearer",
      "expires_in": 3600
    }
  }
}
```

---

### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "user": { /* User object */ },
    "tokens": { /* Tokens object */ }
  }
}
```

---

### Logout

```http
POST /auth/logout
Authorization: Bearer {token}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "Logout successful",
  "data": null
}
```

---

### Refresh Token

```http
POST /auth/refresh
Cookie: refresh_token={token}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "access_token": "eyJhbGc...",
      "refresh_token": "eyJhbGc...",
      "token_type": "Bearer",
      "expires_in": 3600
    }
  }
}
```

---

### Get Current User

```http
GET /auth/me
Authorization: Bearer {token}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "User profile retrieved",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "avatar": "https://...",
    "timezone": "Asia/Ho_Chi_Minh"
  }
}
```

---

### Forgot Password

```http
POST /auth/forgot-password
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "If account exists, reset email sent",
  "data": null
}
```

---

### Reset Password

```http
POST /auth/reset-password
```

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "new_password": "NewSecurePass123!"
}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "Password reset successful",
  "data": null
}
```

---

### Google OAuth - Get URL

```http
GET /auth/google/url
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "OAuth URL generated",
  "data": {
    "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

---

### Google OAuth - Complete Login

```http
POST /auth/google/login
```

**Request Body:**

```json
{
  "code": "google-auth-code",
  "state": "optional-state"
}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "Google login successful",
  "data": {
    "user": { /* User object */ },
    "tokens": { /* Tokens object */ }
  }
}
```

---

## User Endpoints

### Get User Profile

```http
GET /users/:id
Authorization: Bearer {token}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "avatar": "https://...",
    "bio": "Software developer",
    "timezone": "Asia/Ho_Chi_Minh",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update User Profile

```http
PATCH /users/:id
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "bio": "Product designer",
  "timezone": "America/New_York"
}
```

**Response: 200 OK**

---

## Event Endpoints

### List Events

```http
GET /events?page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |

**Response: 200 OK**

```json
{
  "status": 200,
  "data": [
    {
      "id": "uuid",
      "title": "Team Meeting",
      "start_time": "2024-01-01T10:00:00Z",
      "end_time": "2024-01-01T11:00:00Z",
      "location": "Conference Room A",
      "attendees": [...],
      "creator": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### Create Event

```http
POST /events
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "start_time": "2024-01-01T10:00:00Z",
  "end_time": "2024-01-01T11:00:00Z",
  "timezone": "Asia/Ho_Chi_Minh",
  "location": "Conference Room A",
  "calendar_id": "uuid",
  "is_all_day": false,
  "color": "#4285f4",
  "attendees": [
    {
      "email": "user@example.com",
      "display_name": "Jane Smith",
      "is_organizer": false
    }
  ],
  "reminders": [
    {
      "method": "email",
      "minutes_before": 30
    }
  ],
  "recurrence_rule": "FREQ=WEEKLY;BYDAY=MO",
  "conference_data": {
    "type": "google_meet",
    "create_request": true
  }
}
```

**Response: 201 Created**

```json
{
  "status": 201,
  "message": "Event created successfully",
  "data": {
    "id": "uuid",
    "title": "Team Meeting",
    /* ... other fields ... */
    "syncedToGoogle": true,
    "googleEventId": "google-event-id"
  }
}
```

---

### Get Event

```http
GET /events/:id
Authorization: Bearer {token}
```

**Response: 200 OK**

---

### Update Event (Partial)

```http
PATCH /events/:id
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "title": "Updated Meeting Title",
  "start_time": "2024-01-01T11:00:00Z"
}
```

**Response: 200 OK**

---

### Update Event (Full Replace)

```http
PUT /events/:id
Authorization: Bearer {token}
```

**Request Body:** (All fields required)

**Response: 200 OK**

---

### Delete Event

```http
DELETE /events/:id
Authorization: Bearer {token}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "Event deleted successfully",
  "data": {
    "deleted": true,
    "deletedFromGoogle": true
  }
}
```

---

### Get Events by Date Range

```http
GET /events/calendar?start_date=2024-01-01T00:00:00Z&end_date=2024-01-31T23:59:59Z
Authorization: Bearer {token}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| start_date | ISO8601 | Yes | Start of date range |
| end_date | ISO8601 | Yes | End of date range |
| page | number | No | Page number |
| limit | number | No | Items per page |

**Response: 200 OK**

---

### Search Events

```http
GET /events/search?q=team&page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query |
| page | number | Page number |
| limit | number | Items per page |

**Response: 200 OK**

---

### Expand Recurring Events

```http
GET /events/recurring/expand?start_date=2024-01-01T00:00:00Z&end_date=2024-12-31T23:59:59Z&max_occurrences=100
Authorization: Bearer {token}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| start_date | ISO8601 | Yes | Start date |
| end_date | ISO8601 | Yes | End date |
| max_occurrences | number | No | Max per event (default: 100) |

**Response: 200 OK**

```json
{
  "status": 200,
  "data": [
    {
      "id": "uuid_occurrence_0",
      "original_event_id": "uuid",
      "occurrence_index": 0,
      "title": "Weekly Meeting",
      "start_time": "2024-01-08T10:00:00Z",
      "end_time": "2024-01-08T11:00:00Z",
      "is_recurring_instance": true,
      "recurrence_rule": "FREQ=WEEKLY;BYDAY=MO"
    }
  ]
}
```

---

### Send Event Invitations

```http
POST /events/:id/invitations
Authorization: Bearer {token}
```

**Request Body (Optional):**

```json
{
  "emails": ["user1@example.com", "user2@example.com"],
  "show_attendees": true
}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "Invitations sent successfully",
  "data": {
    "sent": 5,
    "failed": 0,
    "results": [
      {
        "email": "user@example.com",
        "status": "sent",
        "token": "invitation-token"
      }
    ]
  }
}
```

---

## Calendar Endpoints

### List Calendars

```http
GET /calendars
Authorization: Bearer {token}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "data": [
    {
      "id": "uuid",
      "name": "Personal Calendar",
      "description": "My personal calendar",
      "color": "#4285f4",
      "timezone": "Asia/Ho_Chi_Minh",
      "is_primary": true,
      "is_active": true
    }
  ]
}
```

---

### Create Calendar

```http
POST /calendars
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "name": "Work Calendar",
  "description": "Work-related events",
  "color": "#34a853",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

**Response: 201 Created**

---

### Sync Google Calendars

```http
POST /calendars/sync
Authorization: Bearer {token}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "message": "Calendars synced successfully",
  "data": {
    "synced": 3
  }
}
```

---

## Booking Endpoints

### List Booking Links

```http
GET /booking-links
Authorization: Bearer {token}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "data": [
    {
      "id": "uuid",
      "title": "30 Min Meeting",
      "slug": "30-min-meeting",
      "public_url": "https://app.tempra.com/book/username/30-min-meeting",
      "duration_minutes": 30,
      "bookings_count": 15,
      "is_active": true
    }
  ]
}
```

---

### Create Booking Link

```http
POST /booking-links
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "title": "30 Min Meeting",
  "slug": "30-min-meeting",
  "description": "Quick chat",
  "duration_minutes": 30,
  "buffer_before_minutes": 5,
  "buffer_after_minutes": 5,
  "availability_type": "specific_hours",
  "availability_hours": {
    "monday": {
      "start": "09:00",
      "end": "17:00",
      "enabled": true
    },
    "tuesday": {
      "start": "09:00",
      "end": "17:00",
      "enabled": true
    }
  },
  "min_booking_notice_minutes": 1440,
  "max_booking_days_future": 60,
  "meeting_type": "google_meet"
}
```

**Response: 201 Created**

---

### Get Booking Link (Public)

```http
GET /book/:username/:slug
```

**Response: 200 OK**

```json
{
  "status": 200,
  "data": {
    "id": "uuid",
    "title": "30 Min Meeting",
    "description": "Quick chat",
    "duration_minutes": 30,
    "host": {
      "name": "John Doe",
      "avatar": "https://..."
    }
  }
}
```

---

### Get Available Slots (Public)

```http
GET /book/:username/:slug/slots?start_date=2024-01-01&end_date=2024-01-07
```

**Response: 200 OK**

```json
{
  "status": 200,
  "data": {
    "slots": [
      {
        "start": "2024-01-01T09:00:00Z",
        "end": "2024-01-01T09:30:00Z"
      },
      {
        "start": "2024-01-01T10:00:00Z",
        "end": "2024-01-01T10:30:00Z"
      }
    ],
    "timezone": "Asia/Ho_Chi_Minh"
  }
}
```

---

### Create Booking (Public)

```http
POST /book/:username/:slug
```

**Request Body:**

```json
{
  "slot_start": "2024-01-01T09:00:00Z",
  "guest_name": "Jane Smith",
  "guest_email": "jane@example.com",
  "guest_notes": "Looking forward to meeting",
  "guest_timezone": "America/New_York"
}
```

**Response: 201 Created**

```json
{
  "status": 201,
  "message": "Booking confirmed",
  "data": {
    "booking_id": "uuid",
    "event_id": "uuid",
    "confirmation_url": "https://app.tempra.com/booking/confirmation/uuid"
  }
}
```

---

## Google Integration

### Get Connection URL

```http
GET /google/connect
Authorization: Bearer {token}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "data": {
    "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

---

### Check Connection Status

```http
GET /google/status
Authorization: Bearer {token}
```

**Response: 200 OK**

```json
{
  "status": 200,
  "data": {
    "connected": true,
    "provider": "google",
    "expires_at": "2024-12-31T23:59:59Z",
    "scopes": ["calendar", "calendar.events"]
  }
}
```

---

### Disconnect Google

```http
DELETE /google/disconnect
Authorization: Bearer {token}
```

**Response: 200 OK**

---

## Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `BAD_REQUEST` | Invalid request data |
| 401 | `UNAUTHORIZED` | Authentication required |
| 403 | `FORBIDDEN` | Access denied |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict (e.g., duplicate) |
| 422 | `VALIDATION_ERROR` | Validation failed |
| 429 | `RATE_LIMIT` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Rate Limiting

```
Default: 100 requests per minute per user
Burst: Up to 150 requests in 10 seconds
```

**Response Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

**Error Response (429):**

```json
{
  "statusCode": 429,
  "message": "Too many requests",
  "error": "Rate Limit Exceeded",
  "retry_after": 60
}
```

---

## Pagination

All list endpoints support pagination:

```
?page=1&limit=20
```

**Default Values:**
- `page`: 1
- `limit`: 20
- `max_limit`: 100

---

## Date/Time Format

All dates use **ISO 8601** format:

```
2024-01-01T10:00:00Z        # UTC
2024-01-01T10:00:00+07:00   # With timezone offset
```

---

## Testing with curl

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"test","password":"Test123!"}'

# Login (save cookies)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' \
  -c cookies.txt

# Get events (use cookies)
curl -X GET http://localhost:8000/api/events \
  -b cookies.txt

# Create event (use token)
curl -X POST http://localhost:8000/api/events \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Meeting","start_time":"2024-01-01T10:00:00Z","end_time":"2024-01-01T11:00:00Z"}'
```

---

## Postman Collection

Import Postman collection:

```
postman/Tempra-API.postman_collection.json
```

Environments:
- `Tempra-Local.postman_environment.json`
- `Tempra-Production.postman_environment.json`

---

## Related Documentation

- [Authentication Flows](./01-AUTHENTICATION-FLOWS.md)
- [Event Management](./03-EVENT-MANAGEMENT.md)
- [Booking System](./04-BOOKING-SYSTEM.md)
