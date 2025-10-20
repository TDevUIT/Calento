import { CheckCircle, Calendar, Clock, User, Video, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConfirmationStepProps {
  bookingLink: {
    title: string;
    description?: string;
    duration_minutes: number;
  };
  selectedDate: string;
  selectedSlot: string;
  bookerData: {
    booker_name: string;
    booker_email: string;
  };
  formatDateDisplay: (date: string) => string;
  formatTimeSlot: (slot: string) => string;
  formatDuration: (minutes: number) => string;
}

export const ConfirmationStep = ({
  bookingLink,
  selectedDate,
  selectedSlot,
  bookerData,
  formatDateDisplay,
  formatTimeSlot,
  formatDuration,
}: ConfirmationStepProps) => {
  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 animate-bounce">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your meeting has been successfully scheduled
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-100 dark:border-green-800">
            <CardTitle className="text-xl">Booking Details</CardTitle>
            <CardDescription>Please save this information for your records</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Event</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{bookingLink.title}</div>
                  {bookingLink.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{bookingLink.description}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date & Time</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatDateDisplay(selectedDate)} at {formatTimeSlot(selectedSlot)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Duration: {formatDuration(bookingLink.duration_minutes)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Attendee</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{bookerData.booker_name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{bookerData.booker_email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Video className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Location</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Google Meet</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    A video conference link will be sent to your email
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">Confirmation Email</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    You&apos;ll receive a confirmation email at <span className="font-medium">{bookerData.booker_email}</span> with calendar invite and meeting details
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">Add to Calendar</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    The calendar invite in your email can be added to Google Calendar, Outlook, or Apple Calendar
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Video className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">Join the Meeting</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    On the scheduled date and time, click the Google Meet link in your email to join
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1" onClick={() => window.print()}>
            Print Details
          </Button>
          <Button className="flex-1" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need to make changes? Contact us or check your confirmation email for reschedule options.
          </p>
        </div>
      </div>
    </div>
  );
};
