**TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN, ĐHQG-HCM**

**KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG**

![][image1]

**BÁO CÁO ĐỒ ÁN MÔN HỌC**

# **ĐỀ TÀI: Xây dựng Calendar Assistant Web**

**Môn học:** Công nghệ Web và ứng dụng - SE347.Q12

**Giảng viên hướng dẫn: Đặng Việt Dũng**

**Thực hiện bởi nhóm 2, bao gồm:**

1. Tạ Văn Thái			22523177		Trưởng nhóm  
2. Bùi Quốc Lâm		22520733		Thành viên  
3. Nguyễn Văn Quyền 		22521223		Thành viên  
4. Nguyễn Công Thắng 	22521330		Thành viên

**Thời gian thực hiện:** 10/2025 - 1/2026

# **DANH MỤC HÌNH ẢNH**

[Hình 1: NestJS	8](#hình-1:-nestjs)

[Hình 2: PostgreSQl	8](#hình-2:-postgresql)

[Hình 3: Redis & BullMQ	9](#hình-3:-redis-&-bullmq)

[Hình 4: Next.js & React	10](#hình-4:-next.js-&-react)

[Hình 5:Tailwind CSS	10](#hình-5:tailwind-css)

[Hình 6:Gemini	11](#hình-6:gemini)

[Hình 7: LangChain	12](#hình-7:-langchain)

[Hình 8: Kiến trúc tổng thể	12](#hình-8:-kiến-trúc-tổng-thể)

[Hình 9: Sơ đồ Use Case tổng quan	13](#hình-9:-sơ-đồ-use-case-tổng-quan)

[Hình 10: Auth Module	13](#hình-10:-auth-module)

[Hình 11: Calendar & Event Module	14](#hình-11:-calendar-&-event-module)

[Hình 12: Booking Module	15](#hình-12:-booking-module)

[Hình 13: LLM Module Architecture	15](#hình-13:-llm-module-architecture)

[Hình 14: Vector Similarity Search Process	16](#hình-14:-vector-similarity-search-process)

[Hình 15: RAG Sequence Flow	16](#hình-15:-rag-sequence-flow)

[Hình 16: Google Calendar Sync Flow	17](#hình-16:-google-calendar-sync-flow)

[Hình 17: Notification Multi-channel System	18](#hình-17:-notification-multi-channel-system)

[Hình 18: Webhook Delivery Flow	18](#hình-18:-webhook-delivery-flow)

[Hình 19: Worker & Infrastructure	19](#hình-19:-worker-&-infrastructure)

[Hình 20: Database Entity Relationship Diagram	20](#hình-20:-database-entity-relationship-diagram)

[Hình 21: VM Instance Google Cloud Platform	21](#hình-21:-vm-instance-google-cloud-platform)

[Hình 22: CloudFlare DNS Record	22](#hình-22:-cloudflare-dns-record)

[Hình 23: Google Search Console	23](#hình-23:-google-search-console)

# <a id="chương-1-giới-thiệu-đề-tài"></a> **Chương 1: Giới thiệu đề tài**

## <a id="11-lý-do-chọn-đề-tài"></a> **1.1 Lý do chọn đề tài**

Trong bối cảnh học tập và làm việc hiện đại, khối lượng công việc tăng nhanh và lịch trình ngày càng dày đặc khiến nhu cầu quản lý thời gian và sắp xếp lịch trở nên quan trọng. Dù các công cụ như Google Calendar, Outlook Calendar hay Apple Calendar đã phổ biến, người dùng vẫn thường gặp khó khăn khi:

- Tạo sự kiện từ thông tin rời rạc (tin nhắn, email, ghi chú) vì phải nhập thủ công.
- Tìm thời gian trống phù hợp để lên lịch họp/đặt lịch hẹn, đặc biệt khi có nhiều lịch hoặc nhiều người tham gia.
- Tra cứu lại ngữ cảnh (mục đích cuộc hẹn, tài liệu liên quan) do thông tin nằm phân tán.

Từ thực tế đó, nhóm xây dựng **Calento (Calendar Intelligence Assistant Web)** với định hướng là một hệ thống quản lý lịch trên nền tảng web kết hợp trợ lý AI, hỗ trợ người dùng thao tác bằng ngôn ngữ tự nhiên, tự động hóa các tác vụ lặp lại và cung cấp trải nghiệm đặt lịch hẹn công khai.

Đề tài đồng thời giúp nhóm vận dụng kiến thức đã học trong môn **Công nghệ Web và Ứng dụng (SE347)**, tiếp cận các kỹ thuật hiện đại như **LLM/Function Calling**, **RAG** và **Vector Similarity Search**.

## <a id="12-mục-tiêu-đề-tài"></a> **1.2 Mục tiêu đề tài**

Mục tiêu của đề tài là xây dựng một ứng dụng web Calento đáp ứng:

- Hỗ trợ người dùng **quản lý lịch và sự kiện** đầy đủ (tạo/xem/sửa/xoá), có các thuộc tính quan trọng (thời gian, mô tả, nhắc nhở, người tham dự).
- Cung cấp **hệ thống đặt lịch hẹn công khai (Booking System)** để người khác có thể đặt lịch theo khung giờ rảnh của chủ tài khoản.
- Tích hợp **đồng bộ với Google Calendar** để dữ liệu lịch được thống nhất.
- Tích hợp **AI Assistant** để người dùng có thể tương tác bằng ngôn ngữ tự nhiên, hỗ trợ tìm lịch trống, tạo lịch nhanh, và truy xuất ngữ cảnh phục vụ hội thoại.

## <a id="13-phạm-vi-đề-tài"></a> **1.3 Phạm vi đề tài**

### <a id="131-phạm-vi-người-dùng-rolesactors"></a> **1.3.1 Phạm vi người dùng (Roles/Actors)**

- **Guest**: Người dùng chưa đăng nhập, có thể truy cập các trang công khai (ví dụ trang booking) và thực hiện đặt lịch nếu được phép.
- **Registered User**: Người dùng đã đăng ký tài khoản, quản lý lịch/sự kiện cá nhân và cài đặt tích hợp.
- **Team Member**: Thành viên thuộc một team, tham gia cộng tác theo phạm vi được phân quyền.
- **Team Owner**: Chủ team, quản lý thành viên, cấu hình team và phân quyền.
- **Admin/Content Manager**: Quản trị nội dung/hệ thống (nếu hệ thống có các trang quản trị/ CMS).

### <a id="132-phạm-vi-môi-trường"></a> **1.3.2 Phạm vi môi trường**

- Ứng dụng tập trung trên **nền tảng Web** (desktop và mobile thông qua responsive).
- Triển khai theo mô hình **client-server**, có thể chạy trong môi trường container hóa (Docker) và triển khai lên hạ tầng cloud.
- Tích hợp các dịch vụ ngoài như **Google Calendar/Google Meet**, email/notification và dịch vụ AI (Gemini).

### <a id="133-phạm-vi-chức-năng"></a> **1.3.3 Phạm vi chức năng**

Trong phạm vi đồ án, hệ thống tập trung vào các nhóm chức năng chính:

- **Xác thực và quản lý người dùng**: đăng ký/đăng nhập, quản lý hồ sơ và cấu hình.
- **Quản lý Calendar & Event**: CRUD sự kiện; hỗ trợ thuộc tính sự kiện và quản lý lịch cá nhân.
- **Booking System**: tạo liên kết đặt lịch công khai; cấu hình availability; ghi nhận lịch hẹn.
- **Đồng bộ Google Calendar**: đồng bộ dữ liệu lịch với tài khoản Google để tránh trùng lịch và thống nhất lịch trình.
- **AI Assistant & RAG**: hội thoại ngôn ngữ tự nhiên; hỗ trợ thực thi hành động (function calling); truy xuất ngữ cảnh bằng vector search để tăng độ chính xác câu trả lời.
- **Thông báo/nhắc lịch**: gửi email/notification theo các sự kiện quan trọng (xác nhận đặt lịch, nhắc lịch).

## <a id="14-phương-pháp-thực-hiện"></a> **1.4 Phương pháp thực hiện**

Nhóm thực hiện đề tài theo các bước chính:

- Khảo sát bài toán và xác định yêu cầu nghiệp vụ/chức năng.
- Phân tích và thiết kế kiến trúc hệ thống, mô hình dữ liệu, phân rã module.
- Xây dựng backend và frontend theo từng tính năng, kiểm thử theo từng giai đoạn.
- Tích hợp các dịch vụ ngoài (Google Calendar, email/notification, AI/LLM) và hoàn thiện luồng nghiệp vụ.
- Đánh giá, tối ưu, chuẩn hóa triển khai và tổng hợp báo cáo.

## <a id="15-công-nghệ-sử-dụng-tech-stack"></a> **1.5 Công nghệ sử dụng (Tech Stack)**

- **Frontend**: 
  - **Framework**: Next.js 15 (App Router, Turbopack)
  - **Library**: React 19
  - **Styling**: Tailwind CSS 4, shadcn/ui, Radix UI
  - **State Management & Data Fetching**: Zustand, TanStack Query v5
- **Backend**: 
  - **Framework**: NestJS 11
  - **Language**: TypeScript
- **Database**: 
  - **Primary**: PostgreSQL (+ pgvector cho RAG)
  - **Cache & Queue**: Redis
- **Background Jobs**: BullMQ
- **AI/LLM**: Google Gemini, LangChain, Embeddings (768 chiều)
- **Realtime**: Server-Sent Events (SSE)
- **Infrastructure**: Docker, GCP
