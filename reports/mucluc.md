# MỤC LỤC BÁO CÁO ĐỒ ÁN (CALENTO)

- [Chương 1: Giới thiệu đề tài](#chương-1-giới-thiệu-đề-tài)

  - [1.1 Lý do chọn đề tài](#11-lý-do-chọn-đề-tài)
  - [1.2 Mục tiêu đề tài](#12-mục-tiêu-đề-tài)
  - [1.3 Phạm vi đề tài](#13-phạm-vi-đề-tài)
    - [1.3.1 Phạm vi người dùng (Roles/Actors)](#131-phạm-vi-người-dùng-rolesactors)
    - [1.3.2 Phạm vi môi trường](#132-phạm-vi-môi-trường)
    - [1.3.3 Phạm vi chức năng](#133-phạm-vi-chức-năng)
  - [1.4 Phương pháp thực hiện](#14-phương-pháp-thực-hiện)
  - [1.5 Công nghệ sử dụng (Tech Stack)](#15-công-nghệ-sử-dụng-tech-stack)
- [Chương 2: Cơ sở lý thuyết](#chương-2-cơ-sở-lý-thuyết)

  - [2.1 Tổng quan bài toán Calendar Assistant](#21-tổng-quan-bài-toán-calendar-assistant)
  - [2.2 TypeScript](#22-typescript)
  - [2.3 Node.js](#23-nodejs)
  - [2.4 NestJS](#24-nestjs)
  - [2.5 PostgreSQL & pgvector](#25-postgresql--pgvector)
  - [2.6 Redis & BullMQ](#26-redis--bullmq)
  - [2.7 Next.js & React](#27-nextjs--react)
  - [2.8 Tailwind CSS & UI Libraries](#28-tailwind-css--ui-libraries)
  - [2.9 AI/LLM: Gemini, LangChain & Embeddings](#29-aillm-gemini-langchain--embeddings)
  - [2.10 Realtime/Streaming: SSE](#210-realtimestreaming-sse)
- [Chương 3: Phân tích và thiết kế hệ thống](#chương-3-phân-tích-và-thiết-kế-hệ-thống)

  - [3.1 Danh sách các yêu cầu](#31-danh-sách-các-yêu-cầu)
    - [3.1.1 Yêu cầu nghiệp vụ (Business Requirements)](#311-yêu-cầu-nghiệp-vụ-business-requirements)
      - [BR-01 Quản lý sự kiện và lịch trình cá nhân](#br-01-quản-lý-sự-kiện-và-lịch-trình-cá-nhân)
      - [BR-02 Đồng bộ hóa với Google Calendar](#br-02-đồng-bộ-hóa-với-google-calendar)
      - [BR-03 Hệ thống đặt lịch hẹn công khai (Booking System)](#br-03-hệ-thống-đặt-lịch-hẹn-công-khai-booking-system)
      - [BR-04 Trợ lý ảo AI thông minh (AI Assistant)](#br-04-trợ-lý-ảo-ai-thông-minh-ai-assistant)
      - [BR-05 Quản lý công việc với hệ thống ưu tiên (Task Management)](#br-05-quản-lý-công-việc-với-hệ-thống-ưu-tiên-task-management)
      - [BR-06 Cộng tác nhóm (Team Collaboration)](#br-06-cộng-tác-nhóm-team-collaboration)
      - [BR-07 Hệ thống thông báo đa kênh (Multi-channel Notifications)](#br-07-hệ-thống-thông-báo-đa-kênh-multi-channel-notifications)
      - [BR-08 Content Management System (Blog CMS)](#br-08-content-management-system-blog-cms)
    - [3.1.2 Yêu cầu chức năng chi tiết (Functional Requirements)](#312-yêu-cầu-chức-năng-chi-tiết-functional-requirements)
  - [3.2 Kiến trúc hệ thống](#32-kiến-trúc-hệ-thống)
    - [3.2.1 Sơ đồ kiến trúc tổng thể](#321-sơ-đồ-kiến-trúc-tổng-thể)
    - [3.2.2 Các tầng/thành phần kiến trúc](#322-arch-cac-tangthanh-phan-kien-truc)
    - [3.2.3 Các module/services chính](#323-arch-cac-moduleservices-chinh)
    - [3.2.4 Luồng dữ liệu (Data Flow)](#324-arch-luong-du-lieu-data-flow)
    - [3.2.5 Triển khai &amp; hạ tầng (Deployment/Workers)](#325-arch-trien-khai--ha-tang-deploymentworkers)
  - [3.2 Phân tích yêu cầu và Use Case](#32-phan-tich-yeu-cau-va-use-case)
    - [3.2.1 Xác định Actors (Tác nhân)](#321-xac-dinh-actors-tac-nhan)
    - [3.2.2 Sơ đồ Use Case tổng quan](#322-so-do-use-case-tong-quan)
    - [3.2.3 Đặc tả Use Case chi tiết](#323-dac-ta-use-case-chi-tiet)
    - [3.2.4 Ma trận Actor - Use Case](#324-ma-tran-actor---use-case)
    - [3.2.5 Yêu cầu phi chức năng (Non-functional Requirements)](#325-yeu-cau-phi-chuc-nang-non-functional-requirements)
      - [3.2.5.1 Yêu cầu về Hiệu năng (Performance Requirements)](#3251-yeu-cau-ve-hieu-nang-performance-requirements)
      - [3.2.5.2 Yêu cầu về Bảo mật (Security Requirements)](#3252-yeu-cau-ve-bao-mat-security-requirements)
      - [3.2.5.3 Yêu cầu về Khả năng Mở rộng (Scalability Requirements)](#3253-yeu-cau-ve-kha-nang-mo-rong-scalability-requirements)
      - [3.2.5.4 Yêu cầu về Độ Sẵn sàng (Availability Requirements)](#3254-yeu-cau-ve-do-san-sang-availability-requirements)
      - [3.2.5.5 Yêu cầu về Tính Khả dụng (Usability Requirements)](#3255-yeu-cau-ve-tinh-kha-dung-usability-requirements)
  - [3.3 Mô tả các thành phần trong hệ thống](#33-mo-ta-cac-thanh-phan-trong-he-thong)
    - [3.3.1 Core Modules - Nhóm Module Nền tảng](#331-core-modules---nhom-module-nen-tang)
      - [33.1.1 Auth Module (Authentication &amp; Authorization)](#3311-auth-module-authentication--authorization)
        - [Auth: Chức năng &amp; trách nhiệm](#auth-chuc-nang--trach-nhiem)
        - [Auth: Luồng xử lý chính](#auth-luong-xu-ly-chinh)
        - [Auth: API endpoints &amp; bảo mật](#auth-api-endpoints--bao-mat)
      - [3.3.1.2 Users Module (User Profile Management)](#3312-users-module-user-profile-management)
        - [Users: Dữ liệu &amp; cài đặt](#users-du-lieu--cai-dat)
        - [Users: API endpoints](#users-api-endpoints)
      - [3.3.1.3 Calendar Module (Calendar Metadata Management)](#3313-calendar-module-calendar-metadata-management)
        - [Calendar: Khái niệm &amp; dữ liệu](#calendar-khai-niem--du-lieu)
        - [Calendar: API endpoints](#calendar-api-endpoints)
    - [3.3.2 Event Management Modules](#332-event-management-modules)
      - [3.3.2.1 Calendar &amp; Event Module](#3321-calendar--event-module)
        - [Event: Chức năng chính](#event-chuc-nang-chinh)
        - [Event: Luồng tạo/sửa/xóa &amp; recurring](#event-luong-taosua-xoa--recurring)
        - [Event: Dữ liệu liên quan](#event-du-lieu-lien-quan)
      - [3.3.2.2 Booking Module](#3322-booking-module)
        - [Booking: Slot/Availability engine](#booking-slotavailability-engine)
        - [Booking: Luồng đặt lịch (guest)](#booking-luong-dat-lich-guest)
        - [Booking: Dữ liệu liên quan](#booking-du-lieu-lien-quan)
    - [3.3.2 AI &amp; RAG Modules](#332-ai--rag-modules)
      - [3.3.2.1 LLM Module (Large Language Model Service)](#3321-llm-module-large-language-model-service)
      - [3.3.2.2 LangChain Integration Layer](#3322-langchain-integration-layer)
      - [3.3.2.3 Vector Module (Embedding &amp; Similarity Search)](#3323-vector-module-embedding--similarity-search)
      - [3.3.2.4 RAG Module (Retrieval-Augmented Generation)](#3324-rag-module-retrieval-augmented-generation)
    - [3.3.3 Google Calendar Sync Module](#333-google-calendar-sync-module)
    - [3.3.4 Notification System Module](#334-notification-system-module)
    - [3.3.5 Webhook System Module (Outgoing Webhook)](#335-webhook-system-module-outgoing-webhook)
  - [3.3 Thiết kế dữ liệu](#33-thiet-ke-du-lieu)
    - [3.3.1 PostgreSQL Extensions &amp; Custom Types](#331-postgresql-extensions--custom-types)
    - [3.3.2 Entity Relationship Diagram](#332-entity-relationship-diagram)
    - [3.3.3 Database Migration Strategy: Raw SQL](#333-database-migration-strategy-raw-sql)
    - [3.3.4 Danh sách bảng (Tables Overview)](#334-danh-sach-bang-tables-overview)
    - [3.3.5 Mối quan hệ dữ liệu](#335-moi-quan-he-du-lieu)
  - [3.4 Thiết kế luồng xử lý &amp; vận hành hệ thống](#34-thiet-ke-luong-xu-ly--van-hanh-he-thong)
    - [3.4.1 Luồng xử lý nghiệp vụ chính](#341-luong-xu-ly-nghiep-vu-chinh)
      - [Luồng 1: Xác thực &amp; Phân quyền (Authentication)](#3411-luong-1-xac-thuc--phan-quyen-authentication)
      - [Luồng 2: Quản lý Sự kiện &amp; Đồng bộ (Event Management)](#3412-luong-2-quan-ly-su-kien--dong-bo-event-management)
      - [Luồng 3: Hệ thống Đặt lịch (Booking System)](#3413-luong-3-he-thong-dat-lich-booking-system)
      - [Luồng 4: Trợ lý AI (AI Assistant)](#3414-luong-4-tro-ly-ai-ai-assistant)
      - [Luồng 5: Quản lý Công việc (Task Management)](#3415-luong-5-quan-ly-cong-viec-task-management)
      - [Luồng 6: Hợp tác Nhóm (Team Collaboration)](#3416-luong-6-hop-tac-nhom-team-collaboration)
      - [Luồng 7: Khôi phục mật khẩu (Password Reset)](#3417-luong-7-khoi-phuc-mat-khau-password-reset)
      - [Luồng 8: Email &amp; Thông báo (Notification Delivery)](#3418-luong-8-email--thong-bao-notification-delivery)
      - [Luồng 9: Webhook Outgoing (Webhook Delivery)](#3419-luong-9-webhook-outgoing-webhook-delivery)
      - [Luồng 10: Blog CMS (Bài viết, tags, comments)](#34110-luong-10-blog-cms-bai-viet-tags-comments)
      - [Luồng 11: Analytics/Report (Tổng hợp số liệu)](#34111-luong-11-analyticsreport-tong-hop-so-lieu)
      - [Luồng 12: Xử lý xung đột đồng bộ (Sync Conflict Resolution)](#34112-luong-12-xu-ly-xung-dot-dong-bo-sync-conflict-resolution)
    - [3.4.2 Sơ đồ tuần tự (Sequence Diagrams)](#342-so-do-tuan-tu-sequence-diagrams)
      - [Sequence Diagram 1: Đăng nhập &amp; Xác thực (Authentication Flow)](#3421-sequence-diagram-1-dang-nhap--xac-thuc-authentication-flow)
      - [Sequence Diagram 2: Quy trình Sự kiện (Event Process)](#3422-sequence-diagram-2-quy-trinh-su-kien-event-process)
      - [Sequence Diagram 3: Quy trình Đặt lịch (Booking Process)](#3423-sequence-diagram-3-quy-trinh-dat-lich-booking-process)
      - [Sequence Diagram 4: AI Chatbot với RAG](#3424-sequence-diagram-4-ai-chatbot-voi-rag)
      - [Sequence Diagram 5: Quản lý Công việc (Task Flow)](#3425-sequence-diagram-5-quan-ly-cong-viec-task-flow)
      - [Sequence Diagram 6: Hợp tác Nhóm (Team Collaboration)](#3426-sequence-diagram-6-hop-tac-nhom-team-collaboration)
      - [Sequence Diagram 7: Khôi phục Mật khẩu (Password Reset)](#3427-sequence-diagram-7-khoi-phuc-mat-khau-password-reset)
      - [Sequence Diagram 8: Gửi Email/Thông báo (Notification Delivery)](#3428-sequence-diagram-8-gui-emailthong-bao-notification-delivery)
      - [Sequence Diagram 9: Webhook Delivery (Outgoing Webhook)](#3429-sequence-diagram-9-webhook-delivery-outgoing-webhook)
      - [Sequence Diagram 10: Xử lý xung đột đồng bộ (Sync Conflict Resolution)](#34210-sequence-diagram-10-xu-ly-xung-dot-dong-bo-sync-conflict-resolution)
      - [Sequence Diagram 11: Blog CMS (Create Post / Moderate Comment)](#34211-sequence-diagram-11-blog-cms-create-post--moderate-comment)
      - [Sequence Diagram 12: Analytics/Report (Aggregate Metrics)](#34212-sequence-diagram-12-analyticsreport-aggregate-metrics)
    - [3.4.3 Progressive Web App (PWA)](#343-progressive-web-app-pwa)
      - [PWA: App Manifest (manifest.json)](#3431-pwa-app-manifest-manifestjson)
      - [PWA: Service Worker (sw.js)](#3432-pwa-service-worker-swjs)
      - [PWA: Caching strategy (Cache First / Network First)](#3433-pwa-caching-strategy-cache-first--network-first)
      - [PWA: Offline &amp; Background Sync](#3434-pwa-offline--background-sync)
      - [PWA: Push Notifications (nếu có)](#3435-pwa-push-notifications-neu-co)
    - [3.4.4 Hệ thống Email &amp; Thông báo (Email Notification Service)](#344-he-thong-email--thong-bao-email-notification-service)
      - [Email: Chức năng chính](#3441-email-chuc-nang-chinh)
      - [Email: Transactional Emails](#3442-email-transactional-emails)
      - [Email: Scheduling Notifications](#3443-email-scheduling-notifications)
      - [Email: Automated Reminders (Cron/Jobs)](#3444-email-automated-reminders-cronjobs)
      - [Email: Nodemailer (SMTP/Transport)](#3445-email-nodemailer-smtptransport)
      - [Email: BullMQ &amp; Redis (Queue/Worker)](#3446-email-bullmq--redis-queueworker)
      - [Email: Handlebars (HTML Templates)](#3447-email-handlebars-html-templates)
  - [3.5 Deployment (Triển khai hệ thống)](#35-deployment-trien-khai-he-thong)
    - [3.5.1 Môi trường triển khai (Environments)](#351-moi-truong-trien-khai-environments)
    - [3.5.2 Docker &amp; Containerization](#352-docker--containerization)
    - [3.5.3 Cấu hình biến môi trường &amp; Secrets](#353-cau-hinh-bien-moi-truong--secrets)
    - [3.5.4 Domain/DNS/SSL](#354-domaindnsssl)
    - [3.5.5 CI/CD (Pipeline)](#355-cicd-pipeline)
    - [3.5.6 Monitoring/Logging &amp; Backup](#356-monitoringlogging--backup)
  - [3.6 Thiết kế API](#36-thiet-ke-api)
    - [3.6.1 Kiến trúc & nguyên lý thiết kế](#361-kien-truc--nguyen-ly-thiet-ke)
    - [3.6.2 Cơ chế xác thực & bảo mật](#362-co-che-xac-thuc--bao-mat)
    - [3.6.3 Chiến lược phiên bản hóa (Versioning)](#363-chien-luoc-phien-ban-hoa-versioning)
    - [3.6.4 Các nhóm tài nguyên chính](#364-cac-nhom-tai-nguyen-chinh)
    - [3.6.5 Danh sách API chi tiết (Endpoints)](#365-danh-sach-api-chi-tiet-endpoints)
- [Chương 4: Xây dựng ứng dụng](#chương-4-xây-dựng-ứng-dụng)

  - [4.1 Thiết kế giao diện (UI/UX)](#41-thiet-ke-giao-dien-uiux)
    - [4.1.1 Public pages (Guest)](#411-public-pages-guest)
    - [4.1.2 Auth pages](#412-auth-pages)
    - [4.1.3 Public Booking pages](#413-public-booking-pages)
    - [4.1.4 Dashboard (Registered User/Host)](#414-dashboard-registered-userhost)
    - [4.1.5 Teams (Team Member/Owner)](#415-teams-team-memberowner)
    - [4.1.6 Settings / Integrations / Profile / Billing](#416-settings--integrations--profile--billing)
    - [4.1.7 Admin / CMS (Blog/Comments/Contacts)](#417-admin--cms-blogcommentscontacts)
    - [4.1.8 Sơ đồ luồng Frontend (Frontend Architecture)](#418-so-do-luong-frontend-frontend-architecture)
  - [4.2 Xây dựng Frontend (Next.js App)](#42-xay-dung-frontend-nextjs-app)
    - [4.2.1 Routing & Layouts (App Router)](#421-routing--layouts-app-router)
    - [4.2.2 Data fetching & State (TanStack Query / Zustand)](#422-data-fetching--state-tanstack-query--zustand)
    - [4.2.3 UI Components (Calendar, Booking, Team, Blog)](#423-ui-components-calendar-booking-team-blog)
  - [4.3 Chi tiết Hiện thực Tính năng (Feature Implementation)](#43-chi-tiet-hien-thuc-tinh-nang-feature-implementation)
    - [4.3.1 Dashboard & Calendar](#431-dashboard--calendar)
    - [4.3.2 Booking System (Đặt lịch hẹn)](#432-booking-system-dat-lich-hen)
    - [4.3.3 Team Collaboration](#433-team-collaboration)
    - [4.3.4 Blog CMS (Admin)](#434-blog-cms-admin)
  - [4.4 Tích hợp AI Assistant](#44-tich-hop-ai-assistant)
  - [4.5 Tích hợp Google Calendar/Meet](#45-tich-hop-google-calendarmeet)
  - [4.6 Notification/Email/Webhook/Jobs](#46-notificationemailwebhookjobs)

- [Chương 5: Kiểm thử - đánh giá - triển khai](#chương-5-kiểm-thử---đánh-giá---triển-khai)

  - [5.1 Đánh giá kết quả](#51-đánh-giá-kết-quả)
  - [5.2 Hạn chế](#52-hạn-chế)
  - [5.3 Hướng phát triển](#53-hướng-phát-triển)

---

## Chương 1: Giới thiệu đề tài

### 1.1 Lý do chọn đề tài

### 1.2 Mục tiêu đề tài

### 1.3 Phạm vi đề tài

#### 1.3.1 Phạm vi người dùng (Roles/Actors)

- Guest
- Registered User
- Team Member
- Team Owner
- Admin/Content Manager

#### 1.3.2 Phạm vi môi trường

#### 1.3.3 Phạm vi chức năng

### 1.4 Phương pháp thực hiện

### 1.5 Công nghệ sử dụng (Tech Stack)

- Frontend: Next.js 15, React 19, Tailwind CSS, TanStack Query, Zustand (Radix UI / shadcn/ui)
- Backend: NestJS, TypeScript
- Database: PostgreSQL (+ pgvector), Redis
- Jobs/Queue: BullMQ
- AI/LLM: Google Gemini, LangChain, Embeddings (768 chiều)
- Realtime/Streaming: SSE
- Infrastructure: Docker, GCP (có thể có Nginx/Load Balancer)

---

## Chương 2: Cơ sở lý thuyết

### 2.1 Tổng quan bài toán Calendar Assistant

### 2.2 TypeScript

### 2.3 Node.js

### 2.4 NestJS

### 2.5 PostgreSQL & pgvector

### 2.6 Redis & BullMQ

### 2.7 Next.js & React

### 2.8 Tailwind CSS & UI Libraries

### 2.9 AI/LLM: Gemini, LangChain & Embeddings

### 2.10 Realtime/Streaming: SSE

---

## Chương 3: Phân tích và thiết kế hệ thống

### 3.1 Danh sách các yêu cầu

#### 3.1.1 Yêu cầu nghiệp vụ (Business Requirements)

##### BR-01 Quản lý sự kiện và lịch trình cá nhân

##### BR-02 Đồng bộ hóa với Google Calendar

##### BR-03 Hệ thống đặt lịch hẹn công khai (Booking System)

##### BR-04 Trợ lý ảo AI thông minh (AI Assistant)

##### BR-05 Quản lý công việc với hệ thống ưu tiên (Task Management)

##### BR-06 Cộng tác nhóm (Team Collaboration)

##### BR-07 Hệ thống thông báo đa kênh (Multi-channel Notifications)

##### BR-08 Content Management System (Blog CMS)

#### 3.1.2 Yêu cầu chức năng chi tiết (Functional Requirements)

`<a id="32-kiến-trúc-hệ-thống"></a>`

### 3.2 Kiến trúc hệ thống

`<a id="321-sơ-đồ-kiến-trúc-tổng-thể"></a>`

#### 3.2.1 Sơ đồ kiến trúc tổng thể

`<a id="322-arch-cac-tangthanh-phan-kien-truc"></a>`

#### 3.2.2 Các tầng/thành phần kiến trúc

`<a id="323-arch-cac-moduleservices-chinh"></a>`

#### 3.2.3 Các module/services chính

`<a id="324-arch-luong-du-lieu-data-flow"></a>`

#### 3.2.4 Luồng dữ liệu (Data Flow)

`<a id="325-arch-trien-khai--ha-tang-deploymentworkers"></a>`

#### 3.2.5 Triển khai & hạ tầng (Deployment/Workers)

`<a id="32-phan-tich-yeu-cau-va-use-case"></a>`

### 3.2 Phân tích yêu cầu và Use Case

`<a id="321-xac-dinh-actors-tac-nhan"></a>`

#### 3.2.1 Xác định Actors (Tác nhân)

`<a id="322-so-do-use-case-tong-quan"></a>`

#### 3.2.2 Sơ đồ Use Case tổng quan

`<a id="323-dac-ta-use-case-chi-tiet"></a>`

#### 3.2.3 Đặc tả Use Case chi tiết

`<a id="324-ma-tran-actor---use-case"></a>`

#### 3.2.4 Ma trận Actor - Use Case

`<a id="325-yeu-cau-phi-chuc-nang-non-functional-requirements"></a>`

#### 3.2.5 Yêu cầu phi chức năng (Non-functional Requirements)

`<a id="3251-yeu-cau-ve-hieu-nang-performance-requirements"></a>`

##### 3.2.5.1 Yêu cầu về Hiệu năng (Performance Requirements)

`<a id="3252-yeu-cau-ve-bao-mat-security-requirements"></a>`

##### 3.2.5.2 Yêu cầu về Bảo mật (Security Requirements)

`<a id="3253-yeu-cau-ve-kha-nang-mo-rong-scalability-requirements"></a>`

##### 3.2.5.3 Yêu cầu về Khả năng Mở rộng (Scalability Requirements)

`<a id="3254-yeu-cau-ve-do-san-sang-availability-requirements"></a>`

##### 3.2.5.4 Yêu cầu về Độ Sẵn sàng (Availability Requirements)

`<a id="3255-yeu-cau-ve-tinh-kha-dung-usability-requirements"></a>`

##### 3.2.5.5 Yêu cầu về Tính Khả dụng (Usability Requirements)

`<a id="33-mo-ta-cac-thanh-phan-trong-he-thong"></a>`

### 3.3 Mô tả các thành phần trong hệ thống

`<a id="331-core-modules---nhom-module-nen-tang"></a>`

#### 3.3.1 Core Modules - Nhóm Module Nền tảng

`<a id="3311-auth-module-authentication--authorization"></a>`

##### 33.1.1 Auth Module (Authentication & Authorization)

`<a id="auth-chuc-nang--trach-nhiem"></a>`

###### Auth: Chức năng & trách nhiệm

`<a id="auth-luong-xu-ly-chinh"></a>`

###### Auth: Luồng xử lý chính

`<a id="auth-api-endpoints--bao-mat"></a>`

###### Auth: API endpoints & bảo mật

`<a id="3312-users-module-user-profile-management"></a>`

##### 3.3.1.2 Users Module (User Profile Management)

`<a id="users-du-lieu--cai-dat"></a>`

###### Users: Dữ liệu & cài đặt

`<a id="users-api-endpoints"></a>`

###### Users: API endpoints

`<a id="3313-calendar-module-calendar-metadata-management"></a>`

##### 3.3.1.3 Calendar Module (Calendar Metadata Management)

`<a id="calendar-khai-niem--du-lieu"></a>`

###### Calendar: Khái niệm & dữ liệu

`<a id="calendar-api-endpoints"></a>`

###### Calendar: API endpoints

`<a id="332-event-management-modules"></a>`

#### 3.3.2 Event Management Modules

`<a id="3321-calendar--event-module"></a>`

##### 3.3.2.1 Calendar & Event Module

`<a id="event-chuc-nang-chinh"></a>`

###### Event: Chức năng chính

`<a id="event-luong-taosua-xoa--recurring"></a>`

###### Event: Luồng tạo/sửa/xóa & recurring

`<a id="event-du-lieu-lien-quan"></a>`

###### Event: Dữ liệu liên quan

`<a id="3322-booking-module"></a>`

##### 3.3.2.2 Booking Module

`<a id="booking-slotavailability-engine"></a>`

###### Booking: Slot/Availability engine

`<a id="booking-luong-dat-lich-guest"></a>`

###### Booking: Luồng đặt lịch (guest)

`<a id="booking-du-lieu-lien-quan"></a>`

###### Booking: Dữ liệu liên quan

`<a id="332-ai--rag-modules"></a>`

#### 3.3.2 AI & RAG Modules

`<a id="3321-llm-module-large-language-model-service"></a>`

##### 3.3.2.1 LLM Module (Large Language Model Service)

`<a id="3322-langchain-integration-layer"></a>`

##### 3.3.2.2 LangChain Integration Layer

`<a id="3323-vector-module-embedding--similarity-search"></a>`

##### 3.3.2.3 Vector Module (Embedding & Similarity Search)

`<a id="3324-rag-module-retrieval-augmented-generation"></a>`

##### 3.3.2.4 RAG Module (Retrieval-Augmented Generation)

`<a id="333-google-calendar-sync-module"></a>`

#### 3.3.3 Google Calendar Sync Module

`<a id="334-notification-system-module"></a>`

#### 3.3.4 Notification System Module

`<a id="335-webhook-system-module-outgoing-webhook"></a>`

#### 3.3.5 Webhook System Module (Outgoing Webhook)

`<a id="33-thiet-ke-du-lieu"></a>`

### 3.3 Thiết kế dữ liệu

`<a id="331-postgresql-extensions--custom-types"></a>`

#### 3.3.1 PostgreSQL Extensions & Custom Types

`<a id="332-entity-relationship-diagram"></a>`

#### 3.3.2 Entity Relationship Diagram

`<a id="333-database-migration-strategy-raw-sql"></a>`

#### 3.3.3 Database Migration Strategy: Raw SQL

`<a id="334-danh-sach-bang-tables-overview"></a>`

#### 3.3.4 Danh sách bảng (Tables Overview)

`<a id="335-moi-quan-he-du-lieu"></a>`

#### 3.3.5 Mối quan hệ dữ liệu

`<a id="34-thiet-ke-luong-xu-ly--van-hanh-he-thong"></a>`

### 3.4 Thiết kế luồng xử lý & vận hành hệ thống

`<a id="341-luong-xu-ly-nghiep-vu-chinh"></a>`

#### 3.4.1 Luồng xử lý nghiệp vụ chính

`<a id="3411-luong-1-xac-thuc--phan-quyen-authentication"></a>`

##### Luồng 1: Xác thực & Phân quyền (Authentication)

`<a id="3412-luong-2-quan-ly-su-kien--dong-bo-event-management"></a>`

##### Luồng 2: Quản lý Sự kiện & Đồng bộ (Event Management)

`<a id="3413-luong-3-he-thong-dat-lich-booking-system"></a>`

##### Luồng 3: Hệ thống Đặt lịch (Booking System)

`<a id="3414-luong-4-tro-ly-ai-ai-assistant"></a>`

##### Luồng 4: Trợ lý AI (AI Assistant)

`<a id="3415-luong-5-quan-ly-cong-viec-task-management"></a>`

##### Luồng 5: Quản lý Công việc (Task Management)

`<a id="3416-luong-6-hop-tac-nhom-team-collaboration"></a>`

##### Luồng 6: Hợp tác Nhóm (Team Collaboration)

`<a id="3417-luong-7-khoi-phuc-mat-khau-password-reset"></a>`

##### Luồng 7: Khôi phục mật khẩu (Password Reset)

`<a id="3418-luong-8-email--thong-bao-notification-delivery"></a>`

##### Luồng 8: Email & Thông báo (Notification Delivery)

`<a id="3419-luong-9-webhook-outgoing-webhook-delivery"></a>`

##### Luồng 9: Webhook Outgoing (Webhook Delivery)

`<a id="34110-luong-10-blog-cms-bai-viet-tags-comments"></a>`

##### Luồng 10: Blog CMS (Bài viết, tags, comments)

`<a id="34111-luong-11-analyticsreport-tong-hop-so-lieu"></a>`

##### Luồng 11: Analytics/Report (Tổng hợp số liệu)

`<a id="34112-luong-12-xu-ly-xung-dot-dong-bo-sync-conflict-resolution"></a>`

##### Luồng 12: Xử lý xung đột đồng bộ (Sync Conflict Resolution)

`<a id="342-so-do-tuan-tu-sequence-diagrams"></a>`

#### 3.4.2 Sơ đồ tuần tự (Sequence Diagrams)

`<a id="3421-sequence-diagram-1-dang-nhap--xac-thuc-authentication-flow"></a>`

##### Sequence Diagram 1: Đăng nhập & Xác thực (Authentication Flow)

`<a id="3422-sequence-diagram-2-quy-trinh-su-kien-event-process"></a>`

##### Sequence Diagram 2: Quy trình Sự kiện (Event Process)

`<a id="3423-sequence-diagram-3-quy-trinh-dat-lich-booking-process"></a>`

##### Sequence Diagram 3: Quy trình Đặt lịch (Booking Process)

`<a id="3424-sequence-diagram-4-ai-chatbot-voi-rag"></a>`

##### Sequence Diagram 4: AI Chatbot với RAG

`<a id="3425-sequence-diagram-5-quan-ly-cong-viec-task-flow"></a>`

##### Sequence Diagram 5: Quản lý Công việc (Task Flow)

`<a id="3426-sequence-diagram-6-hop-tac-nhom-team-collaboration"></a>`

##### Sequence Diagram 6: Hợp tác Nhóm (Team Collaboration)

`<a id="3427-sequence-diagram-7-khoi-phuc-mat-khau-password-reset"></a>`

##### Sequence Diagram 7: Khôi phục Mật khẩu (Password Reset)

`<a id="3428-sequence-diagram-8-gui-emailthong-bao-notification-delivery"></a>`

##### Sequence Diagram 8: Gửi Email/Thông báo (Notification Delivery)

`<a id="3429-sequence-diagram-9-webhook-delivery-outgoing-webhook"></a>`

##### Sequence Diagram 9: Webhook Delivery (Outgoing Webhook)

`<a id="34210-sequence-diagram-10-xu-ly-xung-dot-dong-bo-sync-conflict-resolution"></a>`

##### Sequence Diagram 10: Xử lý xung đột đồng bộ (Sync Conflict Resolution)

`<a id="34211-sequence-diagram-11-blog-cms-create-post--moderate-comment"></a>`

##### Sequence Diagram 11: Blog CMS (Create Post / Moderate Comment)

`<a id="34212-sequence-diagram-12-analyticsreport-aggregate-metrics"></a>`

##### Sequence Diagram 12: Analytics/Report (Aggregate Metrics)

`<a id="343-progressive-web-app-pwa"></a>`

#### 3.4.3 Progressive Web App (PWA)

`<a id="3431-pwa-app-manifest-manifestjson"></a>`

##### PWA: App Manifest (manifest.json)

`<a id="3432-pwa-service-worker-swjs"></a>`

##### PWA: Service Worker (sw.js)

`<a id="3433-pwa-caching-strategy-cache-first--network-first"></a>`

##### PWA: Caching strategy (Cache First / Network First)

`<a id="3434-pwa-offline--background-sync"></a>`

##### PWA: Offline & Background Sync

`<a id="3435-pwa-push-notifications-neu-co"></a>`

##### PWA: Push Notifications (nếu có)

`<a id="344-he-thong-email--thong-bao-email-notification-service"></a>`

#### 3.4.4 Hệ thống Email & Thông báo (Email Notification Service)

`<a id="3441-email-chuc-nang-chinh"></a>`

##### Email: Chức năng chính

`<a id="3442-email-transactional-emails"></a>`

##### Email: Transactional Emails

`<a id="3443-email-scheduling-notifications"></a>`

##### Email: Scheduling Notifications

`<a id="3444-email-automated-reminders-cronjobs"></a>`

##### Email: Automated Reminders (Cron/Jobs)

`<a id="3445-email-nodemailer-smtptransport"></a>`

##### Email: Nodemailer (SMTP/Transport)

`<a id="3446-email-bullmq--redis-queueworker"></a>`

##### Email: BullMQ & Redis (Queue/Worker)

`<a id="3447-email-handlebars-html-templates"></a>`

##### Email: Handlebars (HTML Templates)

`<a id="35-deployment-trien-khai-he-thong"></a>`

### 3.5 Deployment (Triển khai hệ thống)

`<a id="351-moi-truong-trien-khai-environments"></a>`

#### 3.5.1 Môi trường triển khai (Environments)

`<a id="352-docker--containerization"></a>`

#### 3.5.2 Docker & Containerization

`<a id="353-cau-hinh-bien-moi-truong--secrets"></a>`

#### 3.5.3 Cấu hình biến môi trường & Secrets

`<a id="354-domaindnsssl"></a>`

#### 3.5.4 Domain/DNS/SSL

`<a id="355-cicd-pipeline"></a>`

#### 3.5.5 CI/CD (Pipeline)

`<a id="356-monitoringlogging--backup"></a>`

#### 3.5.6 Monitoring/Logging & Backup

`<a id="36-thiet-ke-api"></a>`

### 3.6 Thiết kế API

`<a id="361-kien-truc--nguyen-ly-thiet-ke"></a>`

#### 3.6.1 Kiến trúc & nguyên lý thiết kế

`<a id="362-co-che-xac-thuc--bao-mat"></a>`

#### 3.6.2 Cơ chế xác thực & bảo mật

`<a id="363-chien-luoc-phien-ban-hoa-versioning"></a>`

#### 3.6.3 Chiến lược phiên bản hóa (Versioning)

`<a id="364-cac-nhom-tai-nguyen-chinh"></a>`

#### 3.6.4 Các nhóm tài nguyên chính

`<a id="365-danh-sach-api-chi-tiet-endpoints"></a>`

#### 3.6.5 Danh sách API chi tiết (Endpoints)

---

## Chương 4: Xây dựng ứng dụng

`<a id="41-thiet-ke-giao-dien-uiux"></a>`

### 4.1 Thiết kế giao diện (UI/UX)

`<a id="411-public-pages-guest"></a>`

#### 4.1.1 Public pages (Guest)

`<a id="412-auth-pages"></a>`

#### 4.1.2 Auth pages

`<a id="413-public-booking-pages"></a>`

#### 4.1.3 Public Booking pages

`<a id="414-dashboard-registered-userhost"></a>`

#### 4.1.4 Dashboard (Registered User/Host)

`<a id="415-teams-team-memberowner"></a>`

#### 4.1.5 Teams (Team Member/Owner)

`<a id="416-settings--integrations--profile--billing"></a>`

#### 4.1.6 Settings / Integrations / Profile / Billing

`<a id="417-admin--cms-blogcommentscontacts"></a>`

#### 4.1.7 Admin / CMS (Blog/Comments/Contacts)

`<a id="418-so-do-luong-frontend-frontend-architecture"></a>`

#### 4.1.8 Sơ đồ luồng Frontend (Frontend Architecture)

`<a id="42-xay-dung-frontend-nextjs-app"></a>`

### 4.2 Xây dựng Frontend (Next.js App)

`<a id="421-routing--layouts-app-router"></a>`

#### 4.2.1 Routing & Layouts (App Router)

`<a id="422-data-fetching--state-tanstack-query--zustand"></a>`

#### 4.2.2 Data fetching & State (TanStack Query / Zustand)

`<a id="423-ui-components-calendar-booking-team-blog"></a>`

#### 4.2.3 UI Components (Calendar, Booking, Team, Blog)

`<a id="43-chi-tiet-hien-thuc-tinh-nang-feature-implementation"></a>`

### 4.3 Chi tiết Hiện thực Tính năng (Feature Implementation)

`<a id="431-dashboard--calendar"></a>`

#### 4.3.1 Dashboard & Calendar

`<a id="432-booking-system-dat-lich-hen"></a>`

#### 4.3.2 Booking System (Đặt lịch hẹn)

`<a id="433-team-collaboration"></a>`

#### 4.3.3 Team Collaboration

`<a id="434-blog-cms-admin"></a>`

#### 4.3.4 Blog CMS (Admin)

`<a id="44-tich-hop-ai-assistant"></a>`

### 4.4 Tích hợp AI Assistant

`<a id="45-tich-hop-google-calendarmeet"></a>`

### 4.5 Tích hợp Google Calendar/Meet

`<a id="46-notificationemailwebhookjobs"></a>`

### 4.6 Notification/Email/Webhook/Jobs



---

## Chương 5: Kiểm thử - đánh giá - triển khai

### 5.1 Đánh giá kết quả

### 5.2 Hạn chế

### 5.3 Hướng phát triển
