# **ĐỒ ÁN MÔN HỌC**
# **CÔNG NGHỆ WEB VÀ ỨNG DỤNG (SE347.Q11)**

---

## **ĐỀ TÀI:**
# **CALENTO - TRỢ LÝ QUẢN LÝ LỊCH THÔNG MINH TÍCH HỢP AI**

---

**GVHD:** ThS. Đặng Việt Dũng

**Nhóm thực hiện:** Nhóm 2

**Danh sách thành viên:**
1. Thái Thanh Tài - 22520001 (Nhóm trưởng)
2. [Thành viên khác]

**Thời gian thực hiện:** Từ 08/2024 đến 11/2024

**Trường:** Đại học Công nghệ Thông tin - ĐHQG TP.HCM

---

## **MỤC LỤC**

### **CHƯƠNG I. TỔNG QUAN VỀ ĐỒ ÁN**
1.1. Giới thiệu đề tài
1.2. Mục tiêu đồ án
   - 1.2.1. Mục tiêu chính
   - 1.2.2. Mục tiêu cụ thể
1.3. Phạm vi đồ án
   - 1.3.1. Phạm vi chức năng
   - 1.3.2. Phạm vi phi chức năng
   - 1.3.3. Ngoài phạm vi
1.4. Đối tượng sử dụng
1.5. Công nghệ sử dụng
   - 1.5.1. Frontend Stack
   - 1.5.2. Backend Stack
   - 1.5.3. Database & Storage
   - 1.5.4. Third-party Services
   - 1.5.5. Development & Deployment Tools

### **CHƯƠNG II. THIẾT KẾ HỆ THỐNG**

**Phần 1: Kiến trúc Hệ thống**
2.1. Tổng quan Kiến trúc
2.2. Client Layer (Presentation Layer)
2.3. API Gateway Layer
2.4. Service Layer (Business Logic)
2.5. Data Layer
2.6. External Services Integration
2.7. Background Jobs & Queue System
2.8. Luồng dữ liệu chính

**Phần 2: Thiết kế Cơ sở Dữ liệu**
2.9. Tổng quan Database Schema
2.10. Core Tables
   - 2.10.1. Users Table
   - 2.10.2. Events Table
   - 2.10.3. Calendars Table
   - 2.10.4. Booking Links Table
2.11. Authentication & Security Tables
2.12. Integration Tables
2.13. Supporting Tables
2.14. Relationships & Constraints
2.15. Indexes & Performance Optimization
2.16. JSONB Schema
2.17. Migration System

**Phần 3: Thiết kế API**
2.18. Tổng quan RESTful API
2.19. Authentication Endpoints
2.20. Event Management Endpoints
2.21. Calendar Management Endpoints
2.22. Booking System Endpoints
2.23. AI Chatbot Endpoints
2.24. Google Calendar Integration Endpoints
2.25. User Profile Endpoints
2.26. API Response Format
2.27. HTTP Status Codes

**Phần 4: Thiết kế Frontend & UI/UX**
2.28. Kiến trúc Frontend
2.29. Component Hierarchy
2.30. State Management
2.31. Design System
2.32. User Flows
2.33. Responsive Design & Accessibility

### **CHƯƠNG III. TRIỂN KHAI HỆ THỐNG**

**Phần 1: Cài đặt Môi trường**
3.1. Yêu cầu Hệ thống (Prerequisites)
   - 3.1.1. Các công cụ thiết yếu
   - 3.1.2. Môi trường phát triển tích hợp (IDE)
3.2. Cấu hình Backend
   - 3.2.1. Biến môi trường (.env)
   - 3.2.2. Khởi tạo Database
   - 3.2.3. Khởi chạy Server
3.3. Cấu hình Frontend
   - 3.3.1. Cài đặt và Cấu hình
   - 3.3.2. Khởi chạy Ứng dụng

**Phần 2: Triển khai Backend**
3.4. Hệ thống Xác thực (Authentication System)
   - 3.4.1. Kiến trúc và Quy trình
   - 3.4.2. Tích hợp Google OAuth 2.0
3.5. Hệ thống Quản lý Sự kiện (Event Management)
   - 3.5.1. Cấu trúc và Thao tác dữ liệu
   - 3.5.2. Xử lý Sự kiện Lặp lại (Recurring Events)
3.6. Tích hợp Google Calendar
   - 3.6.1. Đồng bộ Hai chiều (Bidirectional Sync)
   - 3.6.2. Cập nhật Thời gian thực (Webhooks)
3.7. Tích hợp AI Chatbot
   - 3.7.1. Kiến trúc Function Calling
   - 3.7.2. Quản lý Ngữ cảnh (Context Management)
3.8. Hệ thống Booking Links
   - 3.8.1. Logic Tính toán Thời gian rảnh
   - 3.8.2. Quy trình Đặt lịch của Khách

**Phần 3: Triển khai Frontend**
3.9. Tích hợp Hệ thống Xác thực
   - 3.9.1. Quản lý Trạng thái Xác thực
   - 3.9.2. Cấu hình API Client và Bảo vệ Route
3.10. Triển khai Giao diện Lịch (Calendar Views)
   - 3.10.1. Component Lịch Tùy biến
   - 3.10.2. Các Chế độ Xem và Tương tác
   - 3.10.3. Quản lý State với TanStack Query
3.11. Giao diện Chat AI Thông minh
   - 3.11.1. Hiển thị Tin nhắn và Markdown
   - 3.11.2. Action Cards và Tương tác
3.12. Trang Đặt lịch Công khai (Public Booking Page)
   - 3.12.1. Giao diện Cho Khách
   - 3.12.2. Form Đặt lịch và Tích hợp

**Phần 4: Triển khai Hạ tầng**
3.13. Kiến trúc Hạ tầng Production
   - 3.13.1. Tổng quan Kiến trúc
   - 3.13.2. Cấu hình Máy chủ (Digital Ocean Droplet)
3.14. Cấu hình Reverse Proxy và CDN
   - 3.14.1. Nginx Reverse Proxy
   - 3.14.2. Cloudflare CDN và Bảo mật
3.15. Quy trình Triển khai (Deployment Workflow)
   - Bước 1: Chuẩn bị Server
   - Bước 2: Clone Repository & Cấu hình
   - Bước 3: Build Docker Images
   - Bước 4: Khởi chạy Dịch vụ
   - Bước 5: Thiết lập Database & SSL
   - 3.15.1. Quy trình CI/CD (GitHub Actions)
3.16. Giám sát và Logging
   - 3.16.1. Hệ thống Health Check
   - 3.16.2. Chiến lược Logging

### **CHƯƠNG IV. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN**
4.1. Kết quả đạt được
   - 4.1.1. Thành tựu về Backend
   - 4.1.2. Thành tựu về Frontend
   - 4.1.3. Thành tựu về Deployment và Infrastructure
   - 4.1.4. Kiến thức và Kỹ năng Thu được
4.2. Hạn chế của Hệ thống
4.3. Hướng Phát triển Tương lai
   - 4.3.1. Tính năng Mới
   - 4.3.2. Cải thiện Kỹ thuật
   - 4.3.3. Phát triển Kinh doanh
4.4. Kết luận Chung
   - 4.4.1. Đánh giá Tổng quan
   - 4.4.2. Hoàn thành Mục tiêu Học tập
   - 4.4.3. Ý nghĩa Thực tiễn
   - 4.4.4. Lời Cảm ơn
   - 4.4.5. Kết thúc

### **TÀI LIỆU THAM KHẢO**

### **PHỤ LỤC**
A. Hướng dẫn Cài đặt và Chạy Ứng dụng
B. Danh sách Thành viên và Phân công Công việc
C. Source Code Repository

---

# **ĐỒ ÁN MÔN HỌC**
# **CÔNG NGHỆ WEB VÀ ỨNG DỤNG (SE347.Q11)**

---

## **ĐỀ TÀI:**
# **CALENTO - TRỢ LÝ QUẢN LÝ LỊCH THÔNG MINH TÍCH HỢP AI**

---

**GVHD:** ThS. Đặng Việt Dũng

**Nhóm thực hiện:** Nhóm 2

**Danh sách thành viên:**
1. Thái Thanh Tài - 22520001 (Nhóm trưởng)
2. [Thành viên khác]

**Thời gian thực hiện:** Từ 08/2024 đến 11/2024

**Trường:** Đại học Công nghệ Thông tin - ĐHQG TP.HCM

---

## **MỤC LỤC**

### **CHƯƠNG I. TỔNG QUAN VỀ ĐỒ ÁN**
1.1. Giới thiệu đề tài
1.2. Mục tiêu đồ án
   - 1.2.1. Mục tiêu chính
   - 1.2.2. Mục tiêu cụ thể
1.3. Phạm vi đồ án
   - 1.3.1. Phạm vi chức năng
   - 1.3.2. Phạm vi phi chức năng
   - 1.3.3. Ngoài phạm vi
1.4. Đối tượng sử dụng
1.5. Công nghệ sử dụng
   - 1.5.1. Frontend Stack
   - 1.5.2. Backend Stack
   - 1.5.3. Database & Storage
   - 1.5.4. Third-party Services
   - 1.5.5. Development & Deployment Tools

### **CHƯƠNG II. THIẾT KẾ HỆ THỐNG**

**Phần 1: Kiến trúc Hệ thống**
2.1. Tổng quan Kiến trúc
2.2. Client Layer (Presentation Layer)
2.3. API Gateway Layer
2.4. Service Layer (Business Logic)
2.5. Data Layer
2.6. External Services Integration
2.7. Background Jobs & Queue System
2.8. Luồng dữ liệu chính

**Phần 2: Thiết kế Cơ sở Dữ liệu**
2.9. Tổng quan Database Schema
2.10. Core Tables
   - 2.10.1. Users Table
   - 2.10.2. Events Table
   - 2.10.3. Calendars Table
   - 2.10.4. Booking Links Table
2.11. Authentication & Security Tables
2.12. Integration Tables
2.13. Supporting Tables
2.14. Relationships & Constraints
2.15. Indexes & Performance Optimization
2.16. JSONB Schema
2.17. Migration System

**Phần 3: Thiết kế API**
2.18. Tổng quan RESTful API
2.19. Authentication Endpoints
2.20. Event Management Endpoints
2.21. Calendar Management Endpoints
2.22. Booking System Endpoints
2.23. AI Chatbot Endpoints
2.24. Google Calendar Integration Endpoints
2.25. User Profile Endpoints
2.26. API Response Format
2.27. HTTP Status Codes

**Phần 4: Thiết kế Frontend & UI/UX**
2.28. Kiến trúc Frontend
2.29. Component Hierarchy
2.30. State Management
2.31. Design System
2.32. User Flows
2.33. Responsive Design & Accessibility

### **CHƯƠNG III. TRIỂN KHAI HỆ THỐNG**

**Phần 1: Cài đặt Môi trường**
3.1. Yêu cầu Hệ thống (Prerequisites)
   - 3.1.1. Các công cụ thiết yếu
   - 3.1.2. Môi trường phát triển tích hợp (IDE)
3.2. Cấu hình Backend
   - 3.2.1. Biến môi trường (.env)
   - 3.2.2. Khởi tạo Database
   - 3.2.3. Khởi chạy Server
3.3. Cấu hình Frontend
   - 3.3.1. Cài đặt và Cấu hình
   - 3.3.2. Khởi chạy Ứng dụng

**Phần 2: Triển khai Backend**
3.4. Hệ thống Xác thực (Authentication System)
   - 3.4.1. Kiến trúc và Quy trình
   - 3.4.2. Tích hợp Google OAuth 2.0
3.5. Hệ thống Quản lý Sự kiện (Event Management)
   - 3.5.1. Cấu trúc và Thao tác dữ liệu
   - 3.5.2. Xử lý Sự kiện Lặp lại (Recurring Events)
3.6. Tích hợp Google Calendar
   - 3.6.1. Đồng bộ Hai chiều (Bidirectional Sync)
   - 3.6.2. Cập nhật Thời gian thực (Webhooks)
3.7. Tích hợp AI Chatbot
   - 3.7.1. Kiến trúc Function Calling
   - 3.7.2. Quản lý Ngữ cảnh (Context Management)
3.8. Hệ thống Booking Links
   - 3.8.1. Logic Tính toán Thời gian rảnh
   - 3.8.2. Quy trình Đặt lịch của Khách

**Phần 3: Triển khai Frontend**
3.9. Tích hợp Hệ thống Xác thực
   - 3.9.1. Quản lý Trạng thái Xác thực
   - 3.9.2. Cấu hình API Client và Bảo vệ Route
3.10. Triển khai Giao diện Lịch (Calendar Views)
   - 3.10.1. Component Lịch Tùy biến
   - 3.10.2. Các Chế độ Xem và Tương tác
   - 3.10.3. Quản lý State với TanStack Query
3.11. Giao diện Chat AI Thông minh
   - 3.11.1. Hiển thị Tin nhắn và Markdown
   - 3.11.2. Action Cards và Tương tác
3.12. Trang Đặt lịch Công khai (Public Booking Page)
   - 3.12.1. Giao diện Cho Khách
   - 3.12.2. Form Đặt lịch và Tích hợp

**Phần 4: Triển khai Hạ tầng**
3.13. Kiến trúc Hạ tầng Production
   - 3.13.1. Tổng quan Kiến trúc
   - 3.13.2. Cấu hình Máy chủ (Digital Ocean Droplet)
3.14. Cấu hình Reverse Proxy và CDN
   - 3.14.1. Nginx Reverse Proxy
   - 3.14.2. Cloudflare CDN và Bảo mật
3.15. Quy trình Triển khai (Deployment Workflow)
   - Bước 1: Chuẩn bị Server
   - Bước 2: Clone Repository & Cấu hình
   - Bước 3: Build Docker Images
   - Bước 4: Khởi chạy Dịch vụ
   - Bước 5: Thiết lập Database & SSL
   - 3.15.1. Quy trình CI/CD (GitHub Actions)
3.16. Giám sát và Logging
   - 3.16.1. Hệ thống Health Check
   - 3.16.2. Chiến lược Logging

### **CHƯƠNG IV. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN**
4.1. Kết quả đạt được
   - 4.1.1. Thành tựu về Backend
   - 4.1.2. Thành tựu về Frontend
   - 4.1.3. Thành tựu về Deployment và Infrastructure
   - 4.1.4. Kiến thức và Kỹ năng Thu được
4.2. Hạn chế của Hệ thống
4.3. Hướng Phát triển Tương lai
   - 4.3.1. Tính năng Mới
   - 4.3.2. Cải thiện Kỹ thuật
   - 4.3.3. Phát triển Kinh doanh
4.4. Kết luận Chung
   - 4.4.1. Đánh giá Tổng quan
   - 4.4.2. Hoàn thành Mục tiêu Học tập
   - 4.4.3. Ý nghĩa Thực tiễn
   - 4.4.4. Lời Cảm ơn
   - 4.4.5. Kết thúc

### **TÀI LIỆU THAM KHẢO**

### **PHỤ LỤC**
A. Hướng dẫn Cài đặt và Chạy Ứng dụng
B. Danh sách Thành viên và Phân công Công việc
C. Source Code Repository

---

## **DANH SÁCH HÌNH, BẢNG**

### **DANH SÁCH HÌNH**

**Chương I - Tổng quan:**
- Hình 1.1: Logo Next.js Framework
- Hình 1.2: Logo NestJS Framework  
- Hình 1.3: Logo PostgreSQL Database
- Hình 1.4: Logo Redis Cache
- Hình 1.5: Logo Google Gemini AI
- Hình 1.6: Giao diện tổng quan ứng dụng Calento
- Hình 1.7: Sơ đồ Repository Pattern trong NestJS

**Chương II - Thiết kế hệ thống:**
- Hình 2.1: Sơ đồ kiến trúc tổng thể hệ thống
- Hình 2.2: Sơ đồ ERD (Entity Relationship Diagram) - Database Schema
- Hình 2.3: Screenshot Swagger API Documentation
- Hình 2.4: Wireframe giao diện Calendar Dashboard
- Hình 2.5: Mockup giao diện AI Chat Interface
- Hình 2.6: Design System - Color Palette và Typography

**Chương III - Triển khai:**
- Hình 3.1: Screenshot VS Code Extensions
- Hình 3.2: Logo Docker
- Hình 3.3: Screenshot NestJS Module Structure
- Hình 3.4: Screenshot Calendar Component các views (Day/Week/Month)
- Hình 3.5: Screenshot AI Chatbot conversation
- Hình 3.6: Screenshot Public Booking Page
- Hình 3.7: Logo Cloudflare
- Hình 3.8: Screenshot Cloudflare Dashboard - DNS Settings
- Hình 3.9: Logo Nginx
- Hình 3.10: Screenshot GitHub Actions CI/CD Pipeline
- Hình 3.11: Screenshot Digital Ocean Droplet Dashboard

**Chương IV - Kết luận:**
- Hình 4.1: Screenshot Demo ứng dụng hoàn chỉnh

### **DANH SÁCH BẢNG**

**Chương I:**
- Bảng 1.1: So sánh hạn chế các ứng dụng hiện tại
- Bảng 1.2: Các tính năng chính của Calento
- Bảng 1.3: HTTP Methods trong RESTful API

**Chương II:**
- Bảng 2.1: Danh sách 15 bảng chính trong Database
- Bảng 2.2: Chi tiết cấu trúc bảng Users
- Bảng 2.3: Chi tiết cấu trúc bảng Events
- Bảng 2.4: API Endpoints theo nhóm chức năng

**Chương III:**
- Bảng 3.1: Danh sách công cụ yêu cầu
- Bảng 3.2: Extensions khuyến nghị cho VS Code
- Bảng 3.3: Cấu hình biến môi trường Backend
- Bảng 3.4: Cấu hình biến môi trường Frontend
- Bảng 3.5: Thông số kỹ thuật Droplet
- Bảng 3.6: Cấu hình DNS Records

**Lưu ý:** Tất cả hình ảnh và bảng biểu được đánh số theo chương và thứ tự xuất hiện. Các hình ảnh chưa được cập nhật sẽ có ghi chú **[CẬP NHẬT SAU]**.

## **TÓM TẮT ĐỒ ÁN**

Calento là một ứng dụng web quản lý lịch thông minh tích hợp trí tuệ nhân tạo (AI), được phát triển nhằm giúp người dùng tối ưu hóa việc quản lý thời gian và lịch trình cá nhân. Hệ thống kết hợp các công nghệ hiện đại như Next.js 15, NestJS 10, PostgreSQL, Redis và Google Gemini AI để mang lại trải nghiệm người dùng mượt mà và hiệu quả.

Các tính năng chính của Calento bao gồm hệ thống xác thực an toàn với JWT và Google OAuth 2.0, quản lý sự kiện lịch đầy đủ với khả năng tạo sự kiện lặp lại theo chuẩn RRULE, đồng bộ hai chiều với Google Calendar thông qua webhooks real-time, AI Chatbot thông minh sử dụng Google Gemini hiểu ngôn ngữ tự nhiên để tự động tạo sự kiện và đề xuất thời gian họp, cùng với hệ thống Booking Links cho phép chia sẻ lịch rảnh và đặt lịch công khai một cách dễ dàng.

Kiến trúc hệ thống được thiết kế theo mô hình Client-Server với Frontend sử dụng Next.js 15 kết hợp TailwindCSS, Backend xây dựng trên NestJS với kiến trúc modular, cơ sở dữ liệu PostgreSQL với 15 bảng chính được tối ưu hóa, Redis đảm nhận vai trò cache và queue management, và toàn bộ ứng dụng được container hóa bằng Docker triển khai trên Digital Ocean với Cloudflare CDN. RESTful API với hơn 78 endpoints đầy đủ tài liệu Swagger đảm bảo khả năng tích hợp và mở rộng cao.

Đồ án đã đạt được nhiều thành tựu đáng kể trong việc áp dụng kiến thức môn học Công nghệ Web vào thực tiễn, tích hợp thành công các công nghệ tiên tiến như AI và third-party APIs, xây dựng sản phẩm production-ready hoạt động ổn định với uptime trên 99.5%, và mang lại giá trị thực tiễn cho người dùng trong việc quản lý thời gian hiệu quả.

Hệ thống hiện tại vẫn còn một số hạn chế cần khắc phục như test coverage thấp, thiếu một số tính năng nâng cao, và cần cải thiện về performance và security. Hướng phát triển tương lai bao gồm xây dựng ứng dụng mobile cho iOS và Android, mở rộng tính năng team collaboration, nâng cấp AI features với smart scheduling và meeting transcription, cải thiện khả năng scale với microservices architecture, và phát triển chiến lược monetization bền vững.
