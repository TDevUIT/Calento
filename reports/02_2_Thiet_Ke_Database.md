# **Chương II - Phần 2: THIẾT KẾ DATABASE**

Phần này trình bày chi tiết về cấu trúc database của hệ thống Calento, bao gồm các bảng dữ liệu, mối quan hệ giữa các bảng, và các luồng xử lý dữ liệu quan trọng.

## **1\. Tổng quan về cấu trúc Database**

Hệ thống Calento sử dụng **hơn 35 tables** trong PostgreSQL database, được chia thành các modules chức năng chính.

### **Danh sách các tables theo Module:**

**1. Auth & Users (Xác thực & Người dùng)**
- `users`: Thông tin tài khoản chính
- `user_settings`: Cài đặt UI/App preferences
- `user_credentials`: OAuth tokens (Google, Outlook)

**2. Calendar & Events (Lịch & Sự kiện)**
- `calendars`: Lịch của người dùng
- `events`: Sự kiện (local & sync)
- `event_attendees`: Người tham gia sự kiện
- `availabilities`: Cấu hình thời gian rảnh
- `event_conflicts`: Xung đột sync

**3. Booking System (Đặt lịch)**
- `booking_links`: Trang đặt lịch công khai
- `bookings`: Lịch hẹn đã đặt

**4. Teams & Collaboration (Nhóm)**
- `teams`: Thông tin nhóm
- `team_members`: Thành viên nhóm
- `team_rituals`: Lịch họp định kỳ (Standup, Retro)
- `team_availability`: Lịch rảnh của nhóm
- `team_meeting_rotations`: Phân công xoay vòng

**5. Task & Priority (Công việc)**
- `tasks`: Quản lý công việc cá nhân
- `user_priorities`: Hệ thống bảng ưu tiên (Priority Board)

**6. Blog & CMS**
- `blog_posts`: Bài viết
- `blog_categories`: Danh mục bài viết
- `blog_tags`: Thẻ bài viết
- `blog_post_tags`: Liên kết bài viết - thẻ
- `blog_comments`: Bình luận
- `blog_views`: Thống kê lượt xem

**7. AI & Context**
- `ai_conversations`: Lịch sử chat AI
- `ai_actions`: Hành động thực thi bởi AI
- `user_context_summary`: Vector store & context người dùng (cho RAG)
- `meeting_notes`: Ghi chú & Tóm tắt cuộc họp

**8. System & Sync**
- `sync_logs`: Nhật ký đồng bộ
- `sync_errors`: Lỗi đồng bộ & retry
- `webhook_channels`: Google Watch channels
- `integrations`: Kết nối bên thứ 3 (Slack, Zoom)
- `notifications`: Hệ thống thông báo
- `email_logs`: Lịch sử gửi email

**9. Landing Page**
- `contacts`: Form liên hệ

---

## **2\. Mối quan hệ giữa các Tables (ERD Overview)**

(Mô tả tóm tắt các quan hệ chính)

- **User Centric**: Hầu hết các bảng (`calendars`, `events`, `tasks`, `teams`, `blog_posts`) đều xoay quanh `users`.
- **Calendar & Event**: `calendars` 1-n `events`. `events` 1-n `event_attendees`.
- **Booking Flow**: `users` 1-n `booking_links` 1-n `bookings`. Mỗi `booking` có thể tạo ra 1 `event`.
- **Team Structure**: `users` n-n `teams` (thông qua `team_members`).

---

## **3\. Chi tiết các Tables chính**

### **3.1. Module: Auth & Users**

#### **Table: users**
Lưu trữ thông tin tài khoản cốt lõi.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | User ID |
| email | VARCHAR | UNIQUE | Email đăng nhập |
| username | VARCHAR | UNIQUE | Tên đăng nhập |
| password_hash | VARCHAR | | Mật khẩu mã hóa |
| is_active | BOOLEAN | | Trạng thái kích hoạt |
| is_verified | BOOLEAN | | Trạng thái xác minh email |
| reset_token... | | | Các trường reset password |

#### **Table: user_settings**
Lưu trữ cài đặt preferences dạng JSONB.
- `settings` (JSONB): Chứa theme, language, notification preferences, v.v.

#### **Table: user_credentials**
Quản lý kết nối OAuth.
- `provider`: 'google', 'outlook', 'apple'
- `sync_enabled`: Bật/tắt đồng bộ lịch
- `access_token`, `refresh_token`: OAuth tokens

### **3.2. Module: Calendar**

#### **Table: events**
Bảng trung tâm lưu trữ sự kiện.

| Column | Type | Description |
| :--- | :--- | :--- |
| id | UUID | Event ID |
| calendar_id | UUID | Thuộc calendar nào |
| google_event_id | VARCHAR | ID bên Google (nếu sync) |
| recurrence_rule | TEXT | Quy tắc lặp lại (RRULE) |
| conference_data | JSONB | Thông tin họp online (Link Meet/Zoom) |
| visibility | VARCHAR | public/private/default |
| attendees | JSONB | (Legacy) Danh sách tham gia |

#### **Table: event_attendees**
Quản lý chi tiết người tham dự và trạng thái RSVP.
- `response_status`: accepted, declined, needsAction, tentative.
- `invitation_token`: Token để guest phản hồi qua email.
- `can_modify_event`, `can_invite_others`: Quyền hạn của khách.

#### **Table: availabilities**
Cấu hình khung giờ rảnh của user (dùng cho tính năng Booking).
- `day_of_week`: 0-6 (Chủ nhật - Thứ 7)
- `start_time`, `end_time`: Khung giờ (VD: 09:00 - 17:00)

### **3.3. Module: Booking**

#### **Table: booking_links**
Cấu hình trang đặt lịch (tương tự Calendly).
- `slug`: Đường dẫn URL (vd: /book/meeting-15min)
- `duration_minutes`: Thời lượng
- `buffer_time_minutes`: Thời gian nghỉ giữa các cuộc gọi
- `availability_hours`: (JSONB) Override giờ rảnh mặc định nếu cần

#### **Table: bookings**
Lịch hẹn khách đã đặt.
- `status`: confirmed, cancelled, pending.
- `booker_email`, `booker_name`: Thông tin khách.
- `booking_link_id`: Đặt qua link nào.
- `event_id`: Link tới event được tạo ra trong lịch.

### **3.4. Module: Teams**

#### **Table: teams**
- `owner_id`: Người tạo team.
- `settings`: Cài đặt chung của team.

#### **Table: team_rituals**
Quản lý các sự kiện lặp lại của team (Rituals).
- `rotation_type`: Cơ chế xoay vòng người chủ trì (host) hoặc thư ký.
- `rotation_order`: Danh sách thứ tự xoay vòng.

### **3.5. Module: Tasks**

#### **Table: tasks**
Quản lý công việc (To-Do).
- `status`: todo, in_progress, completed.
- `priority`: low, medium, high, critical.
- `parent_task_id`: Hỗ trợ sub-tasks.
- `tags`: Phân loại công việc.

#### **Table: user_priorities**
Bảng đặc biệt cho tính năng "Priority Board", cho phép user sắp xếp ưu tiên hỗn hợp nhiều loại item (task, booking link, habit...).
- `item_type`: 'task', 'booking_link', 'project'...
- `item_id`: ID của đối tượng tương ứng.
- `position`: Vị trí sắp xếp.

### **3.6. Module: Blog (CMS)**

Hệ thống quản lý nội dung bài viết.

#### **Table: blog_posts**
- `slug`: URL thân thiện SEO.
- `status`: draft, published, archived.
- `featured_image`: Ảnh đại diện.
- `seo_title`, `seo_description`: Tối ưu hóa tìm kiếm.
- `reading_time`: Thời gian đọc ước tính.

#### **Table: blog_categories & blog_tags**
Phân loại nội dung. `blog_post_tags` là bảng trung gian cho quan hệ n-n.

#### **Table: blog_comments**
Bình luận của độc giả, có hỗ trợ moderation (`status`: pending/approved).

### **3.7. Module: AI & Context**

#### **Table: ai_conversations**
Lưu trữ hội thoại Chatbot.
- `messages` (JSONB): Mảng các tin nhắn (User/Assistant).

#### **Table: user_context_summary**
**Quan trọng cho tính năng RAG (Retrieval Augmented Generation).**
- `context` (JSONB): Dữ liệu context thô.
- `embedding` (vector(1536)): Vector embedding để tìm kiếm ngữ nghĩa (Semantic Search).
- `text_search_vector` (tsvector): Hỗ trợ tìm kiếm full-text (Hybrid Search).

### **3.8. Module: Sync & System**

#### **Table: webhook_channels**
Lưu trữ thông tin các kênh "Watch" từ Google Calendar API để nhận push notifications khi lịch thay đổi.
- `channel_id`, `resource_id`: Định danh kênh của Google.
- `expiration`: Thời gian hết hạn kênh.

#### **Table: sync_errors**
Cơ chế Retry thông minh.
- `retry_count`, `next_retry_at`: Lịch trình thử lại khi lỗi (Exponential backoff).

---

## **4\. Database Features & Patterns**

### **4.1. UUID Primary Keys**
Tất cả các bảng đều sử dụng `UUID` làm khóa chính thay vì `Serial Integer` để đảm bảo tính duy nhất trên toàn hệ thống phân tán và bảo mật hơn (khó đoán ID).

### **4.2. JSONB Flexibility**
Sử dụng mạnh mẽ kiểu dữ liệu `JSONB` của PostgreSQL cho các dữ liệu có cấu trúc động hoặc phức tạp:
- `events.attendees`
- `events.conference_data`
- `user_settings.settings`
- `ai_conversations.messages`

### **4.3. Full-Text & Vector Search**
Kết hợp sức mạnh của PostgreSQL:
- **Index GIN** trên các trường JSONB.
- **pgvector extension** (`embedding`) cho AI Semantic Search.
- **tsvector** cho tìm kiếm văn bản truyền thống.

### **4.4. Trigger-based Updates**
Tất cả các bảng đều có trigger `update_updated_at_column` để tự động cập nhật timestamp `updated_at`.

### **4.5. Soft Delete (Một số bảng)**
Các bảng quan trọng như `tasks` hỗ trợ soft delete (`is_deleted`, `deleted_at`) để khôi phục dữ liệu khi cần thiết.

---

**Cập nhật lần cuối:** 2026-01-08
**Phiên bản Schema:** Full Modules (Auth, Cal, Booking, Team, Task, Blog, AI, Sync)
