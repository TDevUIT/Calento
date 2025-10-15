import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onShowShortcuts: () => void;
  onCreateEvent: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({ onShowShortcuts, onCreateEvent, enabled = true }: UseKeyboardShortcutsProps) {
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable ||
        target.closest('[role="textbox"]') ||
        target.closest('[contenteditable="true"]');

      if (isTyping) return;

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
  }, [onShowShortcuts, onCreateEvent, enabled]);
}
