'use client';

import { useState } from 'react';
import { ConversationManager } from '@/components/calendar/chat';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIChatPage() {
  const router = useRouter();
  const [showManager, setShowManager] = useState(true);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Chat Assistant</h1>
              <p className="text-sm text-gray-600">Manage your conversations and chat history</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        {showManager ? (
          <ConversationManager onClose={() => setShowManager(false)} />
        ) : (
          <div className="text-center">
            <Button onClick={() => setShowManager(true)}>
              Open Conversation Manager
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
