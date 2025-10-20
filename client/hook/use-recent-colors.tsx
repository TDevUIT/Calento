import { useState, useEffect } from 'react';

const STORAGE_KEY = 'tempra_recent_colors';
const MAX_RECENT_COLORS = 5;

const DEFAULT_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7'];

export function useRecentColors() {
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_COLORS;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COLORS;
      }
    } catch (error) {
      console.error('Error loading recent colors:', error);
    }
    return DEFAULT_COLORS;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentColors));
    } catch (error) {
      console.error('Error saving recent colors:', error);
    }
  }, [recentColors]);

  const addRecentColor = (color: string) => {
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color);
      
      const updated = [color, ...filtered];
      
      return updated.slice(0, MAX_RECENT_COLORS);
    });
  };

  const clearRecentColors = () => {
    setRecentColors(DEFAULT_COLORS);
  };

  return {
    recentColors,
    addRecentColor,
    clearRecentColors,
  };
}
