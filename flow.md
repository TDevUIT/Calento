Kịch bản Trình bày Sản phẩm Calento
Tài liệu này phác thảo kịch bản demo sản phẩm Calento, tập trung vào luồng người dùng bắt đầu từ xác thực (Authentication).

1. Giới thiệu (1-2 phút)
Người trình bày: "Chào mọi người, hôm nay tôi xin giới thiệu Calento - một Trợ lý Lịch thông minh (Smart Calendar Assistant) được xây dựng để giúp cá nhân và đội nhóm quản lý thời gian hiệu quả hơn."

Màn hình: Trang chủ (Landing Page)

Điểm nhấn: Giao diện hiện đại, lời hứa thương hiệu "Get your time back with AI".
Các mục chính: Hero section, Thống kê năng suất (Focus/Productivity Stats), Khách hàng tiêu biểu.
2. Luồng Xác thực (Auth Flow) (3-5 phút)
Đây là cánh cửa đầu tiên để người dùng tiếp cận hệ thống. Chúng ta sẽ đi qua các bước từ Đăng nhập đến Đăng ký và Khôi phục tài khoản.

Bước 1: Truy cập Đăng nhập
Hành động: Từ trang chủ, click vào nút "Sign In" (hoặc "Get Started") ở góc phải.
Màn hình: Chuyển hướng đến /auth/login.
Lời thoại: "Giao diện đăng nhập được thiết kế tối giản, tập trung vào trải nghiệm người dùng."
Bước 2: Đăng nhập (Sign In)
Giao diện:
Logo Calento & thông điệp chào mừng.
Form nhập Email/Password.
Tùy chọn đăng nhập qua Google/Microsoft (nếu có tích hợp).
Hành động:
Nhập thông tin tài khoản đã có.
Nhấn nút "Sign In".
Bước 3: Đăng ký (Sign Up) - Giả định người dùng mới
Hành động: Tại màn hình Login, click vào link "Sign up" ("Don't have an account?").
Màn hình: Chuyển hướng đến /auth/register.
Lời thoại: "Đối với người dùng mới, quá trình đăng ký rất nhanh gọn. Chỉ cần cung cấp các thông tin cơ bản để khởi tạo không gian làm việc cá nhân."
Bước 4: Quên Mật khẩu (Forgot Password)
Hành động: Quay lại màn hình Login, click vào "Forgot your password?".
Màn hình: Chuyển hướng đến /auth/forgot-password.
Lời thoại: "Trong trường hợp quên mật khẩu, Calento cung cấp quy trình khôi phục bảo mật qua email, đảm bảo người dùng luôn có thể truy cập lại tài khoản của mình."
3. Khám phá Dashboard & Tính năng Chính (5 phút)
Sau khi đăng nhập thành công, người dùng được đưa đến Dashboard - trung tâm điều khiển của Calento.

Tổng quan Dashboard
Màn hình: /dashboard
Điểm nhấn:
Thống kê (Analytics): Hiển thị các chỉ số như thời gian tập trung (Focus Stats), hiệu suất làm việc.
Lịch (Calendar): Giao diện lịch trực quan, đồng bộ với Google Calendar.
Các Phân hệ Chính (Modules)
Quản lý Lịch & Sự kiện (Calendar & Availability):
Xem lịch trình ngày/tuần/tháng.
Thiết lập trạng thái sẵn sàng (Availability).
Quản lý Đội nhóm (Teams):
Tạo và quản lý đội nhóm.
Xem lịch trình của thành viên trong team.
Công việc & Ưu tiên (Tasks & Priorities):
Quản lý danh sách công việc (To-do list).
Sắp xếp thứ tự ưu tiên thông minh.
Analytics & Báo cáo:
Biểu đồ trực quan về mức độ sử dụng thời gian.
Đánh giá độ "Xanh" (Green Stats) của lịch trình.
4. Kết luận
Người trình bày: "Calento không chỉ là một cuốn lịch, mà là một trợ lý thông minh giúp tối ưu hóa tài sản quý giá nhất của chúng ta: Thời gian. Với quy trình xác thực bảo mật và các tính năng quản lý mạnh mẽ, Calento sẵn sàng đồng hành cùng sự phát triển của bạn và doanh nghiệp."

Hành động: Mở phần Q&A hoặc kêu gọi dùng thử (Call to Action).