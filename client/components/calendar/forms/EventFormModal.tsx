'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { format } from 'date-fns';
import { X, Loader2, MapPin, Bell, AlertTriangle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { eventFormSchema, type EventFormData } from './event-form.schema';
import type { Event } from '@/interface';
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
import { GuestsField } from './fields/GuestsField';
import { useCreateEvent, useUpdateEvent } from '@/hook';
import { useSendInvitations, useSendReminders } from '@/hook/invitations';

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
  const [mounted, setMounted] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const { mutate: sendInvitations } = useSendInvitations();
  const { mutate: sendReminders } = useSendReminders();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema) as Resolver<EventFormData>,
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
      color: '#3b82f6',
      recurrence_rule: undefined,
      attendees: [],
      reminders: [{ method: 'popup', minutes: 30 }],
      visibility: 'default',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && event && open) {
      const cleanConferenceData = event.conference_data?.url 
        ? event.conference_data 
        : undefined;
      
      const formData = {
        calendar_id: event.calendar_id,
        title: event.title,
        description: event.description || '',
        start_time: format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm"),
        end_time: format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm"),
        location: event.location || '',
        is_all_day: event.is_all_day || false,
        color: event.color || '#3b82f6',
        recurrence_rule: event.recurrence_rule || undefined,
        attendees: event.attendees || [],
        conference_data: cleanConferenceData,
        reminders: event.reminders || [{ method: 'popup', minutes: 30 }],
        visibility: event.visibility || 'default',
      };
      
      form.reset(formData);
    }
  }, [mode, event, open, form]);

  const onSubmit = async (data: EventFormData) => {
    try {
      if (!data.calendar_id) {
        toast.error('Please select a calendar');
        return;
      }

      const cleanedConferenceData = (data.conference_data?.url && data.conference_data?.type) 
        ? {
            type: data.conference_data.type,
            url: data.conference_data.url,
            id: data.conference_data.id,
            password: data.conference_data.password,
            phone: data.conference_data.phone,
            pin: data.conference_data.pin,
            notes: data.conference_data.notes,
          }
        : undefined;

      const cleanedData = {
        ...data,
        description: data.description?.trim() || undefined,
        location: data.location?.trim() || undefined,
        recurrence_rule: data.recurrence_rule?.trim() || undefined,
        conference_data: cleanedConferenceData,
      };

      let createdEventId: string | undefined;
      
      if (mode === 'create') {
        const result = await createEvent.mutateAsync(cleanedData);
        createdEventId = result.data.id;
        
        if (cleanedData.attendees && cleanedData.attendees.length > 0) {
          const shouldSend = confirm(
            `Send invitation to ${cleanedData.attendees.length} attendees?`
          );
          
          if (shouldSend && createdEventId) {
            sendInvitations({
              eventId: createdEventId,
              data: { showAttendees: true }
            });
          }
        }
      } else if (mode === 'edit' && event) {
        await updateEvent.mutateAsync({ id: event.id, data: cleanedData });
      }
      
      setTimeout(() => {
        onOpenChange(false);
        form.reset();
      }, 300);
    } catch (error: unknown) {
      console.error('Event submission error:', error);
      console.error('Error details:', {
        message: (error as Error)?.message,
        response: (error as { response?: { data?: unknown; status?: number } })?.response?.data,
        status: (error as { response?: { data?: unknown; status?: number } })?.response?.status,
      });
      
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (error as Error)?.message;
      
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


  const handleClose = () => {
    if (form.formState.isDirty) {
      setShowUnsavedWarning(true);
    } else {
      onOpenChange(false);
      form.reset();
    }
  };

  const confirmClose = () => {
    setShowUnsavedWarning(false);
    onOpenChange(false);
    form.reset();
  };

  const cancelClose = () => {
    setShowUnsavedWarning(false);
  };

  if (!open) return null;
  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 10000 }}>
      <div 
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      <div className="relative w-full h-full" style={{ zIndex: 10001 }}>
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
                    onClick={handleClose}
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
                          <div className="space-y-2 pb-3 border-b border-border/40">
                            <TimeRangeField form={form} />
                            <div className="pl-8">
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

                  <div className="w-[500px] border-l overflow-y-auto flex-shrink-0">
                    <div className="p-6">
                      <GuestsField 
                        form={form}
                        eventId={mode === 'edit' ? event?.id : undefined}
                        onSendInvitations={() => {
                          if (event?.id) {
                            sendInvitations({
                              eventId: event.id,
                              data: { showAttendees: true }
                            });
                          }
                        }}
                        onSendReminders={() => {
                          if (event?.id) {
                            sendReminders(event.id);
                          }
                        }}
                        showInvitationActions={mode === 'edit' && !!event?.id}
                      />
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

  return (
    <>
      {createPortal(modalContent, document.body)}
      <Dialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
        <DialogContent className="sm:max-w-md" style={{ zIndex: 10003 }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Unsaved Changes
            </DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to close this form? All changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <div className='flex gap-x-2'>
              <Button
                  type="button"
                  variant="outline"
                  onClick={cancelClose}
                  className='ml-2'
                >
                  Continue Editing
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmClose}
              >
                Discard Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
