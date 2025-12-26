'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { CustomSelect, SelectOption } from '@/components/ui/custom-select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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

        const selectedMinutes = parseInt(currentValue, 10);
        const hasEmail = reminders.some((r) => r?.method === 'email');
        const hasPopup = reminders.some((r) => r?.method === 'popup');

        const setChannels = (next: { email: boolean; popup: boolean }) => {
          if (!Number.isFinite(selectedMinutes) || selectedMinutes === -1) {
            field.onChange([]);
            return;
          }

          const nextReminders: Array<{ method: 'email' | 'popup'; minutes: number }> = [];
          if (next.email) nextReminders.push({ method: 'email', minutes: selectedMinutes });
          if (next.popup) nextReminders.push({ method: 'popup', minutes: selectedMinutes });
          field.onChange(nextReminders);
        };

        return (
          <FormItem className="flex-1">
            <FormControl>
              <div className="space-y-3">
                <CustomSelect
                  value={currentValue}
                  onValueChange={(value) => {
                    const minutes = parseInt(value, 10);
                    if (minutes === -1) {
                      field.onChange([]);
                      return;
                    }

                    const nextEmail = hasEmail || (!hasEmail && !hasPopup);
                    const nextPopup = hasPopup;
                    const nextReminders: Array<{ method: 'email' | 'popup'; minutes: number }> = [];
                    if (nextEmail) nextReminders.push({ method: 'email', minutes });
                    if (nextPopup) nextReminders.push({ method: 'popup', minutes });
                    field.onChange(nextReminders);
                  }}
                  options={timePresetOptions}
                  placeholder="Select notification time"
                  className="w-full border-0"
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Email</Label>
                    <Switch
                      checked={hasEmail}
                      disabled={selectedMinutes === -1}
                      onCheckedChange={(checked) => setChannels({ email: checked, popup: hasPopup })}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Desktop</Label>
                    <Switch
                      checked={hasPopup}
                      disabled={selectedMinutes === -1}
                      onCheckedChange={(checked) => setChannels({ email: hasEmail, popup: checked })}
                    />
                  </div>
                </div>
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
