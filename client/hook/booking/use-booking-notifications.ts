import { useState, useEffect, useCallback } from 'react';
import { BookingNotificationData } from '@/components/booking/BookingNotification';

interface UseBookingNotificationsOptions {
  enableRealTime?: boolean;
  pollInterval?: number;
}
export function useBookingNotifications(options: UseBookingNotificationsOptions = {}) {
  const { enableRealTime = false, pollInterval = 30000 } = options;
  
  const [notifications, setNotifications] = useState<BookingNotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('booking-notifications');
    if (stored) {
      try {
        const parsedNotifications = JSON.parse(stored);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n: BookingNotificationData) => !n.read).length);
      } catch (error) {
        console.error('Failed to parse stored notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('booking-notifications', JSON.stringify(notifications));
      setUnreadCount(notifications.filter(n => !n.read).length);
    }
  }, [notifications]);

  // Mock real-time notifications (in real app, this would be WebSocket)
  useEffect(() => {
    if (!enableRealTime) return;

    const interval = setInterval(() => {
      // Randomly add new notifications (for demo purposes)
      if (Math.random() > 0.8) {
        const newNotification: BookingNotificationData = {
          id: Date.now().toString(),
          type: 'new_booking',
          title: 'New Booking Received',
          message: 'Someone just booked a meeting with you.',
          booking: {
            id: `booking-${Date.now()}`,
            booker_name: 'Demo User',
            booker_email: 'demo@example.com',
            start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            booking_link_title: '30 Min Meeting',
          },
          timestamp: new Date().toISOString(),
          read: false,
        };
        
        addNotification(newNotification);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [enableRealTime, pollInterval]);

  const addNotification = useCallback((notification: BookingNotificationData) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep only latest 50
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('booking-notifications');
  }, []);

  // Simulate booking events (for demo)
  const simulateBookingEvent = useCallback((type: BookingNotificationData['type']) => {
    const messages = {
      new_booking: 'Someone just booked a meeting with you.',
      booking_cancelled: 'A booking has been cancelled.',
      booking_rescheduled: 'A booking has been rescheduled.',
      booking_reminder: 'You have an upcoming meeting in 15 minutes.',
    };

    const titles = {
      new_booking: 'New Booking Received',
      booking_cancelled: 'Booking Cancelled',
      booking_rescheduled: 'Booking Rescheduled',
      booking_reminder: 'Meeting Reminder',
    };

    const notification: BookingNotificationData = {
      id: Date.now().toString(),
      type,
      title: titles[type],
      message: messages[type],
      booking: {
        id: `booking-${Date.now()}`,
        booker_name: 'Demo User',
        booker_email: 'demo@example.com',
        start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
        booking_link_title: '30 Min Meeting',
      },
      timestamp: new Date().toISOString(),
      read: false,
    };

    addNotification(notification);
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    simulateBookingEvent, // For demo purposes
  };
}
