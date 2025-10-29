'use client';

import { MessageSquare, Trash2, Plus, Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ConversationListItem } from '@/interface/ai.interface';
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';
import { useState, useMemo } from 'react';

interface ConversationListProps {
  conversations: ConversationListItem[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
}

export const ConversationList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter(conv => 
      conv.preview?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const groupedConversations = useMemo(() => {
    const groups: Record<string, ConversationListItem[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    filteredConversations.forEach(conv => {
      const date = new Date(conv.updated_at);
      if (isToday(date)) {
        groups.today.push(conv);
      } else if (isYesterday(date)) {
        groups.yesterday.push(conv);
      } else if (Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        groups.thisWeek.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  }, [filteredConversations]);

  const renderGroup = (title: string, items: ConversationListItem[]) => {
    if (items.length === 0) return null;

    return (
      <div key={title} className="mb-4">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        </div>
        <div className="space-y-1">
          {items.map((conv) => (
            <div
              key={conv.id}
              className={`
                group relative mx-2 p-3 rounded-lg cursor-pointer transition-all
                ${
                  activeConversationId === conv.id
                    ? 'bg-blue-50 border border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }
              `}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${
                      activeConversationId === conv.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conv.preview || 'New conversation'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}</span>
                    <span className="text-gray-400">•</span>
                    <span>{conv.message_count} messages</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      <div className="p-3 border-b space-y-3">
        <Button
          onClick={onNewConversation}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
              <p className="text-xs text-gray-500">
                {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
              </p>
            </div>
          ) : (
            <>
              {renderGroup('Today', groupedConversations.today)}
              {renderGroup('Yesterday', groupedConversations.yesterday)}
              {renderGroup('This Week', groupedConversations.thisWeek)}
              {renderGroup('Older', groupedConversations.older)}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
