/**
 * Color utilities for event colors
 * Converts string color names to hex codes and provides color variants
 */

export const COLOR_PALETTE = {
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
  
  gray: '#6b7280',
  slate: '#64748b',
  zinc: '#71717a',
  emerald: '#10b981',
  lime: '#84cc16',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  sky: '#0ea5e9',
  
  default: '#3b82f6',
} as const;

export type ColorName = keyof typeof COLOR_PALETTE;
export function getColorHex(color?: string): string {
  if (!color) return COLOR_PALETTE.default;
  
  if (color.startsWith('#')) {
    return color;
  }
  
  const colorName = color.toLowerCase() as ColorName;
  return COLOR_PALETTE[colorName] || COLOR_PALETTE.default;
}


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


export function getRandomColor(): string {
  const colors = Object.values(COLOR_PALETTE);
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}


export function getContrastColor(backgroundColor: string): string {
  const hex = getColorHex(backgroundColor);
  
  const cleanHex = hex.replace('#', '');
  
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
}


export const EVENT_COLOR_OPTIONS = [
  { name: 'Blue', value: 'blue', hex: COLOR_PALETTE.blue },
  { name: 'Red', value: 'red', hex: COLOR_PALETTE.red },
  { name: 'Green', value: 'green', hex: COLOR_PALETTE.green },
  { name: 'Yellow', value: 'yellow', hex: COLOR_PALETTE.yellow },
  { name: 'Purple', value: 'purple', hex: COLOR_PALETTE.purple },
  { name: 'Pink', value: 'pink', hex: COLOR_PALETTE.pink },
  { name: 'Orange', value: 'orange', hex: COLOR_PALETTE.orange },
  { name: 'Cyan', value: 'cyan', hex: COLOR_PALETTE.cyan },
  
  { name: 'Indigo', value: 'indigo', hex: COLOR_PALETTE.indigo },
  { name: 'Teal', value: 'teal', hex: COLOR_PALETTE.teal },
  { name: 'Emerald', value: 'emerald', hex: COLOR_PALETTE.emerald },
  { name: 'Lime', value: 'lime', hex: COLOR_PALETTE.lime },
  { name: 'Amber', value: 'amber', hex: COLOR_PALETTE.amber },
  { name: 'Rose', value: 'rose', hex: COLOR_PALETTE.rose },
  { name: 'Violet', value: 'violet', hex: COLOR_PALETTE.violet },
  { name: 'Sky', value: 'sky', hex: COLOR_PALETTE.sky },
  
  { name: 'Gray', value: 'gray', hex: COLOR_PALETTE.gray },
  { name: 'Slate', value: 'slate', hex: COLOR_PALETTE.slate },
  { name: 'Zinc', value: 'zinc', hex: COLOR_PALETTE.zinc },
] as const;
