'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, X, Filter } from 'lucide-react';

interface SidebarHeaderProps {
  activeTab: 'calendar' | 'events';
  onTabChange: (tab: 'calendar' | 'events') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose?: () => void;
}

export function SidebarHeader({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onClose,
}: SidebarHeaderProps) {
  return (
    <div className="flex-shrink-0 bg-white z-10 border-b">
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Tools</h2>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex border-b">
        <button
          onClick={() => onTabChange('calendar')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'calendar'
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Calendar
          {activeTab === 'calendar' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          onClick={() => onTabChange('events')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'events'
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Events
          {activeTab === 'events' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for something..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
