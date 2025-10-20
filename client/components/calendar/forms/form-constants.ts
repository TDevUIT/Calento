import { EVENT_COLOR_OPTIONS } from '@/utils/colors';

export const COLOR_OPTIONS = EVENT_COLOR_OPTIONS.map(color => ({
  value: color.hex, // Store hex value
  label: color.name,
  class: `bg-${color.value}-500`, // Tailwind class for display
  hex: color.hex,
}));

export const VISIBILITY_OPTIONS = [
  {
    value: 'default',
    label: 'Default',
    description: 'Use calendar default settings',
  },
  {
    value: 'public',
    label: 'Public',
    description: 'Everyone can see details',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can see',
  },
  {
    value: 'confidential',
    label: 'Confidential',
    description: 'Others only see "Busy"',
  },
] as const;

export const RECURRENCE_EXAMPLES = [
  { label: 'Daily', value: 'FREQ=DAILY' },
  { label: 'Weekly', value: 'FREQ=WEEKLY;BYDAY=MO,WE,FR' },
  { label: 'Monthly', value: 'FREQ=MONTHLY;BYMONTHDAY=15' },
] as const;
