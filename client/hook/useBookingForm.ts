import { useState } from 'react';
import { toast } from 'sonner';
import { format, startOfDay } from 'date-fns';
import { useCreatePublicBooking } from '@/hook/booking';

export const useBookingForm = (slug: string) => {
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
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
      setStep('confirmation');
    } catch {
      
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
