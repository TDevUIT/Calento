import { cn } from '@/lib/utils';

export function getCalendarStyles(compactMode: boolean, highlightWeekends: boolean) {
  return {
    container: cn(
      'calendar-container',
      compactMode && 'calendar-compact',
      highlightWeekends && 'calendar-highlight-weekends'
    ),
    event: cn(
      'calendar-event',
      compactMode && 'calendar-event-compact'
    ),
    cell: cn(
      'calendar-cell',
      compactMode && 'calendar-cell-compact'
    ),
    header: cn(
      'calendar-header',
      compactMode && 'calendar-header-compact'
    ),
  };
}

export function getEventTimeDisplay(
  startTime: Date,
  endTime: Date,
  timeFormat: '12h' | '24h',
  compactMode: boolean
) {
  const formatTime = (date: Date) => {
    if (timeFormat === '12h') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const start = formatTime(startTime);
  const end = formatTime(endTime);

  if (compactMode) {
    return `${start}`;
  }

  return `${start} - ${end}`;
}
