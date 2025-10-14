export interface OccurrenceInfo {
  originalId: string;
  isOccurrence: boolean;
  occurrenceIndex?: number;
}


export const getOriginalEventId = (eventId: string): OccurrenceInfo => {
  const occurrencePattern = /^(.+)_occurrence_(\d+)$/;
  const match = eventId.match(occurrencePattern);
  
  if (match) {
    return {
      originalId: match[1],
      isOccurrence: true,
      occurrenceIndex: parseInt(match[2], 10),
    };
  }
  
  return {
    originalId: eventId,
    isOccurrence: false,
  };
};

export const isRecurringOccurrence = (eventId: string): boolean => {
  return /_occurrence_\d+$/.test(eventId);
};


export const generateOccurrenceId = (originalId: string, occurrenceIndex: number): string => {
  return `${originalId}_occurrence_${occurrenceIndex}`;
};


export const getOccurrenceIndex = (eventId: string): number | null => {
  const info = getOriginalEventId(eventId);
  return info.isOccurrence ? info.occurrenceIndex! : null;
};
