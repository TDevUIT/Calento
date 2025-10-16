"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock, Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { vi } from "date-fns/locale";
import { useUpcomingEvents } from "@/hook/use-upcoming-events";

interface UpcomingEventsProps {
  maxEvents?: number;
}

export function UpcomingEvents({ maxEvents = 5 }: UpcomingEventsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { events: upcomingEvents, isLoading, isError } = useUpcomingEvents({ 
    maxEvents,
    enabled: true
  });

  const getTimeDisplay = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isToday(start)) {
      return `Hôm nay ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
    } else if (isTomorrow(start)) {
      return `Ngày mai ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
    } else {
      return `${format(start, 'dd/MM HH:mm', { locale: vi })} - ${format(end, 'HH:mm')}`;
    }
  };

  const getTimeUntilEvent = (startTime: string) => {
    const now = new Date();
    const eventTime = new Date(startTime);
    const diffInMinutes = Math.floor((eventTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút nữa`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} giờ nữa`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days} ngày nữa`;
    }
  };

  const nextEvent = upcomingEvents[0];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 text-sm font-medium hover:bg-accent/50 transition-colors max-w-64 lg:max-w-80"
        >
          <Clock className="h-4 w-4" />
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-pulse h-4 w-4 bg-muted rounded"></div>
              <span className="text-muted-foreground">Đang tải...</span>
            </div>
          ) : nextEvent ? (
            <div className="flex items-center gap-2">
              <span className="truncate max-w-24 sm:max-w-32 lg:max-w-40">
                {nextEvent.title}
              </span>
              <Badge variant="secondary" className="text-xs">
                {getTimeUntilEvent(nextEvent.start_time)}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground">Không có sự kiện</span>
          )}
          <ChevronRight className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 sm:w-96 p-0 !z-[10000]" 
        align="start" 
        sideOffset={8}
        style={{ zIndex: 10000 }}
        avoidCollisions={true}
        collisionPadding={8}
      >
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Sự kiện sắp tới
          </h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm">Đang tải sự kiện...</p>
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Không thể tải sự kiện</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="p-2 space-y-2">
              {upcomingEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="border-l-4 hover:bg-accent/50 transition-colors cursor-pointer hover:shadow-sm" 
                  style={{ borderLeftColor: event.color || '#3b82f6' }}
                  onClick={() => {
                    console.log('Navigate to event:', event.id);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">
                          {event.title}
                        </h4>
                        <Badge variant="outline" className="text-xs ml-2">
                          {getTimeUntilEvent(event.start_time)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{getTimeDisplay(event.start_time, event.end_time)}</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          {event.attendees && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{event.attendees} người tham gia</span>
                            </div>
                          )}
                          
                          {event.creator?.name && (
                            <span className="text-xs">
                              bởi {event.creator.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Không có sự kiện nào trong 7 ngày tới</p>
            </div>
          )}
        </div>
        
        {upcomingEvents.length > 0 && (
          <div className="p-3 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center text-xs"
              onClick={() => {
                setIsOpen(false);
                // Navigate to calendar
                console.log("Navigate to calendar");
              }}
            >
              Xem tất cả trong lịch
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
