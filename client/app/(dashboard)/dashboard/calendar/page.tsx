'use client';

import CalendarPane from '@/components/calendar/views/CalendarPane';
import ChatPane from '@/components/calendar/chat/ChatPane';

export default function Page() {
  return (
    <div className='flex flex-row h-[calc(100vh-3.5rem)] -ml-2 -mb-10 overflow-hidden'>
      <div className='flex-1 min-w-0 overflow-hidden'>
        <CalendarPane />
      </div>
      <ChatPane />
    </div>
  );
}
