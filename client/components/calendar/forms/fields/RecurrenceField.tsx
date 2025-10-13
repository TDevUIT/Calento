'use client';

import { UseFormReturn } from 'react-hook-form';
import { Repeat } from 'lucide-react';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { CustomSelect, SelectOption } from '@/components/ui/custom-select';
import type { EventFormData } from '../event-form.schema';

interface RecurrenceFieldProps {
  form: UseFormReturn<EventFormData>;
}

const recurrenceOptions: SelectOption[] = [
  { value: 'NONE', label: 'Does not repeat' },
  { value: 'FREQ=DAILY', label: 'Daily' },
  { value: 'FREQ=WEEKLY', label: 'Weekly' },
  { value: 'FREQ=MONTHLY', label: 'Monthly' },
  { value: 'FREQ=YEARLY', label: 'Yearly' },
];

export function RecurrenceField({ form }: RecurrenceFieldProps) {
  return (
    <FormField
      control={form.control}
      name="recurrence_rule"
      render={({ field }) => {
        // Strip RRULE: prefix for display
        const displayValue = field.value?.startsWith('RRULE:') 
          ? field.value.substring(6) 
          : field.value || 'NONE';

        return (
          <FormItem>
            <div className="flex items-center gap-3 py-3 border-b border-border/40">
              <Repeat className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <FormControl>
                <CustomSelect
                  value={displayValue}
                  onValueChange={(value) => {
                    if (value === 'NONE') {
                      field.onChange(undefined);
                    } else {
                      // Add RRULE: prefix for backend
                      field.onChange(`RRULE:${value}`);
                    }
                  }}
                  options={recurrenceOptions}
                  placeholder="Does not repeat"
                  className="flex-1 border-0"
                />
              </FormControl>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
