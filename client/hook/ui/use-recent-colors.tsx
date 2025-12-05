import { useState, useEffect } from 'react';

import { DEFAULT_RECENT_COLORS } from '@/constants/theme.constants';
import { STORAGE_KEYS, API_LIMITS } from '@/constants/api.constants';

const STORAGE_KEY = STORAGE_KEYS.RECENT_COLORS;
const MAX_RECENT_COLORS = API_LIMITS.MAX_RECENT_COLORS;

const DEFAULT_COLORS = DEFAULT_RECENT_COLORS;

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
