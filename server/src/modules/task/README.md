# Task Module

Module quản lý công việc (tasks/to-do) cho người dùng với đầy đủ tính năng CRUD, soft delete, và nhiều cách filter.

## Features

- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Soft Delete**: Tasks được đánh dấu xóa thay vì xóa vĩnh viễn
- **Status Management**: TODO, IN_PROGRESS, COMPLETED, CANCELLED
- **Priority Levels**: LOW, MEDIUM, HIGH, CRITICAL
- **Advanced Filtering**: Filter theo status, priority, project, date range, tags
- **Search**: Full-text search trong title và description
- **Statistics**: Task statistics với breakdown theo status và priority
- **Pagination**: Hỗ trợ pagination cho tất cả list endpoints
- **Subtasks**: Hỗ trợ parent-child relationships
- **Tags**: Categorization với tags array
- **Time Tracking**: Estimated và actual duration

## Database Schema

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo',
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    project_id UUID,
    parent_task_id UUID REFERENCES tasks(id),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    estimated_duration INTEGER,
    actual_duration INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Create Task
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "todo",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59Z",
  "tags": ["documentation", "urgent"],
  "estimated_duration": 120
}
```

### Get All Tasks
```http
GET /api/tasks?page=1&limit=20&status=todo&priority=high
Authorization: Bearer {token}
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (todo|in_progress|completed|cancelled)
- `priority`: Filter by priority (low|medium|high|critical)
- `project_id`: Filter by project
- `due_before`: Filter tasks due before date
- `due_after`: Filter tasks due after date
- `tags`: Filter by tags (comma-separated)
- `search`: Search in title and description
- `sortBy`: Sort field (default: created_at)
- `sortOrder`: Sort order (asc|desc, default: desc)

### Get Overdue Tasks
```http
GET /api/tasks/overdue?page=1&limit=20
Authorization: Bearer {token}
```

### Get Task Statistics
```http
GET /api/tasks/statistics
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "total": 45,
    "by_status": {
      "todo": 20,
      "in_progress": 10,
      "completed": 12,
      "cancelled": 3
    },
    "by_priority": {
      "low": 10,
      "medium": 25,
      "high": 8,
      "critical": 2
    },
    "overdue": 5,
    "completed_today": 3
  }
}
```

### Get Task by ID
```http
GET /api/tasks/{id}
Authorization: Bearer {token}
```

### Update Task (Full)
```http
PUT /api/tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "critical"
}
```

### Update Task (Partial)
```http
PATCH /api/tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}
```

### Update Task Status
```http
PATCH /api/tasks/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}
```

### Delete Task (Soft Delete)
```http
DELETE /api/tasks/{id}
Authorization: Bearer {token}
```

### Restore Task
```http
POST /api/tasks/{id}/restore
Authorization: Bearer {token}
```

## Enums

### TaskStatus
- `todo`: Chưa bắt đầu
- `in_progress`: Đang thực hiện
- `completed`: Hoàn thành
- `cancelled`: Đã hủy

### TaskPriority
- `low`: Ưu tiên thấp
- `medium`: Ưu tiên trung bình
- `high`: Ưu tiên cao
- `critical`: Khẩn cấp

## Usage Examples

### Create a task with tags
```typescript
const task = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${token}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Write unit tests',
    description: 'Add comprehensive test coverage',
    status: 'todo',
    priority: 'high',
    tags: ['testing', 'development'],
    estimated_duration: 180
  })
});
```

### Search tasks
```typescript
const tasks = await fetch('/api/tasks?search=documentation&priority=high&page=1&limit=10', {
  headers: {
    'Authorization': 'Bearer ${token}'
  }
});
```

### Get tasks by date range
```typescript
const tasks = await fetch('/api/tasks?due_after=2024-01-01T00:00:00Z&due_before=2024-12-31T23:59:59Z', {
  headers: {
    'Authorization': 'Bearer ${token}'
  }
});
```

### Update task status
```typescript
await fetch('/api/tasks/${taskId}/status', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer ${token}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'completed' })
});
```

## Architecture

### Layer Structure
```
task/
├── task.interface.ts          # Task interface và enums
├── task.repository.ts         # Data access layer (extends UserOwnedRepository)
├── task.service.ts            # Business logic layer
├── task.controller.ts         # API endpoints layer
├── task.module.ts             # Module configuration
├── dto/
│   └── task.dto.ts           # Request/Response DTOs
└── exceptions/
    └── task.exceptions.ts    # Custom exceptions
```

### Dependencies
- **DatabaseModule**: PostgreSQL database access
- **CommonModule**: Shared services (MessageService, PaginationService)
- **JwtAuthGuard**: Authentication guard

## Future Enhancements
- [ ] Recurring tasks với RRULE support
- [ ] Task templates
- [ ] Task dependencies
- [ ] Time tracking với start/stop
- [ ] Task attachments
- [ ] Comments/notes
- [ ] Task sharing/collaboration
- [ ] Notifications/reminders
- [ ] Calendar integration
