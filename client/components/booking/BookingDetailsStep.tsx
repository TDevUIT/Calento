import { ArrowLeft, Check, Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { BookingLink } from '@/service/booking.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingDetailsStepProps {
  bookingLink: BookingLink;
  selectedDate: string;
  selectedSlot: string;
  bookingData: {
    booker_name: string;
    booker_email: string;
    booker_phone: string;
    booker_notes: string;
  };
  setBookingData: React.Dispatch<React.SetStateAction<{
    booker_name: string;
    booker_email: string;
    booker_phone: string;
    booker_notes: string;
  }>>;
  isPending: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formatDateDisplay: (date: string) => string;
  formatTimeSlot: (slot: string) => string;
  formatDuration: (minutes: number) => string;
}

export const BookingDetailsStep = ({
  bookingLink,
  selectedDate,
  selectedSlot,
  bookingData,
  setBookingData,
  isPending,
  onBack,
  onSubmit,
  formatDateDisplay,
  formatTimeSlot,
  formatDuration,
}: BookingDetailsStepProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to time selection
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Event</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{bookingLink.title}</div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Date & Time</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                    {formatDateDisplay(selectedDate)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{formatTimeSlot(selectedSlot)}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Duration</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                    {formatDuration(bookingLink.duration_minutes)}
                  </div>
                </div>
              </div>
              {bookingLink.description && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{bookingLink.description}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Details</CardTitle>
              <CardDescription>Please provide your information to complete the booking</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={bookingData.booker_name}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, booker_name: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={bookingData.booker_email}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, booker_email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                      Confirmation will be sent to this email
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number <span className="text-gray-400">(Optional)</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Phone className="h-4 w-4" />
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={bookingData.booker_phone}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, booker_phone: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Additional Notes <span className="text-gray-400">(Optional)</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <Textarea
                        id="notes"
                        placeholder="Please share anything that will help prepare for our meeting..."
                        rows={4}
                        value={bookingData.booker_notes}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, booker_notes: e.target.value }))}
                        className="pl-10 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button type="button" variant="outline" onClick={onBack} className="w-32">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" disabled={isPending} className="flex-1" size="lg">
                    {isPending ? (
                      <>
                        <span className="animate-spin mr-2">â³</span>
                        Booking...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
