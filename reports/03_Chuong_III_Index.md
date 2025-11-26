# **Chương III: TRIỂN KHAI HỆ THỐNG**

Chương này mô tả chi tiết quá trình hiện thực hóa hệ thống Calento, từ việc thiết lập môi trường phát triển, xây dựng các tính năng cốt lõi trên Backend và Frontend, đến quy trình triển khai hạ tầng Production.

## **Mục lục**

### **[Phần 1: Cài đặt Môi trường](./03_1_Cai_Dat_Moi_Truong.md)**
Hướng dẫn chi tiết về các công cụ cần thiết (Node.js, PostgreSQL, Docker), cấu hình biến môi trường cho Backend và Frontend, cũng như thiết lập IDE để tối ưu hóa quy trình phát triển.

### **[Phần 2: Triển khai Backend](./03_2_Trien_Khai_Backend.md)**
Đi sâu vào logic xử lý phía máy chủ, bao gồm hệ thống xác thực (JWT, OAuth), quản lý sự kiện và lịch, cơ chế đồng bộ hai chiều với Google Calendar, và tích hợp AI Chatbot sử dụng Google Gemini.

### **[Phần 3: Triển khai Frontend](./03_3_Trien_Khai_Frontend.md)**
Trình bày về kiến trúc giao diện người dùng, cách tích hợp xác thực, xây dựng component lịch tùy biến, giao diện chat thông minh và trang đặt lịch công khai tối ưu trải nghiệm người dùng.

### **[Phần 4: Triển khai Hạ tầng](./03_4_Trien_Khai_Ha_Tang.md)**
Mô tả kiến trúc hạ tầng trên Digital Ocean, cấu hình Docker container, Nginx Reverse Proxy, bảo mật với Cloudflare và quy trình CI/CD tự động hóa việc triển khai.

---

**Tổng kết:**
Việc chia nhỏ quá trình triển khai thành các phần rõ ràng giúp đội ngũ phát triển dễ dàng quản lý, bảo trì và mở rộng hệ thống trong tương lai. Mỗi thành phần đều được xây dựng dựa trên các tiêu chuẩn công nghiệp và best practices để đảm bảo hiệu năng và độ tin cậy cao nhất.
