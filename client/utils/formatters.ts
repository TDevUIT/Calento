import { format, parseISO, startOfDay, addDays } from 'date-fns';

export const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatTimeSlot = (dateTimeString: string) => {
  const date = parseISO(dateTimeString);
  return format(date, 'h:mm a');
};

export const formatDateDisplay = (dateString: string) => {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const selectedDateObj = parseISO(dateString + 'T00:00:00');

  if (selectedDateObj.getTime() === today.getTime()) {
    return 'Today';
  } else if (selectedDateObj.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    return format(selectedDateObj, 'MMM d, yyyy');
  }
};
