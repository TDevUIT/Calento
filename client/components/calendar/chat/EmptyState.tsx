'use client';

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  void onSuggestionClick;

  return <div className="h-full" />;
};
