"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2, Palette, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateBookingLink, useUpdateBookingLink } from "@/hook/booking";
import { BookingLink } from "@/service/booking.service";
import { COLOR_OPTIONS } from "@/components/calendar/forms/form-constants";
import { useRecentColors } from "@/hook/use-recent-colors";

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

const colorNameToHex: Record<string, string> = {
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#a855f7",
  red: "#ef4444",
  orange: "#f97316",
  pink: "#ec4899",
};

export function CreateBookingLinkDialog({ 
  open, 
  onOpenChange, 
  bookingLink 
}: CreateBookingLinkDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const createMutation = useCreateBookingLink();
  const updateMutation = useUpdateBookingLink();
  
  const isEditing = !!bookingLink;

  const form = useForm<BookingLinkFormData>({
    resolver: zodResolver(bookingLinkSchema),
    mode: "onChange",
    reValidateMode: "onChange",
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
      color: (() => {
        const c = bookingLink?.color;
        if (!c) return "#3b82f6";
        if (c.startsWith('#')) return c;
        return colorNameToHex[c] ?? "#3b82f6";
      })(),
    },
  });

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
      setTimeout(() => {
        onOpenChange(false);
        form.reset();
      }, 300);
    } catch {
      
    } finally {
      setIsSubmitting(false);
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
                            placeholder="30 Min Meeting"
                            className="border-0 border-b-1 rounded-none border-black text-xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-3"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleTitleChange(e.target.value);
                            }}
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
                    disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                  >
                    {(isSubmitting || createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditing ? 'Saving...' : 'Creating...'}
                      </>
                    ) : (
                      isEditing ? 'Save' : 'Create'
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
                      <div className="px-6 py-4 space-y-6">
                        <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
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

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    value={field.value ?? ""}
                                  />
                                </FormControl>
                                <FormDescription>Leave empty for no limit</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <BookingColorField form={form} />

                          <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
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

  return (
    <>
      {createPortal(modalContent, document.body)}
      <Dialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
        <DialogContent className="sm:max-w-md" style={{ zIndex: 10003 }}>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
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

interface BookingColorFieldProps {
  form: ReturnType<typeof useForm<BookingLinkFormData>>;
}

function BookingColorField({ form }: BookingColorFieldProps) {
  const { recentColors, addRecentColor } = useRecentColors();

  return (
    <FormField
      control={form.control}
      name="color"
      render={({ field }) => {
        const handleColorSelect = (colorHex: string) => {
          field.onChange(colorHex);
          addRecentColor(colorHex);
        };

        return (
          <FormItem>
            <FormLabel>Color</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2 flex-wrap">
                {recentColors.map((colorHex, index) => {
                  const isSelected = field.value === colorHex;
                  const colorOption = COLOR_OPTIONS.find(c => c.hex === colorHex);
                  
                  return (
                    <button
                      key={`${colorHex}-${index}`}
                      type="button"
                      onClick={() => handleColorSelect(colorHex)}
                      className={`relative h-7 w-7 rounded-full transition-all hover:scale-110 flex-shrink-0 ${
                        isSelected ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: colorHex }}
                      title={colorOption?.label || colorHex}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </button>
                  );
                })}

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-xs"
                    >
                      <Palette className="h-3.5 w-3.5" />
                      <span>More</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start" style={{ zIndex: 10002 }}>
                    <Tabs defaultValue="palette" className="w-full">
                      <TabsList className="w-full rounded-none border-b">
                        <TabsTrigger value="palette" className="flex-1">
                          Palette
                        </TabsTrigger>
                        <TabsTrigger value="custom" className="flex-1">
                          Custom
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="palette" className="p-4 m-0">
                        <div className="space-y-3">
                          <p className="text-xs text-muted-foreground">Choose a color</p>
                          <div className="grid grid-cols-8 gap-2">
                            {COLOR_OPTIONS.map((color) => {
                              const isSelected = field.value === color.value;
                              return (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() => handleColorSelect(color.hex)}
                                  className={`relative h-8 w-8 rounded-full transition-all hover:scale-110 ${
                                    isSelected ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : 'opacity-70 hover:opacity-100'
                                  }`}
                                  style={{ backgroundColor: color.hex }}
                                  title={color.label}
                                >
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="custom" className="p-4 m-0">
                        <div className="space-y-3">
                          <p className="text-xs text-muted-foreground">Enter hex code or use picker</p>
                          
                          <Input
                            type="text"
                            placeholder="#3b82f6"
                            value={field.value?.startsWith('#') ? field.value : ''}
                            onChange={(e) => {
                              let value = e.target.value.trim();
                              if (value && !value.startsWith('#')) {
                                value = '#' + value;
                              }
                              if (value === '' || /^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                field.onChange(value);
                                if (value.length === 7) {
                                  addRecentColor(value);
                                }
                              }
                            }}
                            className="font-mono text-sm"
                            maxLength={7}
                          />
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={field.value?.startsWith('#') && field.value.length === 7 ? field.value : '#3b82f6'}
                              onChange={(e) => handleColorSelect(e.target.value)}
                              className="h-10 w-full rounded border border-input cursor-pointer"
                            />
                          </div>

                          {field.value && (
                            <div className="flex items-center gap-2 p-2 rounded border border-border">
                              <div
                                className="h-8 w-8 rounded-full border border-border"
                                style={{ backgroundColor: field.value }}
                              />
                              <div className="flex-1">
                                <p className="text-xs font-medium">Preview</p>
                                <p className="text-xs text-muted-foreground font-mono">{field.value}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
