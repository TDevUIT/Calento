import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onShowShortcuts: () => void;
  onCreateEvent: () => void;
}

export function useKeyboardShortcuts({ onShowShortcuts, onCreateEvent }: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?') {
        e.preventDefault();
        onShowShortcuts();
      }
      if ((e.key === 'c' || e.key === 'C') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onCreateEvent();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onShowShortcuts, onCreateEvent]);
}
