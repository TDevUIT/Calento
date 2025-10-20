"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { ChatBox } from "@/components/calendar/chat";

export function ChatButton() {
  const [showChatBox, setShowChatBox] = useState(false);

  return (
    <>
      {showChatBox && (
        <div 
          className="fixed right-0 top-14 w-[440px] animate-in slide-in-from-right duration-300"
          style={{ height: 'calc(100vh - 3.5rem)', zIndex: 1000 }}
        >
          <ChatBox onClose={() => setShowChatBox(false)} />
        </div>
      )}

      {!showChatBox && (
        <button
          onClick={() => setShowChatBox(true)}
          className="fixed bottom-6 right-6 h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-[1100] group animate-in fade-in slide-in-from-bottom-4"
          aria-label="Open AI Chat Assistant"
        >
          <MessageSquare className="h-6 w-6 transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}
    </>
  );
}
