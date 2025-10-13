export const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
] as const;

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
