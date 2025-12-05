'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useUpdateCalendar } from '@/hook/calendar';
import { Calendar } from '@/interface';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';

const TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh (GMT+7)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)' },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
  { value: 'Europe/London', label: 'London (GMT+0)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
  { value: 'Australia/Sydney', label: 'Sydney (GMT+10)' },
];

const updateCalendarSchema = z.object({
  name: z.string().min(1, 'Calendar name is required').max(255),
  description: z.string().max(1000).optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  is_primary: z.boolean(),
});

type UpdateCalendarFormData = z.infer<typeof updateCalendarSchema>;

interface EditCalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendar: Calendar | null;
}

export function EditCalendarDialog({ open, onOpenChange, calendar }: EditCalendarDialogProps) {
  const { mutate: updateCalendar, isPending } = useUpdateCalendar();

  const form = useForm<UpdateCalendarFormData>({
    resolver: zodResolver(updateCalendarSchema),
    defaultValues: {
      name: '',
      description: '',
      timezone: 'Asia/Ho_Chi_Minh',
      is_primary: false,
    },
  });

  useEffect(() => {
    if (calendar) {
      form.reset({
        name: calendar.name || '',
        description: calendar.description || '',
        timezone: calendar.timezone || 'Asia/Ho_Chi_Minh',
        is_primary: calendar.is_primary || false,
      });
    }
  }, [calendar, form]);

  const onSubmit = (data: UpdateCalendarFormData) => {
    if (!calendar) return;

    updateCalendar(
      {
        id: calendar.id,
        data: {
          name: data.name,
          description: data.description,
          timezone: data.timezone,
          is_primary: data.is_primary,
        },
      },
      {
        onSuccess: (response) => {
          toast.success('Calendar updated successfully!', {
            description: response.data.name,
          });
          onOpenChange(false);
        },
        onError: (error: Error) => {
          toast.error('Failed to update calendar', {
            description: error.message,
          });
        },
      }
    );
  };

  if (!calendar) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Edit Calendar
          </DialogTitle>
          <DialogDescription>
            Update your calendar settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Calendar Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calendar Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Work, Personal, Team Events"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose of this calendar..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description to help identify this calendar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Timezone */}
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    All events in this calendar will use this timezone
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Set as Primary */}
            <FormField
              control={form.control}
              name="is_primary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Set as primary calendar
                    </FormLabel>
                    <FormDescription>
                      New events will be created in this calendar by default
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Update Calendar
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
