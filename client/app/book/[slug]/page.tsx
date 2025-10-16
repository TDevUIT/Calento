"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicBookingLink, useAvailableSlots, useCreatePublicBooking } from "@/hook/booking";
import { format, addDays, startOfDay, parseISO } from "date-fns";
import { toast } from "sonner";

export default function PublicBookingPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [selectedDate, setSelectedDate] = useState<string>(
    format(startOfDay(new Date()), 'yyyy-MM-dd')
  );
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [step, setStep] = useState<'select-time' | 'enter-details' | 'confirmation'>('select-time');
  const [bookingData, setBookingData] = useState({
    booker_name: "",
    booker_email: "",
    booker_phone: "",
    booker_notes: "",
  });

  // Fetch booking link data
  const { data: bookingLink, isLoading: isLoadingLink, error: linkError } = usePublicBookingLink(slug);
  
  // Fetch available slots for selected date
  const { data: availableSlots, isLoading: isLoadingSlotsData } = useAvailableSlots(slug, {
    date: selectedDate,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  // Create booking mutation
  const createBookingMutation = useCreatePublicBooking();

  // Generate next 30 days for date selection
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const dateObj = addDays(new Date(), i);
    return format(dateObj, 'yyyy-MM-dd');
  });

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(""); // Reset selected slot when date changes
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleContinueToDetails = () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    setStep('enter-details');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !bookingData.booker_name || !bookingData.booker_email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        slug,
        data: {
          ...bookingData,
          start_time: selectedSlot,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      });
      setStep('confirmation');
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatTimeSlot = (dateTimeString: string) => {
    const date = parseISO(dateTimeString);
    return format(date, 'h:mm a');
  };

  const formatDateDisplay = (dateString: string) => {
    const dateObj = parseISO(dateString + 'T00:00:00');
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const selectedDateObj = parseISO(dateString + 'T00:00:00');
    
    if (selectedDateObj.getTime() === today.getTime()) {
      return "Today";
    } else if (selectedDateObj.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return format(selectedDateObj, 'MMM d, yyyy');
    }
  };

  // Loading state
  if (isLoadingLink) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (linkError || !bookingLink) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Booking Link Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The booking link you&apos;re looking for doesn&apos;t exist or has been deactivated.
              </p>
              <Button onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Inactive booking link
  if (!bookingLink.is_active) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-orange-600 mb-4">Booking Temporarily Unavailable</h1>
              <p className="text-muted-foreground mb-6">
                This booking link is currently inactive. Please try again later or contact the organizer.
              </p>
              <Button onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Confirmation step
  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-6">
                Your booking has been confirmed. You&apos;ll receive a confirmation email shortly with all the details.
              </p>
              <div className="bg-muted p-4 rounded-lg text-left max-w-md mx-auto mb-6">
                <h3 className="font-semibold mb-2">{bookingLink.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {formatDateDisplay(selectedDate)} at {formatTimeSlot(selectedSlot)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Duration: {formatDuration(bookingLink.duration_minutes)}
                </p>
              </div>
              <Button onClick={() => window.location.href = '/'}>
                Done
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                bookingLink.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                bookingLink.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                bookingLink.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                bookingLink.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                bookingLink.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                'bg-pink-100 dark:bg-pink-900/30'
              }`}>
                <Calendar className={`h-6 w-6 ${
                  bookingLink.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  bookingLink.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  bookingLink.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  bookingLink.color === 'red' ? 'text-red-600 dark:text-red-400' :
                  bookingLink.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                  'text-pink-600 dark:text-pink-400'
                }`} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{bookingLink.title}</CardTitle>
                {bookingLink.description && (
                  <CardDescription className="mt-2">
                    {bookingLink.description}
                  </CardDescription>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDuration(bookingLink.duration_minutes)}
                  </div>
                  {bookingLink.advance_notice_hours > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {bookingLink.advance_notice_hours}h advance notice
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {step === 'select-time' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => handleDateSelect(date)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedDate === date
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="font-medium">
                        {formatDateDisplay(date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(parseISO(date + 'T00:00:00'), 'EEEE, MMM d')}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Time</CardTitle>
                <CardDescription>
                  {formatDateDisplay(selectedDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSlotsData ? (
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : availableSlots && availableSlots.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableSlots.map((slot: { start_time: string; available: boolean }) => (
                      <button
                        key={slot.start_time}
                        onClick={() => handleSlotSelect(slot.start_time)}
                        disabled={!slot.available}
                        className={`w-full text-left p-3 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedSlot === slot.start_time
                            ? 'border-primary bg-primary/5 text-primary'
                            : slot.available
                            ? 'border-border hover:border-primary/50 hover:bg-muted/50'
                            : 'border-border bg-muted/30'
                        }`}
                      >
                        <div className="font-medium">
                          {formatTimeSlot(slot.start_time)}
                        </div>
                        {!slot.available && (
                          <div className="text-xs text-muted-foreground">
                            Not available
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No available time slots for this date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'enter-details' && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep('select-time')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle>Enter Your Details</CardTitle>
                  <CardDescription>
                    {formatDateDisplay(selectedDate)} at {formatTimeSlot(selectedSlot)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={bookingData.booker_name}
                      onChange={(e) => setBookingData(prev => ({ ...prev, booker_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={bookingData.booker_email}
                      onChange={(e) => setBookingData(prev => ({ ...prev, booker_email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={bookingData.booker_phone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, booker_phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Anything you'd like to mention about this meeting..."
                    rows={3}
                    value={bookingData.booker_notes}
                    onChange={(e) => setBookingData(prev => ({ ...prev, booker_notes: e.target.value }))}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('select-time')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={createBookingMutation.isPending}
                    className="flex-1"
                  >
                    {createBookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Continue Button for Time Selection */}
        {step === 'select-time' && (
          <div className="mt-6">
            <Button
              onClick={handleContinueToDetails}
              disabled={!selectedSlot}
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
