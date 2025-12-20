"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { ChatBox } from "@/components/calendar/chat";

export function ChatButton() {
  const [showChatBox, setShowChatBox] = useState(false);

  return (
    <>
      {showChatBox && (
        <div className="fixed bottom-5 right-5 z-[1100] flex w-[90vw] max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 h-[60vh] max-h-[620px]">
          <ChatBox variant="popup" onClose={() => setShowChatBox(false)} />
        </div>
      )}

      {!showChatBox && (
        <button
          onClick={() => setShowChatBox(true)}
          className="fixed bottom-5 right-5 z-[1100] inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:-translate-y-0.5 active:translate-y-0"
          aria-label="Open AI Chat Assistant"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 animate-pulse" />
        </button>
      )}
    </>
  );
}
