'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { X, Loader2, MapPin, Bell } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { eventFormSchema, type EventFormData } from './event-form.schema';
import { useCreateEvent } from '@/hook/event/use-create-event';
import { useUpdateEvent } from '@/hook/event/use-update-event';
import type { Event } from '@/interface/event.interface';
import { TimeRangeField } from './fields/TimeRangeField';
import { AllDayField } from './fields/AllDayField';
import { DescriptionField } from './fields/DescriptionField';
import { LocationField } from './fields/LocationField';
import { ColorField } from './fields/ColorField';
import { VisibilityField } from './fields/VisibilityField';
import { RecurrenceField } from './fields/RecurrenceField';
import { ConferenceField } from './fields/ConferenceField';
import { RemindersField } from './fields/RemindersField';
import { CalendarField } from './fields/CalendarField';

interface EventFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  event?: Event;
  defaultCalendarId?: string;
  defaultStartTime?: Date;
  defaultEndTime?: Date;
}

export function EventFormModal({
  open,
  onOpenChange,
  mode,
  event,
  defaultCalendarId = '',
  defaultStartTime,
  defaultEndTime,
}: EventFormModalProps) {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema) as any,
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      calendar_id: defaultCalendarId || '',
      title: '',
      description: '',
      start_time: defaultStartTime ? format(defaultStartTime, "yyyy-MM-dd'T'HH:mm") : '',
      end_time: defaultEndTime ? format(defaultEndTime, "yyyy-MM-dd'T'HH:mm") : '',
      location: '',
      is_all_day: false,
      color: 'blue',
      recurrence_rule: undefined,
      attendees: [],
      reminders: [{ method: 'popup', minutes: 30 }],
      visibility: 'default',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && event && open) {
      form.reset({
        calendar_id: event.calendar_id,
        title: event.title,
        description: event.description || '',
        start_time: format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm"),
        end_time: format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm"),
        location: event.location || '',
        is_all_day: event.is_all_day || false,
        color: (event.color as any) || 'blue',
        recurrence_rule: event.recurrence_rule || undefined,
        attendees: event.attendees || [],
        conference_data: event.conference_data,
        reminders: event.reminders || [{ method: 'popup', minutes: 30 }],
        visibility: event.visibility || 'default',
      });
    }
  }, [mode, event, open, form]);

  const onSubmit = async (data: EventFormData) => {
    try {
      console.log('Form submission started:', { mode, data });
      
      // Validate calendar_id
      if (!data.calendar_id) {
        toast.error('Please select a calendar');
        return;
      }

      const cleanedData = {
        ...data,
        description: data.description?.trim() || undefined,
        location: data.location?.trim() || undefined,
        recurrence_rule: data.recurrence_rule?.trim() || undefined,
        conference_data: data.conference_data?.url ? data.conference_data : undefined,
      };

      console.log('Cleaned data:', cleanedData);

      if (mode === 'create') {
        const result = await createEvent.mutateAsync(cleanedData);
        console.log('Event created:', result);
        toast.success('Event created successfully!');
      } else if (mode === 'edit' && event) {
        const result = await updateEvent.mutateAsync({ id: event.id, data: cleanedData });
        console.log('Event updated:', result);
        toast.success('Event updated successfully!');
      }
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error('Event submission error:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      
      const errorMessage = error?.response?.data?.message || error?.message;
      
      if (errorMessage === 'error.event_duration_too_long') {
        toast.error('Event duration cannot exceed 24 hours. Please adjust the time range or use recurring events.');
      } else if (errorMessage === 'error.event_invalid_recurrence_format') {
        toast.error('Invalid recurrence rule format. Please check the recurrence settings.');
      } else if (errorMessage === 'error.event_recurrence_missing_freq') {
        toast.error('Recurrence rule is missing frequency. Please select a valid recurrence pattern.');
      } else if (errorMessage === 'error.event_invalid_recurrence_freq') {
        toast.error('Invalid recurrence frequency. Please select a valid option.');
      } else if (errorMessage?.includes('recurrence')) {
        toast.error('Invalid recurrence settings: ' + errorMessage);
      } else if (errorMessage?.includes('duration')) {
        toast.error(errorMessage);
      } else if (errorMessage?.includes('calendar')) {
        toast.error(errorMessage);
      } else {
        toast.error(mode === 'create' ? 'Failed to create event. Please check all fields.' : 'Failed to update event');
      }
    }
  };

  const [attendeeEmail, setAttendeeEmail] = useState('');

  const attendees = form.watch('attendees') || [];

  const addAttendee = () => {
    if (!attendeeEmail || !attendeeEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    if (attendees.some(a => a.email === attendeeEmail)) {
      toast.error('Email already exists');
      return;
    }
    const newAttendee = {
      email: attendeeEmail,
      response_status: 'needsAction' as const,
      is_optional: false,
      is_organizer: false,
    };
    form.setValue('attendees', [...attendees, newAttendee]);
    setAttendeeEmail('');
  };

  const removeAttendee = (index: number) => {
    form.setValue('attendees', attendees.filter((_, i) => i !== index));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative z-10 w-full h-full">
        <div className="w-full h-full bg-background animate-in zoom-in-95 fade-in duration-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full w-full">
              <div className="flex items-center justify-between px-6 py-4 border-b bg-background flex-shrink-0">
                <div className="flex items-center gap-3 flex-1 max-w-3xl">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Add title"
                            className="border-0 border-b-1 rounded-none border-black text-xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-3"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    type="submit"
                    size="default"
                    disabled={createEvent.isPending || updateEvent.isPending}
                  >
                    {(createEvent.isPending || updateEvent.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {mode === 'create' ? 'Creating...' : 'Saving...'}
                      </>
                    ) : (
                      mode === 'create' ? 'Create' : 'Save'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChange(false)}
                    className="h-10 w-10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex justify-center bg-muted/30 min-h-0 max-w-7xl">
                <div className="w-full flex bg-background">
                  <div className="flex-1 overflow-y-auto min-w-0">
                    <div className="w-full h-full">
                      <div className="px-6 py-4 space-y-0">
                          <div className="space-y-2 pb-2 border-b border-border/40">
                            <TimeRangeField form={form} />
                            <div className="pl-8 pb-2">
                              <AllDayField form={form} />
                            </div>
                          </div>

                          <CalendarField form={form} />

                          <RecurrenceField form={form} />

                          <ConferenceField form={form} />

                          <div className="flex items-center gap-3 py-3 border-b border-border/40">
                            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <LocationField form={form} />
                          </div>

                          <div className="py-3 border-b border-border/40">
                            <div className="flex items-start gap-3">
                              <Bell className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-2" />
                              <RemindersField form={form} />
                            </div>
                          </div>

                          <div className="py-3 border-b border-border/40">
                            <div className="flex items-start gap-3">
                              <div className="h-5 w-5 flex-shrink-0 mt-2">
                                <div className="h-4 w-4 rounded-full bg-primary"></div>
                              </div>
                              <div className="flex-1 space-y-3">
                                <ColorField form={form} />
                                <VisibilityField form={form} />
                              </div>
                            </div>
                          </div>

                          <div className="py-3">
                            <div className="flex items-start gap-3">
                              <div className="h-5 w-5 flex-shrink-0 mt-2">
                                <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <DescriptionField form={form} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  <div className="w-96 border-l overflow-y-auto flex-shrink-0">
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-base font-semibold mb-4">Guests</h3>
                        <div className="space-y-2">
                          <Input
                            type="email"
                            placeholder="Add guests"
                            value={attendeeEmail}
                            onChange={(e) => setAttendeeEmail(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addAttendee();
                              }
                            }}
                            className="h-10"
                          />
                          {attendees.length > 0 && (
                            <div className="space-y-1 mt-4">
                              {attendees.map((attendee, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted text-sm group"
                                >
                                  <span className="truncate">{attendee.email}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100"
                                    onClick={() => removeAttendee(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t space-y-3">
                        <h4 className="text-sm font-semibold">Guest permissions</h4>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Modify event</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Invite others</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>See guest list</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
