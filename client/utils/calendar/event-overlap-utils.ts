import { EventLayout } from './event-display';


export function getOverlapIndicator(layouts: EventLayout[]): {
  totalEvents: number;
  visibleEvents: number;
  stackedEvents: number;
  hasOverlap: boolean;
} {
  const stackedLayouts = layouts.filter(l => l.isStacked);
  
  return {
    totalEvents: layouts.length,
    visibleEvents: layouts.filter(l => !l.isStacked).length,
    stackedEvents: stackedLayouts.length,
    hasOverlap: layouts.some(l => l.totalColumns > 1),
  };
}


export function getExpandedLayoutStyles(
  layout: EventLayout,
  isHovered: boolean,
  isGroupHovered: boolean
): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    position: 'absolute' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  if (layout.isStacked && layout.stackIndex !== undefined) {
    const expandedWidth = 30; // Expand to 30% width
    const expandedLeft = 70 - (layout.stackIndex * 10); // Stack from right
    
    if (isGroupHovered || isHovered) {
      return {
        ...baseStyles,
        width: `${expandedWidth}%`,
        left: `${expandedLeft}%`,
        zIndex: layout.zIndex + 100 + layout.stackIndex,
        transform: 'translateY(0)',
        opacity: 1,
      };
    }
    
    return {
      ...baseStyles,
      width: `${layout.width}%`,
      left: `${layout.left}%`,
      zIndex: layout.zIndex,
      transform: `translateX(${layout.stackIndex * 4}px)`,
      opacity: 0.95,
    };
  }

  return {
    ...baseStyles,
    width: `${layout.width}%`,
    left: `${layout.left}%`,
    zIndex: isHovered ? layout.zIndex + 50 : layout.zIndex,
  };
}

export function getEventCardPadding(layout: EventLayout): string {
  if (layout.isStacked) {
    return '4px 8px';
  }
  
  if (layout.totalColumns > 3) {
    return '4px 6px';
  }
  
  if (layout.totalColumns > 2) {
    return '6px 8px';
  }
  
  return '8px 10px';
}


export function getEventBorderStyles(
  layout: EventLayout,
  eventColor: string,
  isTask: boolean
): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    borderColor: isTask ? eventColor : 'rgba(0,0,0,0.1)',
    borderWidth: isTask ? '2px' : '1px',
    borderLeftWidth: isTask ? '4px' : '1px',
    borderStyle: isTask ? 'dashed' : 'solid',
  };

  if (layout.totalColumns > 1 && !layout.isStacked) {
    return {
      ...baseStyles,
      borderRightWidth: layout.column < layout.totalColumns - 1 ? '2px' : '1px',
      borderRightColor: 'rgba(255, 255, 255, 0.5)',
    };
  }

  if (layout.isStacked) {
    return {
      ...baseStyles,
      borderWidth: isTask ? '2px' : '2px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)',
    };
  }

  return baseStyles;
}


export function getEventDensityClasses(totalEvents: number): string {
  if (totalEvents <= 2) return 'event-density-low';
  if (totalEvents <= 4) return 'event-density-medium';
  return 'event-density-high';
}


export function shouldUseCompactView(layout: EventLayout): boolean {
  return layout.totalColumns > 3 || layout.isStacked || layout.width < 30;
}


export function getStackedEventsTooltip(layouts: EventLayout[]): string | null {
  const stacked = layouts.filter(l => l.isStacked);
  
  if (stacked.length === 0) return null;
  
  const eventTitles = stacked.map(l => l.event.title).join(', ');
  return `+${stacked.length} more events: ${eventTitles}`;
}
