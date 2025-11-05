# AI Flow Architecture - Calento AI Assistant

## 📋 Tổng Quan

Tài liệu này mô tả chi tiết luồng hoạt động của hệ thống AI Assistant trong Calento, sử dụng Google Gemini AI với Function Calling để quản lý lịch thông minh.

## 🏗️ Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT REQUEST                            │
│                     (AI Chat Message)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI CONTROLLER                               │
│                  (ai.controller.ts)                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ POST /api/ai/chat                                         │  │
│  │ - Extract userId from JWT token                          │  │
│  │ - Validate request data (ChatRequestDto)                 │  │
│  │ - Route to AIConversationService                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                AI CONVERSATION SERVICE                           │
│              (ai-conversation.service.ts)                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ STEP 1: CONVERSATION MANAGEMENT                           │  │
│  │ - Load or create conversation                            │  │
│  │ - Build calendar context (current date, timezone, etc.)  │  │
│  │ - Save user message to database                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ STEP 2: SEND TO GEMINI SERVICE                            │  │
│  │ - Pass message + history + context                        │  │
│  │ - Get AI response with function calls                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ STEP 3: EXECUTE FUNCTION CALLS                            │  │
│  │ - For each function call:                                 │  │
│  │   * Create action record                                  │  │
│  │   * Execute via AIFunctionCallingService                  │  │
│  │   * Update action status (completed/failed)               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ STEP 4: BUILD RESPONSE                                    │  │
│  │ - Combine AI text + function results                      │  │
│  │ - Save assistant message to database                      │  │
│  │ - Return to controller                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────┐
│  GEMINI SERVICE │  │ FUNCTION CALLING    │  │   REPOSITORIES  │
│ gemini.service  │  │     SERVICE         │  │  (Database)     │
│                 │  │ ai-function-calling │  │                 │
└─────────────────┘  └─────────────────────┘  └─────────────────┘
```

## 📂 Cấu Trúc Module

```
src/modules/ai/
├── ai.controller.ts                 # REST API endpoints
├── ai.module.ts                     # Module configuration
│
├── services/
│   ├── gemini.service.ts           # Google Gemini AI integration
│   ├── ai-conversation.service.ts  # Conversation management
│   ├── ai-function-calling.service.ts  # Function execution
│   └── ai-analysis.service.ts      # Team analysis & analytics
│
├── repositories/
│   ├── ai-conversation.repository.ts   # Conversation persistence
│   └── ai-action.repository.ts         # Action tracking
│
├── dto/
│   └── ai-chat.dto.ts              # Request/Response DTOs
│
├── interfaces/
│   └── ai.interface.ts             # TypeScript interfaces
│
├── prompts/
│   ├── system-prompts.ts           # AI system prompts
│   └── function-prompts.ts         # Function definitions
│
├── constants/
│   ├── ai.constants.ts             # Configuration constants
│   └── prompt.constants.ts         # Prompt configurations
│
└── exceptions/
    └── ai.exceptions.ts            # Custom exceptions
```

## 🔄 Chi Tiết Luồng Xử Lý

### 1️⃣ Nhận Request từ Client

**Endpoint:** `POST /api/ai/chat`

**Request Body:** Message text, conversation ID (optional), context data

**Controller:** Nhận request → Extract user ID từ JWT → Chuyển đến ConversationService

### 2️⃣ Conversation Service Processing

#### A. Load/Create Conversation

- Tìm conversation hiện tại bằng `conversation_id`
- Nếu không tồn tại: Tạo conversation mới
- Build calendar context (ngày giờ hiện tại, timezone, preferences)

#### B. Build Calendar Context

Context bao gồm:
- **user_id**: ID của người dùng
- **timezone**: Múi giờ (mặc định: Asia/Ho_Chi_Minh)
- **current_date**: Ngày giờ hiện tại (ISO 8601)
- **current_date_formatted**: Ngày giờ dễ đọc
- **preferences**: Work hours, default duration
- **upcoming_events**: Các sự kiện sắp tới

#### C. Save User Message

Lưu message của user vào database với role='user', content=message, timestamp

### 3️⃣ Gemini Service - AI Processing

#### A. Initialize Model with Function Declarations

Model được khởi tạo với:
- **Model:** gemini-1.5-flash
- **Generation Config:** temperature=0.7, maxOutputTokens=8192
- **System Instruction:** Prompts chính của Calento
- **Tools:** Danh sách function declarations

#### B. Function Declarations

AI có thể gọi các functions:
- **createEvent**: Tạo sự kiện (title, start_time, end_time, ...)
- **checkAvailability**: Kiểm tra thời gian trống
- **createTask**: Tạo task mới
- **searchEvents**: Tìm kiếm sự kiện
- **updateEvent, deleteEvent**: Cập nhật/xóa sự kiện

Mỗi function có schema định nghĩa parameters và required fields.

#### C. Build Context Message

System message bao gồm:
- Reminder về multi-turn conversation
- Current date/time và timezone
- User preferences
- Upcoming events
- Các context khác từ calendar

#### D. Send to Gemini API

**Quy trình:**
1. Convert conversation history sang Gemini format
2. Build system message với context
3. Start chat session với history
4. Send message kèm context
5. Nhận response từ AI
6. Extract function calls (nếu có)
7. Return text response + function calls

### 4️⃣ Function Calling Service - Execute Actions

#### Cơ Chế Thực Thi

Service sử dụng **switch-case pattern** để route function calls đến handlers tương ứng:
- `createEvent` → handleCreateEvent
- `checkAvailability` → handleCheckAvailability
- `createTask` → handleCreateTask
- `searchEvents` → handleSearchEvents
- Các functions khác...

#### Example: handleCreateEvent

**Quy trình:**
1. Lấy primary calendar của user
2. Validate calendar tồn tại
3. Gọi EventService.createEvent() với parameters
4. Map attendees từ array emails
5. Return success với event details hoặc error

**Response:**
```json
{
  "success": true,
  "result": {
    "event_id": "uuid",
    "title": "Team Meeting",
    "start_time": "2024-01-01T10:00:00Z",
    "message": "Successfully created event"
  }
}
```

#### Example: handleCheckAvailability

**Quy trình:**
1. Lấy tất cả events trong date range (max 1000)
2. Calculate free slots dựa trên:
   - Work hours: 9 AM - 6 PM
   - Skip weekends
   - Duration: mặc định 60 phút
   - Slot interval: 30 phút
3. Filter out conflicts với existing events
4. Return max 20 slots

**Response:**
```json
{
  "success": true,
  "result": {
    "free_slots": [...],
    "total_events": 5,
    "message": "Found 15 free time slot(s)"
  }
}
```

### 5️⃣ Action Tracking

Mỗi function call được track qua 3 bước:

#### 1. Create Action Record
Tạo record trong database với:
- conversation_id
- action_type (tên function)
- parameters (arguments)
- status: 'pending'

#### 2. Execute Function
Gọi FunctionCallingService để thực thi function với userId

#### 3. Update Action Status
Cập nhật status dựa trên kết quả:
- **Success**: status='completed', lưu result
- **Failed**: status='failed', lưu error message

### 6️⃣ Build Final Response

**Quy trình:**
1. Lấy text response từ AI
2. Build assistant message với:
   - role: 'assistant'
   - content: AI text + action results
   - timestamp: current time
3. Lưu message vào conversation
4. Return response bao gồm:
   - response text
   - conversation_id
   - function_calls array
   - actions results
   - timestamp

## 📊 Database Schema

### ai_conversations Table

```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  messages JSONB NOT NULL DEFAULT '[]',
  context JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
```

### ai_actions Table

```sql
CREATE TABLE ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  parameters JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  result JSONB,
  error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_actions_conversation_id ON ai_actions(conversation_id);
CREATE INDEX idx_ai_actions_status ON ai_actions(status);
```

## 🎯 Available Functions

### 1. Calendar Functions

#### createEvent

- Tạo sự kiện mới trong lịch
- Required: title, start_time, end_time
- Optional: description, location, attendees

#### checkAvailability

- Kiểm tra khung giờ trống trong lịch
- Required: start_date, end_date
- Optional: duration_minutes

#### searchEvents

- Tìm kiếm sự kiện theo từ khóa
- Required: query
- Optional: start_date, end_date

#### updateEvent

- Cập nhật thông tin sự kiện
- Required: event_id, updates

#### deleteEvent

- Xóa sự kiện khỏi lịch
- Required: event_id

### 2. Task Functions

#### createTask

- Tạo task mới
- Required: title
- Optional: description, due_date, priority, estimated_duration

#### createLearningPlan

- Tạo kế hoạch học tập dài hạn
- Required: topic, duration_weeks
- Optional: hours_per_day, start_date

### 3. Analysis Functions

#### analyzeTeamAvailability

- Phân tích khả dụng của team
- Tìm thời gian tối ưu cho meeting
- Required: member_ids, start_date, end_date
- Optional: meeting_duration, preferred_time_range

## 🔐 Security & Authentication

### JWT Authentication

- Tất cả AI endpoints require authentication
- Sử dụng JwtAuthGuard để validate token
- Extract user ID từ JWT payload (req.user.id hoặc req.user.sub)

### Request Validation

DTO validation với class-validator:
- **message**: Required string, không được empty
- **conversation_id**: Optional string
- **context**: Optional object

## ⚡ Performance Optimization

### 1. Context Caching

- Cache calendar context trong 5 phút
- Giảm số lần query database

### 2. Event Pagination

- Limit 1000 events per query
- Pagination cho free slots (max 20)

### 3. Async Processing

- Function calls execute song song khi có thể
- Non-blocking I/O operations

## 🐛 Error Handling

### Custom Exceptions

**GeminiAPIException:**
- Status: 500 Internal Server Error
- Dùng khi Gemini API fails
- Bao gồm message và detail

**ConversationNotFoundException:**
- Status: 404 Not Found
- Dùng khi conversation không tồn tại
- Bao gồm conversationId

### Error Recovery

Khi AI chat fails:
1. Log error với NestJS Logger
2. Return graceful error response:
   - Error message cho user
   - conversation_id (để continue chat)
   - Empty function_calls và actions
   - timestamp

## 📝 Logging

### Structured Logging

Các events được log:
- **INFO**: User chat processing, function calls count
- **DEBUG**: Context details, system messages
- **ERROR**: Gemini API errors, function execution failures

## 🧪 Testing

### Test Coverage

**Unit Tests:**
- ConversationService: Load/create conversation, build context
- GeminiService: Function declarations, context building
- FunctionCallingService: Từng handler function

**Integration Tests:**
- End-to-end chat flow: User message → AI response → Function execution
- Verify actions được tạo và completed
- Verify conversation history được lưu đúng

## 🚀 Deployment

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-1.5-flash
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=8192
DEFAULT_TIMEZONE=Asia/Ho_Chi_Minh
```

### Production Checklist

- ✅ Configure Gemini API key
- ✅ Set up database migrations
- ✅ Enable request logging
- ✅ Configure rate limiting
- ✅ Set up error monitoring
- ✅ Enable API caching

## 📚 Best Practices

1. **Always validate user input** - Use DTOs with class-validator
2. **Handle errors gracefully** - Return user-friendly messages
3. **Log important events** - Use NestJS Logger
4. **Keep context fresh** - Update calendar context regularly
5. **Limit AI responses** - Set max tokens and timeouts
6. **Track all actions** - Save to database for audit
7. **Test function calls** - Unit test each handler
8. **Monitor API usage** - Track Gemini API calls

## 🔗 Related Documentation

- [Google Gemini AI Documentation](https://ai.google.dev/docs)
- [Function Calling Guide](https://ai.google.dev/docs/function_calling)
- [NestJS Documentation](https://docs.nestjs.com)
