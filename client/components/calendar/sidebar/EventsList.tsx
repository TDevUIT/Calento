'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Copy, BarChart3, MoreVertical } from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  priority: string;
  count: number;
}

interface EventsSectionProps {
  title: string;
  events: EventItem[];
  defaultExpanded?: boolean;
}

function EventsSection({ title, events, defaultExpanded = true }: EventsSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b">
      <div className="px-4 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-xs font-semibold text-gray-600 uppercase">{title}</span>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {expanded && (
        <div className="border-l-4 border-blue-600 bg-white">
          {events.map((event) => (
            <div 
              key={event.id}
              className="px-4 py-3 hover:bg-gray-50 transition-colors group flex items-center justify-between cursor-pointer border-b"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                <div className="text-xs text-gray-500 mt-1">{event.priority} priority</div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-3.5 w-3.5 text-gray-400" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <BarChart3 className="h-3.5 w-3.5 text-gray-400" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function EventsList() {
  const criticalEvents: EventItem[] = [
    { id: 1, title: 'High Priority Meeting', priority: 'High', count: 3 },
  ];

  const disabledEvents: EventItem[] = [
    { id: 2, title: 'Flexible Quick Meeting', priority: 'Medium', count: 1 },
    { id: 3, title: 'Quick Meeting', priority: 'Low', count: 0 },
  ];

  return (
    <div className="space-y-0">
      <EventsSection title="Critical" events={criticalEvents} />
      <EventsSection title="Disabled" events={disabledEvents} defaultExpanded={false} />
    </div>
  );
}
