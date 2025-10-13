'use client';

import { UseFormReturn } from 'react-hook-form';
import { Repeat } from 'lucide-react';
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
  const recurrenceRule = form.watch('recurrence_rule');

  const handleRecurrenceChange = (value: string) => {
    if (value === 'NONE') {
      // Set to undefined instead of empty string for better API handling
      form.setValue('recurrence_rule', undefined as any, { shouldValidate: true });
    } else {
      form.setValue('recurrence_rule', value, { shouldValidate: true });
    }
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/40">
      <Repeat className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <CustomSelect
        value={recurrenceRule || 'NONE'}
        onValueChange={handleRecurrenceChange}
        options={recurrenceOptions}
        placeholder="Does not repeat"
        className="flex-1 border-0"
      />
    </div>
  );
}
