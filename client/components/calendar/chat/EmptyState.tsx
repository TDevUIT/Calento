'use client';

import { Sparkles, Clock, Calendar, CheckCircle2, Zap, MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  const suggestions = [
    {
      icon: Clock,
      color: 'blue',
      text: 'Find me 1 hour this week to meet with the design team',
      label: 'Find time for a team meeting',
    },
    {
      icon: Calendar,
      color: 'purple',
      text: 'Check my availability for tomorrow',
      label: 'Check my availability',
    },
    {
      icon: CheckCircle2,
      color: 'green',
      text: 'Create a task for code review',
      label: 'Create a task',
    },
    {
      icon: Zap,
      color: 'orange',
      text: 'Analyze my calendar patterns',
      label: 'Get calendar insights',
    },
  ];

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200',
    purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200',
    green: 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200',
    orange: 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200',
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl">
          <Sparkles className="h-10 w-10 text-black" />
        </div>
        <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Calento AI Assistant
      </h3>
      
      <p className="text-sm text-gray-600 mb-2 max-w-md">
        I can help you schedule meetings, check availability, manage tasks, and optimize your calendar.
      </p>

      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Powered by Gemini Flash</span>
        </div>
      </div>

      <div className="w-full max-w-xl space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Try asking me to:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion.text)}
                className={`text-left p-3 rounded-xl border transition-all duration-200 hover:shadow-md hover:scale-105 ${
                  colorClasses[suggestion.color as keyof typeof colorClasses]
                }`}
              >
                <div className="flex items-start gap-2">
                  <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium leading-tight">
                    {suggestion.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-500">
        <p>Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700">Ctrl+L</kbd> to focus on the input</p>
      </div>
    </div>
  );
};
