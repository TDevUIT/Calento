'use client';

import { memo } from 'react';

import { useControllerStore } from '@/store/controller.store';
import { cn } from '@/lib/utils';
import { ChatBox } from '@/components/calendar/chat';
import ChatboxExpandButton from '@/components/calendar/chat/ChatboxExpandButton';

export const ChatPane = memo(function ChatPane() {
  const isChatboxExpanded = useControllerStore((state) => state.isChatboxExpanded);

  return (
    <div
      className={cn(
        'shrink-0 h-full overflow-hidden  bg-white border-l ',
        'transition-[width,max-width] duration-300 ease-in-out',
        isChatboxExpanded ? 'w-[28rem] max-w-[28rem]' : 'w-[2rem] max-w-[2rem]'
      )}
    >
      {isChatboxExpanded ? <ChatBox variant="panel" /> : <ChatboxExpandButton />}
    </div>
  );
});

export default ChatPane;
