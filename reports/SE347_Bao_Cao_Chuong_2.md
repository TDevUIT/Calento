# **Chương II. CÔNG NGHỆ SỬ DỤNG** {#chương-ii.-công-nghệ-sử-dụng}

## **2.1. Kiến trúc tổng quan (Tech Stack)**

Hệ thống Calento được xây dựng trên nền tảng công nghệ hiện đại, tuân theo mô hình Micro-modular Monolith. Kiến trúc này cho phép chia tách rõ ràng giữa các tầng nghiệp vụ (Domain Layer) và tầng ứng dụng (Application Layer), giúp giữ được sự thống nhất trong triển khai (Monolithic Deployment) nhưng vẫn đảm bảo tính linh hoạt và dễ bảo trì của Microservices.

| Thành phần | Công nghệ chính |
| ----- | ----- |
| Frontend | Next.js 15, React 19, Tailwind CSS, TanStack Query, Zustand |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL (với pgvector extension), Redis |
| AI & ML | Google, Gemini, LangChain, Embeddings |
| Infrastructure | Docker, BullMQ, Google Cloud Platform |

## **2.2. Công nghệ Backend**

### **2.2.1. NestJS Framework**

NestJS là framework Node.js được chọn làm nền tảng cho Backend vì kiến trúc module hóa rõ ràng, hỗ trợ TypeScript toàn diện và tuân thủ các nguyên tắc SOLID.

NestJS là framework Node.js được chọn làm nền tảng cho Backend. Trong dự án Calento, NestJS đóng vai trò là xương sống xử lý toàn bộ logic nghiệp vụ và API. Hệ thống tận dụng triệt để kiến trúc Modular của NestJS để phân tách các tính năng thành các module chuyên biệt: `AuthModule` xử lý xác thực JWT, `EventModule` quản lý lịch và sự kiện, `AIModule` điều phối tương tác với Gemini. Các Decorators và Guards được sử dụng rộng rãi để bảo vệ endpoints và validate dữ liệu đầu vào, đảm bảo tính an toàn và chặt chẽ của hệ thống.


  ##### Hình 1: NestJS  {#hình-1:-nestjs}

### **2.2.2. PostgreSQL & pgvector**

Hệ thống sử dụng PostgreSQL làm cơ sở dữ liệu chính (Relational Database) kết hợp với extension pgvector để hỗ trợ lưu trữ và tìm kiếm vector.

PostgreSQL là trái tim lưu trữ dữ liệu của Calento. Ngoài việc lưu trữ các bảng quan hệ (relational tables) như `users` (người dùng), `events` (sự kiện), `bookings` (lịch hẹn), hệ thống còn khai thác sức mạnh của extension `pgvector` để phục vụ tính năng AI RAG. Cụ thể, bảng `user_context_summary` lưu trữ các vector embeddings 768 chiều đại diện cho ngữ cảnh lịch sử của người dùng, cho phép thực hiện các truy vấn tìm kiếm ngữ nghĩa (semantic search) nhanh chóng và chính xác.

  ![][image2]

  ##### Hình 2: PostgreSQl {#hình-2:-postgresql}

### **2.2.3. Redis & BullMQ**

Redis và BullMQ đóng vai trò quan trọng trong việc xử lý các tác vụ nền (background processing) và tối ưu hiệu năng. Redis được dùng để cache các truy vấn thường xuyên như thông tin User Profile, giúp giảm tải cho Database. BullMQ, chạy trên nền Redis, quản lý các hàng đợi công việc (queues) quan trọng: `mail-queue` để gửi email thông báo bất đồng bộ, và `sync-calendar-queue` để thực hiện đồng bộ lịch Google định kỳ 5 phút/lần cho từng user mà không làm chậm trải nghiệm sử dụng trực tiếp.

  ![][image3]

  ![][image4]

  ##### Hình 3: Redis & BullMQ {#hình-3:-redis-&-bullmq}

## **2.3. Công nghệ Frontend**

### **2.3.1. Next.js 15 & React 19**

Sử dụng Next.js phiên bản mới nhất với App Router để tận dụng các tính năng:

Về phía Client, Next.js 15 với App Router mang lại khả năng render linh hoạt. Calento sử dụng React Server Components (RSC) để fetch dữ liệu lịch ngay từ server, giảm thiểu layout shift và tăng tốc độ tải trang ban đầu (FCP). Server Actions được ứng dụng để xử lý các form submission như tạo sự kiện (`createEvent`) hay cập nhật profile, loại bỏ sự cần thiết của các API routes trung gian thủ công và giữ type-safety xuyên suốt từ server xuống client.

  ![][image5]

  ##### Hình 4: Next.js & React  {#hình-4:-next.js-&-react}

### **2.3.2. Tailwind CSS & UI Libraries**

Giao diện được xây dựng bằng Tailwind CSS, framework utility-first giúp phát triển nhanh chóng, dễ tùy biến và tối ưu dung lượng. Để đảm bảo tính truy cập (accessibility) và khả năng tùy chỉnh cao, hệ thống tích hợp bộ component headless Radix UI / Shadcn UI.

  ![][image6]

  ##### Hình 5:Tailwind CSS {#hình-5:tailwind-css}

### **2.3.3. AI Chat Integration**

Trong phần tích hợp AI Chat, hệ thống phân tách rõ ràng giữa việc truyền tải dữ liệu và hiển thị. Server-Sent Events (SSE) được sử dụng để stream từng token phản hồi từ AI về client theo thời gian thực, giúp giảm độ trễ nhận thức (perceived latency). Tại phía client, thư viện `react-markdown` đảm nhận việc render luồng text markdown này thành HTML đẹp mắt với các styles dduocj tùy chỉnh, cho phép hiển thị cả danh sách, code blocks, và đặc biệt là các UI components tương tác (như thẻ xác nhận lịch) ngay trong khung chat.

## **2.4. Công nghệ AI & LLM**

### **2.4.1. Gemini** 

Calento tích hợp mô hình ngôn ngữ lớn (LLM) Gemini Pro của Google để xử lý logic hội thoại và function calling.

Calento tích hợp mô hình ngôn ngữ lớn (LLM) Gemini Pro của Google để xử lý logic hội thoại. Hệ thống có khả năng xử lý ngôn ngữ tự nhiên (NLP) để hiểu ý định người dùng từ các câu chat thông thường, ví dụ như "Đặt lịch họp team vào sáng thứ 2". Đồng thời, tính năng Function Calling cho phép AI tự động xác định và gọi các hàm nghiệp vụ như `createEvent` hay `findSlot` dựa trên yêu cầu cụ thể.

  ![][image7]

  ##### Hình 6:Gemini {#hình-6:gemini}

### **2.4.2. LangChain & Embeddings**

LangChain hoạt động như một framework kết nối LLM với dữ liệu ứng dụng và quản lý luồng hội thoại. Hệ thống sử dụng model `text-embedding-004` để chuyển đổi văn bản (ghi chú, ngữ cảnh) thành các vector 768 chiều. Các vector này được lưu trữ và sử dụng cho việc tìm kiếm tương đồng, nền tảng cốt lõi của tính năng RAG giúp AI nhớ lại thông tin cũ.

  ![][image8]

  ##### Hình 7: LangChain {#hình-7:-langchain}

### **2.4.3. Kiến trúc RAG (Retrieval-Augmented Generation)**

Hệ thống triển khai kỹ thuật **Advanced RAG** để tối ưu hóa khả năng truy xuất thông tin của AI, bao gồm 3 bước xử lý chuyên sâu:

1.  **Query Expansion (Mở rộng truy vấn)**: Câu hỏi thô của người dùng thường ngắn gọn hoặc thiếu ngữ cảnh (ví dụ: "lịch họp mai"). Hệ thống sử dụng LLM để viết lại câu hỏi này (ví dụ: "danh sách sự kiện ngày 20/01/2026"), bổ sung các từ khóa liên quan để tăng độ chính xác khi tìm kiếm.
2.  **Hybrid Search (Tìm kiếm lai)**: Kết hợp sức mạnh của **Vector Search** (`pgvector`) để tìm kiếm theo ngữ nghĩa và **Full-Text Search** để tìm kiếm từ khóa chính xác. Kết quả tìm kiếm được tính điểm tổng hợp theo công thức trọng số: `Score = 0.7 * VectorScore + 0.3 * TextScore`, đảm bảo cân bằng giữa hiểu ngữ cảnh và khớp từ khóa.
3.  **Reranking (Sắp xếp lại)**: Danh sách các ngữ cảnh tiềm năng sau khi được truy xuất sẽ được đưa qua một mô hình AI nhẹ để chấm điểm mức độ liên quan (Relevance Scoring) một lần nữa. Chỉ Top 3 ngữ cảnh có điểm cao nhất mới được chọn để đưa vào prompt context gửi cho Chatbot, giúp giảm nhiễu (hallucination) và tăng độ chính xác của câu trả lời.

