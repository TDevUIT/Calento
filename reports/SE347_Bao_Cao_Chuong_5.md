# **Chương V. KẾT LUẬN**

## **5.1. Kết quả đạt được**

### **5.1.1. Hoàn thành đầy đủ hệ thống Calendar Assistant**

Dự án đã xây dựng thành công một hệ thống Calendar Assistant toàn diện. Về phía Backend, nhóm đã phát triển 22 modules với cấu trúc rõ ràng cùng hơn 102 API endpoints RESTful. Cơ sở dữ liệu gồm 18 bảng được thiết kế chuẩn hóa, hỗ trợ Authentication bảo mật qua JWT và Google OAuth 2.0. Hệ thống cũng xử lý tốt các tác vụ nền với BullMQ và Redis cũng như gửi email notification qua templating engine.

Về Frontend, ứng dụng sử dụng Next.js 15 và React 19 để tạo ra giao diện Responsive mượt mà, tối ưu SEO thông qua Server-Side Rendering (SSR). Trải nghiệm chat với AI được nâng tầm nhờ Real-time streaming qua Server-Sent Events. Việc sử dụng TypeScript, Zod validation và các thư viện UI hiện đại như Radix UI mang lại độ tin cậy và thẩm mỹ cao cho sản phẩm.

Các tính năng đặc trưng đã được hoàn thiện bao gồm: Đồng bộ 2 chiều với Google Calendar (Pull/Push events, xử lý xung đột); Trợ lý ảo AI sử dụng RAG Pattern với khả năng tìm kiếm semantic và function calling; Hệ thống Booking chuyên nghiệp với tính năng availability checking tự động; Hỗ trợ làm việc nhóm (Team Collaboration) với lịch chung và rituals; Quản lý công việc (Task Management) tích hợp Priority Board; và cuối cùng là Blog CMS đầy đủ tính năng hỗ trợ SEO và Analytics.

### **5.1.2. Điểm mạnh của hệ thống**

**Về Kiến trúc**, hệ thống tuân thủ thiết kế Modular giúp dễ dàng bảo trì và mở rộng. Việc sử dụng TypeScript đảm bảo type-safety, giảm thiểu lỗi runtime, đồng thời kiến trúc hỗ trợ scale horizontal để đáp ứng nhu cầu tăng trưởng. **Về Performance**, chiến lược caching với Redis giúp giảm tải database đáng kể, kết hợp với tối ưu hóa database indexing và frontend bundle size giúp ứng dụng đạt tốc độ phản hồi ấn tượng. **Về Security**, hệ thống áp dụng các chuẩn bảo mật cao như JWT rotation, RBAC, password hashing, và bảo vệ chống lại các lỗ hổng phổ biến như SQL Injection thông qua input validation chặt chẽ.

### **5.1.3. Kiến thức và kỹ năng đạt được**

Qua quá trình thực hiện đồ án, nhóm đã nắm vững:

Qua quá trình thực hiện đồ án, nhóm đã tích lũy được khối lượng kiến thức đáng kể. Về **Full-stack Development**, nhóm nắm vững quy trình thiết kế REST API, database modeling phức tạp, và state management hiện đại. Trong lĩnh vực **AI/ML**, nhóm đã có kinh nghiệm làm việc với LLM APIs, triển khai RAG pattern và kỹ thuật prompt engineering. Về **DevOps**, các kỹ năng containerization với Docker, thiết lập CI/CD và triển khai cloud đã được thực hành nhuần nhuyễn. Cuối cùng, các **Soft Skills** như quản lý thời gian, làm việc nhóm qua Git và kỹ năng giải quyết vấn đề cũng được cải thiện rõ rệt.

## **5.2. Hạn chế của hệ thống**

### **5.2.1. Hạn chế kỹ thuật**
 
 Về trải nghiệm Mobile, ứng dụng hiện chưa có phiên bản native app cho iOS/Android nên thiếu các tính năng offline và thông báo đẩy (push notifications) đặc thù của nền tảng. Khả năng tích hợp lịch hiện tại chỉ mới hỗ trợ Google Calendar, chưa mở rộng sang Outlook hay Apple Calendar. Đối với AI, mô hình vẫn hoạt động theo cơ chế reactive (phản hồi khi được hỏi) và phụ thuộc vào giới hạn của Gemini API. Về hạ tầng, hệ thống chưa triển khai database sharding hay Redis cluster, điều này có thể ảnh hưởng đến khả năng scale khi lượng người dùng tăng đột biến.
 
 ### **5.2.2. Hạn chế nghiệp vụ**
 
 Các tính năng cho Team còn giới hạn ở số lượng 5 thành viên và chưa hỗ trợ phân cấp teams. Hệ thống đặt lịch (Booking) chưa tích hợp cổng thanh toán và chưa hỗ trợ đặt lịch nhóm. Ngoài ra, phần Analytics hiện tại còn sơ khai, thiếu các báo cáo chi tiết và khả năng xuất dữ liệu đa dạng cho người dùng.

## **5.3. Hướng phát triển tương lai**

### **5.3.1. Ngắn hạn (3-6 tháng)**
 
 Trong ngắn hạn, nhóm sẽ tập trung phát triển ứng dụng Mobile Native (React Native) với khả năng offline-first và bảo mật sinh trắc học. Tính năng Real-time Collaboration cũng sẽ được bổ sung để hỗ trợ nhiều người cùng chỉnh sửa sự kiện. Bên cạnh đó, các integrations mới như Outlook Calendar, Slack bot, và khả năng AI chủ động đề xuất lịch trình (Proactive suggestions) sẽ được ưu tiên triển khai.
 
 ### **5.3.2. Dài hạn (6-12 tháng)**
 
 Về dài hạn, mục tiêu là hướng tới các tính năng Enterprise như kiến trúc multi-tenant, SSO integration và báo cáo tuân thủ (audit logs). AI sẽ được nâng cấp sâu hơn để phân tích hiệu quả cuộc họp và thói quen làm việc. Hệ thống Booking sẽ tích hợp thanh toán và quản lý tài nguyên. Đồng thời, hạ tầng sẽ được cải thiện với Database sharding và Kubernetes deployment để đảm bảo khả năng phục vụ quy mô lớn.
 
 ### **5.3.3. Về mặt nghiên cứu**
 
 Nhóm định hướng tiếp tục nghiên cứu sâu về AI, bao gồm việc Fine-tune LLM riêng cho bài toán calendar, phát triển Multi-modal AI và Federated learning để bảo vệ quyền riêng tư. Các kỹ thuật tối ưu hóa hiệu năng database nâng cao cũng sẽ được thử nghiệm và áp dụng.

## **5.4. Kết luận chung**

Dự án **Calento - Calendar Assistant Web** đã đạt được mục tiêu ban đầu là xây dựng một hệ thống quản lý lịch trình thông minh, tích hợp AI và các tính năng hiện đại. Hệ thống không chỉ giải quyết được bài toán quản lý thời gian cá nhân mà còn hỗ trợ collaboration cho teams.

**Giá trị thực tế:**
- Sản phẩm có thể triển khai thương mại ngay lập tức
- Đáp ứng nhu cầu thực tế của người dùng (đã có feedback tích cực từ early users)
- Kiến trúc mở rộng tốt, dễ dàng thêm features mới

**Đóng góp về mặt học thuật:**
- Áp dụng thành công RAG pattern trong domain cụ thể (calendar management)
- Case study về Full-stack development với modern tech stack
- Best practices về API design, database modeling, security

**Ý nghĩa đối với nhóm:**
- Nắm vững kiến thức Full-stack từ frontend đến backend, deployment
- Trải nghiệm làm việc với AI/ML integration
- Kỹ năng làm việc nhóm, quản lý dự án lớn
- Sản phẩm portfolio chất lượng cho career development

Dự án Calento là minh chứng cho việc kết hợp kiến thức lý thuyết và kỹ năng thực hành, tạo ra một sản phẩm công nghệ có giá trị.

---

# **NGUỒN THAM KHẢO** {#nguồn-tham-khảo}

## **Tài liệu kỹ thuật**

1. NestJS Documentation. A progressive Node.js framework. Retrieved from [https://docs.nestjs.com/](https://docs.nestjs.com/)  
2. Next.js Documentation. The React Framework for the Web. Vercel. Retrieved from [https://nextjs.org/docs](https://nextjs.org/docs)  
3. PostgreSQL Documentation. The World's Most Advanced Open Source Relational Database. Retrieved from [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)  
4. Redis Documentation. The open source, in-memory data store. Retrieved from [https://redis.io/docs/](https://redis.io/docs/)  
5. Google Calendar API Documentation. Google Developers. Retrieved from [https://developers.google.com/calendar/api/guides/overview](https://developers.google.com/calendar/api/guides/overview)  
6. Google Gemini AI Documentation. (2025). Build with Gemini. Retrieved from [https://ai.google.dev/docs](https://ai.google.dev/docs)
7. pgvector Extension Documentation. Vector similarity search for PostgreSQL. Retrieved from [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)

## **Frameworks & Libraries**

8. TanStack Query Documentation. Powerful asynchronous state management for TS/JS. Retrieved from [https://tanstack.com/query/latest](https://tanstack.com/query/latest)  
9. Tailwind CSS Documentation. A utility-first CSS framework. Retrieved from [https://tailwindcss.com/docs](https://tailwindcss.com/docs)  
10. BullMQ Documentation. Premium Queue package for handling distributed jobs. Retrieved from [https://docs.bullmq.io/](https://docs.bullmq.io/)  
11. React Hook Form Documentation. Performant, flexible and extensible forms. Retrieved from [https://react-hook-form.com/](https://react-hook-form.com/)
12. LangChain Documentation. Building applications with LLMs. Retrieved from [https://js.langchain.com/docs](https://js.langchain.com/docs)

## **Dự án**

**Repository GitHub:** [TDevUIT/Calento: Calendar Assistant](https://github.com/TDevUIT/Calento)

**Website Production:** [Calento - AI Calendar Assistant | Smart Scheduling & Time Management](https://calento.space)

**API Documentation:** [Calento API Docs](https://api.calento.space/docs)

---

