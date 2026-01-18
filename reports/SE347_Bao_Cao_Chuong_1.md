**TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN, ĐHQG-HCM**

**KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG**

![][image1]

**BÁO CÁO ĐỒ ÁN MÔN HỌC**

# **ĐỀ TÀI: Xây dựng Calendar Assistant Web**

**Môn học:** Công nghệ Web và ứng dụng \- SE347.Q12

**Giảng viên hướng dẫn:  Đặng Việt Dũng**

**Thực hiện bởi nhóm 2, bao gồm:** 

1. Tạ Văn Thái			22523177		Trưởng nhóm  
2. Bùi Quốc Lâm		22520733		Thành viên  
3. Nguyễn Văn Quyền 		22521223		Thành viên  
4. Nguyễn Công Thắng 	22521330		Thành viên

**Thời gian thực hiện:** 10/2025 \- 1/2026

# **MỤC LỤC** {#mục-lục}

[MỤC LỤC	2](#mục-lục)

[Chương I. TỔNG QUAN.	3](#chương-i.-tổng-quan.)

[1\. Giới thiệu đề tài.	3](#heading=h.g1cnmohwqajz)

[1.2. Lý do chọn đề tài.	3](#1.1-lý-do-chọn-đề-tài.)

[2\. Cơ sở lý thuyết.	3](#heading=h.h52d15setcmh)

[Chương II. THIẾT KẾ HỆ THỐNG.	4](#chương-ii.-công-nghệ-sử-dụng)

[1.Kiến trúc hệ thống	4](#heading=h.z18z19u0xqds)

[1.1. Tổng quan về kiến trúc	4](#heading=h.l7khgiosucxf)

[1.2. Sơ đồ kiến trúc tổng thể	4](#heading=h.kr03iokw7h6)

[1.3 Luồng dữ liệu (Data Flow)	9](#heading=h.3i0w0agac8rr)

[2\. Thiết kế Database	9](#heading=h.1pi9ud5uc0oj)

[2.1 Tổng quan về cấu trúc Database	9](#heading=h.st73cs6j8a73)

[2\. Mối quan hệ giữa các Tables	11](#heading=h.enzfv0phyihx)

[Chương III. TRIỂN KHAI HỆ THỐNG.	11](#chương-iii.-phân-tích-và-thiết-kế-hệ-thống)

[1\. Tạo tài khoản Azure.	12](#heading=)

[2\. Khởi tạo tài nguyên và cấu hình.	12](#heading=)

[3\. Triển khai ứng dụng web.	12](#heading=)

[Chương IV. KẾT LUẬN.	13](#heading=h.o9k9z0mixkyq)

[1\. Kết quả đạt được	13](#heading=h.hegb62hm14wp)

[1.1. Thành tựu về Backend	13](#heading=h.htiu8wabsamg)

[1.2. Thành tựu về Frontend	16](#heading=h.4yev20d3vtb0)

[1.3. Thành tựu về Deployment và Infrastructure	16](#heading=h.uucx4p2u0o3t)

[1.4. Kiến thức và Kỹ năng Thu được	16](#heading=h.f35xlt7w5gly)

[2\. Hạn chế của Hệ thống	16](#heading=h.pk08do36flej)

[3\. Hướng Phát triển Tương lai	16](#heading=h.64tzltaurqon)

[NGUỒN THAM KHẢO	17](#nguồn-tham-khảo)

# 

# 

# **DANH MỤC HÌNH ẢNH** 

[Hình 1: NestJS	8](#hình-1:-nestjs)

[Hình 2: PostgreSQl	8](#hình-2:-postgresql)

[Hình 3: Redis & BullMQ	9](#hình-3:-redis-&-bullmq)

[Hình 4: Next.js & React	10](#hình-4:-next.js-&-react)

[Hình 5:Tailwind CSS	10](#hình-5:tailwind-css)

[Hình 6:Gemini	11](#hình-6:gemini)

[Hình 7: LangChain	12](#hình-7:-langchain)

[Hình 8: Kiến trúc tổng thể	12](#hình-8:-kiến-trúc-tổng-thể)

[Hình 9: Sơ đồ Use Case tổng quan	13](#hình-9:-sơ-đồ-use-case-tổng-quan)

[Hình 10: Auth Module	13](#hình-10:-auth-module)

[Hình 11: Calendar & Event Module	14](#hình-11:-calendar-&-event-module)

[Hình 12: Booking Module	15](#hình-12:-booking-module)

[Hình 13: LLM Module Architecture	15](#hình-13:-llm-module-architecture)

[Hình 14: Vector Similarity Search Process	16](#hình-14:-vector-similarity-search-process)

[Hình 15: RAG Sequence Flow	16](#hình-15:-rag-sequence-flow)

[Hình 16: Google Calendar Sync Flow	17](#hình-16:-google-calendar-sync-flow)

[Hình 17: Notification Multi-channel System	18](#hình-17:-notification-multi-channel-system)

[Hình 18: Webhook Delivery Flow	18](#hình-18:-webhook-delivery-flow)

[Hình 19: Worker & Infrastructure	19](#hình-19:-worker-&-infrastructure)

[Hình 20: Database Entity Relationship Diagram	20](#hình-20:-database-entity-relationship-diagram)

[Hình 21: VM Instance Google Cloud Platform	21](#hình-21:-vm-instance-google-cloud-platform)

[Hình 22: CloudFlare DNS Record	22](#hình-22:-cloudflare-dns-record)

[Hình 23: Google Search Console	23](#hình-23:-google-search-console)

# **Chương I. TỔNG QUAN.** {#chương-i.-tổng-quan.}

## **1.1 Lý do chọn đề tài.** {#1.1-lý-do-chọn-đề-tài.}

Trong bối cảnh xã hội hiện đại, việc quản lý thời gian hiệu quả đã trở thành một kỹ năng thiết yếu đối với mọi người, đặc biệt là sinh viên, nhân viên văn phòng và các chuyên gia. Theo khảo sát của Microsoft (2022), một người dùng trung bình dành khoảng 11 giờ mỗi tuần để quản lý và sắp xếp lịch trình cá nhân. Con số này cho thấy nhu cầu cấp thiết về một giải pháp tối ưu hóa quy trình quản lý thời gian.

Hiện nay, thị trường đã có nhiều ứng dụng quản lý lịch như Google Calendar, Outlook Calendar, Apple Calendar. Tuy nhiên, các ứng dụng này vẫn tồn tại một số hạn chế:

| Khía cạnh | Hạn chế |
| ----- | ----- |
| Tính tự động hóa | Người dùng phải tự nhập thông tin sự kiện một cách thủ công, không có khả năng đề xuất thời gian họp phù hợp tự động. |
| Trải nghiệm người dùng | Giao diện phức tạp với nhiều bước thao tác, không hỗ trợ tương tác bằng ngôn ngữ tự nhiên. |
| Tích hợp AI | Chưa tận dụng được công nghệ Large Language Models (LLMs), thiếu khả năng hiểu ngữ cảnh và tìm kiếm thông minh (RAG). |

Xuất phát từ những bất cập trên, nhóm quyết định xây dựng Calento (Calendar Intelligence Assistant) \- một ứng dụng web quản lý lịch thông minh. Calento không chỉ là một công cụ lịch thông thường mà còn tích hợp trợ lý ảo AI, khả năng xử lý ngôn ngữ tự nhiên và tìm kiếm ngữ cảnh thông minh để mang lại trải nghiệm đột phá.

Đề tài này cũng là cơ hội để nhóm áp dụng các kiến thức đã học trong môn Công nghệ Web và Ứng dụng, đồng thời tìm hiểu các công nghệ mới như AI, Vector Database.

## **1.2. Mục tiêu**

### **1.2.1. Mục tiêu chung**

Xây dựng thành công ứng dụng web Calento với đầy đủ các tính năng quản lý lịch, tích hợp trợ lý ảo AI để hỗ trợ người dùng sắp xếp công việc một cách thông minh và tự động.

### **1.2.2. Mục tiêu cụ thể**

Về mặt nghiệp vụ, ứng dụng cần cung cấp đầy đủ các thao tác quản lý lịch cơ bản (CRUD events) và tích hợp đồng bộ dữ liệu hai chiều với Google Calendar. Một tính năng quan trọng là hệ thống đặt lịch hẹn (Booking System) chuyên nghiệp, cho phép người dùng tùy chỉnh thời gian rảnh. Bên cạnh đó, trợ lý ảo AI sẽ được phát triển với khả năng hiểu lệnh và thực hiện hành động (Function Calling) để hỗ trợ người dùng tối đa.

Về mặt kỹ thuật, hệ thống được xây dựng theo kiến trúc Client-Server hiện đại để đảm bảo tính mở rộng và dễ bảo trì. Backend sử dụng NestJS kết hợp với Frontend Next.js nhằm tối ưu hóa hiệu suất và khả năng SEO. Cơ sở dữ liệu PostgreSQL được triển khai cùng extension pgvector để hỗ trợ tính năng RAG (Retrieval-Augmented Generation), đồng thời trải nghiệm người dùng được tối ưu hóa thông qua Real-time Streaming và phản hồi nhanh chóng.

## **1.3. Phạm vi thực hiện**

### **1.3.1. Các tính năng được triển khai**

Hệ thống bao gồm tính năng Quản lý sự kiện (Event Management) cho phép tạo, xem, sửa, xóa sự kiện, hỗ trợ sự kiện lặp lại (Recurring events - RRULE), quản lý người tham dự và gửi lời mời. Tính năng AI Assistant & RAG tích hợp Chatbot sử dụng Google Gemini AI, hỗ trợ Function Calling để thực hiện hành động như tạo lịch hoặc tìm lịch trống. Điểm mới là hệ thống RAG giúp AI ghi nhớ và truy xuất ngữ cảnh người dùng thông qua Vector Search.

Đối với Hệ thống đặt lịch (Booking System), người dùng có thể tạo các trang đặt lịch cá nhân (Booking Links) và tùy chỉnh khung giờ rảnh cũng như quy tắc đặt lịch. Khả năng Đồng bộ & Tích hợp đảm bảo đồng bộ 2 chiều với Google Calendar, đồng thời hệ thống sẽ gửi email thông báo và nhắc nhở tự động đến người dùng.

### **1.3.2. Giới hạn**

Ứng dụng hiện tập trung phát triển trên nền tảng Web, với giao diện Mobile được tối ưu hóa qua Responsive Web Design thay vì Native App. Hệ thống chưa hỗ trợ tích hợp Video Call trực tiếp mà chỉ tạo link Google Meet. Ngoài ra, tính năng phân tích dữ liệu nâng cao (Advanced Analytics) sẽ được phát triển trong giai đoạn sau của dự án.

## **1.4. Bố cục báo cáo**

Báo cáo được chia thành 4 chương chính:

Báo cáo được chia thành 4 chương chính. Chương 1 giới thiệu tổng quan về đề tài, lý do lựa chọn, mục tiêu và phạm vi dự án. Chương 2 trình bày các công nghệ, ngôn ngữ và công cụ sử dụng như NestJS, Next.js, PostgreSQL/pgvector và Google Gemini. Chương 3 tập trung phân tích và thiết kế hệ thống, mô tả kiến trúc tổng thể, các module thành phần và thiết kế cơ sở dữ liệu. Cuối cùng, Chương 4 trình bày thiết kế chi tiết màn hình, bao gồm sơ đồ luồng và giao diện người dùng, đặc biệt là các cải tiến trong trải nghiệm chat thông minh.

