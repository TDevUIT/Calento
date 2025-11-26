# **Chương II: THIẾT KẾ HỆ THỐNG**

> **Lưu ý:** Chương II đã được chia thành 4 phần riêng biệt để dễ dàng quản lý và chỉnh sửa.

## **Tổng quan**

Chương này trình bày chi tiết về kiến trúc và thiết kế hệ thống Calento, bao gồm cách các thành phần hoạt động, luồng dữ liệu, cấu trúc database, thiết kế API, và giao diện người dùng.

## **Cấu trúc Chương II**

Chương II được chia thành 4 phần chính:

### **[Phần 1: Kiến trúc hệ thống](./02_1_Kien_Truc_He_Thong.md)**

Trình bày về kiến trúc tổng thể của hệ thống Calento:

- **Tổng quan về kiến trúc**: Mô hình Client-Server và 6 tầng chính
- **Sơ đồ kiến trúc**: Visualization của toàn bộ hệ thống
- **Giải thích chi tiết các tầng**:
  - Client Layer (Tầng giao diện người dùng)
  - API Gateway Layer (Tầng kiểm soát truy cập)
  - Service Layer (Tầng xử lý nghiệp vụ)
  - Data Layer (Tầng lưu trữ dữ liệu)
  - External Services (Dịch vụ bên thứ ba)
  - Background Jobs (Xử lý tác vụ nền)
- **Luồng dữ liệu**: Chi tiết cách dữ liệu di chuyển qua hệ thống
- **Các tính năng quan trọng**: Caching, Optimistic Updates, Error Handling

### **[Phần 2: Thiết kế Database](./02_2_Thiet_Ke_Database.md)**

Trình bày về cấu trúc database của hệ thống:

- **Tổng quan cấu trúc**: 15 tables chính trong PostgreSQL
- **Mối quan hệ giữa các tables**: Foreign keys và relationships
- **Chi tiết các tables**:
  - users (Người dùng)
  - calendars (Lịch)
  - events (Sự kiện)
  - booking_links (Liên kết đặt lịch)
  - bookings (Đặt lịch)
  - user_credentials, webhook_channels, ai_conversations, v.v.
- **JSONB Schema**: Cấu trúc dữ liệu linh hoạt
- **Database Migration System**: Quản lý schema changes

### **[Phần 3: Thiết kế API](./02_3_Thiet_Ke_API.md)**

Trình bày về thiết kế API của hệ thống:

- **Tổng quan API Endpoints**: 78 endpoints chia theo 9 modules
- **Chi tiết endpoints**:
  - Authentication (10 endpoints)
  - Users (8 endpoints)
  - Events (15 endpoints)
  - Calendars (7 endpoints)
  - Booking Links (8 endpoints)
  - Public Bookings (6 endpoints)
  - AI Chatbot (6 endpoints)
  - Google Calendar (8 endpoints)
  - Email (10 endpoints)
- **API Response Format**: Success, Error, Paginated responses
- **Authentication Flow**: JWT tokens, cookies
- **Server Flows**: Event creation, AI chatbot, booking flows
- **HTTP Status Codes**: Success, client error, server error codes

### **[Phần 4: Thiết kế Frontend & UI/UX](./02_4_Thiet_Ke_Frontend_UIUX.md)**

Trình bày về thiết kế giao diện và trải nghiệm người dùng:

- **Frontend Architecture**: Component hierarchy, module structure
- **Frontend Sitemap**: Page structure và routing
- **State Management**: Server state, client state, URL state
- **User Flow Diagrams**: Event creation, booking, AI chatbot flows
- **Design System**:
  - Color Palette (Primary, Neutral, Semantic colors)
  - Typography (Font family, sizes, weights)
  - Spacing System (Base unit, scale)
  - Border Radius
- **Component Library**: Atomic và composite components
- **Layout & Navigation**: Sidebar, navbar, responsive design
- **Page Layouts**: Calendar, event detail, booking page
- **Animations & Transitions**: Micro-interactions, page transitions
- **Accessibility**: Keyboard navigation, screen reader support, color contrast
- **AI System Design**: Function calling, context management
- **Implementation Status**: Implemented và planned components

## **Tài liệu tham khảo**

Để hiểu đầy đủ về thiết kế hệ thống Calento, nên đọc các phần theo thứ tự:

1. **Phần 1** - Hiểu tổng quan về kiến trúc hệ thống
2. **Phần 2** - Nắm rõ cấu trúc database và data model
3. **Phần 3** - Tìm hiểu về API endpoints và communication
4. **Phần 4** - Khám phá giao diện người dùng và UX

## **Liên kết nhanh**

- [Phần 1: Kiến trúc hệ thống](./02_1_Kien_Truc_He_Thong.md)
- [Phần 2: Thiết kế Database](./02_2_Thiet_Ke_Database.md)
- [Phần 3: Thiết kế API](./02_3_Thiet_Ke_API.md)
- [Phần 4: Thiết kế Frontend & UI/UX](./02_4_Thiet_Ke_Frontend_UIUX.md)

---

**Ghi chú:** File gốc `02_Chuong_II_ThietKe.md` vẫn được giữ nguyên để tham khảo. Các file mới được tạo để dễ dàng quản lý và chỉnh sửa từng phần riêng biệt.
