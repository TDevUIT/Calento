"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBookingLink, useUpdateBookingLink } from "@/hook/booking";
import { BookingLink } from "@/service/booking.service";

const bookingLinkSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  duration_minutes: z.number().min(5, "Minimum 5 minutes").max(480, "Maximum 8 hours"),
  buffer_time_minutes: z.number().min(0).max(60, "Maximum 60 minutes").optional(),
  advance_notice_hours: z.number().min(0).max(168, "Maximum 1 week").optional(),
  booking_window_days: z.number().min(1).max(365, "Maximum 1 year").optional(),
  max_bookings_per_day: z.number().min(1).max(50).optional(),
  is_active: z.boolean().optional(),
  color: z.string().optional(),
});

type BookingLinkFormData = z.infer<typeof bookingLinkSchema>;

interface CreateBookingLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingLink?: BookingLink | null;
}

const durationOptions = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
  { value: 240, label: "4 hours" },
];

const colorOptions = [
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "orange", label: "Orange", color: "bg-orange-500" },
  { value: "pink", label: "Pink", color: "bg-pink-500" },
];

export function CreateBookingLinkDialog({ 
  open, 
  onOpenChange, 
  bookingLink 
}: CreateBookingLinkDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createMutation = useCreateBookingLink();
  const updateMutation = useUpdateBookingLink();
  
  const isEditing = !!bookingLink;

  const form = useForm<BookingLinkFormData>({
    resolver: zodResolver(bookingLinkSchema),
    defaultValues: {
      title: bookingLink?.title || "",
      slug: bookingLink?.slug || "",
      description: bookingLink?.description || "",
      duration_minutes: bookingLink?.duration_minutes || 30,
      buffer_time_minutes: bookingLink?.buffer_time_minutes || 0,
      advance_notice_hours: bookingLink?.advance_notice_hours || 24,
      booking_window_days: bookingLink?.booking_window_days || 60,
      max_bookings_per_day: bookingLink?.max_bookings_per_day || undefined,
      is_active: bookingLink?.is_active ?? true,
      color: bookingLink?.color || "blue",
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    if (!isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);
    }
  };

  const onSubmit = async (data: BookingLinkFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && bookingLink) {
        await updateMutation.mutateAsync({
          id: bookingLink.id,
          data: {
            ...data,
            buffer_time_minutes: data.buffer_time_minutes || 0,
            advance_notice_hours: data.advance_notice_hours || 24,
            booking_window_days: data.booking_window_days || 60,
          }
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          buffer_time_minutes: data.buffer_time_minutes || 0,
          advance_notice_hours: data.advance_notice_hours || 24,
          booking_window_days: data.booking_window_days || 60,
        });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the mutation hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Booking Link" : "Create New Booking Link"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update your booking link settings."
              : "Create a new booking link that others can use to schedule time with you."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="30 Min Meeting"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTitleChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>URL Slug *</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          tempra.com/book/
                        </span>
                        <Input 
                          placeholder="30min-meeting"
                          className="rounded-l-none"
                          {...field}
                          disabled={isEditing}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {isEditing ? "URL slug cannot be changed after creation" : "This will be your booking page URL"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of this meeting type..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration *</FormLabel>
                    <Select 
                      value={field.value?.toString()} 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buffer Time */}
              <FormField
                control={form.control}
                name="buffer_time_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buffer Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="0"
                        min="0"
                        max="60"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Minutes between bookings</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Advance Notice */}
              <FormField
                control={form.control}
                name="advance_notice_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advance Notice</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="24"
                        min="0"
                        max="168"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Hours of advance notice required</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Booking Window */}
              <FormField
                control={form.control}
                name="booking_window_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Window</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="60"
                        min="1"
                        max="365"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Days in advance people can book</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Bookings Per Day */}
              <FormField
                control={form.control}
                name="max_bookings_per_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Bookings/Day</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="No limit"
                        min="1"
                        max="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormDescription>Leave empty for no limit</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${option.color}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Allow people to book this meeting type
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Link" : "Create Link")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
