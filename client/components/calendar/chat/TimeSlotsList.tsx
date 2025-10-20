'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Star, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
}

interface TimeSlotsListProps {
  slots: TimeSlot[];
  onBook?: (slot: TimeSlot) => void;
}

export const TimeSlotsList = ({ slots, onBook }: TimeSlotsListProps) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const groupedSlots = useMemo(() => {
    const groups: Record<string, TimeSlot[]> = {};
    
    slots.forEach(slot => {
      const date = new Date(slot.start).toLocaleDateString('en-US');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
    });

    return Object.entries(groups).map(([date, dateSlots]) => ({
      date,
      dateFormatted: new Date(dateSlots[0].start).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      slots: dateSlots
    }));
  }, [slots]);

  const bestSlot = useMemo(() => {
    return slots.find(slot => {
      const hour = new Date(slot.start).getHours();
      return (hour >= 9 && hour < 11) || (hour >= 14 && hour < 16);
    });
  }, [slots]);

  const displayedGroups = showAll ? groupedSlots : groupedSlots.slice(0, 1);
  const hasMore = groupedSlots.length > 1;

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isToday = (date: string) => {
    const today = new Date().toLocaleDateString('en-US');
    return date === today;
  };

  const isBestSlot = (slot: TimeSlot) => {
    return bestSlot && slot.start === bestSlot.start;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3.5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900">Available Time Slots</h4>
              <p className="text-xs text-gray-600">{slots.length} perfect times found</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white px-3 py-1">
            {slots.length} slots
          </Badge>
        </div>
      </div>

      {/* Best Time Suggestion */}
      {bestSlot && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Best Time: {formatTime(bestSlot.start)} - {formatTime(bestSlot.end)}
              </p>
              <p className="text-xs text-blue-700">Peak productivity hours for focused work</p>
            </div>
          </div>
        </div>
      )}

      {/* Slots List */}
      <div className="max-h-80 overflow-y-auto">
        {displayedGroups.map((group, groupIdx) => (
          <div key={group.date} className={groupIdx > 0 ? 'border-t border-gray-100' : ''}>
            {/* Date Header */}
            <div className="sticky top-0 bg-gray-50 px-4 py-2.5 border-b border-gray-100 z-10">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${isToday(group.date) ? 'bg-blue-600' : 'bg-gray-400'}`} />
                <span className="text-sm font-semibold text-gray-700">
                  {isToday(group.date) ? 'Today' : group.dateFormatted}
                </span>
                <span className="text-xs text-gray-500">â€¢ {group.slots.length} slots</span>
              </div>
            </div>

            {/* Slots for this date */}
            <div className="p-3 space-y-2">
              {group.slots.map((slot, slotIdx) => {
                const isBest = isBestSlot(slot);
                const isSelected = selectedSlot?.start === slot.start;

                return (
                  <div
                    key={slotIdx}
                    onClick={() => setSelectedSlot(slot)}
                    className={`
                      relative flex items-center justify-between p-4 rounded-lg 
                      transition-all cursor-pointer group
                      ${isSelected 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent'
                      }
                      ${isBest ? 'ring-2 ring-blue-200 ring-offset-1' : ''}
                    `}
                  >
                    {/* Best badge */}
                    {isBest && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-blue-600 text-white rounded-full px-2.5 py-1 text-[10px] font-bold flex items-center gap-1 shadow-md">
                          <Star className="h-2.5 w-2.5 fill-white" />
                          BEST
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 flex-1">
                      <div className={`
                        h-11 w-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                        ${isSelected ? 'bg-blue-600' : 'bg-white group-hover:bg-blue-100'}
                      `}>
                        <Clock className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-base font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </p>
                        <p className="text-sm text-gray-600">1 hour â€¢ Perfect for meetings</p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      className={`
                        text-sm px-4 transition-all
                        ${isSelected 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'opacity-0 group-hover:opacity-100'
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBook?.(slot);
                      }}
                    >
                      Book
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less */}
      {hasMore && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show {slots.length - displayedGroups[0].slots.length} More Slots
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
