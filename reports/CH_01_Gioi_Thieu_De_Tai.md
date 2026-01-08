# **CHƯƠNG 1: GIỚI THIỆU ĐỀ TÀI**

## **1.1. Lý do chọn đề tài**

Trong bối cảnh xã hội hiện đại, việc quản lý thời gian hiệu quả đã trở thành một kỹ năng thiết yếu. Theo khảo sát của Microsoft (2022), một người dùng trung bình dành khoảng 11 giờ mỗi tuần để quản lý và sắp xếp lịch trình cá nhân. Tuy nhiên, các giải pháp hiện tại vẫn còn rời rạc: người dùng phải dùng một ứng dụng để xem lịch, một ứng dụng khác để ghi chú, và một nơi khác để tạo content hoặc kết nối với khách hàng.

Hiện nay, thị trường đã có nhiều ứng dụng quản lý lịch như Google Calendar, Calendly. Tuy nhiên, chúng vẫn tồn tại hạn chế:

| Khía cạnh | Hạn chế thực tế |
| :--- | :--- |
| **Tính tự động hóa** | Người dùng phải tự nhập thông tin thủ công, thiếu khả năng "hiểu" ngôn ngữ tự nhiên để tạo lịch nhanh. |
| **Khả năng tích hợp** | Thiếu sự kết nối giữa Lịch cá nhân và các hoạt động Content/Marketing (Blog, Contact) cho Freelancer/KOLs. |
| **Trí tuệ nhân tạo** | Chưa tận dụng được sức mạnh của **RAG (Retrieval-Augmented Generation)** để nhớ lại ngữ cảnh và hỗ trợ ra quyết định thông minh. |

Xuất phát từ thực tế đó, nhóm phát triển **Calento** (Calendar Intelligence Assistant) - một nền tảng "All-in-one" không chỉ giúp quản lý lịch thông minh mà còn hỗ trợ xây dựng thương hiệu cá nhân qua Blog và kết nối khách hàng, tất cả được vận hành bởi trợ lý ảo AI.

## **1.2. Mục tiêu**

### **1.2.1. Mục tiêu chung**
Xây dựng một hệ sinh thái quản lý cá nhân toàn diện: từ quản lý thời gian (Calendar), kết nối khách hàng (Booking/Contact) đến chia sẻ kiến thức (Blog), được tối ưu hóa bởi AI.

### **1.2.2. Mục tiêu cụ thể**
1.  **Về nghiệp vụ:**
    *   **Zero-friction Scheduling:** Tự động hóa việc đặt lịch hẹn qua Booking Links và AI Chat.
    *   **Content Management:** Tích hợp CMS (Content Management System) để viết và xuất bản Blog.
    *   **Smart Assistant:** Trợ lý ảo có khả năng thực hiện hành động (Function Calling) và ghi nhớ ngữ cảnh (Memory).

2.  **Về kỹ thuật:**
    *   Làm chủ kiến trúc **Micro-modular Monolith** với NestJS.
    *   Triển khai kỹ thuật **Hybrid Search** (Vector + Full-text) với PostgreSQL & pgvector.
    *   Xây dựng UI hiện đại, chuẩn SEO với Next.js 15 và Tailwind CSS.

## **1.3. Phạm vi thực hiện**

### **1.3.1. Các tính năng nổi bật**

1.  **Lịch & Booking Thông minh:**
    *   Lịch cá nhân với đầy đủ chế độ xem (Ngày/Tuần/Tháng).
    *   Booking Links (giống Calendly) với khả năng tùy chỉnh khung giờ linh hoạt.
    *   Đồng bộ 2 chiều Real-time với Google Calendar.

2.  **AI Assistant & RAG (Trọng tâm):**
    *   Chatbot đa năng: Vừa trò chuyện, vừa điều khiển ứng dụng (Tạo lịch, tìm kiếm).
    *   **Contextual Memory:** Ghi nhớ thông tin người dùng (sở thích, lịch sử) nhờ Vector Database.
    *   **Function Calling:** AI tự động gọi API để thực hiện tác vụ thay người dùng.

3.  **Blog & CMS System (Mới):**
    *   Trình soạn thảo bài viết Markdown chuyên nghiệp.
    *   Quản lý danh mục, thẻ (Tags), và trạng thái xuất bản.
    *   Tối ưu SEO cho các bài viết và trang cá nhân.

4.  **Hệ thống Contact & CRM nhẹ:**
    *   Form liên hệ tích hợp cho trang cá nhân.
    *   Quản lý danh sách khách hàng tiềm năng từ Booking và Contact form.

### **1.3.2. Giới hạn**
*   Tập trung vào trải nghiệm người dùng cá nhân (Solopreneurs, Freelancers) hơn là doanh nghiệp lớn (Enterprise).
*   Chưa hỗ trợ Video Call nội bộ (sử dụng Google Meet).

## **1.4. Bố cục báo cáo**

Báo cáo được cấu trúc để làm nổi bật quá trình từ ý tưởng đến sản phẩm thực tế:

*   **Chương 1: Giới thiệu:** Tầm nhìn và bài toán mà Calento giải quyết.
*   **Chương 2: Công nghệ lõi:** Phân tích sâu về Stack công nghệ (Next.js 15, NestJS, pgvector).
*   **Chương 3: Thiết kế hệ thống:** Kiến trúc module, Database schema 35+ bảng, và luồng xử lý AI.
*   **Chương 4: Thiết kế & Trải nghiệm:** Chi tiết UI/UX cho các phân hệ Dashboard, Blog, và AI Chat.
