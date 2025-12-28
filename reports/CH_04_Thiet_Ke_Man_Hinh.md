# **CHƯƠNG 4: THIẾT KẾ MÀN HÌNH**

## **4.1. Sơ đồ liên kết màn hình (Screen Flow)**

Hệ thống được tổ chức với luồng di chuyển logic, tập trung vào Dashboard làm trung tâm.

```mermaid
graph TD
    Login[Đăng nhập / Đăng ký] -->|Success| Dashboard
    
    Dashboard --> CalendarView[Màn hình Lịch (Ngày/Tuần/Tháng)]
    Dashboard --> EventDetail[Chi tiết sự kiện]
    Dashboard --> BookingMan[Quản lý Booking Links]
    Dashboard --> Settings[Cài đặt & Profile]
    
    CalendarView --"Click (+)"--> CreateEventModal[Tạo sự kiện mới]
    
    Dashboard --"Toggle Chat"--> AIChatPanel[AI Assistant Chat]
    AIChatPanel --"Open Action"--> EventDetail
    
    PublicUser[Khách vãng lai] --> BookingPage[Trang Booking Public]
    BookingPage --> ConfirmPage[Xác nhận đặt lịch]
```

## **4.2. Danh sách các màn hình chính**

### **4.2.1. Màn hình Dashboard & Calendar (Chính)**
Đây là màn hình trung tâm nơi người dùng quản lý thời gian của mình.
*   **Thành phần:**
    *   **Sidebar:** Điều hướng nhanh giữa các module (Lịch, Tasks, Booking).
    *   **Main Calendar:** Hiển thị lịch dạng lưới (FullCalendar), hỗ trợ Drag & Drop.
    *   **Mini Calendar:** Chọn ngày nhanh.
    *   **Upcoming List:** Danh sách sự kiện sắp tới bên phải (có thể thu gọn).
*   **Cải thiện:** Tối ưu hóa hiệu năng render khi có nhiều sự kiện, load dữ liệu theo range ngày.

### **4.2.2. Màn hình AI Assistant Chat (Cập nhật lớn)**
Giao diện giao tiếp với trợ lý ảo, được thiết kế lại để hỗ trợ rich content.
*   **Vị trí:** Panel trượt từ bên phải (Drawer) hoặc Popover, có thể mở từ bất kỳ đâu.
*   **Tính năng UI mới:**
    *   **Streaming Typography:** Hiệu ứng chữ chạy khi AI đang trả lời (giống ChatGPT) giúp giảm cảm giác chờ đợi.
    *   **Markdown Rendering:** Hiển thị văn bản định dạng đậm, nghiêng, list, và code block đẹp mắt thay vì plain text.
    *   **Action Cards:** Khi AI đề xuất tạo lịch hay tìm thấy lịch trống, hiển thị dưới dạng thẻ tương tác (Card) thay vì chỉ văn bản. Người dùng có thể bấm "Confirm" hoặc "Edit" ngay trên đoạn chat.
    *   **Thinking State:** Hiển thị trạng thái "AI đang suy nghĩ..." hoặc "Đang tra cứu dữ liệu..." khi RAG đang hoạt động.

### **4.2.3. Màn hình Quản lý Booking Link**
*   Cho phép người dùng tạo các trang đặt lịch (tương tự Calendly).
*   **Form Config:** Cài đặt thời lượng, thời gian đệm (buffer time), và giới hạn số booking trong ngày.
*   **Preview:** Xem trước giao diện mà khách sẽ thấy.

### **4.2.4. Màn hình Public Booking (Cho khách)**
*   Giao diện tối giản, tập trung vào việc chọn giờ.
*   Mobile-first design để khách dễ dàng đặt lịch trên điện thoại.
*   Flow: Chọn Ngày -> Chọn Giờ -> Nhập Info -> Hoàn tất.

### **4.2.5. Modal Tạo/Sửa Sự kiện**
*   Form nhập liệu chi tiết: Tiêu đề, Thời gian, Location, Description.
*   **Attendees:** Input autocomplete để thêm email người tham dự.
*   **Recurrence:** Giao diện tùy chỉnh lặp lại (Hàng ngày, Hàng tuần, Tùy chỉnh).
*   **AI Suggestion:** (Tính năng mới) Button "Suggest Time" bên cạnh ô chọn giờ để AI đề xuất giờ rảnh của cả team.
