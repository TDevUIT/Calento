import { useState } from 'react';
import { toast } from 'sonner';
import { format, startOfDay } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { useCreatePublicBooking } from '@/hook/booking';
import { BOOKING_QUERY_KEYS } from '@/hook/booking/use-bookings';
import { getBrowserTimezone } from '@/utils';

export const useBookingForm = (slug: string) => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string>(
    format(startOfDay(new Date()), 'yyyy-MM-dd')
  );
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [step, setStep] = useState<'select-time' | 'enter-details' | 'confirmation'>('select-time');
  const [bookingData, setBookingData] = useState({
    booker_name: '',
    booker_email: '',
    booker_phone: '',
    booker_notes: '',
  });

  const createBookingMutation = useCreatePublicBooking();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot('');
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleContinueToDetails = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }
    setStep('enter-details');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot || !bookingData.booker_name || !bookingData.booker_email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        slug,
        data: {
          ...bookingData,
          start_time: selectedSlot,
          timezone: getBrowserTimezone(),
        },
      });
      setStep('confirmation');
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.toLowerCase().includes('selected time slot is not available')) {
        setSelectedSlot('');
        setStep('select-time');
        queryClient.invalidateQueries({
          queryKey: [...BOOKING_QUERY_KEYS.public.all, 'slots', slug],
        });
      }
    }
  };

  return {
    selectedDate,
    selectedSlot,
    step,
    bookingData,
    setBookingData,
    createBookingMutation,
    handleDateSelect,
    handleSlotSelect,
    handleContinueToDetails,
    handleBookingSubmit,
    setStep,
  };
};
