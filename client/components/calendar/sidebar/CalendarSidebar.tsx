'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, User, Briefcase, Users } from 'lucide-react';
import { MiniCalendar } from '../MiniCalendar';
import { CalendarItem } from '../shared/types';
import { SidebarHeader } from './SidebarHeader';
import { CalendarList } from './CalendarList';
import { EventsList } from './EventsList';

interface CalendarSidebarProps {
  onDateSelect?: (date: Date) => void;
  onCreateEvent?: () => void;
  onClose?: () => void;
  selectedDate?: Date;
}

export function CalendarSidebar({ 
  onDateSelect, 
  onCreateEvent, 
  onClose, 
  selectedDate 
}: CalendarSidebarProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'events'>('calendar');
  const [searchQuery, setSearchQuery] = useState('');

  const eventsCount = {
    '2024-12-12': 3,
    '2024-12-15': 2,
    '2024-12-18': 1,
    '2024-12-20': 4,
  };

  const [calendars, setCalendars] = useState<CalendarItem[]>([
    { id: 'personal', name: 'Personal', color: 'bg-blue-500', icon: User, visible: true, count: 12 },
    { id: 'work', name: 'Work', color: 'bg-green-500', icon: Briefcase, visible: true, count: 8 },
    { id: 'team', name: 'Team Events', color: 'bg-purple-500', icon: Users, visible: false, count: 5 },
  ]);

  const toggleCalendar = (id: string) => {
    setCalendars(prev => 
      prev.map(cal => 
        cal.id === id ? { ...cal, visible: !cal.visible } : cal
      )
    );
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-xl border-l overflow-hidden">
      <SidebarHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {activeTab === 'calendar' ? (
          <div className="p-4 space-y-4">
            <Button 
              onClick={onCreateEvent} 
              className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Create Event</span>
              <Sparkles className="h-3.5 w-3.5 ml-auto" />
            </Button>

            <MiniCalendar
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
              eventsCount={eventsCount}
            />

            <CalendarList calendars={calendars} onToggle={toggleCalendar} />
          </div>
        ) : (
          <EventsList />
        )}
      </div>
    </div>
  );
}
