'use client';

import React, { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, MapPin, Loader2, Palette, Trash2 } from 'lucide-react';
import { useUpdateEvent } from '@/hook/event/use-update-event';
import { useEventById } from '@/hook/event/use-event-by-id';
import { toast } from 'sonner';
import type { Event } from '@/interface/event.interface';

const eventSchema = z.object({
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

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  onDelete?: () => void;
}

export function EditEventDialog({ open, onOpenChange, eventId, onDelete }: EditEventDialogProps) {
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('blue');
  
  const { mutate: updateEvent, isPending } = useUpdateEvent();
  const { data: eventResponse, isLoading: isLoadingEvent } = useEventById(eventId, open);
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      start_time: '09:00',
      end_date: format(new Date(), 'yyyy-MM-dd'),
      end_time: '10:00',
      location: '',
      is_all_day: false,
      color: 'blue',
    },
    mode: 'onChange',
  });

  // Populate form when event data loads
  useEffect(() => {
    if (eventResponse?.data && open) {
      const event = eventResponse.data;
      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);

      form.reset({
        title: event.title,
        description: event.description || '',
        start_date: format(startDate, 'yyyy-MM-dd'),
        start_time: format(startDate, 'HH:mm'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        end_time: format(endDate, 'HH:mm'),
        location: event.location || '',
        is_all_day: event.is_all_day,
        color: (event.color as any) || 'blue',
      });

      setIsAllDay(event.is_all_day);
      setSelectedColor((event.color as string) || 'blue');
    }
  }, [eventResponse, open, form]);

  const onSubmit = (data: EventFormData) => {
    // Combine date and time into ISO format
    const startDateTime = `${data.start_date}T${data.start_time}:00.000Z`;
    const endDateTime = `${data.end_date}T${data.end_time}:00.000Z`;

    updateEvent(
      {
        id: eventId,
        data: {
          title: data.title,
          description: data.description,
          start_time: startDateTime,
          end_time: endDateTime,
          location: data.location,
          is_all_day: data.is_all_day,
          color: data.color,
        },
      },
      {
        onSuccess: (response) => {
          toast.success('Event updated successfully!', {
            description: response.data.title,
          });
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error('Failed to update event', {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update event details and information
          </DialogDescription>
        </DialogHeader>

        {isLoadingEvent ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
        )}

        <DialogFooter className="gap-2">
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isPending || isLoadingEvent}
              className="mr-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPending || isLoadingEvent}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending || isLoadingEvent}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Updating...' : 'Update Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
