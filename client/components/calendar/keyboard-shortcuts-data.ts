export const KEYBOARD_SHORTCUTS = [
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
] as const;
