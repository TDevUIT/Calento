"use client";

import { useEffect, useState } from "react";
import { Bell, Calendar, Clock, User, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

export interface BookingNotificationData {
  id: string;
  type: 'new_booking' | 'booking_cancelled' | 'booking_rescheduled' | 'booking_reminder';
  title: string;
  message: string;
  booking: {
    id: string;
    booker_name: string;
    booker_email: string;
    start_time: string;
    end_time: string;
    booking_link_title: string;
  };
  timestamp: string;
  read: boolean;
}

interface BookingNotificationProps {
  notification: BookingNotificationData;
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

export function BookingNotification({
  notification,
  onDismiss,
  onMarkAsRead,
}: BookingNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!notification.read) {
      onMarkAsRead?.(notification.id);
    }
  }, [notification.id, notification.read, onMarkAsRead]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'new_booking':
        return <Calendar className="h-5 w-5 text-green-600" />;
      case 'booking_cancelled':
        return <X className="h-5 w-5 text-red-600" />;
      case 'booking_rescheduled':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'booking_reminder':
        return <Bell className="h-5 w-5 text-orange-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBadgeColor = () => {
    switch (notification.type) {
      case 'new_booking':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'booking_cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'booking_rescheduled':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'booking_reminder':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = parseISO(dateTimeString);
    return format(date, 'MMM d, yyyy \'at\' h:mm a');
  };

  if (!isVisible) return null;

  return (
    <Card className={`transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    } ${!notification.read ? 'border-primary/50 shadow-md' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted/50">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-50 hover:opacity-100"
                onClick={handleDismiss}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {notification.message}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{notification.booking.booker_name}</span>
                <span>â€¢</span>
                <span>{notification.booking.booker_email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{notification.booking.booking_link_title}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDateTime(notification.booking.start_time)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <Badge className={`text-xs ${getBadgeColor()}`}>
                {notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              
              <span className="text-xs text-muted-foreground">
                {format(parseISO(notification.timestamp), 'h:mm a')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BookingNotificationContainerProps {
  notifications: BookingNotificationData[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  maxVisible?: number;
}

export function BookingNotificationContainer({
  notifications,
  onDismiss,
  onMarkAsRead,
  maxVisible = 5,
}: BookingNotificationContainerProps) {
  const visibleNotifications = notifications.slice(0, maxVisible);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <BookingNotification
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}
