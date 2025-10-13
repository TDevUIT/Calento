/**
 * @deprecated This component is deprecated. Use CreateEventDialog instead.
 * 
 * This old Dialog-based event form will be removed in future versions.
 * Please migrate to CreateEventDialog which uses the new Sheet-based UI
 * consistent with EditEventDialog.
 * 
 * @example
 * // Instead of:
 * // <EventDialog open={open} onOpenChange={setOpen} />
 * 
 * // Use:
 * // <CreateEventDialog open={open} onOpenChange={setOpen} />
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, MapPin, Users, Bell, Repeat, Video, Loader2, Palette } from 'lucide-react';
import { useCreateEvent } from '@/hook/event';
import { useCalendars } from '@/hook/calendar';
import { useApiData } from '@/hook/use-api-data';
import { toast } from 'sonner';
import type { Calendar as CalendarType } from '@/interface/calendar.interface';

const eventSchema = z.object({
  calendar_id: z.string().min(1, 'Calendar is required'),
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_date: z.string().min(1, 'End date is required'),
  end_time: z.string().min(1, 'End time is required'),
  location: z.string().optional(),
  is_all_day: z.boolean(),
  color: z.enum(['blue', 'green', 'pink', 'purple', 'orange', 'red']).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
  defaultTime?: string;
}

export function EventDialog({ open, onOpenChange, defaultDate, defaultTime }: EventDialogProps) {
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('blue');
  const { mutate: createEvent, isPending } = useCreateEvent();
  
  // Fetch user's calendars
  const calendarsQuery = useCalendars({ page: 1, limit: 50 });
  const { items: calendars = [] } = useApiData<CalendarType>(calendarsQuery);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      calendar_id: '',
      title: '',
      description: '',
      start_date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      start_time: defaultTime || '09:00',
      end_date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      end_time: '10:00',
      location: '',
      is_all_day: false,
      color: 'blue',
    },
    mode: 'onChange', // Enable real-time validation
  });

  // Set default calendar when calendars load
  useEffect(() => {
    if (calendars.length > 0 && !form.getValues('calendar_id')) {
      const primaryCalendar = calendars.find(cal => cal.is_primary);
      const defaultCalendarId = primaryCalendar?.id || calendars[0].id;
      console.log('Setting default calendar:', defaultCalendarId);
      form.setValue('calendar_id', defaultCalendarId, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [calendars, form]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        calendar_id: calendars.find(cal => cal.is_primary)?.id || calendars[0]?.id || '',
        title: '',
        description: '',
        start_date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        start_time: defaultTime || '09:00',
        end_date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        end_time: '10:00',
        location: '',
        is_all_day: false,
        color: 'blue',
      });
      setIsAllDay(false);
      setSelectedColor('blue');
    }
  }, [open, defaultDate, defaultTime, calendars, form]);

  const onSubmit = (data: EventFormData) => {
    // Combine date and time into ISO format
    const startDateTime = `${data.start_date}T${data.start_time}:00.000Z`;
    const endDateTime = `${data.end_date}T${data.end_time}:00.000Z`;

    createEvent(
      {
        calendar_id: data.calendar_id,
        title: data.title,
        description: data.description,
        start_time: startDateTime,
        end_time: endDateTime,
        location: data.location,
        is_all_day: data.is_all_day,
      },
      {
        onSuccess: (response) => {
          toast.success('Event created successfully!', {
            description: response.data.title,
          });
          onOpenChange(false);
          form.reset();
        },
        onError: (error) => {
          toast.error('Failed to create event', {
            description: error.message,
          });
        },
      }
    );
  };

  // Debug info
  console.log('Calendars loaded:', calendars.length);
  console.log('Selected calendar_id:', form.watch('calendar_id'));
  console.log('Calendars query loading:', calendarsQuery.isLoading);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Add a new event to your calendar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="calendar">Calendar *</Label>
            {calendarsQuery.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading calendars...
              </div>
            ) : calendars.length === 0 ? (
              <p className="text-sm text-red-600">
                No calendars found. Please create a calendar first.
              </p>
            ) : (
              <Select
                value={form.watch('calendar_id') || undefined}
                onValueChange={(value) => {
                  console.log('Calendar selected:', value);
                  form.setValue('calendar_id', value, { 
                    shouldValidate: true,
                    shouldDirty: true 
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a calendar" />
                </SelectTrigger>
                <SelectContent>
                  {calendars.map((calendar) => (
                    <SelectItem key={calendar.id} value={calendar.id}>
                      <div className="flex items-center gap-2">
                        <span>{calendar.name}</span>
                        {calendar.is_primary && (
                          <span className="text-xs text-blue-600 font-medium">(Primary)</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {form.formState.errors.calendar_id && (
              <p className="text-sm text-red-600">{form.formState.errors.calendar_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Team Meeting, Birthday Party..."
              className="text-base"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="start-date"
                  type="date"
                  {...form.register('start_date')}
                  className="pl-9"
                />
              </div>
              {form.formState.errors.start_date && (
                <p className="text-sm text-red-600">{form.formState.errors.start_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end-date"
                  type="date"
                  {...form.register('end_date')}
                  className="pl-9"
                />
              </div>
              {form.formState.errors.end_date && (
                <p className="text-sm text-red-600">{form.formState.errors.end_date.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="all-day" className="cursor-pointer">All day event</Label>
            <Switch
              id="all-day"
              checked={isAllDay}
              onCheckedChange={(checked) => {
                setIsAllDay(checked);
                form.setValue('is_all_day', checked);
              }}
            />
          </div>

          {!isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start-time"
                    type="time"
                    {...form.register('start_time')}
                    className="pl-9"
                  />
                </div>
                {form.formState.errors.start_time && (
                  <p className="text-sm text-red-600">{form.formState.errors.start_time.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end-time"
                    type="time"
                    {...form.register('end_time')}
                    className="pl-9"
                  />
                </div>
                {form.formState.errors.end_time && (
                  <p className="text-sm text-red-600">{form.formState.errors.end_time.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Add event description, agenda, or notes..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                {...form.register('location')}
                placeholder="Add location or meeting link"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Video Conference</Label>
            <Select>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <SelectValue placeholder="Add video conference" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="google-meet">Google Meet</SelectItem>
                <SelectItem value="zoom">Zoom Meeting</SelectItem>
                <SelectItem value="teams">Microsoft Teams</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees">Attendees</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="attendees"
                placeholder="Add guests (email addresses)"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Repeat</Label>
            <Select>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  <SelectValue placeholder="Does not repeat" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reminder</Label>
            <Select defaultValue="15min">
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No reminder</SelectItem>
                <SelectItem value="0">At time of event</SelectItem>
                <SelectItem value="15min">15 minutes before</SelectItem>
                <SelectItem value="30min">30 minutes before</SelectItem>
                <SelectItem value="1hour">1 hour before</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Event Color</Label>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {['blue', 'green', 'pink', 'purple', 'orange', 'red'].map((color) => {
                  const colorClasses = {
                    blue: 'bg-blue-500 hover:bg-blue-600',
                    green: 'bg-green-500 hover:bg-green-600',
                    pink: 'bg-pink-500 hover:bg-pink-600',
                    purple: 'bg-purple-500 hover:bg-purple-600',
                    orange: 'bg-orange-500 hover:bg-orange-600',
                    red: 'bg-red-500 hover:bg-red-600',
                  };
                  
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        form.setValue('color', color as any);
                      }}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-transparent hover:border-gray-300'
                      } ${colorClasses[color as keyof typeof colorClasses]}`}
                      aria-label={`Select ${color}`}
                      title={color.charAt(0).toUpperCase() + color.slice(1)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending || calendars.length === 0}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Creating...' : 'Create Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
