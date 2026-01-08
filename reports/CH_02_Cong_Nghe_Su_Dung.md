# **CHƯƠNG 2: CÔNG NGHỆ SỬ DỤNG**

## **2.1. Kiến trúc tổng quan (Tech Stack)**

Hệ thống Calento được xây dựng trên nền tảng công nghệ "Bleeding Edge", ưu tiên tốc độ phát triển và hiệu suất cao.

| Thành phần | Công nghệ chính | Phiên bản / Đặc điểm |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) | React 19 RC, Server Actions, Streaming |
| **State Mngt** | TanStack Query + Zustand | Server State & Client State separation |
| **Backend** | NestJS 10 | Modular Architecture, Dependency Injection |
| **Database** | PostgreSQL 16 + Redis | **pgvector** enabled, BullMQ for queues |
| **AI Core** | **Google Gemini 1.5 Flash** | Model mới nhất tối ưu độ trễ thấp |
| **CMS** | Custom Markdown Editor | Tiptap based, hỗ trợ SEO |

## **2.2. Công nghệ Backend**

### **2.2.1. NestJS: Modular Architecture**
Backend không chỉ là API server mà là một hệ thống phân tán logic (Modular Monolith):
*   **Domain-Driven Modules:** Các module được chia theo nghiệp vụ: `BlogModule`, `ContactModule`, `RagModule`, `CalendarModule`.
*   **Custom Decorators:** Tự xây dựng các decorators như `@CurrentUser()` để lấy thông tin user từ JWT, hay `@Roles()` để phân quyền.

### **2.2.2. Database & Advanced Search (RAG)**
Sự kết hợp giữa Relational và Vector Database là điểm nhấn kỹ thuật:
*   **PostgreSQL + pgvector:** Thay vì dùng Vector DB rời rạc (như Pinecone), nhóm tích hợp trực tiếp `pgvector` vào Postgres. Điều này cho phép thực hiện **Hybrid Search** (kết hợp vector similarity và SQL filters) trong một câu lệnh truy vấn duy nhất, giảm độ trễ mạng.
*   **Vector Embeddings:** Sử dụng model `text-embedding-004` của Google (768 dimensions) để mã hóa ngữ cảnh người dùng.

### **2.2.3. Asynchronous Processing**
*   **BullMQ (Redis):** Xử lý các tác vụ nặng:
    *   *Email Queue:* Gửi email xác nhận, nhắc hẹn (có cơ chế retry exponential backoff).
    *   *Sync Worker:* Đồng bộ nền lịch Google (tránh chặn request của user).

## **2.3. Công nghệ Frontend**

### **2.3.1. Next.js 15 & Server Actions**
Tiên phong sử dụng các tính năng mới nhất của Next.js:
*   **Server Component (RSC):** Render 90% giao diện trên server để tối ưu LCP (Largest Contentful Paint).
*   **Server Actions:** Gọi hàm backend trực tiếp từ frontend component, loại bỏ sự cần thiết của các file API route trung gian cho các tác vụ đơn giản.

### **2.3.2. Rich Text & CMS**
*   **Tiptap Editor:** Xây dựng bộ soạn thảo Blog mạnh mẽ, hỗ trợ Markdown shortcuts, image upload và code highlighting.
*   **SEO Optimization:** Tự động tạo `sitemap.xml`, `robots.txt` và thẻ Meta động cho từng bài viết Blog và trang Booking.

## **2.4. Công nghệ AI & LLM Integration**

### **2.4.1. Google Gemini 1.5 Flash**
Lựa chọn model **Gemini 1.5 Flash** thay vì Pro để tối ưu chi phí và độ trễ phản hồi (Latency), yếu tố sống còn của Chatbot.
*   **Function Calling:** AI được cung cấp "bộ công cụ" (Tools) gồm: `createEvent`, `searchEvents`, `checkAvailability`. AI tự động quyết định gọi công cụ nào dựa trên hội thoại.
*   **Structured Output:** Ép kiểu dữ liệu trả về từ AI thành JSON thuần túy để Frontend dễ dàng render thành UI (Action Cards).

### **2.4.2. RAG Pipeline (Quy trình nhớ lại)**
1.  **Ingestion:** Mọi ghi chú, sự kiện mới đều được "vector hóa" và lưu vào DB.
2.  **Retrieval:** Khi user hỏi, hệ thống tìm 5 đoạn thông tin liên quan nhất (Top-K retrieval).
3.  **Synthesis:** Gửi câu hỏi + thông tin tìm được cho Gemini để tổng hợp câu trả lời chính xác.
