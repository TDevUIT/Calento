/**
 * Example colors to test the automatic text color functionality
 */

export const testColors = [
  // Light colors (should use dark text)
  '#ffffff', // White
  '#f0f0f0', // Light gray
  '#ffeb3b', // Yellow
  '#4caf50', // Light green
  '#2196f3', // Light blue
  '#ff9800', // Orange
  '#e91e63', // Pink
  
  // Dark colors (should use white text)
  '#000000', // Black
  '#212121', // Dark gray
  '#1a1a1a', // Very dark gray
  '#8b0000', // Dark red
  '#006400', // Dark green
  '#000080', // Navy blue
  '#4b0082', // Indigo
  '#800080', // Purple
  
  // Medium colors (test edge cases)
  '#808080', // Medium gray
  '#696969', // Dim gray
  '#a0a0a0', // Light gray
  '#404040', // Dark gray
];

export const colorExamples = [
  { name: 'Primary Blue', color: '#3b82f6', expectedText: 'white' },
  { name: 'Success Green', color: '#10b981', expectedText: 'white' },
  { name: 'Warning Yellow', color: '#f59e0b', expectedText: 'dark' },
  { name: 'Danger Red', color: '#ef4444', expectedText: 'white' },
  { name: 'Info Cyan', color: '#06b6d4', expectedText: 'dark' },
  { name: 'Purple', color: '#8b5cf6', expectedText: 'white' },
  { name: 'Pink', color: '#ec4899', expectedText: 'white' },
  { name: 'Indigo', color: '#6366f1', expectedText: 'white' },
  { name: 'Light Blue', color: '#0ea5e9', expectedText: 'white' },
  { name: 'Emerald', color: '#059669', expectedText: 'white' },
  { name: 'Lime', color: '#65a30d', expectedText: 'white' },
  { name: 'Amber', color: '#d97706', expectedText: 'white' },
  { name: 'Orange', color: '#ea580c', expectedText: 'white' },
  { name: 'Rose', color: '#e11d48', expectedText: 'white' },
  { name: 'Slate', color: '#475569', expectedText: 'white' },
  { name: 'Gray', color: '#6b7280', expectedText: 'white' },
  { name: 'Zinc', color: '#71717a', expectedText: 'white' },
  { name: 'Neutral', color: '#737373', expectedText: 'white' },
  { name: 'Stone', color: '#78716c', expectedText: 'white' },
];
