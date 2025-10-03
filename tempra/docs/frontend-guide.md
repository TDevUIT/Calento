# Frontend Guide — Calendar Assistant (Next.js + shadcn/ui)

Cập nhật: 2025-09-23
Phạm vi: Next.js (App Router), shadcn/ui, Tailwind CSS. Tiêu thụ Backend theo `docs/api-spec.md`.

## 1) Mục tiêu
- Xác thực Google OAuth2 và (tuỳ chọn) Slack OAuth.
- CRUD sự kiện, xem lịch, free/busy, gợi ý slot.
- Tích hợp Gemini: interpret/summarize/compose.
- Đồng bộ real-time (webhook backend -> WS frontend) để cập nhật UI.

## 2) Kiến trúc FE đề xuất
- Next.js App Router (`client/app/`):
  - `app/(auth)/callback/google/page.tsx` — xử lý callback OAuth Google (nhận query, gọi backend)
  - `app/(auth)/callback/slack/page.tsx` — xử lý callback OAuth Slack
  - `app/dashboard/page.tsx` — màn hình chính lịch + actions
  - `app/events/[id]/page.tsx` — chi tiết event
- Thư mục `client/lib/`:
  - `api.ts` — API client (fetch wrapper xử lý Response Envelope)
  - `auth.ts` — helpers phiên (JWT nội bộ, cookies)
  - `format.ts` — fmt thời gian, timezone
  - `socket.ts` — websocket client (tuỳ chọn)
- Thư mục `client/components/`:
  - `calendar/CalendarView.tsx` — lưới hiển thị events ngày/tuần
  - `events/EventForm.tsx` — form tạo/sửa event (shadcn/ui + react-hook-form + zod)
  - `assistant/PromptBox.tsx` — ô nhập lệnh tự nhiên, gọi Gemini interpret
  - `availability/SlotsSuggestion.tsx` — hiển thị slot gợi ý + chọn

## 3) Biến môi trường (Frontend)
- `NEXT_PUBLIC_API_BASE_URL` — trỏ tới backend, ví dụ: `https://your.api/api/v1`
- `NEXT_PUBLIC_GOOGLE_AUTH_URL` — ví dụ: `https://your.api/api/v1/auth/google`
- `NEXT_PUBLIC_SLACK_AUTH_URL` — ví dụ: `https://your.api/api/v1/auth/slack`
- `NEXT_PUBLIC_WS_URL` — WebSocket backend (tuỳ chọn), ví dụ: `wss://your.api/ws`

Đảm bảo các URL mapping với endpoints trong `docs/api-spec.md`.

## 4) Chuẩn Response Envelope (bắt buộc)
Theo mục 13.1 `docs/api-spec.md`, mọi response (trừ các đặc thù) được bọc dạng:
```json
{
  "time": "2025-09-23T11:33:00Z",
  "requestID": "uuid",
  "status": "success" | "error",
  "message": "...",
  "data": {...}
}
```
FE cần:
- Check `status`. Nếu `error`, hiển thị `message` và chi tiết `data.error` nếu có.
- Sử dụng `requestID` để correlate logs.

### 4.1) API Client Wrapper (`client/lib/api.ts`)
```ts
export type Envelope<T> = {
  time: string;
  requestID: string;
  status: 'success' | 'error';
  message?: string;
  data: T | { error?: { code?: number; details?: any } } | null;
};

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });
  const json = (await res.json()) as Envelope<T>;
  if (json.status !== 'success') {
    const msg = json.message || 'Request failed';
    // Optionally report requestID for tracing
    console.error(`[API] ${path} failed`, json.requestID, json.data);
    throw new Error(msg);
  }
  return json.data as T;
}
```

## 5) Luồng OAuth

### 5.1) Nút đăng nhập Google
- FE chỉ cần redirect người dùng sang `NEXT_PUBLIC_GOOGLE_AUTH_URL`.
- Sau khi user approve, backend `GET /auth/google/callback` sẽ set phiên (cookie JWT nội bộ hoặc redirect kèm token), sau đó trả về FE.

Ví dụ component:
```tsx
'use client';
import { Button } from '@/components/ui/button';

export function GoogleLoginButton() {
  const onClick = () => {
    window.location.href = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL!;
  };
  return <Button onClick={onClick}>Đăng nhập với Google</Button>;
}
```

### 5.2) Slack OAuth (tuỳ chọn)
- Tương tự Google, redirect tới `NEXT_PUBLIC_SLACK_AUTH_URL`.
- FE có thể hiển thị trạng thái kết nối Slack (đã cài app hay chưa) theo data từ `/auth/me`.

## 6) Các màn hình chính

### 6.1) Dashboard
- Thành phần:
  - Bộ chọn khoảng thời gian (ngày/tuần/tháng)
  - `CalendarView` hiển thị events
  - `PromptBox` để nhập lệnh tự nhiên
  - Nút “Tạo sự kiện” (mở `EventForm`)

Data fetching:
- Gọi `GET /calendar/calendars` để liệt kê calendars.
- Gọi `GET /calendar/events?timeMin=...&timeMax=...` để tải events.

```tsx
import { apiFetch } from '@/lib/api';

type CalendarEvent = {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

export async function getEvents(timeMin: string, timeMax: string) {
  return apiFetch<{ items: CalendarEvent[] }>(
    `/calendar/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`
  );
}
```

### 6.2) Tạo/Sửa/Xoá sự kiện
- Tạo: `POST /calendar/events` (body theo mục 7.1 Backend).
- Sửa: `PATCH /calendar/events/:id`.
- Xoá: `DELETE /calendar/events/:id`.

Form với shadcn/ui + react-hook-form + zod:
```tsx
'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea } from '@/components/ui';
import { apiFetch } from '@/lib/api';

const schema = z.object({
  calendarId: z.string().default('primary'),
  summary: z.string().min(1),
  description: z.string().optional(),
  start: z.object({ dateTime: z.string() }),
  end: z.object({ dateTime: z.string() }),
});

type FormValues = z.infer<typeof schema>;

export function EventForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await apiFetch(`/calendar/events`, {
      method: 'POST',
      body: JSON.stringify(values),
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Input placeholder="Tiêu đề" {...form.register('summary')} />
      <Textarea placeholder="Mô tả" {...form.register('description')} />
      <Input type="datetime-local" {...form.register('start.dateTime')} />
      <Input type="datetime-local" {...form.register('end.dateTime')} />
      <Button type="submit">Lưu</Button>
    </form>
  );
}
```

### 6.3) Assistant (Gemini)
- Hiểu lệnh tự nhiên -> `POST /assistant/interpret`.
- Tóm tắt events -> `POST /assistant/summarize`.
- Soạn nội dung -> `POST /assistant/compose`.

```tsx
'use client';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Input } from '@/components/ui';

export function PromptBox() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const onSubmit = async () => {
    const data = await apiFetch(`/assistant/interpret`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
    setResult(data);
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hãy yêu cầu..." />
        <Button onClick={onSubmit}>Gửi</Button>
      </div>
      <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
```

### 6.4) Gợi ý slot & đặt lịch
- Parse intent từ interpret -> gọi `POST /calendar/availability`.
- Render danh sách slot -> nút chọn -> gọi `POST /calendar/events`.

## 7) Realtime cập nhật UI
- Kết nối `NEXT_PUBLIC_WS_URL`.
- Khi backend nhận webhook từ Google Calendar, push sự kiện qua WS (ví dụ: `event.updated`), FE cập nhật store/UI.

## 8) Pagination & Idempotency
- Khi gọi `GET /calendar/events`, sử dụng `pageToken` nếu có để tải thêm.
- Khi tạo event, có thể gửi header `Idempotency-Key` (tạo UUID) để tránh trùng khi retry.

## 9) Xử lý lỗi & UX
- Bắt mọi lỗi từ `apiFetch` và hiển thị toast/dialog (shadcn/ui `useToast`).
- Mapping mã lỗi backend (400/401/403/404/409/429/500) sang thông báo thân thiện.
- Với 401: redirect về trang đăng nhập/khởi tạo OAuth.

## 10) Mẫu UI shadcn/ui gợi ý
- Nút: `@/components/ui/button`
- Input: `@/components/ui/input`
- Textarea: `@/components/ui/textarea`
- Dialog/Drawer: confirm tạo/sửa/xoá
- DataTable: liệt kê events (nếu cần)

## 11) Tích hợp Slack từ FE (tuỳ chọn)
- Hiển thị trạng thái kết nối Slack (đã cài app): gọi `/auth/me` để biết `slackConnected`.
- Nút "Kết nối Slack" -> redirect `NEXT_PUBLIC_SLACK_AUTH_URL`.
- Không cần FE gửi message thẳng tới Slack; việc gửi do backend đảm nhiệm (chat.postMessage). FE chỉ hiển thị kết quả.

## 12) i18n & Timezone
- Sử dụng `Intl.DateTimeFormat` hoặc `dayjs`/`date-fns` để format theo locale.
- Cho phép người dùng chọn timezone, mặc định theo trình duyệt.

## 13) Bảo mật
- Không lưu tokens nhạy cảm trên FE.
- Sử dụng `credentials: 'include'` để gửi cookie phiên an toàn (httpOnly, secure) do backend quản lý.
- CSRF: nếu backend yêu cầu, gắn header CSRF phù hợp.

## 14) Checklists
- **Cấu hình môi trường**
  - Thiết lập `.env.local` với `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_GOOGLE_AUTH_URL`, `NEXT_PUBLIC_SLACK_AUTH_URL`, `NEXT_PUBLIC_WS_URL`.
  - Bật Tailwind + shadcn/ui trong `client/`.
- **Luồng xác thực**
  - Nút redirect OAuth Google/Slack.
  - Sau callback, FE load `/auth/me` để hiển thị user.
- **Lịch & Sự kiện**
  - Tải calendars + events theo khoảng thời gian.
  - Tạo/sửa/xoá event với form chuẩn.
- **Assistant**
  - Gọi `/assistant/interpret` từ PromptBox, hiển thị kết quả, hỗ trợ tạo event từ intent.
- **Realtime**
  - Kết nối WS và cập nhật khi có `event.updated`.
- **Lỗi & Trải nghiệm**
  - Toast lỗi, loading states, empty states.

