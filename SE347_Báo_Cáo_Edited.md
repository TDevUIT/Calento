**TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN, ĐHQGHCM**

**KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG**

![][image1]

**BÁO CÁO ĐỒ ÁN MÔN HỌC**

# **ĐỀ TÀI: Xây dựng Calendar Assistant Web**

**Môn học:** Công nghệ Web và ứng dụng \ SE347.Q12

**Giảng viên hướng dẫn:  Đặng Việt Dũng**

**Thực hiện bởi nhóm 2, bao gồm:**

1. Tạ Văn Thái			22523177		Trưởng nhóm
2. Bùi Quốc Lâm		22520733		Thành viên
3. Nguyễn Văn Quyền 		22521223		Thành viên
4. Nguyễn Công Thắng 	22521330		Thành viên

**Thời gian thực hiện:** \<Thời gian bắt đầu\> \ \<Thời gian kết thúc\>

# **MỤC LỤC**

[MỤC LỤC	2](#mụclục)

[DANH SÁCH HÌNH, BẢNG	3](#danhsáchhình,bảng)

[TÓM TẮT	4](#tómtắt)

[Chương I. TỔNG QUAN.	5](#chươngi.tổngquan.)

[1\. Giới thiệu đề tài.	5](#1.giớithiệuđềtài.)

[1.1. Tiểu mục nếu cần thiết.	5](#heading=h.mp948p3xzpi6)

[1.2. Tiểu mục khác.	5](#1.2.lýdochọnđềtài.)

[2\. Cơ sở lý thuyết.	5](#2.cơsởlýthuyết.)

[Chương II. THIẾT KẾ HỆ THỐNG.	6](#chươngii.thiếtkếhệthống.)

[Chương III. TRIỂN KHAI HỆ THỐNG.	7](#chươngiii.triểnkhaihệthống.)

[Chương IV. KẾT LUẬN.	8](#chươngiv.kếtluận.)

[NGUỒN THAM KHẢO	9](#nguồnthamkhảo)

# **DANH SÁCH HÌNH, BẢNG**

[Hình 1\. Kiến trúc của Kubernetes.	6](#heading)
[Hình 2\. Kiến trúc của Docker.	6](#hình2.kiếntrúccủadocker.)

**Lưu ý:** Đối với một đồ án môn học thì việc đính kèm danh sách hình và danh sách bảng trong file báo cáo thường là không bắt buộc. Nếu số lượng hình minh họa, bảng biểu quá nhiều thì việc thêm danh sách khi đó là cần thiết. Khi thêm, cần tạo riêng một trang dành cho danh sách hình và một trang dành cho danh sách bảng.

# **TÓM TẮT**

**Calento** là ứng dụng web quản lý lịch thông minh tích hợp công nghệ Large Language Models (LLMs) \ cụ thể là Google Gemini AI, được phát triển nhằm giải quyết vấn đề quản lý thời gian và tối ưu hóa quy trình lên lịch tự động thông qua xử lý ngôn ngữ tự nhiên (NLP) và function calling.

Tính năng chính:

* **AIPowered Scheduling**: Trợ lý ảo Gemini AI hiểu ngôn ngữ tự nhiê, tự động tạo sự kiện, phân tích lịch trống và đề xuất thời gian họp tối ưu
* **Google Calendar Sync**: Đồng bộ hai chiều realtime qua OAuth 2.0 và webhook
* **Priority Management**: Kanban board draganddrop quản lý tasks, booking links, habits theo mức độ ưu tiên
* **Booking Links**: Tạo liên kết đặt lịch công khai tương tự Calendly
* **Multichannel Notifications**: Thông báo qua email, Slack và webhook

Công nghệ:

* **AI/LLMs**: Google Gemini AI với function calling API
* **Backend**: NestJS \+ TypeScript \+ PostgreSQL \+ Redis/BullMQ
* **Frontend**: Next.js 15 \+ React 18 \+ TanStack Query \+ Tailwind CSS
* **Authentication**: JWT \+ OAuth 2.0

**Kết quả:** Ứng dụng web hoàn chỉnh với hơn 50 API endpoints, giao diện responsive, AI chatbot xử lý tiếng Việt/Anh. Code theo clean architecture với TypeScript strict mode.

# **Chương I. TỔNG QUAN**

## **1\. Giới thiệu đề tài**

### **1.1. Bối cảnh và động lực thực hiện**

Trong bối cảnh xã hội hiện đại, việc quản lý thời gian hiệu quả đã trở thành một kỹ năng thiết yếu đối với mọi người, đặc biệt là sinh viên, nhân viên văn phòng và các chuyên gia. Theo khảo sát của Microsoft (2022), một người dùng trung bình dành khoảng 11 giờ mỗi tuần để quản lý và sắp xếp lịch trình cá nhân. Con số này cho thấy nhu cầu cấp thiết về một giải pháp tối ưu hóa quy trình quản lý thời gian.

Hiện nay, thị trường đã có nhiều ứng dụng quản lý lịch như Google Calendar, Outlook Calendar, Apple Calendar. Tuy nhiên, các ứng dụng này vẫn tồn tại một số hạn chế:

**Về tính tự động hóa:**
 Người dùng phải tự nhập thông tin sự kiện một cách thủ công
 Không có khả năng đề xuất thời gian họp phù hợp tự động
 Thiếu tính năng phân tích và tối ưu hóa lịch trình

**Về trải nghiệm người dùng:**
 Giao diện phức tạp với nhiều bước thao tác
 Không hỗ trợ tương tác bằng ngôn ngữ tự nhiên
 Thiếu tính năng quản lý độ ưu tiên công việc trực quan

**Về tích hợp AI:**
 Chưa tận dụng được công nghệ Large Language Models (LLMs)
 Không có trợ lý ảo hỗ trợ quản lý lịch thông minh
 Thiếu khả năng hiểu ngữ cảnh và đề xuất thông minh

### **1.2. Giới thiệu về Calento**

**Calento** (Calendar Intelligence Assistant) là một ứng dụng web quản lý lịch thông minh được phát triển nhằm giải quyết các vấn đề trên. Ứng dụng tích hợp công nghệ AI tiên tiến (Google Gemini) để mang đến trải nghiệm quản lý thời gian hoàn toàn mới.

**Tên gọi "Calento"** được ghép từ "Calendar" (lịch) và "Intelligence" (thông minh), thể hiện tầm nhìn của nhóm về một hệ thống lịch có khả năng tự động hóa và hỗ trợ người dùng một cách thông minh.

**Các tính năng chính:**

**1. AIPowered Scheduling (Lên lịch thông minh với AI):**
 Trợ lý ảo Gemini AI hiểu và xử lý ngôn ngữ tự nhiên tiếng Việt và tiếng Anh
 Tự động tạo sự kiện chỉ bằng cách gõ chat: "Tạo cuộc họp ngày mai lúc 2 giờ chiều"
 Phân tích lịch trống và đề xuất thời gian họp tối ưu cho nhiều người
 Hỗ trợ function calling để thực hiện các hành động như tìm kiếm, tạo, sửa, xóa sự kiện

**2. Google Calendar Sync (Đồng bộ Google Calendar):**
 Kết nối và đồng bộ hai chiều với Google Calendar
 Sử dụng OAuth 2.0 để đảm bảo bảo mật
 Nhận thông báo realtime khi có thay đổi trên Google Calendar thông qua webhook
 Tự động cập nhật sự kiện giữa hai hệ thống

**3. Priority Management (Quản lý độ ưu tiên):**
 Bảng Kanban trực quan với 4 cấp độ ưu tiên: Critical, High, Medium, Low
 Draganddrop để thay đổi độ ưu tiên dễ dàng
 Quản lý tập trung các loại công việc: Tasks, Booking Links, Habits, Smart Meetings
 Tự động sắp xếp công việc theo mức độ quan trọng

**4. Booking Links (Liên kết đặt lịch):**
 Tạo liên kết công khai để người khác đặt lịch hẹn, tương tự Calendly
 Tự động tìm các khung giờ trống dựa trên lịch hiện tại
 Tùy chỉnh thời lượng cuộc hẹn, khoảng thời gian đệm trước/sau
 Gửi email xác nhận tự động cho cả hai bên

**5. Multichannel Notifications (Thông báo đa kênh):**
 Nhận thông báo qua email
 Tích hợp Slack để nhận thông báo trên workspace
 Hỗ trợ webhook cho các hệ thống bên ngoài

### **1.3. Mối liên hệ với môn học**

Đề tài **"Xây dựng Calendar Assistant Web"** có mối liên hệ chặt chẽ với nội dung môn học **Công nghệ Web và ứng dụng (SE347)** thông qua việc áp dụng các kiến thức đã học:

**Về kiến trúc web:**
 Áp dụng mô hình ClientServer architecture
 Thiết kế RESTful API với 78+ endpoints
 Xây dựng kiến trúc 3layer: Presentation, Business Logic, Data Access

**Về công nghệ Frontend:**
 Sử dụng Next.js 15 framework với App Router
 Triển khai ServerSide Rendering (SSR) và Static Site Generation (SSG)
 Áp dụng componentbased architecture với React 18

**Về công nghệ Backend:**
 Xây dựng API server với NestJS framework
 Thiết kế database với PostgreSQL
 Implement authentication với JWT và OAuth 2.0

**Về tích hợp bên thứ ba:**
 Tích hợp Google Calendar API
 Sử dụng Google Gemini AI API
 Kết nối với SMTP/SendGrid cho email service

**Về realtime communication:**
 Triển khai webhook system để nhận notifications
 Background job processing với BullMQ queue
 WebSocket cho chat realtime (future enhancement)

## **2\. Lý do chọn đề tài**

### **2.1. Tính thực tiễn cao**

Đề tài được lựa chọn dựa trên nhu cầu thực tế về quản lý thời gian trong cuộc sống hàng ngày:

**Nhu cầu thiết yếu:**
 Sinh viên cần quản lý lịch học, deadline bài tập, lịch thi
 Nhân viên văn phòng cần sắp xếp cuộc họp, công việc hàng ngày
 Freelancer cần quản lý lịch hẹn với khách hàng
 Mọi người đều cần tối ưu hóa thời gian trong ngày

**Hạn chế của các giải pháp hiện tại:**

Các ứng dụng quản lý lịch phổ biến như Google Calendar, Outlook Calendar có những hạn chế:
 Không tự động hóa: Phải nhập thủ công mọi thông tin
 Không thông minh: Không đề xuất thời gian phù hợp
 Giao diện phức tạp: Nhiều bước thao tác để tạo một sự kiện
 Thiếu tích hợp AI: Không tận dụng công nghệ AI hiện đại

**Khả năng áp dụng thực tế:**

Sau khi hoàn thành, ứng dụng có thể:
 Sử dụng cho cá nhân để quản lý công việc hàng ngày
 Áp dụng cho nhóm/team để sắp xếp cuộc họp
 Triển khai cho doanh nghiệp nhỏ để quản lý lịch làm việc
 Mở rộng thêm các tính năng phục vụ nhu cầu cụ thể

### **2.2. Phù hợp với nội dung môn học**

Đề tài cho phép nhóm áp dụng đầy đủ kiến thức đã học trong môn **Công nghệ Web và ứng dụng**:

**Áp dụng kiến thức lý thuyết:**
 **Kiến trúc web**: Hiểu và triển khai mô hình ClientServer, RESTful API
 **Frontend development**: Áp dụng React, Next.js framework, component lifecycle
 **Backend development**: Xây dựng API với NestJS, xử lý business logic
 **Database**: Thiết kế schema, query optimization, indexing
 **Authentication**: JWT tokens, OAuth 2.0, session management
 **API Design**: RESTful principles, versioning, documentation

**Sử dụng công nghệ hiện đại:**

Dự án sử dụng các framework và thư viện được giảng dạy trong môn học:
 **Frontend**: Next.js 15, React 18, TanStack Query (state management)
 **Backend**: NestJS (Node.js framework), TypeScript
 **Database**: PostgreSQL (SQL database), Redis (caching)
 **Styling**: Tailwind CSS (utilityfirst CSS framework)

**Thực hành design patterns:**

Áp dụng các design patterns quan trọng trong web development:
 **Repository Pattern**: Tách biệt data access logic
 **Service Layer Pattern**: Tổ chức business logic
 **DTO Pattern**: Data transfer objects cho API
 **Dependency Injection**: Quản lý dependencies trong NestJS
 **Observer Pattern**: Webhook notifications, event handling

### **2.3. Cơ hội học hỏi công nghệ mới**

Đề tài tạo cơ hội tìm hiểu các công nghệ tiên tiến ngoài nội dung cơ bản của môn học:

**Công nghệ AI và Machine Learning:**
 **Google Gemini AI**: Tích hợp Large Language Model (LLM)
 **Function Calling**: Cho phép AI thực hiện các hành động cụ thể
 **Prompt Engineering**: Thiết kế prompts để AI hiểu chính xác yêu cầu
 **Natural Language Processing**: Xử lý ngôn ngữ tự nhiên tiếng Việt/Anh

**Tích hợp dịch vụ bên thứ ba:**
 **Google Calendar API**: OAuth 2.0, Calendar Events management
 **Email Services**: SMTP, SendGrid API integration
 **Slack Integration**: Webhook notifications (future)

**Hệ thống realtime:**
 **Webhook System**: Nhận thông báo realtime từ Google Calendar
 **Background Jobs**: Queue system với BullMQ và Redis
 **Eventdriven Architecture**: Xử lý sự kiện bất đồng bộ

**DevOps và Deployment:**
 **Docker**: Containerization cho development và production
 **CI/CD**: GitHub Actions để tự động test và deploy
 **Monitoring**: Logging, error tracking, performance monitoring

### **2.4. Phát triển kỹ năng làm việc nhóm**

Dự án yêu cầu phân công công việc rõ ràng và phối hợp chặt chẽ:

**Phân công theo vai trò:**
 **Team Lead**: Quản lý tiến độ, phân công công việc
 **Backend Developer**: Phát triển API, database, business logic
 **Frontend Developer**: Xây dựng giao diện người dùng
 **Integration Developer**: Tích hợp các dịch vụ bên thứ ba

**Kỹ năng cần thiết:**
 **Version Control**: Sử dụng Git, GitHub cho collaborative development
 **Code Review**: Đánh giá code của nhau, đảm bảo chất lượng
 **Documentation**: Viết tài liệu kỹ thuật, hướng dẫn sử dụng
 **Testing**: Unit test, integration test, endtoend test

## **3\. Mục tiêu và phạm vi đề tài**

### **3.1. Mục tiêu**

Dự án **Calento** hướng đến các mục tiêu cụ thể sau:

**Mục tiêu chính:**

1. **Xây dựng ứng dụng web hoàn chỉnh với AI assistant**
    Phát triển ứng dụng quản lý lịch đầy đủ chức năng
    Tích hợp AI chatbot hỗ trợ tương tác bằng ngôn ngữ tự nhiên
    Đảm bảo giao diện thân thiện, responsive trên mọi thiết bị

2. **Áp dụng kiến thức môn học vào thực tế**
    Triển khai kiến trúc ClientServer đầy đủ
    Xây dựng RESTful API theo chuẩn
    Implement authentication và authorization
    Thiết kế database tối ưu
    Quản lý state và data flow hiệu quả

3. **Tìm hiểu và áp dụng các công nghệ mới**
    Tích hợp AI API (Google Gemini) với function calling
    Triển khai webhook system để nhận realtime notifications
    Sử dụng queue system (BullMQ) cho background jobs
    Áp dụng các best practices trong web development

4. **Đảm bảo chất lượng code**
    Tuân thủ clean architecture principles
    Sử dụng TypeScript strict mode cho type safety
    Viết unit tests và integration tests
    Code review và maintain coding standards
    Tài liệu hóa code và API

**Mục tiêu phụ:**

 Học cách làm việc nhóm với Git/GitHub
 Hiểu quy trình phát triển phần mềm từ đầu đến cuối
 Tạo portfolio project để phục vụ học tập và tìm việc
 Có thể mở rộng ứng dụng sau môn học

### **3.2. Phạm vi thực hiện**

Để đảm bảo hoàn thành đúng tiến độ môn học, nhóm xác định rõ phạm vi thực hiện như sau:

**Các tính năng ĐƯỢC triển khai:**

**1. Quản lý sự kiện (Event Management):**
 Tạo, sửa, xóa sự kiện (CRUD operations)
 Sự kiện định kỳ (recurring events) với RRULE standard
 Tìm kiếm và lọc sự kiện theo nhiều tiêu chí
 Quản lý attendees (người tham dự)
 Cấu hình reminders (nhắc nhở)
 Thêm địa điểm và mô tả chi tiết

**2. AI Chatbot:**
 Giao diện chat tương tác
 Xử lý ngôn ngữ tự nhiên (tiếng Việt và tiếng Anh)
 Function calling để thực hiện actions (tạo/sửa/xóa sự kiện)
 Kiểm tra thời gian trống (availability checking)
 Đề xuất thời gian họp tối ưu
 Lưu lịch sử hội thoại

**3. Google Calendar Integration:**
 Kết nối với Google Calendar qua OAuth 2.0
 Đồng bộ hai chiều (sync) sự kiện
 Webhook notifications khi có thay đổi
 Tự động refresh access tokens

**4. Priority Management:**
 Bảng Kanban với draganddrop
 4 cấp độ ưu tiên: Critical, High, Medium, Low
 Quản lý tasks, booking links, habits
 Lưu trữ vị trí items trong database

**5. Booking Links (Scheduling Links):**
 Tạo liên kết đặt lịch công khai
 Tùy chỉnh thời lượng cuộc hẹn
 Tự động tìm khung giờ trống
 Guest booking form
 Email confirmation tự động

**6. Authentication & Authorization:**
 Đăng ký/Đăng nhập với email và password
 Google OAuth 2.0 login
 JWT tokenbased authentication
 Cookiebased session management
 Password reset functionality

**7. Email Notifications:**
 Email xác nhận booking
 Email nhắc nhở sự kiện
 Welcome email cho user mới
 Template system với Handlebars

**8. Background Job Processing:**
 Queue system với BullMQ và Redis
 Email sending jobs
 Calendar sync jobs
 Autoretry với exponential backoff

**Các tính năng KHÔNG triển khai (ngoài phạm vi):**

**Mobile Application:**
 Chỉ phát triển web application
 Responsive design cho mobile browser
 Không phát triển native iOS/Android app

**Video Conferencing Integration:**
 Không tích hợp Zoom, Microsoft Teams
 Chỉ hỗ trợ Google Meet links (có sẵn từ Google Calendar)

**Payment Processing:**
 Không có tính năng thanh toán
 Ứng dụng hoàn toàn miễn phí

**Advanced Team Features:**
 Không có shared calendars cho teams
 Không có roundrobin scheduling
 Không có meeting polls

**Advanced Analytics:**
 Không có dashboard phân tích chi tiết
 Chỉ có thống kê cơ bản về events và bookings

### **3.3. Giới hạn và ràng buộc**

**Giới hạn về thời gian:**
 Thời gian thực hiện: 12 tuần (theo kế hoạch môn học)
 Phải hoàn thành các tính năng core trước deadline
 Ưu tiên tính năng thiết yếu trước các tính năng bổ sung

**Giới hạn về nguồn lực:**
 Nhóm 4 thành viên sinh viên
 Không có kinh phí để sử dụng dịch vụ trả phí
 Sử dụng free tier của các services (Google AI, email)

**Giới hạn về công nghệ:**
 Chỉ sử dụng công nghệ web (không mobile native)
 Database: PostgreSQL (open source)
 Hosting: Free tier hoặc student account

**Ràng buộc về bảo mật:**
 Tuân thủ OAuth 2.0 standards
 Mã hóa passwords với bcrypt
 HTTPS required cho production
 Không lưu trữ thông tin nhạy cảm dạng plain text

## **4\. Cơ sở lý thuyết và công nghệ sử dụng**

Phần này giới thiệu các công nghệ và khái niệm chính được sử dụng trong dự án, giúp hiểu rõ hơn về cách thức hoạt động của hệ thống.

### **4.1. Công nghệ Backend (Phía máy chủ)**

#### **4.1.1. NestJS Framework**

**NestJS là gì?**

NestJS là một framework (khung phát triển) để xây dựng các ứng dụng web phía server bằng Node.js. Framework này sử dụng TypeScript (ngôn ngữ lập trình mở rộng của JavaScript) và được thiết kế theo kiến trúc modular (chia thành các module nhỏ).

**Tại sao chọn NestJS?**

 **Dễ tổ chức code**: Chia ứng dụng thành các module nhỏ (auth, events, users...), mỗi module quản lý một chức năng riêng
 **TypeScript**: Kiểm tra lỗi ngay khi viết code, giảm bugs
 **Tích hợp sẵn**: Có sẵn các tính năng như xác thực, validation dữ liệu, logging
 **Dễ học**: Cú pháp giống Angular, nhiều tài liệu học tập

**Ví dụ cấu trúc module:**

**Cách hoạt động:**
1. Client gửi HTTP request đến server
2. Controller nhận request và chuyển cho Service
3. Service xử lý logic và gọi Repository
4. Repository tương tác với database
5. Kết quả trả về client theo chiều ngược lại

#### **4.1.2. PostgreSQL Database**

**PostgreSQL là gì?**

PostgreSQL (thường gọi là Postgres) là một hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) miễn phí và mã nguồn mở. Dữ liệu được lưu trữ dưới dạng bảng (table) với các hàng (rows) và cột (columns).

**Tại sao chọn PostgreSQL?**

 **Miễn phí**: Open source, không mất phí
 **Đáng tin cậy**: Đảm bảo dữ liệu không bị mất hoặc sai lệch
 **Linh hoạt**: Hỗ trợ cả dữ liệu có cấu trúc (SQL) và không cấu trúc (JSONB)
 **Phổ biến**: Nhiều tài liệu, cộng đồng hỗ trợ lớn

**Ví dụ trong dự án:**

Bảng `events` lưu thông tin sự kiện:
 `id`: Mã định danh duy nhất
 `title`: Tiêu đề sự kiện (VD: "Họp team")
 `start_time`: Thời gian bắt đầu
 `end_time`: Thời gian kết thúc
 `user_id`: Người tạo sự kiện

**ACID  Đảm bảo tính toàn vẹn:**
 **A**tomicity: Một thao tác hoặc thành công hoàn toàn, hoặc thất bại hoàn toàn
 **C**onsistency: Dữ liệu luôn ở trạng thái hợp lệ
 **I**solation: Các thao tác không ảnh hưởng lẫn nhau
 **D**urability: Dữ liệu được lưu vĩnh viễn sau khi commit

#### **4.1.3. Redis & BullMQ**

**Redis là gì?**

Redis là một cơ sở dữ liệu lưu trữ dữ liệu trong bộ nhớ RAM (inmemory), giúp truy xuất dữ liệu cực kỳ nhanh. Thường được dùng để cache (lưu tạm) dữ liệu thường xuyên truy cập.

**BullMQ là gì?**

BullMQ là thư viện giúp quản lý hàng đợi công việc (job queue), cho phép xử lý các tác vụ nền (background tasks) mà không làm chậm ứng dụng chính.

**Ứng dụng trong Calento:**

**1. Caching (Lưu tạm):**
 Lưu danh sách sự kiện của user để load nhanh hơn
 Cache thông tin user đã đăng nhập
 Giảm số lần truy vấn database

**2. Queue System (Hệ thống hàng đợi):**
 **Email jobs**: Gửi email xác nhận booking không làm user phải chờ
 **Sync jobs**: Đồng bộ với Google Calendar chạy nền
 **Webhook jobs**: Xử lý notifications từ Google

**Ví dụ cụ thể:**

Khi user book một cuộc hẹn:
1. Server tạo booking ngay lập tức → User thấy kết quả
2. Server thêm job "gửi email" vào queue
3. Worker (bộ xử lý) lấy job từ queue và gửi email
4. Nếu gửi thất bại, tự động thử lại sau 2 phút

### **4.2. Công nghệ Frontend (Phía người dùng)**

#### **4.2.1. Next.js 15 Framework**

**Next.js là gì?**

Next.js là một framework xây dựng trên React, giúp tạo các ứng dụng web hiện đại với nhiều tính năng tối ưu sẵn có. React là thư viện JavaScript phổ biến nhất để xây dựng giao diện người dùng.

**Tại sao chọn Next.js?**

 **SEO tốt**: Render HTML trên server, Google dễ dàng index
 **Performance cao**: Load trang nhanh nhờ optimization tự động
 **Developer Experience**: Dễ phát triển với hot reload, TypeScript support
 **Fullstack**: Có thể viết cả frontend và backend trong một project

**Các tính năng chính:**

**1. App Router (Định tuyến dựa trên file):**

Cấu trúc thư mục tự động tạo routes:

**2. ServerSide Rendering (SSR):**

 Render HTML trên server trước khi gửi cho client
 Trang load nhanh hơn, SEO tốt hơn
 Ví dụ: Trang public booking cần SEO để Google index

**3. Server Components:**

 Component render trên server, giảm code JavaScript gửi đến browser
 Trang load nhanh hơn, đặc biệt trên mobile

**4. Image Optimization:**

 Tự động tối ưu hóa hình ảnh (resize, format)
 Lazy loading (chỉ load ảnh khi cần)
 Hỗ trợ responsive images

#### **4.2.2. React 18**

**React là gì?**

React là thư viện JavaScript để xây dựng giao diện người dùng bằng cách chia nhỏ thành các components (thành phần) có thể tái sử dụng.

**Componentbased Architecture:**

Ví dụ cấu trúc component trong Calento:

**Lợi ích:**
 **Tái sử dụng**: Viết một lần, dùng nhiều nơi
 **Dễ bảo trì**: Mỗi component quản lý logic riêng
 **Hiệu suất**: React chỉ update phần UI thay đổi

#### **4.2.3. TanStack Query (React Query)**

**TanStack Query là gì?**

TanStack Query là thư viện giúp quản lý data từ API một cách thông minh, tự động cache và đồng bộ dữ liệu.

**Giải quyết vấn đề gì?**

Thông thường khi fetch API, phải quản lý:
 Loading state (đang tải)
 Error state (lỗi)
 Cache data (lưu tạm)
 Refetch khi data cũ
→ TanStack Query làm tất cả tự động!

**Ví dụ cụ thể:**


**Lợi ích:**
 **Giảm request**: Không gọi API trùng lặp
 **UX tốt**: Load nhanh từ cache
 **Automatic sync**: Data luôn được cập nhật
 **Optimistic updates**: UI update ngay, không chờ API

#### **4.2.4. Zustand State Management**

**Zustand là gì?**

Zustand là thư viện quản lý state (trạng thái) toàn cục của ứng dụng, đơn giản hơn nhiều so với Redux.

**State là gì?**

State là dữ liệu của ứng dụng tại một thời điểm. Ví dụ:
 User đã đăng nhập chưa?
 Calendar đang hiển thị view nào (day/week/month)?
 Theme là dark mode hay light mode?

**Tại sao cần State Management?**

Một số state cần truy cập từ nhiều component khác nhau:
 User info → Navbar (hiển thị avatar) + Sidebar (hiển thị tên)
 Calendar view → Header (hiển thị tháng/năm) + Main calendar

**Ví dụ trong Calento:**


**Lợi ích:**
 **Đơn giản**: Ít code hơn Redux rất nhiều
 **TypeScript**: Typesafe, dễ refactor
 **Persistence**: Lưu vào localStorage tự động
 **DevTools**: Debug dễ dàng

### **4.3. AI và Large Language Models**

#### **4.3.1. Google Gemini AI**

**Large Language Model (LLM) là gì?**

LLM là mô hình AI được huấn luyện trên lượng dữ liệu khổng lồ, có khả năng hiểu và tạo ra ngôn ngữ tự nhiên như con người. Ví dụ phổ biến: ChatGPT, Google Gemini, Claude.

**Google Gemini AI:**

Gemini là LLM của Google, được tích hợp vào Calento để tạo ra trợ lý ảo thông minh.

**Tại sao chọn Gemini?**

 **Miễn phí**: Google cung cấp free tier cho developers
 **Đa ngôn ngữ**: Hỗ trợ tốt cả tiếng Việt và tiếng Anh
 **Function Calling**: Tính năng quan trọng cho chatbot
 **Fast response**: Phản hồi nhanh, UX tốt

**Function Calling  Tính năng chính:**

Function Calling cho phép AI không chỉ trả lời text, mà còn **thực hiện hành động** trong ứng dụng.

**Ví dụ cụ thể:**

**Kịch bản 1: Tạo sự kiện**

**Kịch bản 2: Kiểm tra lịch trống**

**Danh sách Functions có sẵn:**

1. `createEvent`: Tạo sự kiện mới
2. `searchEvents`: Tìm kiếm sự kiện
3. `checkAvailability`: Kiểm tra thời gian trống
4. `updateEvent`: Cập nhật sự kiện
5. `deleteEvent`: Xóa sự kiện
6. `createTask`: Tạo task
7. `createLearningPlan`: Tạo kế hoạch học

#### **4.3.2. Prompt Engineering**

**Prompt Engineering là gì?**

Prompt Engineering là kỹ thuật thiết kế "câu lệnh" (prompts) cho AI để nhận được kết quả chính xác nhất.

**System Prompt trong Calento:**

System Prompt là "hướng dẫn" ban đầu cho AI về vai trò và cách hoạt động.

**Ví dụ System Prompt:**


**Context Management (Quản lý ngữ cảnh):**

Context là thông tin AI cần để trả lời chính xác:

**1. Calendar Context:**
 Ngày giờ hiện tại: `20241109 18:30`
 Timezone: `Asia/Ho_Chi_Minh`
 Sự kiện sắp tới: Danh sách 5 events sắp diễn ra
 User preferences: Giờ làm việc, ngôn ngữ ưa thích

**2. Conversation History:**
 Lưu 10 messages gần nhất
 AI nhớ ngữ cảnh cuộc hội thoại

**Ví dụ:**

### **4.4. Authentication & Authorization (Xác thực và phân quyền)**

#### **4.4.1. JWT (JSON Web Tokens)**

**JWT là gì?**

JWT (phát âm là "jot") là một chuẩn để tạo ra "token" (mã thông báo) dùng để xác thực người dùng. Token này chứa thông tin về user và được mã hóa an toàn.

**Tại sao cần JWT?**

Khi user đăng nhập, server cần cách để "nhớ" user đã đăng nhập. Có 2 cách phổ biến:
1. **Sessionbased**: Lưu thông tin trên server → Tốn bộ nhớ khi nhiều user
2. **Tokenbased (JWT)**: Lưu token ở client → Server không cần lưu gì

**Cấu trúc JWT:**

JWT gồm 3 phần, phân cách bởi dấu chấm:

**1. Header** (Phần đầu):

**2. Payload** (Dữ liệu):

**3. Signature** (Chữ ký):
 Mã hóa Header + Payload + Secret Key
 Dùng để verify token không bị giả mạo

**Quy trình xác thực:**

**Đăng nhập:**

**Gọi API:**

**Token Types trong Calento:**

**1. Access Token:**
 Thời gian sống: 1 giờ
 Dùng để gọi API
 Hết hạn nhanh → Bảo mật cao

**2. Refresh Token:**
 Thời gian sống: 7 ngày
 Dùng để lấy Access Token mới
 Lưu trong HTTPonly cookie → An toàn hơn

#### **4.4.2. OAuth 2.0 Protocol**

**OAuth 2.0 là gì?**

OAuth 2.0 là một chuẩn cho phép ứng dụng truy cập dữ liệu của user trên dịch vụ khác (Google, Facebook...) mà KHÔNG CẦN password.

**Tại sao cần OAuth?**

Thay vì:
 User nhập password Google vào app của bạn (nguy hiểm!)

OAuth cho phép:
 User đăng nhập trên trang Google
 Google xác nhận và cấp quyền cho app
 App nhận "access token" để truy cập data

**Google OAuth Flow (Luồng xác thực):**

**Bước 1: User click "Login with Google"**

**Bước 2: User đăng nhập và cho phép**
 User thấy trang: "Calento muốn truy cập email và calendar của bạn"
 User click "Cho phép"

**Bước 3: Google redirect về app với code**

**Bước 4: App đổi code lấy tokens**

**Bước 5: Sử dụng access_token**

**Lợi ích của OAuth 2.0:**

 **Bảo mật**: Không lưu password của user
 **Phân quyền**: User chỉ cấp quyền cần thiết (email, calendar)
 **Thu hồi**: User có thể thu hồi quyền bất cứ lúc nào
 **Chuẩn hóa**: Dùng cho nhiều dịch vụ (Google, Facebook, GitHub...)

**Trong Calento:**

OAuth được dùng cho 2 mục đích:
1. **Đăng nhập**: Login with Google thay vì tạo account mới
2. **Google Calendar Sync**: Truy cập Google Calendar để đồng bộ sự kiện

### **4.5. RESTful API Design**

#### **4.5.1. REST là gì?**

**REST** (REpresentational State Transfer) là một kiến trúc thiết kế API, trong đó:
 Mỗi **resource** (tài nguyên) có một **URL** riêng
 Dùng **HTTP methods** chuẩn để thao tác
 Server **không lưu trạng thái** của client (stateless)

**Ví dụ dễ hiểu:**

Tưởng tượng API như một thư viện:
 **GET**: Đọc/mượn sách (không thay đổi gì)
 **POST**: Thêm sách mới vào thư viện
 **PUT/PATCH**: Sửa thông tin sách
 **DELETE**: Xóa sách khỏi thư viện

#### **4.5.2. HTTP Methods trong Calento**

**1. GET  Lấy dữ liệu:**

**2. POST  Tạo mới:**

**3. PATCH  Cập nhật một phần:**

**4. PUT  Thay thế toàn bộ:**

**5. DELETE  Xóa:**

#### **4.5.3. URL Structure (Cấu trúc URL)**

**Chuẩn REST:**

**Ví dụ trong Calento:**

#### **4.5.4. Response Format (Định dạng trả về)**

| Trường | Kiểu dữ liệu | Mô tả |
| : | : | : |
| `success` | boolean | Trạng thái phản hồi (true/false) |
| `data` | object | Dữ liệu chính trả về từ API |
| `meta` | object | Thông tin bổ sung (timestamp, pagination) |

**Error Response:**
| Trường | Kiểu dữ liệu | Mô tả |
| : | : | : |
| `success` | boolean | Trạng thái thất bại (false) |
| `error.code` | string | Mã lỗi định danh (ví dụ: VALIDATION_ERROR) |
| `error.message` | string | Thông báo lỗi chi tiết cho người dùng |
| `error.details` | array | Danh sách chi tiết các lỗi (nếu có) |
| `meta.timestamp` | string | Thời điểm xảy ra lỗi |

**Paginated Response:**
| Trường | Kiểu dữ liệu | Mô tả |
| : | : | : |
| `success` | boolean | Trạng thái thành công (true) |
| `data` | array | Danh sách các đối tượng dữ liệu |
| `meta.page` | number | Số thứ tự trang hiện tại |
| `meta.limit` | number | Số lượng mục trên mỗi trang |
| `meta.total` | number | Tổng số lượng mục trong cơ sở dữ liệu |
| `meta.totalPages` | number | Tổng số trang |}
GET /api/events
Summary: Get list of events
Parameters:
   page (query, number): Page number
   limit (query, number): Items per page
   start_date (query, string): Start date filter
Responses:
  200: Success
    Schema: PaginatedEventsResponse
  401: Unauthorized
  500: Server Error
Controller → Service → Repository → Database
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Next.js App]
        C[React Components]
    end
  
    subgraph "API Gateway Layer"
        D[NestJS Server]
        E[Authentication Guard]
        F[Validation Pipeline]
        G[Rate Limiter]
    end
  
    subgraph "Service Layer"
        H[Auth Service]
        I[Event Service]
        J[Booking Service]
        K[AI Service]
        L[Google Service]
        M[Email Service]
    end
  
    subgraph "Data Layer"
        N[(PostgreSQL)]
        O[(Redis)]
    end
  
    subgraph "External Services"
        P[Google Calendar API]
        Q[Gemini AI API]
        R[SMTP/SendGrid]
    end
  
    subgraph "Background Jobs"
        S[BullMQ Queue]
        T[Email Worker]
        U[Sync Worker]
        V[Webhook Worker]
    end
  
    A > B
    B > C
    C > D
  
    D > E
    D > F
    D > G
  
    E > H
    E > I
    E > J
    E > K
    E > L
    E > M
  
    H > N
    I > N
    J > N
    K > Q
    L > P
    M > R
  
    H > O
    I > O
  
    S > T
    S > U
    S > V
  
    T > M
    U > I
    V > L
  
    O > S
  
    style D fill:#4285f4,color:#fff
    style N fill:#336791,color:#fff
    style O fill:#dc382d,color:#fff
    style P fill:#4285f4,color:#fff
    style Q fill:#8e44ad,color:#fff
User click button → React Component xử lý event
                  → Gọi API service
                  → Nhận response
                  → Update UI
1. Client gửi: POST /api/events + JWT token
2. Authentication Guard: Kiểm tra token ✓ Valid
3. Validation Pipeline: Kiểm tra data ✓ Valid
4. Rate Limiter: Kiểm tra rate ✓ OK (50/100 requests)
5. → Forward request đến Service Layer
User load calendar tháng 11:
1. Check Redis cache → Cache hit! (đã lưu từ lần trước)
2. Return data từ Redis → Nhanh (5ms)
3. Không cần query PostgreSQL

User tạo event mới:
1. Insert vào PostgreSQL → Dữ liệu lưu vĩnh viễn
2. Invalidate Redis cache cho tháng 11
3. Lần load tiếp theo sẽ query PostgreSQL và cache lại
User book một cuộc hẹn:
1. API tạo booking ngay → Return 201 Created (nhanh, ~100ms)
2. Thêm job "gửi email" vào queue → Async
3. Email Worker xử lý job sau 12 giây
4. Guest nhận email confirmation
flowchart LR
    subgraph "User Interface"
        A[👤 User Action]
        B[React Component]
        K[🎨 Rerender UI]
    end

    subgraph "State Management"
        C["Custom Hook<br>useEvents, useCreateEvent"]
        D["TanStack Query<br>Query/Mutation"]
    end

    subgraph "API Layer"
        E["Service Layer<br>eventService.createEvent"]
        F[Axios HTTP Client]
    end

    subgraph "Backend"
        G["Backend API<br>POST /api/events"]
        H[NestJS Controller]
        I[Service Layer]
    end

    subgraph "Database"
        J[("PostgreSQL<br>Database")]
    end

    A >|Click/Submit| B
    B >|Call Hook| C
    C >|Trigger| D
    D >|Execute| E
    E >|HTTP Request| F
    F >|POST/PUT/DELETE| G
    G > H
    H > I
    I >|Query| J
    J >|Response| I
    I >|JSON| H
    H >|API Response| G
    G >|200 OK| F
    F >|Success| E
    E >|Update| D
    D >|Invalidate Cache| D
    D >|Trigger Refetch| E
    E >|New Data| C
    C >|Update State| B
    B >|React Render| K

    style A fill:#60a5fa,color:#fff
    style K fill:#34d399,color:#fff
    style D fill:#8b5cf6,color:#fff
    style G fill:#f59e0b,color:#fff
    style J fill:#ec4899,color:#fff
User fills form:
 Title: "Họp team"
 Start: "20241110 14:00"
 End: "20241110 15:00"

User clicks "Save" button
→ React Component bắt sự kiện onClick
→ Component gọi function handleSubmit()
// Component gọi custom hook
const { mutate: createEvent } = useCreateEvent();

createEvent({
  title: "Họp team",
  start_time: "20241110T14:00:00",
  end_time: "20241110T15:00:00"
});
// eventService.ts
export const eventService = {
  createEvent: async (data) => {
    return apiClient.post('/events', data);
  }
};
POST http://localhost:8000/api/events
Headers:
  Authorization: Bearer eyJhbGc...
  ContentType: application/json
Body:
  {
    "title": "Họp team",
    "start_time": "20241110T14:00:00",
    "end_time": "20241110T15:00:00"
  }
@Post('/events')
@UseGuards(JwtAuthGuard)  // Kiểm tra authentication
async create(@CurrentUser() user, @Body() dto: CreateEventDto) {
  return this.eventService.create(user.id, dto);
}
async create(userId: string, dto: CreateEventDto) {
  // 1. Validate thời gian
  if (dto.end_time <= dto.start_time) {
    throw new BadRequestException('End time must be after start time');
  }
  
  // 2. Get primary calendar
  const calendar = await this.calendarService.getPrimary(userId);
  
  // 3. Create event
  const event = await this.eventRepository.create({
    ...dto,
    user_id: userId,
    calendar_id: calendar.id
  });
  
  // 4. Sync with Google if connected
  if (calendar.is_synced) {
    await this.googleService.createEvent(userId, event);
  }
  
  return event;
}
INSERT INTO events (
  id, user_id, calendar_id, title, 
  start_time, end_time, created_at, updated_at
) VALUES (
  gen_random_uuid(), 
  '123e4567...', 
  '987fcdeb...', 
  'Họp team',
  '20241110 14:00:00',
  '20241110 15:00:00',
  NOW(),
  NOW()
) RETURNING *;
{
  "success": true,
  "data": {
    "id": "abcdef123",
    "title": "Họp team",
    "start_time": "20241110T14:00:00Z",
    "end_time": "20241110T15:00:00Z",
    "created_at": "20241109T18:30:00Z"
  }
}
// TanStack Query tự động:
1. Invalidate cache cho queries liên quan:
    queryKey: ['events', { month: 11, year: 2024 }]
    queryKey: ['events', 'upcoming']

2. Trigger refetch để lấy data mới

3. Update cache với data mới
React Component rerender với:
 isLoading = false
 data = new event
 Calendar view tự động hiện event mới
 Toast notification: "Event created successfully!"
Lần đầu load calendar tháng 11:
→ Gọi API GET /events?month=11&year=2024
→ Cache với key: ['events', {month: 11, year: 2024}]
→ Thời gian cache: 5 phút

Lần sau load tháng 11:
→ Load từ cache (không gọi API)
→ Nhanh chóng, tiết kiệm bandwidth
const { mutate } = useCreateEvent({
  onMutate: async (newEvent) => {
    // 1. Cancel outgoing refetches
    await queryClient.cancelQueries(['events']);
    
    // 2. Snapshot current cache
    const previousEvents = queryClient.getQueryData(['events']);
    
    // 3. Optimistically update cache
    queryClient.setQueryData(['events'], (old) => [...old, newEvent]);
    
    // 4. Return rollback function
    return { previousEvents };
  },
  
  onError: (err, newEvent, context) => {
    // Rollback nếu API thất bại
    queryClient.setQueryData(['events'], context.previousEvents);
  }
});
const { mutate, error, isError } = useCreateEvent();

if (isError) {
  toast.error(error.message); // Hiện notification lỗi
}
try {
  await this.eventService.create(userId, dto);
} catch (error) {
  if (error instanceof ValidationError) {
    throw new BadRequestException(error.message);
  }
  throw new InternalServerErrorException('Failed to create event');
}
const { isLoading, isFetching } = useEvents();

if (isLoading) return <Spinner />;
if (isFetching) return <RefetchIndicator />;
// Sau khi create event thành công
queryClient.invalidateQueries(['events']); // Tất cả event queries
queryClient.invalidateQueries(['events', { month: 11 }]); // Chỉ tháng 11
graph TB
    A[🏠 Root /] > B[Login Page]
    A > C[Register Page]
    A > Dashboard[Dashboard /dashboard]

    Dashboard > Calendar[📅 Calendar /calendar]
    Dashboard > Tasks[Tasks /tasks]
    Dashboard > Priorities[📊 Priorities /schedule]
    Dashboard > SchedulingLinks[🔗 Scheduling Links /schedulinglinks]
    Dashboard > Chat[💬 AI Chat /chat]
    Dashboard > Settings[⚙️ Settings /settings]

    Calendar > DayView[Day View]
    Calendar > WeekView[Week View]
    Calendar > MonthView[Month View]
    Calendar > YearView[Year View]
    Calendar > EventDetail[Event Detail Modal]
    Calendar > EventForm[Event Form Modal]

    Tasks > AllTasks[All Tasks]
    Tasks > Today[Today]
    Tasks > Upcoming[Upcoming]
    Tasks > Completed[Completed]

    Priorities > Critical[Critical Priority]
    Priorities > High[High Priority]
    Priorities > Medium[Medium Priority]
    Priorities > Low[Low Priority]
    Priorities > Disabled[Disabled Items]

    SchedulingLinks > MyLinks[My Links]
    SchedulingLinks > CreateLink[Create Link Modal]
    SchedulingLinks > EditLink[Edit Link Modal]
    SchedulingLinks > LinkAnalytics[Link Analytics]

    Chat > NewChat[New Conversation]
    Chat > History[Conversation History]
    Chat > AI_FnCalls[AI Function Calls]

    Settings > Profile[Profile Settings]
    Settings > CalSettings[Calendar Settings]
    Settings > Notify[Notification Settings]
    Settings > GoogleSync[Google Calendar Sync]
    Settings > Security[Security Settings]

    PublicRoutes[Public Routes] > BookingPage["📆 Booking Page<br>/book/:username/:slug"]
    BookingPage > DateSelection[Date Selection]
    BookingPage > TimeSlotSelection[Time Slot Selection]
    BookingPage > GuestInfo[Guest Information Form]
    BookingPage > Confirm[Confirmation Page]

    style A fill:#60a5fa,color:#fff
    style Dashboard fill:#8b5cf6,color:#fff
    style Calendar fill:#10b981,color:#fff
    style Chat fill:#f59e0b,color:#fff
    style BookingPage fill:#ec4899,color:#fff

graph TB
    A[App Layout] > B[Header/Navbar]
    A > C[Sidebar Navigation]
    A > D[Main Content Area]
    A > E[Footer]

    B > B1[User Menu]
    B > B2[Search Bar]
    B > B3[Notifications]
    B > B4[AI Chat Toggle]

    C > C1[Calendar Icon]
    C > C2[Tasks Icon]
    C > C3[Priorities Icon]
    C > C4[Scheduling Links Icon]
    C > C5[Settings Icon]

    D > D1[Page Component]
    D1 > D2[Calendar View]
    D1 > D3[Task List]
    D1 > D4[Priority Board]
    D1 > D5[Scheduling Links Grid]

    D2 > D21[FullCalendar Component]
    D2 > D22[Event Cards]
    D2 > D23[Mini Calendar]
    D2 > D24[Event Modals]

    D3 > D31[Task Item]
    D3 > D32[Task Form]
    D3 > D33[Task Filters]

    D4 > D41[Priority Column]
    D4 > D42[Draggable Items]
    D4 > D43[Category Filters]

    style A fill:#60a5fa,color:#fff
    style D fill:#8b5cf6,color:#fff
    style D2 fill:#10b981,color:#fff
flowchart TD
    A[👤 User Login] > B{Authenticated?}
    B >|No| C[Login Page]
    C > D[Enter Credentials]
    D > E[Submit Form]
    E > F{Valid?}
    F >|No| C
    F >|Yes| G[Dashboard]

    B >|Yes| G

    G > H[Navigate to Calendar]
    H > I[📅 Calendar View]

    I > J{Create Event Method?}
    J >|Manual| K[Click Date/Time]
    J >|AI Chat| L[Open AI Chatbot]
    J >|Quick Add| M[Click + Button]

    K > N[Event Form Modal Opens]
    M > N

    N > O["Fill Event Details<br>Title, Time, Description"]
    O > P[Add Attendees Optional]
    P > Q[Set Reminders Optional]
    Q > R[Choose Recurrence Optional]
    R > S[Select Calendar]
    S > T[Click Save Button]

    T > U{Validation?}
    U >|Failed| V[Show Error Message]
    V > O
    U >|Success| W[POST /api/events]
    W > X[Backend Creates Event]
    X > Y[Sync to Google Calendar]
    Y > Z[Update Cache]
    Z > AA[Rerender Calendar]
    AA > AB[Show Success Toast]

    L > L1["Type Natural Language<br>Create meeting tomorrow 3pm"]
    L1 > L2[AI Processes Request]
    L2 > L3[AI Calls createEvent Function]
    L3 > W

    AB > AC[Event Visible on Calendar]

    style A fill:#60a5fa,color:#fff
    style G fill:#8b5cf6,color:#fff
    style I fill:#10b981,color:#fff
    style L fill:#f59e0b,color:#fff
    style AB fill:#34d399,color:#fff
flowchart TD
    A[📧 Guest Receives Link] > B["Click Booking Link<br>/book/username/slug"]
    B > C[Public Booking Page Loads]
    C > D[View Host Information]
    D > E[Select Date from Calendar]

    E > F[View Available Time Slots]
    F > G{Slot Available?}
    G >|No Slots| H[Choose Different Date]
    H > E
    G >|Has Slots| I[Click Time Slot]

    I > J[Time Slot Highlights]
    J > K["Fill Guest Information<br>Name, Email, Phone"]
    K > L[Add Notes Optional]
    L > M[Review Booking Summary]
    M > N[Click Confirm Booking]

    N > O{Validation?}
    O >|Failed| P[Show Error]
    P > K
    O >|Success| Q[POST /api/book/:slug]

    Q > R[Backend Creates Booking]
    R > S[Create Calendar Event]
    S > T["Send Confirmation Emails<br>Host + Guest"]
    T > U[Generate ICS File]
    U > V[Confirmation Page]

    V > W[Guest Receives Email]
    W > X[Add to Calendar Button]
    W > Y[Reschedule Link]
    W > Z[Cancel Link]

    style A fill:#60a5fa,color:#fff
    style C fill:#8b5cf6,color:#fff
    style V fill:#34d399,color:#fff
    style W fill:#10b981,color:#fff
flowchart TD
    A[💬 User Opens AI Chat] > B[Chat Interface Opens]
    B > C[Load Conversation History]
    C > D[Display Welcome Message]

    D > E["User Types Message<br>Show my calendar today"]
    E > F[Click Send Button]
    F > G[POST /api/ai/chat]

    G > H[Backend Receives Message]
    H > I["Build Calendar Context<br>Current date, upcoming events"]
    I > J["Send to Gemini AI<br>Message + Context + Functions"]

    J > K{AI Decision}
    K >|Function Call| L[AI Calls searchEvents]
    K >|Text Response| M[AI Generates Text]

    L > N[Backend Executes Function]
    N > O[Fetch Events from DB]
    O > P[Return Results to AI]
    P > Q[AI Formats Response]

    M > Q

    Q > R[Send Response to Frontend]
    R > S[Display AI Message]
    S > T{Contains Actions?}

    T >|Yes| U["Render Action Cards<br>Event List, Time Slots"]
    T >|No| V[Render Text Message]

    U > W["Show Interactive Buttons<br>Book, View Details"]
    V > X[Show Markdown Content]

    W > Y{User Clicks Action?}
    Y >|Yes| Z["Execute Action<br>Navigate, Create Event"]
    Y >|No| AA[Continue Conversation]

    X > AA
    Z > AA
    AA > E

    style A fill:#60a5fa,color:#fff
    style J fill:#8b5cf6,color:#fff
    style L fill:#f59e0b,color:#fff
    style S fill:#10b981,color:#fff
    style U fill:#34d399,color:#fff
client/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── (dashboard)/       # Protected pages
│   └── api/               # API routes
├── components/            # React components
│   ├── calendar/         # Calendar UI
│   ├── chat/             # AI chatbot
│   └── ui/               # Reusable UI
├── hook/                 # Custom React hooks
├── service/              # API services
├── store/                # Zustand stores
└── utils/                # Helper functions
sequenceDiagram
    participant C as Client
    participant API as NestJS API
    participant Auth as AuthService
    participant Pass as PasswordService
    participant DB as PostgreSQL
    participant JWT as JwtService
  
    C>>API: POST /auth/login {email, password}
    API>>Auth: login(loginDto)
    Auth>>DB: SELECT * FROM users WHERE email=?
    DB>>Auth: User data
  
    alt User not found
        Auth>>API: 401 Unauthorized
        API>>C: Error: Invalid credentials
    end
  
    Auth>>Pass: comparePassword(plainText, hash)
    Pass>>Auth: isValid
  
    alt Password invalid
        Auth>>API: 401 Unauthorized
        API>>C: Error: Invalid credentials
    end
  
    Auth>>DB: UPDATE users SET last_login_at=NOW()
    Auth>>JWT: generateTokens(user)
    JWT>>Auth: {accessToken, refreshToken}
  
    Auth>>API: {tokens, user}
    API>>API: setAuthCookies(response, tokens)
    API>>C: 200 OK + Cookies + User data
sequenceDiagram
    participant C as Client
    participant API as NestJS API
    participant Guard as JwtAuthGuard
    participant Event as EventService
    participant Cal as CalendarService
    participant DB as PostgreSQL
    participant Google as Google Calendar API
  
    C>>API: POST /events + JWT Token
    API>>Guard: validateToken()
    Guard>>API: User authenticated
  
    API>>Event: createEvent(userId, dto)
    Event>>Cal: getPrimaryCalendar(userId)
    Cal>>DB: SELECT * FROM calendars WHERE user_id=? AND is_primary=true
    DB>>Cal: Calendar
    Cal>>Event: Calendar data
  
    Event>>Event: validateTimeRange(start, end)
    Event>>DB: INSERT INTO events (...)
    DB>>Event: New event
  
    alt Google Calendar Connected
        Event>>Google: createEvent(event)
        Google>>Event: google_event_id
        Event>>DB: UPDATE events SET google_event_id=?
    end
  
    Event>>API: Event created
    API>>C: 201 Created + Event data
sequenceDiagram
    participant C as Client
    participant API as NestJS API
    participant AI as AIConversationService
    participant Gemini as GeminiService
    participant Func as FunctionCallingService
    participant Event as EventService
    participant DB as PostgreSQL
  
    C>>API: POST /ai/chat {message}
    API>>AI: chat(userId, message)
  
    AI>>DB: Load/Create conversation
    AI>>AI: buildCalendarContext(userId)
    AI>>DB: Save user message
  
    AI>>Gemini: chat(message, history, context)
    Gemini>>Gemini: processWithAI()
  
    alt AI calls function
        Gemini>>AI: functionCall: createEvent
        AI>>Func: executeFunctionCall(userId, functionCall)
        Func>>Event: createEvent(userId, args)
        Event>>DB: INSERT INTO events
        DB>>Event: Event created
        Event>>Func: Success
        Func>>AI: Function result
        AI>>DB: Save action (completed)
    end
  
    Gemini>>AI: AI response text
    AI>>DB: Save assistant message
    AI>>API: {response, actions}
    API>>C: 200 OK + Response
sequenceDiagram
    participant C as Client
    participant API as NestJS API
    participant Google as GoogleService
    participant GoogleAPI as Google Calendar API
    participant Event as EventService
    participant DB as PostgreSQL
    participant Queue as BullMQ
  
    C>>API: POST /google/sync
    API>>Google: syncCalendar(userId)
  
    Google>>DB: Get user credentials
    DB>>Google: OAuth tokens
  
    Google>>GoogleAPI: listEvents(timeMin, timeMax)
    GoogleAPI>>Google: Google events[]
  
    loop For each Google event
        Google>>Event: syncEvent(userId, googleEvent)
        Event>>DB: SELECT * FROM events WHERE google_event_id=?
  
        alt Event exists
            Event>>DB: UPDATE events SET ...
        else Event not exists
            Event>>DB: INSERT INTO events
        end
    end
  
    Google>>Queue: Queue webhook setup
    Queue>>GoogleAPI: watch(calendarId)
    GoogleAPI>>Queue: {channelId, expiration}
    Queue>>DB: INSERT INTO webhook_channels
  
    Google>>API: Sync completed
    API>>C: 200 OK + Sync result
sequenceDiagram
    participant G as Guest
    participant API as Public API
    participant Booking as BookingService
    participant Avail as AvailabilityService
    participant Event as EventService
    participant Email as EmailService
    participant DB as PostgreSQL
  
    G>>API: GET /book/:username/:slug
    API>>Booking: getBookingLinkBySlug(username, slug)
    Booking>>DB: SELECT * FROM booking_links WHERE slug=?
    DB>>Booking: Booking link
    Booking>>API: Link details
    API>>G: Booking page data
  
    G>>API: GET /book/:username/:slug/slots?date=...
    API>>Avail: getAvailableSlots(linkId, date)
    Avail>>DB: Get existing bookings
    Avail>>DB: Get user's events
    Avail>>Avail: calculateFreeSlots()
    Avail>>API: Available slots[]
    API>>G: Show available times
  
    G>>API: POST /book/:username/:slug {slot, guestInfo}
    API>>Booking: createBooking(linkId, data)
  
    Booking>>DB: INSERT INTO bookings
    Booking>>Event: createEvent(userId, eventDto)
    Event>>DB: INSERT INTO events
  
    Booking>>Email: sendConfirmation(guest, booking)
    Email>>Email: Generate ICS file
    Email>>Email: Send email
  
    Booking>>API: Booking created
    API>>G: 201 Created + Confirmation
sequenceDiagram
    participant Dev as Developer
    participant CLI as Migration CLI
    participant Service as MigrationService
    participant DB as PostgreSQL
    participant Files as Migration Files
  
    Note over Dev,Files: CREATE NEW MIGRATION
  
    Dev>>CLI: npm run migration:create users_table
    CLI>>Service: createMigration(name)
    Service>>Service: Generate timestamp
    Service>>Files: Create SQL file with template
    Files>>Dev: 20240101_001_users_table.sql
  
    Dev>>Files: Write SQL DDL statements
    Note over Files: CREATE TABLE users (...)<br>CREATE INDEX idx_users_email ...
  
    Note over Dev,Files: RUN MIGRATIONS
  
    Dev>>CLI: npm run migration:run
    CLI>>Service: runMigrations()
  
    Service>>DB: CREATE TABLE IF NOT EXISTS migrations
    Note over DB: id, name, executed_at
  
    Service>>DB: SELECT * FROM migrations
    DB>>Service: Executed migrations list
  
    Service>>Files: Read all migration files
    Files>>Service: Migration files array
  
    Service>>Service: Filter pending migrations
  
    loop For each pending migration
        Service>>DB: BEGIN TRANSACTION
  
        Service>>Files: Read SQL file content
        Files>>Service: SQL statements
  
        Service>>DB: Execute SQL statements
  
        alt SQL execution success
            Service>>DB: INSERT INTO migrations (name, executed_at)
            Service>>DB: COMMIT
            Service>>CLI: ✓ Migration applied: filename
        else SQL execution failed
            Service>>DB: ROLLBACK
            Service>>CLI: ✗ Migration failed: error
            Service>>Service: Stop execution
        end
    end
  
    Service>>CLI: All migrations completed
    CLI>>Dev: Migration summary
  
    Note over Dev,Files: ROLLBACK MIGRATION
  
    Dev>>CLI: npm run migration:rollback
    CLI>>Service: rollbackLastMigration()
  
    Service>>DB: SELECT * FROM migrations ORDER BY executed_at DESC LIMIT 1
    DB>>Service: Last migration
  
    Service>>Files: Find rollback SQL file
    Files>>Service: Rollback SQL statements
  
    Service>>DB: BEGIN TRANSACTION
    Service>>DB: Execute rollback SQL
    Service>>DB: DELETE FROM migrations WHERE name=?
    Service>>DB: COMMIT
  
    Service>>CLI: Rollback completed
    CLI>>Dev: Migration rolled back
 20240101_001_create_users_table.sql
 UP Migration
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

 Autoupdate timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
 20240101_001_create_users_table_rollback.sql
 DOWN Migration
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_email;
DROP TABLE IF EXISTS users CASCADE;
// Raw SQL  No ORM
export class MigrationService {
  async runMigrations(): Promise<void> {
    // 1. Ensure migrations table exists
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Get executed migrations
    const { rows: executed } = await this.db.query(
      'SELECT name FROM migrations ORDER BY executed_at'
    );
    const executedSet = new Set(executed.map(r => r.name));

    // 3. Get all migration files
    const files = await fs.readdir('./migrations');
    const pending = files
      .filter(f => f.endsWith('.sql') && !f.includes('rollback'))
      .filter(f => !executedSet.has(f))
      .sort();

    // 4. Execute each pending migration
    for (const file of pending) {
      const sql = await fs.readFile(`./migrations/${file}`, 'utf8');
  
      try {
        await this.db.query('BEGIN');
  
        // Execute migration SQL
        await this.db.query(sql);
  
        // Record migration
        await this.db.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
  
        await this.db.query('COMMIT');
        console.log(`✓ Applied: ${file}`);
      } catch (error) {
        await this.db.query('ROLLBACK');
        console.error(`✗ Failed: ${file}`, error);
        throw error;
      }
    }
  }
}
users (1) < (nhiều) calendars
users (1) < (nhiều) events
users (1) < (nhiều) booking_links
calendars (1) < (nhiều) events
booking_links (1) < (nhiều) bookings
events (1) < (1) bookings
User "John Doe" (id: abc123)
  ├── Calendar "Work" (id: cal001)
  │   ├── Event "Team Meeting" (id: evt001)
  │   └── Event "Project Review" (id: evt002)
  ├── Calendar "Personal" (id: cal002)
  │   └── Event "Doctor Appointment" (id: evt003)
  └── Booking Link "30min Call" (id: link001)
      ├── Booking từ "Alice" (id: book001)
      └── Booking từ "Bob" (id: book002)
[
  {
    "email": "alice@example.com",
    "name": "Alice Smith",
    "response_status": "accepted",
    "optional": false
  },
  {
    "email": "bob@example.com",
    "name": "Bob Johnson",
    "response_status": "pending",
    "optional": true
  }
]
{
  "type": "google_meet",
  "url": "https://meet.google.com/abcdefghij",
  "conference_id": "abcdefghij"
}
[
  {
    "method": "email",
    "minutes_before": 60
  },
  {
    "method": "notification",
    "minutes_before": 15
  }
]
FREQ=WEEKLY;BYDAY=MO,WE,FR;UNTIL=20241231T235959Z

Giải thích:
 FREQ=WEEKLY: Lặp lại hàng tuần
 BYDAY=MO,WE,FR: Vào thứ 2, 4, 6
 UNTIL=...: Cho đến hết 31/12/2024
mindmap
  root((App Layout))
    Navbar Global
    Sidebar Dashboard only
    Page Content
      Calendar View
        CalendarHeader
        DatePicker
        EventList Grid
      AI Chatbot
        ChatMessages
        InputBox
        ActionResults
      Booking Links
        LinkList
        LinkEditor
flowchart TD
    UserAction[User Action] > ReactComponent[React Component]
    ReactComponent > CustomHook[Custom Hook\nuseEvents, useCreateEvent]
    CustomHook > TanStackQuery[TanStack Query\nQuery/Mutation]
    TanStackQuery > ServiceLayer[Service Layer\neventService.createEvent]
    ServiceLayer > Axios[Axios HTTP Client]
    Axios > BackendAPI[Backend API]
    BackendAPI > Database[Database]
    Database > Response[Response]
    Response > UpdateCache[Update Cache]
    UpdateCache > ReRenderUI[Rerender UI]
blockbeta
  columns 2
  Navbar(("Navbar (Fixed)")):2
  Sidebar(("Sidebar\n(Fixed)")) MainContent(("Main Content\n(Scrollable)"))
node version    # v18.17.0
npm version     # 9.8.1
psql version    # 14.x
rediscli version  # 6.x
docker version  # 20.x
git version     # 2.x
Ctrl+Shift+X (Windows) hoặc Cmd+Shift+X (Mac)
→ Search extension name → Click Install
flowchart TB
    subgraph "Cloudflare"
        A[DNS Management]
        B[SSL/TLS Certificates]
        C[CDN & Caching]
        D[DDoS Protection]
        E[Web Application Firewall]
    end

    subgraph "Digital Ocean Droplet"
        F[Ubuntu 22.04 LTS]
        G[Docker Engine]
        H[Nginx Reverse Proxy]
        I[Docker Compose Stack]
    end

    subgraph "Docker Services"
        J["Frontend Container<br>Next.js:3000"]
        K["Backend Container<br>NestJS:8000"]
        L[PostgreSQL:5432]
        M[Redis:6379]
    end

    N[Users] > A
    A > B
    B > C
    C > D
    D > E
    E >|HTTPS:443| H
  
    H >|Proxy Pass| J
    H >|Proxy Pass /api| K
  
    J > K
    K > L
    K > M
  
    G > I
    I > J
    I > K
    I > L
    I > M

    style A fill:#f6821f,color:#fff
    style B fill:#f6821f,color:#fff
    style F fill:#0080ff,color:#fff
    style H fill:#009639,color:#fff
    style J fill:#000,color:#fff
    style K fill:#e0234e,color:#fff
# SSH vào Droplet
ssh calento@<droplet_ip>

# Clone project
cd ~
git clone https://github.com/TDevUIT/Calento.git
cd Calento
# Backend .env
cd server
cp .env.example .env.production
nano .env.production
Error: "redirect_uri_mismatch"
→ Redirect URI trong code khác với setting trên Google Console
→ Mất 2 ngày để debug vì không để ý URL có trailing slash
User: "Tạo họp ngày mai"
AI gọi: searchEvents({ query: "họp ngày mai" }) ← SAI
Expected: createEvent({ title: "họp", start_time: "20241110..." }) ← ĐÚNG
Event: "Họp team mỗi thứ 2, 4, 6 đến cuối năm"
RRULE: FREQ=WEEKLY;BYDAY=MO,WE,FR;UNTIL=20241231T235959Z
→ Generate 150+ occurrences
→ Calendar render chậm vì quá nhiều events
User creates event "Họp team" 
→ API returns success
→ Calendar vẫn không hiển thị event mới
→ User confused: "Event đã được tạo chưa?"
Month view với 200 events:
→ Render time: 3 seconds (user sees white screen)
→ User complains: "App rất chậm"
Query events for year 2024: 500ms
→ Có thể optimize xuống 50ms với better indexing
Event changes on Google Calendar:
→ Calento update sau 30 giây (polling)
→ Có thể instant với WebSocket
User deletes important event:
→ Không có audit log để track who/when
→ Cannot investigate security breach
1000 concurrent users:
→ Single server có thể overload
→ Database connections limit reached
→ App becomes slow/unresponsive
Unit test pass ✓
Integration test pass ✓
→ Nhưng real user flow bị broken
→ Cần Playwright E2E tests
User đang đi đường → Nhận reminder "Họp 15 phút nữa"
→ Tap notification → Mở app → Join Google Meet
→ All in mobile, no desktop needed
Team lead muốn schedule họp với 5 người:
→ Calento analyze calendars của 5 người
→ Suggest 3 time slots tất cả đều rảnh
→ Send poll để team vote
→ Auto create event khi majority vote
After meeting "Product Planning Q4":
→ AI extracts: "Design mockups  John  Due Nov 15"
→ Auto create task for John
→ Add to his task list
Kiến thức từ môn học → Áp dụng thực tế:
 HTTP Methods (GET/POST/PUT/DELETE) → RESTful API với 78 endpoints
 Database Normalization → 15 normalized tables với foreign keys
 Session Management → JWT tokens với refresh mechanism
 Responsive Design → Mobilefirst approach với TailwindCSS
 Lines of Code: 35,000+ (15K backend + 20K frontend)
 API Endpoints: 78 endpoints
 Database Tables: 15 tables
 React Components: 150+ components
 Test Coverage: 40% backend, 20% frontend
 Production Uptime: 99.5%+
