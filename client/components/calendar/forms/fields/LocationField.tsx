'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { EventFormData } from '../event-form.schema';

interface LocationFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function LocationField({ form }: LocationFieldProps) {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <Input
              placeholder="Add location"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 px-2"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
