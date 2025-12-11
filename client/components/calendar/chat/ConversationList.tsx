'use client';

import { Trash2, Plus, Search, Clock, Sparkles, MessagesSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ConversationListItem } from '@/interface';
import { isToday, isYesterday, format } from 'date-fns';
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const getTimeDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const renderGroup = (title: string, items: ConversationListItem[], icon: React.ReactNode) => {
    if (items.length === 0) return null;

    return (
      <div key={title} className="mb-2 w-full">
        <div className="px-4 py-2 flex items-center gap-2">
          <div className="text-gray-400">{icon}</div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-2" />
        </div>
        <div className="space-y-0.5 px-2">
          {items.map((conv) => (
            <div
              key={conv.id}
              className={`
                group relative p-3 rounded-xl cursor-pointer transition-all duration-200 ease-out
                ${activeConversationId === conv.id
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 shadow-sm'
                  : 'hover:bg-gray-50/80 border border-transparent hover:border-gray-100'
                }
              `}
              onClick={() => onSelectConversation(conv.id)}
              onMouseEnter={() => setHoveredId(conv.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate mb-1.5 transition-colors ${activeConversationId === conv.id ? 'text-blue-900' : 'text-gray-800'
                    }`}>
                    {conv.preview || 'New conversation'}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${activeConversationId === conv.id ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                      {getTimeDisplay(conv.updated_at)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-xs text-gray-400">
                      {conv.message_count} {conv.message_count === 1 ? 'message' : 'messages'}
                    </span>
                  </div>
                </div>

                <div className={`
                  transition-all duration-200
                  ${hoveredId === conv.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
                `}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-red-50 hover:text-red-600 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {activeConversationId === conv.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50/50 to-white">
      <div className="p-4 space-y-3 border-b border-gray-100/80 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <Button
          onClick={onNewConversation}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 group"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
          New Conversation
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 h-9 text-sm bg-gray-50/80 border-gray-200/80 focus:bg-white focus:border-blue-300 transition-all rounded-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {conversations.length > 0 && (
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span className="flex items-center gap-1.5">
              <MessagesSquare className="h-3.5 w-3.5" />
              {conversations.length} conversation{conversations.length !== 1 && 's'}
            </span>
            {searchQuery && filteredConversations.length !== conversations.length && (
              <span className="text-blue-600">
                {filteredConversations.length} result{filteredConversations.length !== 1 && 's'}
              </span>
            )}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="py-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="relative mx-auto mb-4 w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl rotate-6" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
                  {searchQuery ? (
                    <Search className="h-8 w-8 text-gray-400" />
                  ) : (
                    <Sparkles className="h-8 w-8 text-blue-500/70" />
                  )}
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1.5">
                {searchQuery ? 'No matches found' : 'Start a conversation'}
              </p>
              <p className="text-xs text-gray-500 mb-4 max-w-[180px] mx-auto">
                {searchQuery
                  ? `No conversations matching "${searchQuery}"`
                  : 'Ask Calento to help with your calendar'}
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNewConversation}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1.5" />
                  New Chat
                </Button>
              )}
            </div>
          ) : (
            <>
              {renderGroup('Today', groupedConversations.today, <Clock className="h-3.5 w-3.5" />)}
              {renderGroup('Yesterday', groupedConversations.yesterday, <Clock className="h-3.5 w-3.5" />)}
              {renderGroup('This Week', groupedConversations.thisWeek, <Clock className="h-3.5 w-3.5" />)}
              {renderGroup('Older', groupedConversations.older, <Clock className="h-3.5 w-3.5" />)}
            </>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Sparkles className="h-3 w-3" />
          <span>Powered by Calento AI</span>
        </div>
      </div>
    </div>
  );
};
