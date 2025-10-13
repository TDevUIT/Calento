'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Calendar } from 'lucide-react';
import { SidebarHeader } from './SidebarHeader';
import { CalendarListWithAPI } from './CalendarListWithAPI';
import { EventsList } from './EventsList';
import { CreateCalendarDialog } from '../dialogs/CreateCalendarDialog';

interface CalendarSidebarProps {
  onDateSelect?: (date: Date) => void;
  onCreateEvent?: () => void;
  onClose?: () => void;
  selectedDate?: Date;
  visibleCalendarIds?: Set<string>;
  onVisibleCalendarIdsChange?: (ids: Set<string>) => void;
}

export function CalendarSidebar({ 
 
  onCreateEvent, 
  onClose, 
  visibleCalendarIds,
  onVisibleCalendarIdsChange
}: CalendarSidebarProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'events'>('calendar');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateCalendarDialog, setShowCreateCalendarDialog] = useState(false);

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
          <div className="p-4 space-y-3">
            <Button 
              onClick={onCreateEvent} 
              className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Create Event</span>
              <Sparkles className="h-3.5 w-3.5 ml-auto" />
            </Button>

            <Button 
              onClick={() => setShowCreateCalendarDialog(true)} 
              variant="outline"
              className="w-full gap-2 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Create Calendar</span>
              <Plus className="h-3.5 w-3.5 ml-auto" />
            </Button>

            <CalendarListWithAPI 
              onCreateCalendar={() => setShowCreateCalendarDialog(true)}
              visibleCalendarIds={visibleCalendarIds}
              onVisibleCalendarIdsChange={onVisibleCalendarIdsChange}
            />
          </div>
        ) : (
          <EventsList />
        )}
      </div>

      <CreateCalendarDialog 
        open={showCreateCalendarDialog}
        onOpenChange={setShowCreateCalendarDialog}
      />
    </div>
  );
}
