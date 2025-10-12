'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['T'], description: 'Go to Today' },
        { keys: ['←'], description: 'Previous period' },
        { keys: ['→'], description: 'Next period' },
        { keys: ['D'], description: 'Day view' },
        { keys: ['W'], description: 'Week view' },
        { keys: ['M'], description: 'Month view' },
        { keys: ['Y'], description: 'Year view' },
      ],
    },
    {
      category: 'Actions',
      items: [
        { keys: ['C'], description: 'Create new event' },
        { keys: ['N'], description: 'New task' },
        { keys: ['/'], description: 'Search events' },
        { keys: ['?'], description: 'Show shortcuts' },
      ],
    },
    {
      category: 'Event Actions',
      items: [
        { keys: ['E'], description: 'Edit selected event' },
        { keys: ['Delete'], description: 'Delete selected event' },
        { keys: ['Enter'], description: 'Open event details' },
        { keys: ['Esc'], description: 'Close dialog/modal' },
      ],
    },
    {
      category: 'General',
      items: [
        { keys: ['Cmd', 'K'], description: 'Quick search (Mac)' },
        { keys: ['Ctrl', 'K'], description: 'Quick search (Windows)' },
        { keys: ['Cmd', 'Z'], description: 'Undo' },
        { keys: ['Cmd', 'Shift', 'Z'], description: 'Redo' },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate and manage your calendar faster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {shortcuts.map((section) => (
            <div key={section.category} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs px-2 py-1 bg-background"
                          >
                            {key}
                          </Badge>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-xs text-muted-foreground">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Press <Badge variant="outline" className="mx-1 font-mono">?</Badge> anytime to view this list
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
