'use client';

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
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
  const reminders = form.watch('reminders') || [];
  const [localValue, setLocalValue] = useState<string>(() => {
    if (reminders.length === 0) return '-1';
    const minutes = reminders[0]?.minutes;
    return minutes !== undefined ? minutes.toString() : '30';
  });

  // Sync local value with form value
  useEffect(() => {
    if (reminders.length === 0) {
      setLocalValue('-1');
    } else {
      const minutes = reminders[0]?.minutes;
      if (minutes !== undefined) {
        setLocalValue(minutes.toString());
      }
    }
  }, [reminders]);

  const handleReminderChange = (value: string) => {
    setLocalValue(value); // Update local state immediately for responsive UI
    
    const minutes = parseInt(value);
    
    if (minutes === -1) {
      form.setValue('reminders', [], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    } else {
      form.setValue('reminders', [
        {
          method: 'popup' as const,
          minutes,
        },
      ], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }
  };

  return (
    <div className="flex-1">
      <CustomSelect
        value={localValue}
        onValueChange={handleReminderChange}
        options={timePresetOptions}
        placeholder="Select notification time"
        className="w-full border-0"
      />
    </div>
  );
}
