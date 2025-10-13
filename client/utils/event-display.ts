/**
 * Event display utilities for calendar views
 * Handles z-index, positioning, and overlapping logic
 */

import type { CalendarEvent } from '@/components/calendar/views';

/**
 * Calculate z-index for event based on start time
 * Later events get higher z-index (appear on top)
 */
export function getEventZIndex(event: CalendarEvent, baseZIndex: number = 100): number {
  // Convert start time to timestamp for comparison
  const timestamp = event.start.getTime();
  
  // Add minutes to base z-index for fine-grained ordering
  // This ensures events starting later appear on top
  const minutesOffset = Math.floor(timestamp / (1000 * 60)); // Minutes since epoch
  
  return baseZIndex + (minutesOffset % 1000); // Mod to keep reasonable z-index values
}

/**
 * Calculate z-index for overlapping events
 * Events with later start times get higher z-index
 */
export function getOverlapZIndex(events: CalendarEvent[], currentEvent: CalendarEvent, baseZIndex: number = 100): number {
  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  
  // Find index of current event in sorted array
  const eventIndex = sortedEvents.findIndex(e => e.id === currentEvent.id);
  
  // Return z-index based on position (later events = higher z-index)
  return baseZIndex + eventIndex;
}

/**
 * Check if two events overlap in time
 */
export function eventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
  return event1.start < event2.end && event2.start < event1.end;
}

/**
 * Get overlapping events for a given event
 */
export function getOverlappingEvents(events: CalendarEvent[], targetEvent: CalendarEvent): CalendarEvent[] {
  return events.filter(event => 
    event.id !== targetEvent.id && eventsOverlap(event, targetEvent)
  );
}

/**
 * Calculate dynamic z-index for event cards
 * Higher z-index for:
 * 1. Events starting later (time priority)
 * 2. Events that are currently hovered
 * 3. Events that are being edited
 */
export function calculateEventZIndex(
  event: CalendarEvent, 
  allEvents: CalendarEvent[], 
  options: {
    baseZIndex?: number;
    isHovered?: boolean;
    isEditing?: boolean;
    isSelected?: boolean;
  } = {}
): number {
  const { 
    baseZIndex = 100, 
    isHovered = false, 
    isEditing = false, 
    isSelected = false 
  } = options;

  let zIndex = baseZIndex;

  // Add time-based priority (later events on top)
  const overlappingEvents = getOverlappingEvents(allEvents, event);
  if (overlappingEvents.length > 0) {
    zIndex = getOverlapZIndex([...overlappingEvents, event], event, baseZIndex);
  } else {
    zIndex = getEventZIndex(event, baseZIndex);
  }

  // Boost z-index for interactive states
  if (isSelected) zIndex += 1000;
  if (isEditing) zIndex += 2000;
  if (isHovered) zIndex += 100;

  return zIndex;
}

/**
 * Get CSS z-index style for event
 */
export function getEventZIndexStyle(
  event: CalendarEvent, 
  allEvents: CalendarEvent[], 
  options?: Parameters<typeof calculateEventZIndex>[2]
): { zIndex: number } {
  return {
    zIndex: calculateEventZIndex(event, allEvents, options)
  };
}

/**
 * Get CSS class for event layering (simpler approach)
 * Returns className for time-based layering
 */
export function getEventLayerClass(
  event: CalendarEvent, 
  allEvents: CalendarEvent[], 
  viewType: 'month' | 'week' | 'day' = 'month'
): string {
  const baseClass = 'event-card';
  const viewClass = viewType === 'month' ? 'event-month' : 'event-week';
  
  // Calculate layer based on start time (later events get higher layer)
  const overlappingEvents = getOverlappingEvents(allEvents, event);
  
  if (overlappingEvents.length === 0) {
    return `${baseClass} ${viewClass}`;
  }
  
  // Sort overlapping events by start time
  const sortedEvents = [...overlappingEvents, event].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
  
  // Find position of current event (0-based)
  const layerIndex = sortedEvents.findIndex(e => e.id === event.id);
  const layerClass = `event-layer-${Math.min(layerIndex + 1, 10)}`;
  
  return `${baseClass} ${viewClass} ${layerClass}`;
}
