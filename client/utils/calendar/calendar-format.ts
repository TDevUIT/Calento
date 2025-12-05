import { format } from 'date-fns';

export function formatTimeWithSettings(date: Date, timeFormat: '12h' | '24h'): string {
  if (timeFormat === '12h') {
    return format(date, 'h:mm a');
  }
  return format(date, 'HH:mm');
}

export function formatDateWithSettings(date: Date, dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'): string {
  switch (dateFormat) {
    case 'DD/MM/YYYY':
      return format(date, 'dd/MM/yyyy');
    case 'MM/DD/YYYY':
      return format(date, 'MM/dd/yyyy');
    case 'YYYY-MM-DD':
      return format(date, 'yyyy-MM-dd');
    default:
      return format(date, 'dd/MM/yyyy');
  }
}

export function getWeekStartDay(weekStartsOn: 'sunday' | 'monday' | 'saturday'): 0 | 1 | 6 {
  switch (weekStartsOn) {
    case 'sunday':
      return 0;
    case 'monday':
      return 1;
    case 'saturday':
      return 6;
    default:
      return 1;
  }
}
