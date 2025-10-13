'use client';

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
  return (
    <FormField
      control={form.control}
      name="is_all_day"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <FormControl>
            <Checkbox 
              checked={field.value} 
              onCheckedChange={field.onChange}
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
