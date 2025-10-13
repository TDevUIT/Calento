'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { CustomSelect, SelectOption } from '@/components/ui/custom-select';
import type { EventFormData } from '../event-form.schema';
import { VISIBILITY_OPTIONS } from '../form-constants';

interface VisibilityFieldProps {
  form: UseFormReturn<EventFormData>;
}

const visibilityOptions: SelectOption[] = VISIBILITY_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}));

export function VisibilityField({ form }: VisibilityFieldProps) {
  return (
    <FormField
      control={form.control}
      name="visibility"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <CustomSelect
              value={field.value}
              onValueChange={field.onChange}
              options={visibilityOptions}
              placeholder="Select visibility"
              className="h-9 w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
