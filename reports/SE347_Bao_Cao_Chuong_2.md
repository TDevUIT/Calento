# <a id="chương-2-cơ-sở-lý-thuyết"></a> **Chương 2: Cơ sở lý thuyết**

## <a id="21-tổng-quan-bài-toán-calendar-assistant"></a> **2.1 Tổng quan bài toán Calendar Assistant**

Calendar Assistant là bài toán xây dựng hệ thống hỗ trợ người dùng quản lý lịch (calendar) và sự kiện (events), đồng thời tự động hoá một phần thao tác thông qua các gợi ý và tương tác bằng ngôn ngữ tự nhiên. Với Calento, bài toán được mở rộng thêm các nhu cầu phổ biến:

- Quản lý lịch/sự kiện cá nhân, nhắc lịch và theo dõi thay đổi.
- Đặt lịch hẹn công khai (booking) dựa trên khung giờ rảnh (availability).
- Đồng bộ với hệ sinh thái Google Calendar để thống nhất lịch trình.
- Tích hợp AI Assistant để hiểu yêu cầu, hỗ trợ tìm lịch trống, tạo sự kiện nhanh và truy xuất ngữ cảnh hội thoại.

## <a id="22-typescript"></a> **2.2 TypeScript**

TypeScript là ngôn ngữ lập trình có kiểu tĩnh (static typing) mở rộng từ JavaScript. Trong dự án web theo mô hình client-server, TypeScript giúp:

- Giảm lỗi do sai kiểu dữ liệu ở thời điểm runtime.
- Tăng khả năng bảo trì khi hệ thống có nhiều module và API.
- Dễ tích hợp với hệ sinh thái Node.js và các framework như NestJS/Next.js.

## <a id="23-nodejs"></a> **2.3 Node.js**

Node.js là môi trường chạy JavaScript/TypeScript phía server dựa trên V8. Với các ứng dụng backend xử lý nhiều tác vụ I/O (database, gọi API, gửi email, đồng bộ lịch), Node.js phù hợp nhờ mô hình event-driven và non-blocking I/O.

## <a id="24-nestjs"></a> **2.4 NestJS**

NestJS (phiên bản 11) là framework backend dựa trên Node.js, được thiết kế theo hướng module hoá và hỗ trợ TypeScript tốt. Trong Calento, NestJS giúp tổ chức hệ thống theo các module chức năng (ví dụ xác thực, lịch/sự kiện, booking, tích hợp AI), kết hợp các cơ chế phổ biến như middleware/guards/pipes để:

- Bảo vệ API (authentication/authorization).
- Kiểm tra và chuẩn hoá dữ liệu đầu vào.
- Dễ mở rộng và tách biệt trách nhiệm giữa các phần.

##### Hình 1: NestJS

## <a id="25-postgresql--pgvector"></a> **2.5 PostgreSQL & pgvector**

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) dùng để lưu trữ dữ liệu cốt lõi như người dùng, sự kiện, lịch hẹn, cấu hình availability và các thông tin liên quan. Extension `pgvector` bổ sung khả năng lưu trữ vector embedding và thực hiện truy vấn tương đồng (similarity search), phục vụ các bài toán truy xuất ngữ cảnh cho AI (RAG).

![][image2]

##### Hình 2: PostgreSQL

## <a id="26-redis--bullmq"></a> **2.6 Redis & BullMQ**

Redis là kho dữ liệu in-memory thường dùng cho cache và lưu trạng thái tạm thời. BullMQ là thư viện hàng đợi (queue) chạy trên nền Redis, phù hợp cho các tác vụ nền như gửi email thông báo, xử lý đồng bộ, hoặc các job định kỳ. Việc tách các tác vụ này khỏi luồng request chính giúp hệ thống phản hồi nhanh hơn và ổn định hơn.

![][image3]

![][image4]

##### Hình 3: Redis & BullMQ

## <a id="27-nextjs--react"></a> **2.7 Next.js & React**

**Next.js 15** là framework web dựa trên React, sử dụng App Router và Turbopack để tối ưu hiệu suất phát triển và vận hành. **React 19** mang lại các cải tiến về tính năng xử lý bất đồng bộ và tối ưu UI.

Với Calento, Next.js phù hợp cho các trang:
- Trang public (booking pages) cần SEO tốt và tải nhanh.
- Trang dashboard quản lý lịch/sự kiện với khả năng render linh hoạt (Server Components / Client Components).
- Trải nghiệm chat AI theo thời gian thực.

![][image5]

##### Hình 4: Next.js & React

## <a id="28-tailwind-css--ui-libraries"></a> **2.8 Tailwind CSS & UI Libraries**

**Tailwind CSS v4** là framework utility-first giúp xây dựng giao diện nhanh và nhất quán theo hệ thống design tokens, với hiệu năng build được cải thiện đáng kể.

Dự án sử dụng kết hợp với các thư viện UI headless như **Radix UI** và bộ component **shadcn/ui** để đảm bảo:
- Tính truy cập (accessibility) tốt.
- Dễ dàng tuỳ biến giao diện theo thiết kế riêng.
- Tốc độ phát triển nhanh nhờ các component có sẵn chất lượng cao.

![][image6]

##### Hình 5: Tailwind CSS

## <a id="29-aillm-gemini-langchain--embeddings"></a> **2.9 AI/LLM: Gemini, LangChain & Embeddings**

Hệ thống tích hợp LLM (Google Gemini) để xử lý hội thoại và hiểu ý định người dùng. **LangChain** đóng vai trò lớp tích hợp giúp tổ chức prompt, điều phối luồng hội thoại và kết nối LLM với dữ liệu ứng dụng.

**Embeddings** được dùng để biểu diễn văn bản thành vector (kích thước 768 chiều) nhằm phục vụ tìm kiếm ngữ nghĩa. Các vector này được lưu trong `pgvector` để thực hiện truy vấn tương đồng, làm nền tảng cho cơ chế RAG (Retrieval-Augmented Generation) nhằm:
- Bổ sung ngữ cảnh liên quan vào prompt.
- Giảm thiếu thông tin khi người dùng hỏi ngắn/gãy gọn.
- Tăng độ nhất quán câu trả lời dựa trên dữ liệu có sẵn.

![][image7]

##### Hình 6: Gemini

![][image8]

##### Hình 7: LangChain

## <a id="210-realtimestreaming-sse"></a> **2.10 Realtime/Streaming: SSE**

Server-Sent Events (SSE) là cơ chế streaming một chiều từ server về client qua HTTP. Với tính năng chat AI, SSE phù hợp để đẩy dữ liệu phản hồi theo từng phần (streaming) giúp người dùng nhận kết quả sớm hơn thay vì chờ toàn bộ phản hồi hoàn tất. 

Ở phía client, nội dung có thể được render theo định dạng markdown (ví dụ dùng `react-markdown`) để hiển thị rõ ràng danh sách, bảng, và đoạn mã, mang lại trải nghiệm tương tác mượt mà.
