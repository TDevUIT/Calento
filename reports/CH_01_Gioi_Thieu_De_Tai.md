# **CHƯƠNG 1: GIỚI THIỆU ĐỀ TÀI**

## **1.1. Lý do chọn đề tài**

Trong bối cảnh xã hội hiện đại, việc quản lý thời gian hiệu quả đã trở thành một kỹ năng thiết yếu đối với mọi người, đặc biệt là sinh viên, nhân viên văn phòng và các chuyên gia. Theo khảo sát của Microsoft (2022), một người dùng trung bình dành khoảng 11 giờ mỗi tuần để quản lý và sắp xếp lịch trình cá nhân. Con số này cho thấy nhu cầu cấp thiết về một giải pháp tối ưu hóa quy trình quản lý thời gian.

Hiện nay, thị trường đã có nhiều ứng dụng quản lý lịch như Google Calendar, Outlook Calendar, Apple Calendar. Tuy nhiên, các ứng dụng này vẫn tồn tại một số hạn chế:

| Khía cạnh | Hạn chế |
| :--- | :--- |
| **Tính tự động hóa** | Người dùng phải tự nhập thông tin sự kiện một cách thủ công, không có khả năng đề xuất thời gian họp phù hợp tự động. |
| **Trải nghiệm người dùng** | Giao diện phức tạp với nhiều bước thao tác, không hỗ trợ tương tác bằng ngôn ngữ tự nhiên. |
| **Tích hợp AI** | Chưa tận dụng được công nghệ Large Language Models (LLMs), thiếu khả năng hiểu ngữ cảnh và tìm kiếm thông minh (RAG). |

Xuất phát từ những bất cập trên, nhóm quyết định xây dựng **Calento** (Calendar Intelligence Assistant) - một ứng dụng web quản lý lịch thông minh. Calento không chỉ là một công cụ lịch thông thường mà còn tích hợp trợ lý ảo AI, khả năng xử lý ngôn ngữ tự nhiên và tìm kiếm ngữ cảnh thông minh để mang lại trải nghiệm đột phá.

Đề tài này cũng là cơ hội để nhóm áp dụng các kiến thức đã học trong môn Công nghệ Web và Ứng dụng, đồng thời tìm hiểu các công nghệ mới như AI, Vector Database và Microservices Architecture.

## **1.2. Mục tiêu**

### **1.2.1. Mục tiêu chung**
Xây dựng thành công ứng dụng web **Calento** với đầy đủ các tính năng quản lý lịch, tích hợp trợ lý ảo AI để hỗ trợ người dùng sắp xếp công việc một cách thông minh và tự động.

### **1.2.2. Mục tiêu cụ thể**
1.  **Về nghiệp vụ:**
    *   Cung cấp đầy đủ các thao tác quản lý lịch cơ bản (CRUD events).
    *   Tích hợp Google Calendar để đồng bộ dữ liệu hai chiều.
    *   Xây dựng hệ thống đặt lịch hẹn (Booking System) chuyên nghiệp.
    *   Phát triển trợ lý ảo AI có khả năng hiểu lệnh và thực hiện hành động (Function Calling).

2.  **Về kỹ thuật:**
    *   Xây dựng hệ thống theo kiến trúc Client-Server hiện đại, đảm bảo tính mở rộng và bảo trì.
    *   Sử dụng **NestJS** cho Backend và **Next.js** cho Frontend để tối ưu hiệu suất và SEO.
    *   Triển khai **PostgreSQL** với **pgvector** để hỗ trợ tính năng RAG (Retrieval-Augmented Generation).
    *   Tối ưu hóa trải nghiệm người dùng với **Real-time Streaming** và phản hồi nhanh chóng.

## **1.3. Phạm vi thực hiện**

### **1.3.1. Các tính năng được triển khai**

1.  **Quản lý sự kiện (Event Management):**
    *   Tạo, xem, sửa, xóa sự kiện.
    *   Hỗ trợ sự kiện lặp lại (Recurring events - RRULE).
    *   Quản lý người tham dự và gửi lời mời.

2.  **AI Assistant & RAG (Retrieval-Augmented Generation):**
    *   Chatbot tích hợp Google Gemini AI.
    *   Hỗ trợ Function Calling để thực hiện hành động (tạo lịch, tìm lịch trống).
    *   **MỚI:** Hệ thống RAG giúp AI ghi nhớ và truy xuất ngữ cảnh người dùng thông qua Vector Search.

3.  **Hệ thống đặt lịch (Booking System):**
    *   Tạo trang đặt lịch cá nhân (Booking Links).
    *   Tùy chỉnh khung giờ rảnh và quy tắc đặt lịch.

4.  **Đồng bộ & Tích hợp:**
    *   Đồng bộ 2 chiều với Google Calendar.
    *   Gửi email thông báo và nhắc nhở tự động.

### **1.3.2. Giới hạn**
*   Ứng dụng tập trung vào nền tảng Web, giao diện Mobile được tối ưu qua Responsive Web Design (không phải Native App).
*   Chưa hỗ trợ tích hợp Video Call trực tiếp (chỉ tạo link Google Meet).
*   Tính năng phân tích dữ liệu nâng cao (Advanced Analytics) sẽ được phát triển trong giai đoạn sau.

## **1.4. Bố cục báo cáo**

Báo cáo được chia thành 4 chương chính:

*   **Chương 1: Giới thiệu đề tài:** Trình bày lý do chọn đề tài, mục tiêu và phạm vi của dự án.
*   **Chương 2: Công nghệ sử dụng:** Giới thiệu các công nghệ, ngôn ngữ và công cụ được sử dụng để xây dựng hệ thống (NestJS, Next.js, PostgreSQL/pgvector, Google Gemini).
*   **Chương 3: Phân tích và thiết kế hệ thống:** Mô tả kiến trúc tổng thể, các thành phần module (bao gồm module Vector/RAG mới), và thiết kế cơ sở dữ liệu chi tiết.
*   **Chương 4: Thiết kế màn hình:** Trình bày sơ đồ luồng màn hình và chi tiết thiết kế giao diện người dùng, bao gồm các cải tiến về trải nghiệm chat thông minh.
