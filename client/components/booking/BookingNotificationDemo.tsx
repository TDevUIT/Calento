"use client";

import { Bell, Calendar, Clock, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/radix-dropdown-menu";
import { useBookingNotifications } from "@/hook/booking/use-booking-notifications";
import { BookingNotificationContainer } from "./BookingNotification";

export function BookingNotificationDemo() {
  const {
    notifications,
    unreadCount,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    simulateBookingEvent,
  } = useBookingNotifications();

  return (
    <>
      {/* Notification Bell Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between p-2">
            <h4 className="font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="p-3 cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className={`p-1 rounded ${
                      notification.type === 'new_booking' ? 'bg-green-100 text-green-600' :
                      notification.type === 'booking_cancelled' ? 'bg-red-100 text-red-600' :
                      notification.type === 'booking_rescheduled' ? 'bg-blue-100 text-blue-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {notification.type === 'new_booking' ? <Calendar className="h-3 w-3" /> :
                       notification.type === 'booking_cancelled' ? <X className="h-3 w-3" /> :
                       notification.type === 'booking_rescheduled' ? <Clock className="h-3 w-3" /> :
                       <AlertCircle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.booking.booker_name}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
          
          {notifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearAll} className="text-red-600 justify-center">
                Clear all notifications
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Demo Controls Card */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Notification Demo</CardTitle>
          <CardDescription>
            Test different types of booking notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateBookingEvent('new_booking')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              New Booking
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateBookingEvent('booking_cancelled')}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelled
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateBookingEvent('booking_rescheduled')}
            >
              <Clock className="mr-2 h-4 w-4" />
              Rescheduled
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateBookingEvent('booking_reminder')}
            >
              <Bell className="mr-2 h-4 w-4" />
              Reminder
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Container (Toast-style) */}
      <BookingNotificationContainer
        notifications={notifications.filter(n => !n.read)}
        onDismiss={removeNotification}
        onMarkAsRead={markAsRead}
        maxVisible={3}
      />
    </>
  );
}
