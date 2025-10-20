'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { CustomSelect, SelectOption } from '@/components/ui/custom-select';
import type { EventFormData } from '../event-form.schema';

interface RemindersFieldProps {
  form: UseFormReturn<EventFormData>;
}

const timePresets = [
  { label: 'No notification', minutes: -1 },
  { label: 'At time of event', minutes: 0 },
  { label: '5 minutes before', minutes: 5 },
  { label: '10 minutes before', minutes: 10 },
  { label: '15 minutes before', minutes: 15 },
  { label: '30 minutes before', minutes: 30 },
  { label: '1 hour before', minutes: 60 },
  { label: '1 day before', minutes: 1440 },
];

const timePresetOptions: SelectOption[] = timePresets.map((preset) => ({
  value: preset.minutes.toString(),
  label: preset.label,
}));

export function RemindersField({ form }: RemindersFieldProps) {
  return (
    <FormField
      control={form.control}
      name="reminders"
      render={({ field }) => {
        const reminders = field.value || [];
        const currentValue = reminders.length === 0 
          ? '-1' 
          : (reminders[0]?.minutes?.toString() || '30');

        return (
          <FormItem className="flex-1">
            <FormControl>
              <CustomSelect
                value={currentValue}
                onValueChange={(value) => {
                  const minutes = parseInt(value, 10);
                  if (minutes === -1) {
                    field.onChange([]);
                  } else {
                    field.onChange([{ method: 'popup' as const, minutes }]);
                  }
                }}
                options={timePresetOptions}
                placeholder="Select notification time"
                className="w-full border-0"
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
