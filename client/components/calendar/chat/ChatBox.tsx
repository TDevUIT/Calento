'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send,
  Sparkles,
  Calendar,
  Clock,
  Settings,
  ChevronRight,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';
import { useAIChat } from '@/hook/ai/use-ai-chat';
import { AIMessage, FunctionCall, ActionPerformed } from '@/interface/ai.interface';
import { ThinkingProcess } from './ThinkingProcess';
import { MessageContent } from './MessageContent';
import { ActionConfirmationDialog } from './ActionConfirmationDialog';
import { TimeSlotsList } from './TimeSlotsList';
import { EventsList } from './EventsList';
import { toast } from 'sonner';

interface ChatBoxProps {
  onClose?: () => void;
}

interface ChatMessage extends AIMessage {
  functionCalls?: FunctionCall[];
  actions?: ActionPerformed[];
}

interface ThinkingStep {
  id: string;
  status: 'pending' | 'active' | 'completed';
  label: string;
  icon?: string;
}

export function ChatBox({ onClose }: ChatBoxProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatMutation = useAIChat();
  const [isProcessing, setIsProcessing] = useState(false);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  

  const handleSend = async () => {
    if (!input.trim() || isProcessing || chatMutation.isPending) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    const steps: ThinkingStep[] = [
      { id: '1', status: 'active', label: 'Understanding your request...', icon: 'search' },
      { id: '2', status: 'pending', label: 'Analyzing calendar context...', icon: 'calendar' },
      { id: '3', status: 'pending', label: 'Processing with AI...', icon: 'zap' },
    ];
    setThinkingSteps(steps);
    
    // Step 1: Complete first step, activate second (after 1s)
    setTimeout(() => {
      setThinkingSteps(prev => {
        if (prev.length === 0) return prev;
        return prev.map((s, i) => 
          i === 0 ? { ...s, status: 'completed' as const } :
          i === 1 ? { ...s, status: 'active' as const } : s
        );
      });
    }, 1000);
    
    // Step 2: Complete second step, activate third (after 2.2s total)
    setTimeout(() => {
      setThinkingSteps(prev => {
        if (prev.length === 0) return prev;
        return prev.map((s, i) => 
          i <= 1 ? { ...s, status: 'completed' as const } :
          i === 2 ? { ...s, status: 'active' as const } : s
        );
      });
    }, 2200);

    const cleanHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content || '',
    }));

    const now = new Date();
    
    try {
      console.log('🚀 Sending chat request...');
      
      const response = await chatMutation.mutateAsync({
        message: input.trim(),
        conversation_id: conversationId,
        history: cleanHistory,
        context: {
          current_date: now.toISOString(),
          current_date_formatted: now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
      
      console.log('✅ Chat completed');
      
      // Update conversation ID if new
      if (response.data.conversation_id && !conversationId) {
        setConversationId(response.data.conversation_id);
      }
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response,
        functionCalls: response.data.function_calls,
        actions: response.data.actions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Complete all steps
      setThinkingSteps(prev => prev.map(s => ({ ...s, status: 'completed' as const })));
      
      // Clear thinking steps
      setTimeout(() => {
        setThinkingSteps([]);
      }, 800);
      
      setIsProcessing(false);
    } catch (error: any) {
      setThinkingSteps([]);
      setIsProcessing(false);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ Sorry, I encountered an error: ${error?.message || 'Unknown error'}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    
    try {
      // Call confirm API (you'll need to create this hook)
      // For now, just show success and close dialog
      toast.success('Meeting scheduled successfully!');
      setShowConfirmDialog(false);
      setPendingAction(null);
      
      // Add confirmation message
      const confirmMessage: ChatMessage = {
        role: 'assistant',
        content: '✅ Meeting has been scheduled and invites sent to all participants.',
      };
      setMessages((prev) => [...prev, confirmMessage]);
    } catch (error) {
      toast.error('Failed to confirm action');
    }
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
    toast.info('Action cancelled');
  };

  return (
    <div className="flex flex-col bg-white border-l shadow-xl h-full overflow-hidden">
      <ActionConfirmationDialog
        open={showConfirmDialog}
        action={pendingAction}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
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
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Calento AI Assistant
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md">
              I can help you schedule meetings, check availability, manage tasks, and optimize your calendar.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-md">
              <button
                onClick={() => setInput('Find me 1 hour this week to meet with the design team')}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <Clock className="h-4 w-4 inline mr-2 text-blue-600" />
                Find time for a team meeting
              </button>
              <button
                onClick={() => setInput('Check my availability for tomorrow')}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <Calendar className="h-4 w-4 inline mr-2 text-blue-600" />
                Check my availability
              </button>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {message.role === 'user' ? (
                <div className="bg-blue-600 text-white rounded-lg px-2 py-2 ml-auto max-w-[80%]">
                  <p className="text-sm font-medium leading-relaxed">
                    {message.content}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {message.content && (
                    <div className="bg-gray-50 rounded-2xl p-4 max-w-[85%]">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <MessageContent content={message.content} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {message.actions && message.actions.length > 0 && (
                    <div className="space-y-2 max-w-full">
                      {message.actions.map((action, idx) => (
                        <div key={idx}>
                          {action.type === 'checkAvailability' && action.result?.free_slots && (
                            <TimeSlotsList 
                              slots={action.result.free_slots}
                              onBook={(slot) => {
                                toast.success(`Slot booked: ${new Date(slot.start).toLocaleTimeString()} - ${new Date(slot.end).toLocaleTimeString()}`);
                                // TODO: Implement actual booking logic
                              }}
                            />
                          )}
                          
                          {action.type === 'searchEvents' && action.result?.events && (
                            <EventsList 
                              events={action.result.events}
                              total={action.result.total}
                              dateRange={action.result.date_range}
                              message={action.result.message}
                            />
                          )}
                          
                          {action.type === 'createEvent' && action.result && (
                            <div className="bg-white rounded-xl p-4 space-y-3">
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <h4 className="text-sm font-semibold">Event Created</h4>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-semibold text-gray-900 mb-1">
                                    {action.result.title}
                                  </h5>
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>
                                      {new Date(action.result.start_time).toLocaleString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {action.type === 'createTask' && action.result && (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Task Created Successfully</h4>
                                    <p className="text-xs text-gray-600">Added to your task list</p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 space-y-3">
                                <div>
                                  <h5 className="text-base font-semibold text-gray-900 mb-2">{action.result.title}</h5>
                                  {action.result.description && (
                                    <p className="text-sm text-gray-600">{action.result.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                                  {action.result.due_date && (
                                    <div className="flex items-center gap-2">
                                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Due Date</p>
                                        <p className="text-sm font-medium text-gray-900">
                                          {new Date(action.result.due_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {action.result.estimated_duration && (
                                    <div className="flex items-center gap-2">
                                      <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                        <Clock className="h-4 w-4 text-purple-600" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Duration</p>
                                        <p className="text-sm font-medium text-gray-900">{action.result.estimated_duration} min</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        
        {thinkingSteps.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-900">Thinking...</p>
            </div>
            <ThinkingProcess steps={thinkingSteps} />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 p-3 bg-gray-50 flex-shrink-0 z-10">
        <div className="flex items-center gap-4 text-sm">
          <button 
            onClick={() => setInput('Check my availability this week')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Clock className="h-4 w-4" />
            <span>Find time</span>
          </button>
          <button 
            onClick={() => setInput('Show my calendar for today')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span>Check calendar</span>
          </button>
          <button 
            onClick={() => setInput('Create a task for code review')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Create task</span>
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
              onKeyPress={(e) => e.key === 'Enter' && !(chatMutation.isPending || isProcessing) && handleSend()}
              placeholder="Ask about your schedule..."
              className="pr-24 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
              disabled={chatMutation.isPending || isProcessing}
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
                disabled={!input.trim() || chatMutation.isPending || isProcessing}
              >
                {(chatMutation.isPending || isProcessing) ? (
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 text-blue-600" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Gemini Flash</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-gray-600">Calendar Intelligence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
