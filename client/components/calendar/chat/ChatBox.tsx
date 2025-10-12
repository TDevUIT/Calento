'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Send,
  Sparkles,
  Calendar,
  Clock,
  Settings,
  ChevronRight,
  CheckCircle2,
  Users,
  RotateCcw,
  X,
  Zap,
} from 'lucide-react';

interface ChatBoxProps {
  onClose?: () => void;
}

export function ChatBox({ onClose }: ChatBoxProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const analysisItems = [
    { text: 'Checked 4 team member calendars', checked: true },
    { text: 'Identified 5 mutual availability windows', checked: true },
    { text: 'Monday 9AM - back-to-back conflicts', checked: true },
    { text: 'Wednesday 2PM - everyone busy', checked: true },
    { text: 'Thursday 2PM - Peak productivity time', checked: false },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setInput('');
    }, 2000);
  };

  return (
    <div className="flex flex-col bg-white border-l shadow-xl h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Calento Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4 text-gray-500" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-sm font-medium leading-relaxed">
            Find me 1 hour this week to meet with the design team
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">AI Analysis</h3>
            </div>
            <Badge variant="secondary" className="text-xs">1.2s</Badge>
          </div>

          <div className="space-y-2">
            {analysisItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {item.checked ? (
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    item.checked ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Match Score</span>
              <span className="font-semibold">92%</span>
            </div>
            <Progress value={92} className="h-1.5" />
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p>
            Perfect! I found an ideal time when everyone is available
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Design Team Sync
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Thu, Nov 14 • 2:00 - 3:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users className="h-3.5 w-3.5" />
                <span>4 members • 100% available</span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Schedule Meeting
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-100 p-3 bg-gray-50 flex-shrink-0 z-10">
        <div className="flex items-center gap-4 text-sm">
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
            <Clock className="h-4 w-4" />
            <span>Find time</span>
          </button>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
            <Calendar className="h-4 w-4" />
            <span>Check calendar</span>
          </button>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
            <RotateCcw className="h-4 w-4" />
            <span>Reschedule</span>
          </button>
        </div>
      </div>

      <div className="border-t p-4 bg-white flex-shrink-0 z-10">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
              placeholder="Ask about your schedule..."
              className="pr-24 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
              disabled={isProcessing}
            />
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-white text-gray-500 border border-gray-300 rounded">
                Ctrl+L
              </kbd>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
              >
                {isProcessing ? (
                  <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4 text-blue-600" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>GPT-4 Turbo</span>
            <span className="mx-1">•</span>
            <span>Calendar Intelligence</span>
          </div>
          <button className="text-blue-600 hover:underline">Change model</button>
        </div>
      </div>
    </div>
  );
}
