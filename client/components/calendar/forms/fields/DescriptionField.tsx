'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { EventFormData } from '../event-form.schema';

interface DescriptionFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function DescriptionField({ form }: DescriptionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea
              placeholder="Add description or attachments"
              className="min-h-[80px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
