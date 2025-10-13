'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { EventFormData } from '../event-form.schema';

interface TitleFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function TitleField({ form }: TitleFieldProps) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-semibold">Event Title *</FormLabel>
          <FormControl>
            <Input
              placeholder="e.g., Team Meeting, Birthday, Interview..."
              className="text-base h-11"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
