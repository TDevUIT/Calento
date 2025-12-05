import type { CalendarEvent } from '@/components/calendar/views';

export interface EventLayout {
  event: CalendarEvent;
  column: number;
  totalColumns: number;
  width: number;
  left: number;
  zIndex: number;
  isStacked?: boolean;
  stackIndex?: number;
  totalStacked?: number;
  shouldShowFull?: boolean;
}

const layoutCache = new Map<string, EventLayout[]>();

function generateCacheKey(events: CalendarEvent[]): string {
  return events
    .map(e => `${e.id}-${e.start.getTime()}-${e.end.getTime()}`)
    .sort()
    .join('|');
}

export function getEventZIndex(event: CalendarEvent, baseZIndex: number = 100): number {
  const timestamp = event.start.getTime();
  const minutesOffset = Math.floor(timestamp / (1000 * 60));
  return baseZIndex + (minutesOffset % 1000);
}

export function getOverlapZIndex(events: CalendarEvent[], currentEvent: CalendarEvent, baseZIndex: number = 100): number {
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const eventIndex = sortedEvents.findIndex(e => e.id === currentEvent.id);
  return baseZIndex + eventIndex;
}

export function eventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
  return event1.start < event2.end && event2.start < event1.end;
}

export function getOverlappingEvents(events: CalendarEvent[], targetEvent: CalendarEvent): CalendarEvent[] {
  return events.filter(event => 
    event.id !== targetEvent.id && eventsOverlap(event, targetEvent)
  );
}

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

  const overlappingEvents = getOverlappingEvents(allEvents, event);
  if (overlappingEvents.length > 0) {
    zIndex = getOverlapZIndex([...overlappingEvents, event], event, baseZIndex);
  } else {
    zIndex = getEventZIndex(event, baseZIndex);
  }

  if (isSelected) zIndex += 1000;
  if (isEditing) zIndex += 2000;
  if (isHovered) zIndex += 100;

  return zIndex;
}

export function getEventZIndexStyle(
  event: CalendarEvent, 
  allEvents: CalendarEvent[], 
  options?: Parameters<typeof calculateEventZIndex>[2]
): { zIndex: number } {
  return {
    zIndex: calculateEventZIndex(event, allEvents, options)
  };
}

export function calculateEventLayouts(events: CalendarEvent[]): EventLayout[] {
  if (events.length === 0) return [];
  
  const cacheKey = generateCacheKey(events);
  if (layoutCache.has(cacheKey)) {
    return layoutCache.get(cacheKey)!;
  }
  
  const sortedEvents = [...events].sort((a, b) => {
    const startDiff = a.start.getTime() - b.start.getTime();
    if (startDiff !== 0) return startDiff;
    
    const aDuration = a.end.getTime() - a.start.getTime();
    const bDuration = b.end.getTime() - b.start.getTime();
    return bDuration - aDuration;
  });
  
  const overlapGroups: CalendarEvent[][] = [];
  
  for (const event of sortedEvents) {
    let addedToGroup = false;
    
    for (const group of overlapGroups) {
      const overlapsWithGroup = group.some(groupEvent => eventsOverlap(event, groupEvent));
      if (overlapsWithGroup) {
        group.push(event);
        addedToGroup = true;
        break;
      }
    }
    
    if (!addedToGroup) {
      overlapGroups.push([event]);
    }
  }
  
  const layouts: EventLayout[] = [];
  
  for (const group of overlapGroups) {
    if (group.length === 1) {
      layouts.push({
        event: group[0],
        column: 0,
        totalColumns: 1,
        width: 100,
        left: 0,
        zIndex: calculateEventZIndex(group[0], events)
      });
    } else {
      const groupLayouts = calculateGroupColumnLayout(group);
      layouts.push(...groupLayouts);
    }
  }
  
  layoutCache.set(cacheKey, layouts);
  
  if (layoutCache.size > 100) {
    const firstKey = layoutCache.keys().next().value;
    if (firstKey) {
      layoutCache.delete(firstKey);
    }
  }
  
  return layouts;
}

function calculateGroupColumnLayout(group: CalendarEvent[]): EventLayout[] {
  const layouts: EventLayout[] = [];
  const columns: CalendarEvent[][] = [];
  
  const sortedGroup = [...group].sort((a, b) => a.start.getTime() - b.start.getTime());
  
  for (const event of sortedGroup) {
    let assignedColumn = -1;
    
    for (let i = 0; i < columns.length; i++) {
      const columnEvents = columns[i];
      const hasOverlap = columnEvents.some(colEvent => eventsOverlap(event, colEvent));
      
      if (!hasOverlap) {
        assignedColumn = i;
        break;
      }
    }
    
    if (assignedColumn === -1) {
      assignedColumn = columns.length;
      columns.push([]);
    }
    
    columns[assignedColumn].push(event);
  }
  
  const totalColumns = columns.length;
  
  // Smart layout: If too many columns (>4), use stacked view
  const useStackedView = totalColumns > 4;
  const maxVisibleColumns = useStackedView ? 3 : totalColumns;
  
  if (useStackedView) {
    // Stacked view: Show first 3 columns normally, stack the rest
    const visibleColumns = columns.slice(0, maxVisibleColumns);
    const stackedColumns = columns.slice(maxVisibleColumns);
    
    const columnWidth = Math.floor(100 / maxVisibleColumns);
    
    // Layout visible columns
    for (let colIndex = 0; colIndex < visibleColumns.length; colIndex++) {
      const columnEvents = visibleColumns[colIndex];
      
      for (const event of columnEvents) {
        layouts.push({
          event,
          column: colIndex,
          totalColumns: maxVisibleColumns,
          width: columnWidth,
          left: colIndex * columnWidth,
          zIndex: calculateEventZIndex(event, group, { baseZIndex: 200 + colIndex }),
          isStacked: false,
          shouldShowFull: true,
        });
      }
    }
    
    // Layout stacked columns (overlapped position)
    const stackedWidth = columnWidth;
    const stackedLeft = (maxVisibleColumns - 1) * columnWidth;
    
    for (let stackIndex = 0; stackIndex < stackedColumns.length; stackIndex++) {
      const columnEvents = stackedColumns[stackIndex];
      
      for (const event of columnEvents) {
        layouts.push({
          event,
          column: maxVisibleColumns + stackIndex,
          totalColumns,
          width: stackedWidth,
          left: stackedLeft,
          zIndex: calculateEventZIndex(event, group, { baseZIndex: 300 + stackIndex }),
          isStacked: true,
          stackIndex,
          totalStacked: stackedColumns.length,
          shouldShowFull: false,
        });
      }
    }
  } else {
    // Normal view: Equal width columns
    const columnWidth = Math.floor(100 / totalColumns);
    
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const columnEvents = columns[colIndex];
      
      for (const event of columnEvents) {
        layouts.push({
          event,
          column: colIndex,
          totalColumns,
          width: columnWidth,
          left: colIndex * columnWidth,
          zIndex: calculateEventZIndex(event, group, { baseZIndex: 200 + colIndex }),
          isStacked: false,
          shouldShowFull: true,
        });
      }
    }
  }
  
  return layouts;
}

export function getEventLayout(event: CalendarEvent, allEvents: CalendarEvent[]): EventLayout {
  const layouts = calculateEventLayouts(allEvents);
  const layout = layouts.find(l => l.event.id === event.id);
  
  return layout || {
    event,
    column: 0,
    totalColumns: 1,
    width: 100,
    left: 0,
    zIndex: calculateEventZIndex(event, allEvents)
  };
}

function getLuminance(color: string): number {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

export function isLightColor(color: string): boolean {
  if (!color || !color.startsWith('#')) {
    return true;
  }
  
  const luminance = getLuminance(color);
  return luminance > 0.5;
}

export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#1f2937' : '#ffffff';
}

export function getEventTextClasses(backgroundColor: string): {
  titleClass: string;
  timeClass: string;
} {
  const isLight = isLightColor(backgroundColor);
  
  return {
    titleClass: isLight ? 'text-gray-900' : 'text-white',
    timeClass: isLight ? 'text-gray-800' : 'text-gray-100',
  };
}

export function getEventLayoutStyles(layout: EventLayout): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    width: `${layout.width}%`,
    left: `${layout.left}%`,
    zIndex: layout.zIndex,
    position: 'absolute' as const,
  };
  
  // Enhanced styles for stacked events
  if (layout.isStacked && layout.stackIndex !== undefined) {
    return {
      ...baseStyles,
      // Offset slightly for visual separation
      transform: `translateX(${layout.stackIndex * 4}px)`,
      // Add shadow for depth
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)',
      // Subtle scale for stacked effect
      transition: 'all 0.2s ease-in-out',
    };
  }
  
  // Enhanced styles for normal overlapping events
  if (layout.totalColumns > 1) {
    return {
      ...baseStyles,
      // Add separator border
      borderRight: layout.column < layout.totalColumns - 1 ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
      // Enhance shadow for better separation
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease-in-out',
    };
  }
  
  return baseStyles;
}

export function getEventLayerClass(
  event: CalendarEvent, 
  allEvents: CalendarEvent[], 
  viewType: 'month' | 'week' | 'day' = 'month'
): string {
  const baseClass = 'event-card';
  const viewClass = viewType === 'month' ? 'event-month' : 'event-week';
  
  const overlappingEvents = getOverlappingEvents(allEvents, event);
  
  if (overlappingEvents.length === 0) {
    return `${baseClass} ${viewClass}`;
  }
  
  const sortedEvents = [...overlappingEvents, event].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
  
  const layerIndex = sortedEvents.findIndex(e => e.id === event.id);
  const layerClass = `event-layer-${Math.min(layerIndex + 1, 10)}`;
  
  return `${baseClass} ${viewClass} ${layerClass}`;
}
