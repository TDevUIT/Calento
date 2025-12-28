# **CHƯƠNG 2: CÔNG NGHỆ SỬ DỤNG**

## **2.1. Kiến trúc tổng quan (Tech Stack)**

Hệ thống Calento được xây dựng trên nền tảng công nghệ hiện đại, đảm bảo hiệu năng cao, khả năng mở rộng tốt và trải nghiệm người dùng mượt mà.

| Thành phần | Công nghệ chính |
| :--- | :--- |
| **Frontend** | Next.js 15, React 18, Tailwind CSS, TanStack Query |
| **Backend** | NestJS, TypeScript, Node.js |
| **Database** | PostgreSQL (với pgvector extension), Redis |
| **AI & ML** | Google Gemini Pro, LangChain, Gecko Embeddings |
| **Infrastructure** | Docker, BullMQ, Google Cloud Platform |

## **2.2. Công nghệ Backend**

### **2.2.1. NestJS Framework**
NestJS là framework Node.js được chọn làm nền tảng cho Backend vì kiến trúc module hóa rõ ràng, hỗ trợ TypeScript toàn diện và tuân thủ các nguyên tắc SOLID.
*   **Module System:** Giúp tổ chức code thành các khối độc lập (AuthModule, UserModule, AIModule, VectorModule...), dễ bảo trì và mở rộng.
*   **Dependency Injection:** Quản lý sự phụ thuộc giữa các thành phần hiệu quả.
*   **Decorators:** Đơn giản hóa việc khai báo route, middleware và validation.

### **2.2.2. PostgreSQL & pgvector**
Hệ thống sử dụng PostgreSQL làm cơ sở dữ liệu chính (Relational Database) kết hợp với extension `pgvector` để hỗ trợ lưu trữ và tìm kiếm vector.
*   **Relational Data:** Lưu trữ thông tin structured như User, Event, Calendar, Booking.
*   **Vector Data:** Lưu trữ embeddings của ngữ cảnh người dùng và lịch sử hội thoại trong bảng `user_context_summary` với kích thước 768 chiều (tương thích với model embedding mới của Google).
*   **Hybrid Search:** Kết hợp tìm kiếm từ khóa (Full-text search) và tìm kiếm ngữ nghĩa (Vector similarity search) để tăng độ chính xác.

### **2.2.3. Redis & BullMQ**
*   **Redis:** Sử dụng làm bộ nhớ đệm (Caching) để tăng tốc độ truy xuất dữ liệu thường dùng và lưu trữ session/temp data.
*   **BullMQ:** Thư viện quản lý hàng đợi (Message Queue) dựa trên Redis, dùng để xử lý các tác vụ nền (background jobs) như gửi email, đồng bộ lịch Google, xử lý embeddings mà không làm chặn luồng chính của ứng dụng.

## **2.3. Công nghệ Frontend**

### **2.3.1. Next.js 15 & React 18**
Sử dụng Next.js phiên bản mới nhất với App Router để tận dụng các tính năng:
*   **Server Components (RSC):** Render giao diện trên server, giảm dung lượng JavaScript gửi xuống client.
*   **Server Actions:** Xử lý logic form và mutation trực tiếp trên server mà không cần tạo API route riêng biệt.
*   **Streaming & Suspense:** Hiển thị từng phần của trang web ngay khi sẵn sàng, đặc biệt hữu ích cho tính năng AI Chat streaming.

### **2.3.2. Tailwind CSS & UI Libraries**
*   **Tailwind CSS:** Framework CSS utility-first giúp xây dựng giao diện nhanh chóng, dễ tùy biến và tối ưu dung lượng.
*   **Radix UI / Shadcn UI:** Bộ component headless đảm bảo tính truy cập (accessibility) và dễ dàng tùy chỉnh style.

### **2.3.3. AI Chat Integration**
*   **React Markdown:** Hỗ trợ render nội dung phản hồi từ AI (Markdown) thành HTML đẹp mắt.
*   **Event Source API:** Sử dụng Server-Sent Events (SSE) để nhận phản hồi từ AI theo thời gian thực (streaming response), mang lại cảm giác hội thoại tự nhiên.

## **2.4. Công nghệ AI & LLM**

### **2.4.1. Google Gemini Pro**
Calento tích hợp mô hình ngôn ngữ lớn (LLM) Gemini Pro của Google để xử lý logic hội thoại và function calling.
*   **Natural Language Processing:** Hiểu ý định người dùng từ câu chat tự nhiên (VD: "Đặt lịch họp team vào sáng thứ 2").
*   **Function Calling:** AI tự động xác định và gọi các hàm nghiệp vụ (createEvent, findSlot, summary) dựa trên yêu cầu.

### **2.4.2. LangChain & Embeddings**
*   **LangChain:** Framework giúp kết nối LLM với dữ liệu của ứng dụng và quản lý luồng hội thoại.
*   **Embeddings (text-embedding-004):** Chuyển đổi văn bản (ghi chú, ngữ cảnh) thành các vector 768 chiều để lưu trữ và tìm kiếm tương đồng, phục vụ cho tính năng RAG (nhớ lại thông tin cũ).
