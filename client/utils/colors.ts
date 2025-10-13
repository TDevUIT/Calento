/**
 * Color utilities for event colors
 * Converts string color names to hex codes and provides color variants
 */

export const COLOR_PALETTE = {
  // Primary colors
  blue: '#3b82f6',
  red: '#ef4444', 
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  pink: '#ec4899',
  indigo: '#6366f1',
  cyan: '#06b6d4',
  orange: '#f97316',
  teal: '#14b8a6',
  
  // Neutral colors
  gray: '#6b7280',
  slate: '#64748b',
  zinc: '#71717a',
  
  // Extended palette
  emerald: '#10b981',
  lime: '#84cc16',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  sky: '#0ea5e9',
  
  // Default fallback
  default: '#3b82f6',
} as const;

export type ColorName = keyof typeof COLOR_PALETTE;

/**
 * Convert color string to hex code
 * Supports both hex codes and color names
 */
export function getColorHex(color?: string): string {
  if (!color) return COLOR_PALETTE.default;
  
  // If already hex code, return as-is
  if (color.startsWith('#')) {
    return color;
  }
  
  // Convert color name to hex
  const colorName = color.toLowerCase() as ColorName;
  return COLOR_PALETTE[colorName] || COLOR_PALETTE.default;
}

/**
 * Get color variants for different UI elements
 */
export function getColorVariants(color?: string) {
  const hex = getColorHex(color);
  
  return {
    primary: hex,
    background: `${hex}20`, // 12.5% opacity
    border: hex,
    text: hex,
    hover: `${hex}30`, // 18.75% opacity
    light: `${hex}10`, // 6.25% opacity
  };
}

/**
 * Generate random color from palette
 */
export function getRandomColor(): string {
  const colors = Object.values(COLOR_PALETTE);
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * Get contrasting text color (black or white) for a given background color
 */
export function getContrastColor(backgroundColor: string): string {
  const hex = getColorHex(backgroundColor);
  
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Predefined color options for event form
 */
export const EVENT_COLOR_OPTIONS = [
  { name: 'Blue', value: 'blue', hex: COLOR_PALETTE.blue },
  { name: 'Red', value: 'red', hex: COLOR_PALETTE.red },
  { name: 'Green', value: 'green', hex: COLOR_PALETTE.green },
  { name: 'Purple', value: 'purple', hex: COLOR_PALETTE.purple },
  { name: 'Orange', value: 'orange', hex: COLOR_PALETTE.orange },
  { name: 'Pink', value: 'pink', hex: COLOR_PALETTE.pink },
  { name: 'Cyan', value: 'cyan', hex: COLOR_PALETTE.cyan },
  { name: 'Yellow', value: 'yellow', hex: COLOR_PALETTE.yellow },
  { name: 'Indigo', value: 'indigo', hex: COLOR_PALETTE.indigo },
  { name: 'Teal', value: 'teal', hex: COLOR_PALETTE.teal },
] as const;
