'use client';

import { format } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import type { EventFormData } from '../event-form.schema';

interface AllDayFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function AllDayField({ form }: AllDayFieldProps) {
  const handleAllDayChange = (checked: boolean) => {
    form.setValue('is_all_day', checked);
    
    if (checked) {
      let startTime = form.getValues('start_time');
      
      if (!startTime) {
        startTime = format(new Date(), "yyyy-MM-dd'T'HH:mm");
        form.setValue('start_time', startTime);
      }
      
      try {
        const startDate = new Date(startTime);
        if (!isNaN(startDate.getTime())) {
          const dateStr = format(startDate, 'yyyy-MM-dd');
          const nextDay = new Date(startDate);
          nextDay.setDate(nextDay.getDate() + 1);
          const endDateStr = format(nextDay, 'yyyy-MM-dd');
          
          form.setValue('start_time', dateStr + 'T00:00', { shouldValidate: true });
          form.setValue('end_time', endDateStr + 'T00:00', { shouldValidate: true });
        }
      } catch (error) {
        console.error('Error setting all-day times:', error);
      }
    } else {
      const startTime = form.getValues('start_time');
      if (startTime) {
        try {
          const startDate = new Date(startTime);
          if (!isNaN(startDate.getTime())) {
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
            form.setValue('end_time', format(endDate, "yyyy-MM-dd'T'HH:mm"), { shouldValidate: true });
          }
        } catch (error) {
          console.error('Error setting time range:', error);
        }
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name="is_all_day"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <FormControl>
            <Checkbox 
              checked={field.value} 
              onCheckedChange={handleAllDayChange}
              id="is_all_day"
            />
          </FormControl>
          <FormLabel htmlFor="is_all_day" className="text-sm font-normal cursor-pointer">
            All day
          </FormLabel>
        </FormItem>
      )}
    />
  );
}
