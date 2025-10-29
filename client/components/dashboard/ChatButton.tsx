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
          className="fixed right-0 top-14 w-[500px] animate-in slide-in-from-right duration-300"
          style={{ height: 'calc(100vh - 3.5rem)', zIndex: 1000 }}
        >
          <ChatBox onClose={() => setShowChatBox(false)} />
        </div>
      )}

      {!showChatBox && (
        <button
          onClick={() => setShowChatBox(true)}
          className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group z-[1100]"
          aria-label="Open AI Chat Assistant"
        >
          <MessageSquare className="h-6 w-6 transition-transform group-hover:scale-110" />
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}
    </>
  );
}
