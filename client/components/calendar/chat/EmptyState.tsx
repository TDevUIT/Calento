'use client';

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  const suggestions = [
    'Summarize my schedule for today',
    'When am I free this week?',
    'Create an appointment tomorrow at 9:00 AM',
    'Find events with the keyword "meeting"',
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="text-sm font-semibold text-gray-900">Calento Assistant</div>
      <div className="mt-1 text-xs text-muted-foreground">Quick suggestions to get started</div>

      <div className="mt-5 w-full space-y-2">
        {suggestions.map((text) => (
          <button
            key={text}
            type="button"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={() => onSuggestionClick(text)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};
