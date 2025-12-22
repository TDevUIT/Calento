'use client';

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  const suggestions = [
    'Tóm tắt lịch hôm nay giúp tôi',
    'Tuần này tôi rảnh lúc nào?',
    'Tạo một cuộc hẹn vào ngày mai lúc 9:00',
    'Tìm các event có từ khóa "meeting"',
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="text-sm font-semibold text-gray-900">Calento Assistant</div>
      <div className="mt-1 text-xs text-muted-foreground">Gợi ý nhanh để bắt đầu</div>

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
