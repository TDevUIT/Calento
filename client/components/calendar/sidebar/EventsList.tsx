'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, Edit2, Globe, Lock, Eye, EyeOff, Repeat } from 'lucide-react';
import { useEvents } from '@/hook/event/use-events';
import { EditEventDialog } from '../dialogs/EditEventDialog';
import { Event, ExpandedEvent } from '@/interface/event.interface';
import { format } from 'date-fns';

interface VisibilitySectionConfig {
  title: string;
  visibility: 'public' | 'private' | 'confidential' | 'default';
  icon: React.ReactNode;
  borderColor: string;
  defaultExpanded: boolean;
}

interface EventsSectionByVisibilityProps {
  config: VisibilitySectionConfig;
  events: Event[];
  onEditEvent: (event: Event) => void;
  isLoading?: boolean;
}

function EventsSectionByVisibility({ config, events, onEditEvent, isLoading }: EventsSectionByVisibilityProps) {
  const [expanded, setExpanded] = useState(config.defaultExpanded);

  return (
    <div className="border-b">
      <div className="px-4 py-3 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="text-xs font-semibold text-gray-600 uppercase">{config.title}</span>
          <span className="text-xs text-gray-400">({events.length})</span>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {expanded && (
        <div className={`border-l-4 ${config.borderColor} bg-white`}>
          {isLoading ? (
            <div className="px-4 py-8 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : events.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No {config.title.toLowerCase()} events found
            </div>
          ) : (
            events.map((event) => {
              const visibility = event.visibility || 'default';
              const VisibilityIcon = 
                visibility === 'public' ? Globe :
                visibility === 'private' ? Lock :
                visibility === 'confidential' ? EyeOff :
                Eye;
              
              const visibilityColor = 
                visibility === 'public' ? 'text-green-600 bg-green-50' :
                visibility === 'private' ? 'text-blue-600 bg-blue-50' :
                visibility === 'confidential' ? 'text-red-600 bg-red-50' :
                'text-gray-600 bg-gray-50';
              
              const visibilityLabel = 
                visibility === 'public' ? 'Public' :
                visibility === 'private' ? 'Private' :
                visibility === 'confidential' ? 'Confidential' :
                'Default';
              
              const isRecurring = !!event.recurrence_rule;
              
              return (
                <div 
                  key={event.id}
                  onClick={() => onEditEvent(event)}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors group flex items-center justify-between cursor-pointer border-b"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm font-medium text-gray-900 truncate flex-1 flex items-center gap-1.5">
                        {event.title}
                        {isRecurring && (
                          <Repeat className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" />
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${visibilityColor}`}>
                        <VisibilityIcon className="h-3 w-3" />
                        {visibilityLabel}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(event.start_time), 'MMM dd, yyyy HH:mm')}
                      </span>
                      {isRecurring && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-xs font-medium">
                          <Repeat className="h-3 w-3" />
                          Recurring
                        </span>
                      )}
                    </div>
                    {event.location && (
                      <div className="text-xs text-gray-400 mt-0.5 truncate">{event.location}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(event);
                      }}
                    >
                      <Edit2 className="h-3.5 w-3.5 text-blue-600" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export function EventsList() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Fetch events from API
  const { data: eventsData, isLoading } = useEvents({ page: 1, limit: 100 });
  const apiEvents = eventsData?.data?.items || [];

  // Filter out expanded recurring instances, keep only parent events
  const filteredEvents = useMemo(() => {
    return apiEvents.filter((event) => {
      const expandedEvent = event as ExpandedEvent;
      // Keep event if it's NOT a recurring instance (i.e., it's a parent event)
      return !expandedEvent.is_recurring_instance && !expandedEvent.original_event_id;
    });
  }, [apiEvents]);

  // Define visibility sections configuration
  const visibilitySections: VisibilitySectionConfig[] = [
    {
      title: 'Public Events',
      visibility: 'public',
      icon: <Globe className="h-3.5 w-3.5 text-green-600" />,
      borderColor: 'border-green-600',
      defaultExpanded: true,
    },
    {
      title: 'Private Events',
      visibility: 'private',
      icon: <Lock className="h-3.5 w-3.5 text-blue-600" />,
      borderColor: 'border-blue-600',
      defaultExpanded: true,
    },
    {
      title: 'Confidential Events',
      visibility: 'confidential',
      icon: <EyeOff className="h-3.5 w-3.5 text-red-600" />,
      borderColor: 'border-red-600',
      defaultExpanded: true,
    },
    {
      title: 'Default Events',
      visibility: 'default',
      icon: <Eye className="h-3.5 w-3.5 text-gray-600" />,
      borderColor: 'border-gray-600',
      defaultExpanded: true,
    },
  ];

  // Group events by visibility
  const eventsByVisibility = useMemo(() => {
    const grouped: Record<string, Event[]> = {
      public: [],
      private: [],
      confidential: [],
      default: [],
    };

    filteredEvents.forEach((event) => {
      const visibility = event.visibility || 'default';
      if (grouped[visibility]) {
        grouped[visibility].push(event);
      }
    });

    return grouped;
  }, [filteredEvents]);

  const handleEditEvent = (event: Event) => {
    setSelectedEventId(event.id);
    setEditDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-0">
        {visibilitySections.map((config) => (
          <EventsSectionByVisibility
            key={config.visibility}
            config={config}
            events={eventsByVisibility[config.visibility] || []}
            onEditEvent={handleEditEvent}
            isLoading={isLoading}
          />
        ))}
      </div>

      {selectedEventId && (
        <EditEventDialog
          eventId={selectedEventId}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </>
  );
}
